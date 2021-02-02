const crypto = require('crypto')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const sendMail = require('./../utils/email')

const signToken = id => {
	return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id)

	res.status(statusCode).json({
		status: 'Success',
		token,
		data: {
			user
		}
	})
}

exports.signup = catchAsync(async(req, res, next) => {
	const newUser = await User.create(req.body)
	createSendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
	const {email, password} = req.body
	// check email and password is existed
	if (!email || !password) {
		return next(new AppError('Email and password is required', 400))
	}

	const user = await User.findOne({email}).select('+password')
	// compare password
	
	if(!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401))
	}

	// send token in response
	createSendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
	// check the token is existed
	let token
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1]
	}

	if (!token) {
		return next(new AppError('Your are not logged in', 401))
	}

	// validate the token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

	// check if the user existed
	const currentUser = await User.findById(decoded.id)
	
	if (!currentUser) {
		return next(new AppError('The user belonging to this token does no longer exist.', 401))
	}

	// check the password chaged after token created
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppError('User recently changed password! Please login again!!', 401))
	}

	req.user = currentUser
	next()
})

exports.restrictedTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new AppError('You do not have permission to perform this action', 403))
		}
		next()
	}
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
	// check the user is exist with that mail
	const user = await User.findOne({email: req.body.email})
	if (!user) {
		return next(new AppError('There is no user with this mail', 404))
	}

	// generate rest token
	const resetToken = user.createPasswordResetToken()
	await user.save({validateBeforeSave: false})

	// send the mail to user for reset the password
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

	const message = `Forgot your password? Click this URL: ${resetURL} \n If you don't forget your password, please ignore this mail`

	try {
		await sendMail({
			email: user.email,
			subject: `Your password reset token (valid for 10 min)`,
			message
		})
	
		res.status(200).json({
			status: 'success',
			message: 'Token sent to email'
		})
	} catch (err) {
		user.passwordResetToken = undefined
		user.passwordResetExpire = undefined

		await user.save({validateBeforeSave: false})

		return next(new AppError('There was an error sending mail. Please try again later!', 500))
	}
})

exports.resetPassword = catchAsync(async (req, res, next) => {
	// get the user based on token
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
	const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpire: {$gt: Date.now()}})

	// user exists and token not expired then set new password
	if (!user) {
		return next(new AppError('Token has invalid or has expired', 400))
	}
	
	user.password = req.body.password
	user.passwordConfirm = req.body.passwordConfirm
	user.passwordResetToken = undefined
	user.passwordResetExpire = undefined

	await user.save()

	// log the user in, send jwt
	createSendToken(user, 200, res)
})

module.exports.updatePassword = catchAsync(async (req, res, next) => {
	// get the user from collection
	const user = await User.findById(req.user.id).select('+password')

	// check if POSTed current password is correct
	if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
		return next(new AppError('Your current password is wrong!!', 401))
	}

	// if so, update password
	user.password = req.body.password
	user.passwordConfirm = req.body.passwordConfirm
	await user.save()

	// log user in, send jwt
	createSendToken(user, 200, res)
})
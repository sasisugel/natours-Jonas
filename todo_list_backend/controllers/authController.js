const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

const signToken = id => {
	return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}

exports.signup = catchAsync(async(req, res, next) => {
	const newUser = await User.create(req.body)

	const token = signToken(newUser._id)

	res.status(200).json({
		status: 'Success',
		token,
		data: {
			user: newUser
		}
	})
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
	const token = signToken(user._id)

	res.status(200).json({
		status: "Success",
		token
	})
})

exports.protect = catchAsync(async (req, res, next) => {
	// check the token is existed
	let token;
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
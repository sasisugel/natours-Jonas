const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

const filterObj = (obj, ...allowedFields) => {
	const newObj = {}
	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) newObj[el] = obj[el]
	});
	return newObj
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find()
	res.status(200).json({
		status: 'Success',
		result: users.length,
		data: {
			users
		}
	})
})

exports.updateMe = catchAsync(async (req, res, next) => {
	// don't allow to pass the password
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError('This routes is not define for password update. Please use /updateMyPassword', 400))
	}

	// restrict the fields while update. Ex: 'role'
	const filterdBody = filterObj(res.body, 'name', 'email')

	// update the data and return updated new data
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {new: true, runValidators: true})

	res.status(200).json({
		status: 'Success',
		data: {
			user: updatedUser
		}
	})
})

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, {active: false})

	res.status(204).json({
		status: 'Success',
		data: null
	})
})

exports.getUser = (req, res) => {
	res.status(500).json({
		status: 'Filed',
		message: 'The router not yet defined'
	})
}

exports.createNewUser = (req, res) => {
	res.status(500).json({
		status: 'Filed',
		message: 'The router not yet defined'
	})
}

exports.updateUser = (req, res) => {
	res.status(500).json({
		status: 'Filed',
		message: 'The router not yet defined'
	})
}

exports.deleteUser = (req, res) => {
	res.status(500).json({
		status: 'Filed',
		message: 'The router not yet defined'
	})
}

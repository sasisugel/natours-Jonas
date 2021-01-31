const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is mandatory']
	},
	email: {
		type: String,
		required: [true, 'Mail is mandatory'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email']
	},
	photo: String,
	password: {
		type: String,
		required: [true, 'Password is mandatory'],
	},
	confirmPassword: {
		type: String,
		required: [true, 'Confirm password is mandatory'],
		validate: {
			// this only work on create and save
			validator: function (el) {
				return this.password == el
			},
			message: 'Passwords are not the same'
		}
	}
})

userSchema.pre('save', async function (next) {
	// it will run only when the password is change
	if (!this.isModified('password')) return next()

	this.password = await bcrypt.hash(this.password, 12)
	this.confirmPassword = undefined

	next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
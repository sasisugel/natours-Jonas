const crypto = require('crypto')
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
	role: {
		type: String,
		enum: ['user', 'guide', 'lead-guide', 'admin'],
		default: 'user'
	},
	password: {
		type: String,
		required: [true, 'Password is mandatory'],
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Confirm password is mandatory'],
		validate: {
			// this only work on create and save
			validator: function (el) {
				return this.password == el
			},
			message: 'Passwords are not the same'
		}
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpire: Date
})

userSchema.pre('save', async function (next) {
	// it will run only when the password is change
	if (!this.isModified('password')) return next()

	this.password = await bcrypt.hash(this.password, 12)
	this.passwordConfirm = undefined

	next()
})

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next()

	this.passwordChangedAt = Date.now()-1000
	next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
	console.log(`candidatepassword is : ${candidatePassword}, user pass: ${userPassword}`)
	return (await bcrypt.compare(candidatePassword, userPassword))
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
		return JWTTimestamp < changedTimestamp
	}
	return false
}

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex')

	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	this.passwordResetExpire = Date.now()+10*60*1000

	return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
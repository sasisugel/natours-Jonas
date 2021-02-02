const express = require('express')

const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const route = express.Router()

route.post('/signup', authController.signup)
route.post('/login', authController.login)

route.post('/forgotPassword', authController.forgotPassword)
route.patch('/resetPassword/:token', authController.resetPassword)

route.patch('/updateMyPassword', authController.protect, authController.updatePassword)

route.patch('/updateMe', authController.protect, userController.updateMe)

route.delete('/deleteMe', authController.protect, userController.deleteMe)

route.route('/')
	.get(userController.getAllUsers)
	.post(userController.createNewUser)
route.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser)

module.exports = route
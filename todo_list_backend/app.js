const express = require('express')
const morgan  = require('morgan')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRourter = require('./routes/tourRoutes')
const userRourter = require('./routes/userRoutes')

const app = express()

// middleware usage 
app.use(express.json())
app.use(morgan('dev'))

app.use((req, res, next) => {
	req.modifiedId = new Date().toISOString()
	next()
})

app.use('/api/v1/tours', tourRourter)
app.use('/api/v1/users', userRourter)

app.all('*', (req, res, next) => {
	// res.status(500).json({message: 'You are accessing wrong url!!!'})

	// const err = new Error(`Can't find ${req.originalUrl} on this server!`)
	// err.status = 'fail',
	// err.statusCode = 404,
	// next(err)

	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
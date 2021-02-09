const express = require('express')
const morgan  = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRourter = require('./routes/tourRoutes')
const userRourter = require('./routes/userRoutes')
const reviewRoutes = require('./routes/reviewRoutes')

const app = express()

// global middleware usage
// set security HTTP header
app.use(helmet())

// limit request from same API (IP)
const requestLimiter = rateLimit({
	max: 60,
	windowMs: 60*60*1000,
	message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api', requestLimiter)

// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
	whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}))

// serving static files
app.use(express.static(`${__dirname}/public`))

// development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// test middleware
app.use((req, res, next) => {
	req.modifiedId = new Date().toISOString()
	next()
})

app.use('/api/v1/tours', tourRourter)
app.use('/api/v1/users', userRourter)
app.use('/api/v1/reviews', reviewRoutes)

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
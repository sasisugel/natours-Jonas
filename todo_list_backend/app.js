const express = require('express')
const morgan  = require('morgan')

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

app.all('*', (req, res) => {
	// res.status(500).json({message: 'You are accessing wrong url!!!'})

	const err = new Error(`Can't find ${req.originalUrl} on this server!`)
	err.status = 'fail',
	err.statusCode = 404
})

app.use((err, req, res, next) => {
	err.statusCode = err.statusCode || 500
	err.status = err.status || 'error'

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message
	})
})

module.exports = app
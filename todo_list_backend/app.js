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

app.all('/', (req, res) => {
	res.status(500).json({message: 'You are accessing wrong url!!!'})
})

module.exports = app
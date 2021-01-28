const mongoose = require('mongoose')

const tourSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is mandatory'],
		unique: true,
		trim: true
	},
	duration: {
		type: Number,
		required: [true, 'Duration is mandatory']
	},
	maxGroupSize: {
		type: Number,
		required: [true, 'Group size is mandatory']
	},
	difficulty: {
		type: String,
		required: [true, 'Difficulty is mandatory']
	},
	ratinsAverage: {
		type: Number,
		default: 4.5
	},
	ratingsQuantiry: {
		type: Number,
		default: 0
	},
	price: {
		type: Number,
		required: [true, 'Price is mandatory']
	},
	priceDiscount: Number,
	summary: {
		type: String,
		trim: true,
		required: [true, 'Summary is mandatory']
	},
	description: {
		type: String,
		trim: true
	},
	imageCover: {
		type: String,
		required: [true, 'Image cover is mandatory']
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now()
	},
	startDates: [Date]
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
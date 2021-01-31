const mongoose = require('mongoose')
const slugify = require('slugify')

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
	ratingsAverage: {
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
		default: Date.now(),
		select: false
	},
	startDates: [Date],
	secretTour: {
		type: Boolean,
		default: false
	}
})

// document middleware: applicable for only save() and creat()
tourSchema.pre('save', function (next) {
	this.slugify = slugify(this.name, {lower: true})
	next()
})

// query middleware
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
	this.find({secretTour: {$ne: true}})

	this.startingTime = Date.now()
	next()
})

tourSchema.post(/^find/, function (doc, next) {
	console.log(`Query took ${Date.now()-this.startingTime} milliseconds`)
	next()
})

// aggregation middleware
tourSchema.pre('aggregate', function (next) {
	this.pipeline().unshift({$match: {secretTour: {$ne : true}}})
	next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
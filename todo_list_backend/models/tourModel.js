const mongoose = require('mongoose')
const slugify = require('slugify')

// const User = require('./userModel')

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
		required: [true, 'Difficulty is mandatory'],
		enum: ['easy', 'medium', 'difficult'],
		message: 'Difficulty is either: easy, medium, difficult'
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
	},
	startLocation: {
		type: {
			type: String,
			default: 'Point',
			enum: ['Point']
		},
		coordinates: [Number],
		address: String,
		description: String
	},
	locations: [
		{
			type: {
				type: String,
				default: 'Point',
				enum: ['Point']
			},
			coordinates: [Number],
			address: String,
			description: String,
			day: Number
		}
	],
	guides: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	]
},
{
	toJSON: {virtuals: true},
	toObject: {virtuals: true}
})

// virtual middleware
tourSchema.virtual('durationWeeks').get('/', function () {
	return this.duration/7
})

tourSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'tour',
	localField: '_id'
})

// document middleware: applicable for only save() and creat()
tourSchema.pre('save', function (next) {
	this.slugify = slugify(this.name, {lower: true})
	next()
})

// tourSchema.pre('save', async function (next) {
// 	const guidesPromises = this.guides.map(async id => await User.findById(id))
// 	this.guides = await Promise.all(guidesPromises)
// 	next()
// })

// query middleware
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
	this.find({secretTour: {$ne: true}})

	this.startingTime = Date.now()
	next()
})

tourSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'guides',
		select: '-__v, -passwordChangedAt'
	})
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
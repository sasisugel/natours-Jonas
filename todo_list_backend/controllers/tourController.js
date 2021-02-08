const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

exports.aliasTopTours = (req, res, next) => {
	req.query.limit = '5'
	req.query.sort = '-ratingsAverage, price'
	req.query.fields = 'name,price,ratingsAverage,difficulty,summary'
	next()
}

exports.getAllTours = catchAsync(async (req, res, next) => {
	// execute query 
	const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate()
	const tours = await features.query

	res.status(200).json({
		status: 'Success',
		result: tours.length,
		data: {
			tours
		}
	})
})

exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.id)

	if (!tour) {
		return next(new AppError('Your requested ID does not exist', 404))
	}

	res.status(200).json({
		status: "success",
		data: {
			tour
		}
	})
})

exports.createNewTour = catchAsync(async (req, res, next) => {
	const newTour = await Tour.create(req.body)

	res.status(200).json({
		status: "success",
		data: {
			tour: newTour
		}
	})
})

exports.updateTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndUpdate({ _id: req.params.id},req.body, {
		new: true,
		runValidators: true
	})

	if (!tour) {
		return next(new AppError('Your requested ID does not exist', 404))
	}

	res.status(200).json({
		status: "success",
		message: "Tour Update Successfully!!!",
		data: {
			tour
		}
	})
})

exports.deleteTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndDelete({ _id: req.params.id})

	if (!tour) {
		return next(new AppError('Your requested ID does not exist', 404))
	}
	
	res.status(204).json({
		status: "success",
		message: "Tour deleted successfully!!!",
		data: null
	})
})

exports.getTourStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{
			$match: {ratingsAverage: {$gte: 4.5}}
		},
		{
			$group: {
				_id: {$toUpper: '$difficulty'},
					numTours: {$sum: 1},
					numRatings: {$sum: '$ratingsQuantity'},
					avgRating: {$avg: '$ratinsgAverage'},
					avgPrice: {$avg: '$price'},
					minPrice: {$min: '$price'},
					maxPrice: {$max: '$price'}
			}
		},
		{
			$sort: {avgPrice: 1}
		},
		// {
		// 	$match: {_id: {$ne: 'EASY'}}
		// }
	])

	res.status(200).json({
		status: "success",
		data: {
			stats
		}
	})
})

const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')

exports.aliasTopTours = (req, res, next) => {
	req.query.limit = '5'
	req.query.sort = '-ratingsAverage, price'
	req.query.fields = 'name,price,ratingsAverage,difficulty,summary'
	next()
}

exports.getAllTours = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(400).json({
			status: 'Failed',
			message: err
		})
	}

}

exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id)
		res.status(200).json({
			status: "success",
			data: {
				tour
			}
		})
	} catch (err) {
		res.status(400).json({
			status: 'Failed',
			message: err
		})
	}
}

exports.createNewTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body)
		res.status(200).json({
			status: "success",
			data: {
				tour: newTour
			}
		})
		
	} catch (err) {
		res.status(400).json({
			status: 'Failed',
			message: err
		})
	}
}

exports.updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate({ _id: req.params.id},req.body, {
			new: true,
			runValidators: true
		})
		res.status(200).json({
			status: "success",
			message: "Tour Update Successfully!!!",
			data: {
				tour
			}
		})
	} catch (err) {
		res.status(400).json({
			status: 'Failed',
			message: err
		})
	}
}

exports.deleteTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndDelete({ _id: req.params.id})
		res.status(204).json({
			status: "success",
			message: "Tour deleted successfully!!!",
			data: null
		})
	} catch (err) {
		res.status(400).json({
			status: 'Failed',
			message: err
		})
	}
}

exports.getTourStats = async (req, res) => {
	try {
		const stats = await Tour.aggregate([
			{
				$match: {ratinsAverage: {$gte: 4.5}}
			},
			{
				$group: {
					_id: {$toUpper: '$difficulty'},
					 numTours: {$sum: 1},
					 numRatings: {$sum: '$ratingsQuantity'},
					 avgRating: {$avg: '$ratinsAverage'},
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
	} catch (err) {
		res.status(400).json({
			status: 'Failed',
			message: err
		})
	}
}

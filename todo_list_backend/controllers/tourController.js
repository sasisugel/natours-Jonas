const Tour = require('./../models/tourModel')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

// exports.checkId = (req, res, next, val) => {
// 	console.log(`Tour id is: ${val}`)
// 	const id = req.params.id*1
// 	const tour = tours.find(tour => tour.id === id)

// 	if (!tour) {
// 		return res.status(400).json({
// 			status: "failed",
// 			message: "Invalid Id"
// 		})
// 	}
// 	next()
// }

// exports.checkBody = (req, res, next) => {
// 	if (!req.body.name || !req.body.price) {
// 		return res.status(400).json({
// 			status: 'failed',
// 			message: 'missing tour name or price'
// 		})
// 	}
// 	next()
// }

exports.getAllTours = async (req, res) => {
	console.log(`got from middleware is: ${req.modifiedId}`)
	
	try {
		const queryObj = {...req.query}
		const excludesFields = ['page', 'sort', 'limit', 'fields']
		excludesFields.forEach(el => delete queryObj[el])

		const query = Tour.find(queryObj)
		const tours = await query
		res.status(200).json({
			status: 'Success',
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

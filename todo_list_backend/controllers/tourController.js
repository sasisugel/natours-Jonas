const fs = require('fs')

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.checkId = (req, res, next, val) => {
	console.log(`Tour id is: ${val}`)
	const id = req.params.id*1
	const tour = tours.find(tour => tour.id === id)

	if (!tour) {
		return res.status(400).json({
			status: "failed",
			message: "Invalid Id"
		})
	}
	next()
}

exports.checkBody = (req, res, next) => {
	if (!req.body.name || !req.body.price) {
		return res.status(400).json({
			status: 'failed',
			message: 'missing tour name or price'
		})
	}
	next()
}

exports.getAllTours = (req, res) => {
	res.status(200).json({
		status: 'Success',
		data: {
			tours
		}
	})
}

exports.getTour = (req, res) => {
	const id = req.params.id*1
	const tour = tours.find(tour => tour.id === id)

	console.log(`got from middleware is: ${req.modifiedId}`)

	if (!tour) {
		return res.status(404).json({
			status: "failed",
			message: "Invalid Id"
		})
	}

	res.status(200).json({
		status: "success",
		data: {
			tour
		}
	})
}

exports.createNewTour = (req, res) => {
	const newTourId = tours[tours.length-1].id+1;
	const newTour = Object.assign({id: newTourId}, req.body)
	tours.push(newTour)

	// fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
		res.status(200).json({
			status: "success",
			data: {
				tour: newTour
			}
		})
	// })
}

exports.updateTour = (req, res) => {
	res.status(200).json({
		status: "success",
		message: "<Tour Update>"
	})
}

exports.deleteTour = (req, res) => {
	res.status(204).json({
		status: "success",
		data: null
	})
}

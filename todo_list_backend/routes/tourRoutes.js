const express = require('express')
const tourController = require('../controllers/tourController')

const route = express.Router()
// route.param('id', tourController.checkId)

route.route('/')
	.get(tourController.getAllTours)
	// .post(tourController.checkBody, tourController.createNewTour)
	.post(tourController.createNewTour)

route.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour)

module.exports = route
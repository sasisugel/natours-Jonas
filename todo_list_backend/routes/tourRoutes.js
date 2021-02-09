const express = require('express')
const tourController = require('../controllers/tourController')
const authController = require('../controllers/authController')
// const reviewController = require('../controllers/reviewController')
const reviewRouter = require('./../routes/reviewRoutes')

const router = express.Router()
// route.param('id', tourController.checkId)

// router.route('/:tourId/reviews')
// 	.post(authController.protect, authController.restrictedTo('user'), reviewController.createReview)

// /* connect with review routes (multiple routes merge) */
router.route('/:tourId/reviews', reviewRouter)

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)

router.route('/')
	.get(authController.protect, tourController.getAllTours)
	// .post(tourController.checkBody, tourController.createNewTour)
	.post(tourController.createNewTour)

router.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(authController.protect, authController.restrictedTo('admin', 'lead-guide'), tourController.deleteTour)

module.exports = router
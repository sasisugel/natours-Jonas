const express = require('express')
const { protect, restrictedTo } = require('../controllers/authController')
const { getAllReviews, createReview } = require('../controllers/reviewController')

const router = express.Router()

router.route('/')
	.get(getAllReviews)
	.post(protect,restrictedTo('user'),createReview)

module.exports = router
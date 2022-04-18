const express = require('express')
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');
const Campground = require('../models/campground');
const Review = require('../models/review');

const ExpressError = require('../utils/ExpressError');
const ViewAsync = require('../utils/ViewAsync');

//posta o review
router.post('/', isLoggedIn, validateReview, ViewAsync(reviews.createReview));

//deleta o review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, ViewAsync(reviews.deleteReview));

module.exports = router;
const Review = require("../models/reviewModel");
const factory = require("./handlersFactory");

// @desc      Get List Of reviews
// @route     GET   /api/v1/reviews
// @access    Public
exports.getReviews = factory.getAll(Review);

// @desc      Get Specific Review by Id
// @route     GET   /api/v1/reviews/:id
// @access    Public
exports.getReview = factory.getOne(Review);

// @desc      Create Review
// @route     POST   /api/v1/reviews
// @access    Private/Protect/User
exports.createReview = factory.createOne(Review);

// @desc      Update Specific Review
// @route     PUT   /api/v1/reviews/:id
// @access    Private/Protect/User
exports.updateReview = factory.updateOne(Review);

// @desc      Delete Specific Review
// @route     DELETE   /api/v1/reviews/:id
// @access    Private/Protect/User/Admin/Manager
exports.deleteReview = factory.deleteOne(Review);

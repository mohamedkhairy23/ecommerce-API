const Review = require("../models/reviewModel");
const factory = require("./handlersFactory");

exports.createFilterObj = (req, res, next) => {
  // Nested Route
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObject = filterObject;
  next();
};
// @desc      Get List Of reviews
// @route     GET   /api/v1/reviews
// @access    Public
exports.getReviews = factory.getAll(Review);

// @desc      Get Specific Review by Id
// @route     GET   /api/v1/reviews/:id
// @access    Public
exports.getReview = factory.getOne(Review);

exports.setProductIdAndUserIdToBody = (req, res, next) => {
  // Nested Route
  //  Middleware for adding product to request by productId
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};
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

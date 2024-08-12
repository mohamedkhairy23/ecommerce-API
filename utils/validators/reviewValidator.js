const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid review id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid review id format")
    .custom((val, { req }) =>
      // Check if logged user create review before
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
        }
      )
    ),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id format")
    .custom((val, { req }) =>
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error(`There is no review with this id ${val}`)
          );
        }
        // check if a logged in user own the review
        if (review.user.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`You are not allowed to perform this action`)
          );
        }
      })
    ),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id format")
    .custom((val, { req }) =>
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error(`There is no review with this id ${val}`)
          );
        }
        // check if a logged in user own the review
        if (review.user.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`You are not allowed to perform this action`)
          );
        }
      })
    ),

  validatorMiddleware,
];

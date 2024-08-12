const express = require("express");
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require("../services/reviewService");
const {
  getReviewValidator,
  createReviewValidator,
  deleteReviewValidator,
  updateReviewValidator,
} = require("../utils/validators/reviewValidator");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getReviews)
  .post(protect, allowedTo("user"), createReviewValidator, createReview);
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("user", "manager", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;

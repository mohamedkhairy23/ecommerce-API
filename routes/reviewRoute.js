const express = require("express");
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require("../services/reviewService");
// const {
//   createBrandValidator,
//   getBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../utils/validators/brandValidator");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getReviews)
  .post(protect, allowedTo("user"), createReview);
router
  .route("/:id")
  .get(getReview)
  .put(protect, allowedTo("user"), updateReview)
  .delete(protect, allowedTo("user", "manager", "admin"), deleteReview);

module.exports = router;

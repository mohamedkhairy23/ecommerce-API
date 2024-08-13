const express = require("express");
const { protect, allowedTo } = require("../services/authService");
const {
  addProductToWishList,
  removeProductFromWishlist,
} = require("../services/wishlistService");

const router = express.Router();

router.route("/").post(protect, allowedTo("user"), addProductToWishList);
router
  .route("/:productId")
  .delete(protect, allowedTo("user"), removeProductFromWishlist);

module.exports = router;

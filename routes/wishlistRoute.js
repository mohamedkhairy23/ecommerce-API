const express = require("express");
const { protect, allowedTo } = require("../services/authService");
const {
  addProductToWishList,
  removeProductFromWishlist,
  getLoggedInUserWishlist,
} = require("../services/wishlistService");

const router = express.Router();

router.use(protect, allowedTo("user"));

router.route("/").post(addProductToWishList).get(getLoggedInUserWishlist);
router.route("/:productId").delete(removeProductFromWishlist);

module.exports = router;

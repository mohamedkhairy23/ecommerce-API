const express = require("express");
const {
  addProductToCart,
  getLoggedInUserCart,
  removeSpecificCartItem,
  clearLoggedInUserCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartService");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedInUserCart)
  .delete(clearLoggedInUserCart);

router.put("/applyCoupon", applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

module.exports = router;

const express = require("express");
const {
  addProductToCart,
  getLoggedInUserCart,
  removeSpecificCartItem,
  clearLoggedInUserCart,
} = require("../services/cartService");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedInUserCart)
  .delete(clearLoggedInUserCart);

router.route("/:itemId").delete(removeSpecificCartItem);

module.exports = router;

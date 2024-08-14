const express = require("express");
const {
  addProductToCart,
  getLoggedInUserCart,
  removeSpecificCartItem,
} = require("../services/cartService");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router.use(protect, allowedTo("user"));

router.route("/").post(addProductToCart).get(getLoggedInUserCart);

router.route("/:itemId").delete(removeSpecificCartItem);

module.exports = router;

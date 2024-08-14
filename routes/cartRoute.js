const express = require("express");
const {
  addProductToCart,
  getLoggedInUserCart,
} = require("../services/cartService");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router.route("/").post(protect, allowedTo("user"), addProductToCart);
router.route("/").get(protect, allowedTo("user"), getLoggedInUserCart);

module.exports = router;

const express = require("express");
const { addProductToCart } = require("../services/cartService");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router.route("/").post(protect, allowedTo("user"), addProductToCart);

module.exports = router;

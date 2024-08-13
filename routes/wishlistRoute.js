const express = require("express");
const { protect, allowedTo } = require("../services/authService");
const { addProductToWishList } = require("../services/wishlistService");

const router = express.Router();

router.route("/").post(protect, allowedTo("user"), addProductToWishList);

module.exports = router;

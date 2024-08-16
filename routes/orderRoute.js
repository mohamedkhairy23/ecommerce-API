const express = require("express");
const { protect, allowedTo } = require("../services/authService");
const { createCashOrder } = require("../services/orderService");

const router = express.Router();

router.route("/:cartId").post(protect, allowedTo("user"), createCashOrder);

module.exports = router;

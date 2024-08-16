const express = require("express");
const { protect, allowedTo } = require("../services/authService");
const {
  createCashOrder,
  getAllOrders,
  getOrder,
  filterOrderForLoggedUser,
} = require("../services/orderService");

const router = express.Router();

router.route("/:cartId").post(protect, allowedTo("user"), createCashOrder);
router.get(
  "/",
  protect,
  allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  getAllOrders
);
router.get(
  "/:id",
  protect,
  allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  getOrder
);

module.exports = router;

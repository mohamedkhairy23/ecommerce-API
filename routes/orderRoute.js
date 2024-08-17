const express = require("express");
const { protect, allowedTo } = require("../services/authService");
const {
  createCashOrder,
  getAllOrders,
  getOrder,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderService");
const {
  createCashOrderValidator,
  getOrderValidator,
} = require("../utils/validators/orderValidator");

const router = express.Router();

router.get(
  "/checkout-session/:cartId",
  protect,
  allowedTo("user"),
  createCashOrderValidator,
  checkoutSession
);

router
  .route("/:cartId")
  .post(protect, allowedTo("user"), createCashOrderValidator, createCashOrder);
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
  getOrderValidator,
  getOrder
);
router.put(
  "/:id/pay",
  protect,
  allowedTo("admin", "manager"),
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  protect,
  allowedTo("admin", "manager"),
  updateOrderToDelivered
);

module.exports = router;

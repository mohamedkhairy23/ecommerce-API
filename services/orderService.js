const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// @desc      Create cash order (Cash on delivery order)
// @route     POST   /api/v1/orders/:cartId
// @access    Private/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(
      new ApiError(`There is no cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default payment method type ("cash")
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "Success", data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObject = { user: req.user._id };

  next();
});
// @desc      Get all orders
// @route     POST   /api/v1/orders
// @access    Private/User/Admin/Manager
exports.getAllOrders = factory.getAll(Order);

// @desc      Get a specific order
// @route     GET   /api/v1/orders/:id
// @access    Private/User/Admin/Manager
exports.getOrder = asyncHandler(async (req, res, next) => {
  let order;
  if (req.user.role === "user") {
    order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate({
      path: "user",
      select: "name",
    });
  } else {
    order = await Order.findById(req.params.id).populate({
      path: "user",
      select: "name",
    });
  }

  if (!order) {
    return next(
      new ApiError(`There is no order with id ${req.params.id}`, 404)
    );
  }

  res.status(201).json({ data: order });
});

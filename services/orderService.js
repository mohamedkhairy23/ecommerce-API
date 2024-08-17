// eslint-disable-next-line import/no-extraneous-dependencies
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Settings = require("../models/settingsModel");

// @desc      Create cash order (Cash on delivery order)
// @route     POST   /api/v1/orders/:cartId
// @access    Private/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const settings = await Settings.findById("66bfac0be34c9a80f90e82be");

  // app settings
  const { taxPrice, shippingPrice } = settings;

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
    taxPrice: taxPrice,
    shippingPrice: shippingPrice,
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
    });
  } else {
    order = await Order.findById(req.params.id);
  }

  if (!order) {
    return next(
      new ApiError(`There is no order with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ data: order });
});

// @desc      Update order paid status to paid
// @route     PUT   /api/v1/orders/:id/pay
// @access    Private/Admin/Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(`There is no order with id ${req.params.id}`, 404)
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "Success", data: updatedOrder });
});

// @desc      Update order paid status to delivered
// @route     PUT   /api/v1/orders/:id/deliver
// @access    Private/Admin/Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(`There is no order with id ${req.params.id}`, 404)
    );
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "Success", data: updatedOrder });
});

// @desc      Get checkout session from stripe paid and send it as response
// @route     GET   /api/v1/orders/checkout-session/:cartId
// @access    Private/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const settings = await Settings.findById("66bfac0be34c9a80f90e82be");

  // app settings
  const { taxPrice, shippingPrice } = settings;

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

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: `${req.user.name}`,
          },
        },
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // Send session to response
  res.status(200).json({ status: "success", session });
});

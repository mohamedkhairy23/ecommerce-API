const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });

  cart.totalCartPrice = totalPrice;

  return totalPrice;
};

// @desc      Add Product To Cart
// @route     POST   /api/v1/cart
// @access    Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  // 1) get cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // create cart for loggged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color: color, price: product.price }],
    });
  } else {
    // if product exists in cartItems array, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // if product doesn't exist in cartItems array, push product to cart items array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  // calc total cart price
  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "Success",
    message: "Prduct added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc      Get LoggedIn User Cart
// @route     GET   /api/v1/cart
// @access    Private/User
exports.getLoggedInUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id: ${req.user._id}`, 404)
    );
  }

  res.status(200).json({
    status: "Success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc      Remove specific cart item from cart items array
// @route     DELETE OR PUT   /api/v1/cart/:itemId
// @access    Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "Success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc      Clear logged user cart
// @route     DELETE   /api/v1/cart
// @access    Private/User
exports.clearLoggedInUserCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(200).json({
    status: "Success",
    message: "Cart removed successfully",
  });
});

// @desc      Update specific cart item quantity
// @route     PUT   /api/v1/cart/:itemId
// @access    Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError(`There is no cart for user ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;

    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`There is no item for this id ${req.params.itemId}`, 404)
    );
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "Success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

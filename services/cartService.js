const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });

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
  const totalPrice = calcTotalCartPrice(cart);

  cart.totalCartPrice = totalPrice;

  await cart.save();

  res.status(200).json({
    status: "Success",
    message: "Prduct added to cart successfully",
    data: cart,
  });
});

const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

// @desc      Add Product To Wishlist
// @route     POST   /api/v1/wishlist
// @access    Private/User
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // $addToSet operator in mongoDB => add productId to wishlist array if productId not exist
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Product added successfully to your wishlist",
    data: user.wishlist,
  });
});

// @desc      Remove Product From Wishlist
// @route     DELETE   /api/v1/wishlist/:productId
// @access    Private/User
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // $pull operator in mongoDB => remove productId from wishlist array if productId not exist
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Product removed successfully from your wishlist",
    data: user.wishlist,
  });
});

// @desc      Get logged user wishlist
// @route     GET   /api/v1/wishlist
// @access    Private/User
exports.getLoggedInUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "Success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});

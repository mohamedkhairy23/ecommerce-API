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
      // $addToSet operator in mongoDB => add productId to wishlst if productId not exist
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

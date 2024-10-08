const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

// @desc      Add Addres To User Addresses List
// @route     POST   /api/v1/addresses
// @access    Private/User
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // $addToSet operator in mongoDB => add address object to user addresses array if address not exist
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Address added successfully",
    data: user.addresses,
  });
});

// @desc      Remove address From addresses list
// @route     DELETE   /api/v1/addresses/:addressId
// @access    Private/User
exports.removeAddressFromUserAddressesList = asyncHandler(
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        // $pull operator in mongoDB => remove address object from addresses array if address not exist
        $pull: { addresses: { _id: req.params.addressId } },
      },
      { new: true }
    );

    res.status(200).json({
      status: "Success",
      message: "Address removed successfully",
      data: user.addresses,
    });
  }
);

// @desc      Get logged user addresses
// @route     GET   /api/v1/addresses
// @access    Private/User
exports.getLoggedInUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "Success",
    results: user.addresses.length,
    data: user.addresses,
  });
});

// @desc      Update specific address
// @route     PUT   /api/v1/cart/:addressId
// @access    Private/User
exports.updateSpecificAddress = asyncHandler(async (req, res, next) => {
  const { alias, details, phone, city, postalCode } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError(`Login to access this route`, 404));
  }

  const addressIndex = user.addresses.findIndex(
    (address) => address._id.toString() === req.params.addressId
  );

  if (addressIndex > -1) {
    const addressItem = user.addresses[addressIndex];
    addressItem.alias = alias;
    addressItem.details = details;
    addressItem.phone = phone;
    addressItem.city = city;
    addressItem.postalCode = postalCode;

    user.addresses[addressIndex] = addressItem;

    await user.save();
  } else {
    return next(
      new ApiError(
        `There is no address for this id ${req.params.addressId}`,
        404
      )
    );
  }

  res.status(200).json({
    status: "Success",
    data: user.addresses[addressIndex],
  });
});

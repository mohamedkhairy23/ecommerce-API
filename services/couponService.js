const factory = require("./handlersFactory");
const Coupon = require("../models/couponModel");

// @desc      Get List Of Coupons
// @route     GET   /api/v1/coupons
// @access    Private/Admin/Manager
exports.getCoupons = factory.getAll(Coupon);

// @desc      Get Specific Coupon by Id
// @route     GET   /api/v1/coupons/:id
// @access    Private/Admin/Manager
exports.getCoupon = factory.getOne(Coupon);

// @desc      Create Coupon
// @route     POST   /api/v1/coupons
// @access    Private/Admin/Managers
exports.createCoupon = factory.createOne(Coupon);

// @desc      Update Specific Coupon
// @route     PUT   /api/v1/coupons/:id
// @access    Private/Admin/Manager
exports.updateCoupon = factory.updateOne(Coupon);

// @desc      Delete Specific Coupon
// @route     DELETE   /api/v1/coupons/:id
// @access    Private/Admin/Manager
exports.deleteCoupon = factory.deleteOne(Coupon);

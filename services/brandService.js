const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");

// @desc      Get List Of Brands
// @route     GET   /api/v1/brands
// @access    Public
exports.getBrands = factory.getAll(Brand);

// @desc      Get Specific Brand by Id
// @route     GET   /api/v1/brands/:id
// @access    Public
exports.getBrand = factory.getOne(Brand);

// @desc      Create Brand
// @route     POST   /api/v1/brands
// @access    Private
exports.createBrand = factory.createOne(Brand);

// @desc      Update Specific Brand
// @route     PUT   /api/v1/brands/:id
// @access    Private
exports.updateBrand = factory.updateOne(Brand);

// @desc      Delete Specific Brand
// @route     DELETE   /api/v1/brands/:id
// @access    Private
exports.deleteBrand = factory.deleteOne(Brand);

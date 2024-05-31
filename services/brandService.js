const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const ApiError = require("../utils/apiError");

// @desc      Get List Of Brands
// @route     GET   /api/v1/brands
// @access    Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const brands = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({ result: brands.length, page, data: brands });
});

// @desc      Get Specific Brand by Id
// @route     GET   /api/v1/brands/:id
// @access    Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }

  res.status(200).json({ data: brand });
});

// @desc      Create Brand
// @route     POST   /api/v1/brands
// @access    Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

// @desc      Update Specific Brand
// @route     PUT   /api/v1/brands/:id
// @access    Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    { _id: id },
    { name: name, slug: slugify(name) },
    {
      new: true,
    }
  );

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }

  res.status(200).json({ data: brand });
});

// @desc      Delete Specific Brand
// @route     DELETE   /api/v1/brands/:id
// @access    Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }

  res.status(200).json({ data: {} });
});

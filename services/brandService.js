const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// @desc      Get List Of Brands
// @route     GET   /api/v1/brands
// @access    Public
exports.getBrands = asyncHandler(async (req, res) => {
  const docummentsCount = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .paginate(docummentsCount)
    .filter()
    .sort()
    .limitFields()
    .search();

  const { mongooseQuery, paginationResult } = apiFeatures;
  const brands = await mongooseQuery;

  res
    .status(200)
    .json({ result: brands.length, paginationResult, data: brands });
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

  res.status(200).json({});
});
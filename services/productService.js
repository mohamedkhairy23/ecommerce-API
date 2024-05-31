const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");

// @desc      Get List Of Products
// @route     GET   /api/v1/products
// @access    Public
exports.getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const products = await Product.find({}).skip(skip).limit(limit).populate({
    path: "category",
    select: "name -_id",
  });
  res.status(200).json({ result: products.length, page, data: products });
});

// @desc      Get Specific Product by Id
// @route     GET   /api/v1/products/:id
// @access    Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  });

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }

  res.status(200).json({ data: product });
});

// @desc      Create Product
// @route     POST   /api/v1/products
// @access    Private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);

  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

// @desc      Update Specific Product
// @route     PUT   /api/v1/products/:id
// @access    Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }

  res.status(200).json({ data: product });
});

// @desc      Delete Specific Product
// @route     DELETE   /api/v1/products/:id
// @access    Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }

  res.status(200).json({});
});

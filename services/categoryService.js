const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc      Get List Of Category
// @route     GET   /api/v1/categories
// @access    Public
exports.getCategories = asyncHandler(async (req, res) => {
  const docummentsCount = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .paginate(docummentsCount)
    .filter()
    .sort()
    .limitFields()
    .search();

  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;
  res
    .status(200)
    .json({ result: categories.length, paginationResult, data: categories });
});

// @desc      Get Specific Category by Id
// @route     GET   /api/v1/categories/:id
// @access    Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }

  res.status(200).json({ data: category });
});

// @desc      Create Category
// @route     POST   /api/v1/categories
// @access    Private
exports.createCategory = factory.createOne(Category);

// @desc      Update Specific Category
// @route     PUT   /api/v1/categories/:id
// @access    Private
exports.updateCategory = factory.updateOne(Category);

// @desc      Delete Specific Category
// @route     DELETE   /api/v1/categories/:id
// @access    Private
exports.deleteCategory = factory.deleteOne(Category);

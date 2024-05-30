const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Subcategory = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");

// @desc      Get List Of Subategory
// @route     GET   /api/v1/subcategories
// @access    Public
exports.getSubcategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const subcategories = await Subcategory.find({})
    .populate("category")
    .skip(skip)
    .limit(limit);
  res
    .status(200)
    .json({ result: subcategories.length, page, data: subcategories });
});

// @desc      Get Specific Subcategory by Id
// @route     GET   /api/v1/subcategories/:id
// @access    Public
exports.getSubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findById(id);

  if (!subcategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }

  res.status(200).json({ data: subcategory });
});

// @desc      Create Category
// @route     POST   /api/v1/subcategories
// @access    Private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await Subcategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

// @desc      Update Specific subategory
// @route     PUT   /api/v1/subcategories/:id
// @access    Private
exports.updateSubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subcategory = await Subcategory.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    {
      new: true,
    }
  );

  if (!subcategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }

  res.status(200).json({ data: subcategory });
});

// @desc      Delete Specific Subcategory
// @route     DELETE   /api/v1/subcategories/:id
// @access    Private
exports.deleteSubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findByIdAndDelete(id);

  if (!subcategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }

  res.status(200).json({ data: {} });
});

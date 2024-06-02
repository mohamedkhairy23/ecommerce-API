const asyncHandler = require("express-async-handler");
const Subcategory = require("../models/subCategoryModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// Nested Route
// @route     GET   /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};
// @desc      Get List Of Subategory
// @route     GET   /api/v1/subcategories
// @access    Public
exports.getSubcategories = asyncHandler(async (req, res) => {
  const docummentsCount = await Subcategory.countDocuments();
  const apiFeatures = new ApiFeatures(
    Subcategory.find(req.filterObject),
    req.query
  )
    .paginate(docummentsCount)
    .filter()
    .sort()
    .limitFields()
    .search();

  const { mongooseQuery, paginationResult } = apiFeatures;
  const subcategories = await mongooseQuery;

  res.status(200).json({
    result: subcategories.length,
    paginationResult,
    data: subcategories,
  });
});

// @desc      Get Specific Subcategory by Id
// @route     GET   /api/v1/subcategories/:id
// @access    Public
exports.getSubcategory = factory.getOne(Subcategory);

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested Route
  //  Middleware for adding category to request by categoryId
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// @desc      Create Category
// @route     POST   /api/v1/subcategories
// @route     POST   /api/v1/categories/:categoryId/subcategories
// @access    Private
exports.createSubCategory = factory.createOne(Subcategory);

// @desc      Update Specific subategory
// @route     PUT   /api/v1/subcategories/:id
// @access    Private
exports.updateSubcategory = factory.updateOne(Subcategory);

// @desc      Delete Specific Subcategory
// @route     DELETE   /api/v1/subcategories/:id
// @access    Private
exports.deleteSubcategory = factory.deleteOne(Subcategory);

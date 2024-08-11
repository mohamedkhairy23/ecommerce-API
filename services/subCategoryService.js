const Subcategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.createFilterObj = (req, res, next) => {
  // Nested Route
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};
// @desc      Get List Of Subategory
// @route     GET   /api/v1/subcategories
// @route     GET   /api/v1/categories/:categoryId/subcategories
// @access    Public
exports.getSubcategories = factory.getAll(Subcategory);

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
// @access    Private/Admin/Manager
exports.createSubCategory = factory.createOne(Subcategory);

// @desc      Update Specific subategory
// @route     PUT   /api/v1/subcategories/:id
// @access    Private/Admin/Manager
exports.updateSubcategory = factory.updateOne(Subcategory);

// @desc      Delete Specific Subcategory
// @route     DELETE   /api/v1/subcategories/:id
// @access    Private/Admin
exports.deleteSubcategory = factory.deleteOne(Subcategory);

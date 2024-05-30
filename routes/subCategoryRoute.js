const express = require("express");
const {
  createSubCategory,
  getSubcategories,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const router = express.Router();

router
  .route("/")
  .post(createSubCategoryValidator, createSubCategory)
  .get(getSubcategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubcategory)
  .put(updateSubCategoryValidator, updateSubcategory)
  .delete(deleteSubCategoryValidator, deleteSubcategory);

module.exports = router;

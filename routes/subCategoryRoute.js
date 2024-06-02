const express = require("express");
const {
  createSubCategory,
  getSubcategories,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
  setCategoryIdToBody,
  createFilterObj,
  applySlugify,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

// mergeParams: Allow us to access the parameters on other routers
// ex: We need to access categoryId from category routes
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObj, getSubcategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubcategory)
  .put(updateSubCategoryValidator, applySlugify, updateSubcategory)
  .delete(deleteSubCategoryValidator, deleteSubcategory);

module.exports = router;

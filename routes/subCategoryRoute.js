const express = require("express");
const {
  createSubCategory,
  getSubcategories,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const { protect, allowedTo } = require("../services/authService");

// mergeParams: Allow us to access the parameters on other routers
// ex: We need to access categoryId from category routes
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    allowedTo("manager", "admin"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObj, getSubcategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubcategory)
  .put(
    protect,
    allowedTo("manager", "admin"),
    updateSubCategoryValidator,
    updateSubcategory
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubcategory
  );

module.exports = router;

const { param, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory required")
    .isLength({ min: 3 })
    .withMessage("Too short subcategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subcategory name"),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to category")
    .isMongoId()
    .withMessage("Invalid Category id format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleware,
];

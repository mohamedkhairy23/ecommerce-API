const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getOrderValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.createOrderValidator = [
  check("cartId").isMongoId().withMessage("Invalid Cart ID format"),

  check("shippingAddress.details")
    .notEmpty()
    .withMessage("Address details required")
    .isLength({ min: 20 })
    .withMessage("Too short address description")
    .isLength({ max: 100 })
    .withMessage("Too long address description"),

  check("shippingAddress.city")
    .notEmpty()
    .withMessage("City required")
    .isLength({ min: 3 })
    .withMessage("Too short city name")
    .isLength({ max: 32 })
    .withMessage("Too long city name"),

  check("shippingAddress.phone")
    .notEmpty()
    .withMessage("Phone required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Only accept Egypt phone numbers and saudian phone numbers"),

  check("shippingAddress.postalCode")
    .notEmpty()
    .withMessage("Postal code required"),
  // .isPostalCode({ locale: "ar-EG" })
  // .withMessage("Invalid postal code"),

  validatorMiddleware,
];

const slugify = require("slugify");
const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

/////////////// Code between for localizing express validator ///////////////////////////
///// example validation message
// const passwordLengthMessage = {
//   english: "Password must be at least 6 characters",
//   arabic: "كلمة السر المطلوبة لا تقل عن ستة أحرف",
// };
//////////////////////*** headers in client will be like that, and that is based on validatorMiddleware configuration in validatorMiddleware.js file
// headers: {
//   "accept-language":"english"
// }
/////////////// Code between for localizing express validator ///////////////////////////

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name required")
    .isLength({ min: 3 })
    .withMessage("Too short user name")
    .isLength({ max: 32 })
    .withMessage("Too long user name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Only accept Egypt phone numbers and saudian phone numbers"),

  check("profileImg").optional(),

  check("role").optional(),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Only accept Egypt phone numbers and saudian phone numbers"),

  check("profileImg").optional(),

  check("role").optional(),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),

  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),

  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),

  body("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);

      if (!user) {
        throw new Error("There is no user for this id");
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      // val refer to password
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

////////////////////////////////////////////////////////////////////////////////////////
exports.changeLoggedUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),

  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),

  body("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);

      // if (!user) {
      //   throw new Error("There is no user for this id");
      // }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      // val refer to password
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val, { req }) =>
      User.findById(req.user.id).then((user) => {
        if (user && user.email !== val) {
          return Promise.reject(new Error("Email already in use"));
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Only accept Egypt phone numbers and saudian phone numbers"),

  check("profileImg").optional(),

  validatorMiddleware,
];

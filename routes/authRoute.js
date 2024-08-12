const express = require("express");
const { signUp, login, forgetPassword } = require("../services/authService");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, signUp);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgetPassword);

module.exports = router;

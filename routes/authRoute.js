const express = require("express");
const { signUp, login } = require("../services/authService");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.route("/signup").post(signupValidator, signUp);
router.route("/login").post(loginValidator, login);

module.exports = router;

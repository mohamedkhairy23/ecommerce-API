const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const generateToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

// @desc      Signup
// @route     POST   /api/v1/auth/signup
// @access    Public
exports.signUp = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = generateToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc      Login
// @route     POST   /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  const checkPassword = await bcrypt.compare(req.body.password, user.password);

  if (!user || !checkPassword) {
    return next(new ApiError(`Invalid email or password`, 400));
  }

  const token = generateToken(user._id);

  res.status(200).json({ data: user, token });
});

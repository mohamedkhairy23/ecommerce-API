const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

const generateToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

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

exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "You are not login, please login to get access this route",
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = currentUser.passwordChangedAt.getTime(); // This in mili seconds (getTime() method convert date to milli seconds)
    const passwordChangedTimestampInSeconds = parseInt(
      passwordChangedTimestamp / 1000,
      10
    ); // This in seconds

    // console.log(passwordChangedTimestampInSeconds, decoded.iat);

    if (passwordChangedTimestampInSeconds > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed this password. Please login again...",
          401
        )
      );
    }
  }

  // access current user(logged in user) from req.user
  req.user = currentUser;

  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1.access to roles
    // 2. access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route"),
        403
      );
    }

    next();
  });

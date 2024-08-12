const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

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

// @desc      Forgot Password
// @route     POST   /api/v1/auth/forgotPassword
// @access    Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 2. Get user by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ApiError(`There is no user with this email ${req.body.email}`),
      404
    );
  }

  // 3. If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  console.log(resetCode);
  console.log(hashResetCode);

  // Save hashed password reset code into db
  user.passwordResetCode = hashResetCode;
  // Add expiration time for password reset code (10 mins)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3. Send the reset code via email
  const message = `Hi ${user.name},\n We recieved a request to reset the password on your E-shop account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure \n The E-shop team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 mins)",
      message: message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

// @desc      Verify Password Reset Code
// @route     POST   /api/v1/auth/verifyResetCode
// @access    Public
exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;

  await user.save();

  res.status(200).json({ status: "Success" });
});

// @desc      Reset Password
// @route     POST   /api/v1/auth/resetPassword
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError(`There is no user with email ${req.body.email}`));
  }

  // check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset cde not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = generateToken(user._id);

  res.status(200).json({ data: user, token });
});

const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const { uploadSingleImage } = require("../middlewares/uploadImage");
const User = require("../models/userModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const { generateToken } = require("../utils/generateToken");

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImg = filename;
  }

  next();
});

// @desc      Get List Of Users
// @route     GET   /api/v1/users
// @access    Private/Admin/Manager
exports.getUsers = factory.getAll(User);

// @desc      Get Specific User by Id
// @route     GET   /api/v1/users/:id
// @access    Private/Admin
exports.getUser = factory.getOne(User);

// @desc      Create User
// @route     POST   /api/v1/users
// @access    Private/Admin
exports.createUser = factory.createOne(User);

// @desc      Update Specific User
// @route     PUT   /api/v1/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

// @desc      Change User Password
// @route     PUT   /api/v1/users/changePassword/:id
// @access    Private/Admin
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: user });
});

// @desc      Delete Specific User
// @route     DELETE   /api/v1/users/:id
// @access    Private/Admin
exports.deleteUser = factory.deleteOne(User);

// @desc      Get My Data (Logged in user data)
// @route     DELETE   /api/v1/users/getMe
// @access    Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc      Update logged user password
// @route     PUT   /api/v1/users/changeMyPassword
// @access    Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }

  const token = generateToken(user._id);

  res.status(200).json({ data: user, token });
});

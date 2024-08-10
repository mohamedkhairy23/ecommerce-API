const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const { uploadSingleImage } = require("../middlewares/uploadImage");
const User = require("../models/userModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

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
// @access    Private
exports.getUsers = factory.getAll(User);

// @desc      Get Specific User by Id
// @route     GET   /api/v1/users/:id
// @access    Private
exports.getUser = factory.getOne(User);

// @desc      Create User
// @route     POST   /api/v1/users
// @access    Private
exports.createUser = factory.createOne(User);

// @desc      Update Specific User
// @route     PUT   /api/v1/users/:id
// @access    Private
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
// @access    Private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
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

// @desc      Delete Specific User
// @route     DELETE   /api/v1/users/:id
// @access    Private
exports.deleteUser = factory.deleteOne(User);

const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImage");
const User = require("../models/userModel");
const factory = require("./handlersFactory");

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
exports.updateUser = factory.updateOne(User);

// @desc      Delete Specific User
// @route     DELETE   /api/v1/users/:id
// @access    Private
exports.deleteUser = factory.deleteOne(User);

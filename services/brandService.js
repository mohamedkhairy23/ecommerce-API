const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImage");
const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/brands/${filename}`);

    req.body.image = filename;
  }

  next();
});

// @desc      Get List Of Brands
// @route     GET   /api/v1/brands
// @access    Public
exports.getBrands = factory.getAll(Brand);

// @desc      Get Specific Brand by Id
// @route     GET   /api/v1/brands/:id
// @access    Public
exports.getBrand = factory.getOne(Brand);

// @desc      Create Brand
// @route     POST   /api/v1/brands
// @access    Private/Admin/Manager
exports.createBrand = factory.createOne(Brand);

// @desc      Update Specific Brand
// @route     PUT   /api/v1/brands/:id
// @access    Private/Admin/Manager
exports.updateBrand = factory.updateOne(Brand);

// @desc      Delete Specific Brand
// @route     DELETE   /api/v1/brands/:id
// @access    Private/Admin
exports.deleteBrand = factory.deleteOne(Brand);

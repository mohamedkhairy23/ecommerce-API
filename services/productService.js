const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const { uploadMixImages } = require("../middlewares/uploadImage");

exports.uploadProductImages = uploadMixImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // image processing for image cover
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFilename}`);

    req.body.imageCover = imageCoverFilename;
  }
  // image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      })
    );
  }

  next();
});

// @desc      Get List Of Products
// @route     GET   /api/v1/products
// @access    Public
exports.getProducts = factory.getAll(Product, "Products");

// @desc      Get Specific Product by Id
// @route     GET   /api/v1/products/:id
// @access    Public
exports.getProduct = factory.getOne(Product, "reviews");

// @desc      Create Product
// @route     POST   /api/v1/products
// @access    Private/Admin/Manager
exports.createProduct = factory.createOne(Product);

// @desc      Update Specific Product
// @route     PUT   /api/v1/products/:id
// @access    Private/Admin/Manager
exports.updateProduct = factory.updateOne(Product);

// @desc      Delete Specific Product
// @route     DELETE   /api/v1/products/:id
// @access    Private/Admin
exports.deleteProduct = factory.deleteOne(Product);

const express = require("express");
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  applySlugify,
} = require("../services/brandService");
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();

router.route("/").get(getBrands).post(createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(updateBrandValidator, applySlugify, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;

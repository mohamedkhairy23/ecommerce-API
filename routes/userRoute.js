const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
} = require("../services/userService");
// const {
//   createBrandValidator,
//   getBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../utils/validators/brandValidator");

const router = express.Router();

router.route("/").get(getUsers).post(uploadUserImage, resizeImage, createUser);
router
  .route("/:id")
  .get(getUser)
  .put(uploadUserImage, resizeImage, updateUser)
  .delete(deleteUser);

module.exports = router;

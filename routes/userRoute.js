const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
} = require("../services/userService");
const {
  createUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  changeLoggedUserPasswordValidator,
} = require("../utils/validators/userValidator");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

// For logged in user
router.get("/getMe", protect, getLoggedUserData, getUser);
router.put(
  "/changeMyPassword",
  protect,
  changeLoggedUserPasswordValidator,
  updateLoggedUserPassword
);

///// For admin
router
  .route("/")
  .get(protect, allowedTo("manager", "admin"), getUsers)
  .post(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(protect, allowedTo("admin"), getUserValidator, getUser)
  .put(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser);

router.put(
  "/changePassword/:id",
  protect,
  allowedTo("admin"),
  changeUserPasswordValidator,
  changeUserPassword
);

module.exports = router;

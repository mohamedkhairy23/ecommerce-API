const express = require("express");
const { protect, allowedTo } = require("../services/authService");
const {
  addAddress,
  getLoggedInUserAddresses,
  removeAddressFromUserAddressesList,
} = require("../services/addressService");

const router = express.Router();

router.use(protect, allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedInUserAddresses);
router.route("/:addressId").delete(removeAddressFromUserAddressesList);

module.exports = router;

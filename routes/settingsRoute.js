const express = require("express");

const { protect, allowedTo } = require("../services/authService");
const {
  getSettings,
  getSettingsById,
  updateSettings,
} = require("../services/settingsService");

const router = express.Router();

router.use(protect, allowedTo("admin"));

router.route("/").get(getSettings);
// router.route("/").get(getSettings).post(createSettings);
router.route("/:id").get(getSettingsById).put(updateSettings);

module.exports = router;

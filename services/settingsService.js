const Settings = require("../models/settingsModel");
const factory = require("./handlersFactory");

// @desc      Get List Of Settings
// @route     GET   /api/v1/settings
// @access    Private/Admin
exports.getSettings = factory.getAll(Settings);

// @desc      Get Settings by Id
// @route     GET   /api/v1/settings/:id
// @access    Private/Admin
exports.getSettingsById = factory.getOne(Settings);

// @desc      Create Settings
// @route     POST   /api/v1/settings
// @access    Private/Admin
exports.createSettings = factory.createOne(Settings);

// @desc      Update Specific Settings
// @route     PUT   /api/v1/settings/:id
// @access    Private/Admin
exports.updateSettings = factory.updateOne(Settings);

// @desc      Delete Specific Settings
// @route     DELETE   /api/v1/settings/:id
// @access    Private/Admin
exports.deleteSettings = factory.deleteOne(Settings);

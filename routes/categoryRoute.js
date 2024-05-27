const express = require("express");
const { createCategories } = require("../services/categoryService");

const router = express.Router();

router.post("/", createCategories);

module.exports = router;

const express = require("express");
const { uploadSingleFile } = require("../controllers/upload.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { uploadSingle } = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/single", isAuthenticated, uploadSingle, uploadSingleFile);

module.exports = router;

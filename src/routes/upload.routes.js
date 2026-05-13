const express = require("express");

const {
  uploadSingleFile,
  uploadMultipleFiles,
} = require("../controllers/upload.controller");

const { isAuthenticated } = require("../middlewares/auth.middleware");

const {
  uploadSingle,
  uploadMultiple,
} = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/single", isAuthenticated, uploadSingle, uploadSingleFile);
router.post("/multiple", isAuthenticated, uploadMultiple, uploadMultipleFiles);

module.exports = router;

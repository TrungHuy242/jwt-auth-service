const express = require("express");

const {
  uploadSingleFile,
  uploadMultipleFiles,
  getUploadedFiles,
  getUploadedFileById,
  deleteUploadedFile,
} = require("../controllers/upload.controller");

const { isAuthenticated } = require("../middlewares/auth.middleware");

const {
  uploadSingle,
  uploadMultiple,
} = require("../middlewares/upload.middleware");

const router = express.Router();

router.get("/", isAuthenticated, getUploadedFiles);
router.get("/:id", isAuthenticated, getUploadedFileById);

router.post("/single", isAuthenticated, uploadSingle, uploadSingleFile);
router.post("/multiple", isAuthenticated, uploadMultiple, uploadMultipleFiles);

router.delete("/:id", isAuthenticated, deleteUploadedFile);

module.exports = router;

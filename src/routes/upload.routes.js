const express = require("express");
const {
  uploadSingleFile,
  uploadMultipleFiles,
  getUploadedFiles,
  getUploadedFileById,
  deleteUploadedFile,
} = require("../controllers/upload.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { requirePermission, requireAnyPermission } = require("../middlewares/permission.middleware");
const {
  uploadSingle,
  uploadMultiple,
} = require("../middlewares/upload.middleware");

const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  requireAnyPermission(["files.view", "files.view_all"]),
  getUploadedFiles
);
router.get(
  "/:id",
  isAuthenticated,
  requireAnyPermission(["files.view", "files.view_all"]),
  getUploadedFileById
);
router.post(
  "/single",
  isAuthenticated,
  requirePermission("files.upload"),
  uploadSingle,
  uploadSingleFile
);
router.post(
  "/multiple",
  isAuthenticated,
  requirePermission("files.upload"),
  uploadMultiple,
  uploadMultipleFiles
);
router.delete(
  "/:id",
  isAuthenticated,
  requireAnyPermission(["files.delete", "files.delete_all"]),
  deleteUploadedFile
);

module.exports = router;

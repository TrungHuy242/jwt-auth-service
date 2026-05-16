const express = require("express");
const {
  getActivityLogs,
  getActivityLogById,
  exportActivityLogsExcelController,
} = require("../controllers/activityLog.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  requirePermission("activity_logs.view"),
  getActivityLogs
);
router.get(
  "/export/excel",
  isAuthenticated,
  requirePermission("activity_logs.export"),
  exportActivityLogsExcelController
);

router.get(
  "/:id",
  isAuthenticated,
  requirePermission("activity_logs.detail"),
  getActivityLogById
);

module.exports = router;

const express = require("express");
const {
  getDashboardOverview,
  getUserStatistics,
  getFileStatistics,
  getSystemStatistics,
  getRecentActivities,
} = require("../controllers/dashboard.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

const router = express.Router();

router.use(isAuthenticated);
router.use(requirePermission("dashboard.view"));

router.get("/overview", getDashboardOverview);
router.get("/users", getUserStatistics);
router.get("/files", getFileStatistics);
router.get("/system", getSystemStatistics);
router.get("/recent-activities", getRecentActivities);

module.exports = router;

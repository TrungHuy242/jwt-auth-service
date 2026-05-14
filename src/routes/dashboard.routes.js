const express = require("express");
const {
  getDashboardOverview,
  getUserStatistics,
  getFileStatistics,
  getSystemStatistics,
  getRecentActivities,
} = require("../controllers/dashboard.controller");
const { isAuthenticated, allowRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/overview", isAuthenticated, allowRoles("ADMIN"), getDashboardOverview);
router.get("/users", isAuthenticated, allowRoles("ADMIN"), getUserStatistics);
router.get("/files", isAuthenticated, allowRoles("ADMIN"), getFileStatistics);
router.get("/system", isAuthenticated, allowRoles("ADMIN"), getSystemStatistics);

router.get(
  "/recent-activities",
  isAuthenticated,
  allowRoles("ADMIN"),
  getRecentActivities
);

module.exports = router;

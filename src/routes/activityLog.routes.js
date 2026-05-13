const express = require("express");
const {
  getActivityLogs,
  getActivityLogById,
} = require("../controllers/activityLog.controller");
const { isAuthenticated, allowRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", isAuthenticated, allowRoles("ADMIN"), getActivityLogs);
router.get("/:id", isAuthenticated, allowRoles("ADMIN"), getActivityLogById);

module.exports = router;

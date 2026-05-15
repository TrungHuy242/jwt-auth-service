const express = require("express");
const {
  sendNotificationToUser,
  broadcastNotification,
} = require("../controllers/adminNotification.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

const router = express.Router();

router.post(
  "/user/:id",
  isAuthenticated,
  requirePermission("notifications.send"),
  sendNotificationToUser
);

router.post(
  "/broadcast",
  isAuthenticated,
  requirePermission("notifications.broadcast"),
  broadcastNotification
);

module.exports = router;

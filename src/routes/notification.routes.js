const express = require("express");
const {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notification.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

const router = express.Router();

router.get("/", isAuthenticated, requirePermission("notifications.view"), getMyNotifications);
router.get("/unread-count", isAuthenticated, requirePermission("notifications.view"), getUnreadNotificationCount);
router.patch("/read-all", isAuthenticated, requirePermission("notifications.view"), markAllNotificationsAsRead);
router.patch("/:id/read", isAuthenticated, requirePermission("notifications.view"), markNotificationAsRead);

module.exports = router;

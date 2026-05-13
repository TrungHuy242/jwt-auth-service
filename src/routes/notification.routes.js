const express = require("express");

const {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notification.controller");

const { isAuthenticated } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/unread-count", isAuthenticated, getUnreadNotificationCount);
router.get("/", isAuthenticated, getMyNotifications);
router.patch("/read-all", isAuthenticated, markAllNotificationsAsRead);
router.patch("/:id/read", isAuthenticated, markNotificationAsRead);

module.exports = router;

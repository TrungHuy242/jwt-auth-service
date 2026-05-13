const express = require("express");

const {
  sendNotificationToUser,
  broadcastNotification,
} = require("../controllers/adminNotification.controller");

const { isAuthenticated, allowRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/user/:id",
  isAuthenticated,
  allowRoles("ADMIN"),
  sendNotificationToUser
);

router.post(
  "/broadcast",
  isAuthenticated,
  allowRoles("ADMIN"),
  broadcastNotification
);

module.exports = router;

const express = require("express");
const {
  getAdminSettingsController,
  updateAdminSettingsController,
} = require("../controllers/setting.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

const router = express.Router();

router.use(isAuthenticated);

router.get("/", requirePermission("settings.view"), getAdminSettingsController);
router.patch("/", requirePermission("settings.manage"), updateAdminSettingsController);

module.exports = router;

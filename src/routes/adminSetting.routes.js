const express = require("express");
const {
  getAdminSettingsController,
  updateAdminSettingsController,
} = require("../controllers/setting.controller");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(isAuthenticated);
router.use(isAdmin);

router.get("/", getAdminSettingsController);
router.patch("/", updateAdminSettingsController);

module.exports = router;

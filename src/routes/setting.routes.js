const express = require("express");
const { getPublicSettingsController } = require("../controllers/setting.controller");

const router = express.Router();

router.get("/public", getPublicSettingsController);

module.exports = router;

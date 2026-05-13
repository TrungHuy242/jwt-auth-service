const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
  updateMyAvatar,
  deleteMyAvatar,
} = require("../controllers/user.controller");

const { isAuthenticated } = require("../middlewares/auth.middleware");
const { uploadAvatar } = require("../middlewares/upload.middleware");

const router = express.Router();

router.get("/me", isAuthenticated, getMyProfile);
router.patch("/me", isAuthenticated, updateMyProfile);
router.patch("/me/avatar", isAuthenticated, uploadAvatar.single("avatar"), updateMyAvatar);
router.delete("/me/avatar", isAuthenticated, deleteMyAvatar);
module.exports = router;
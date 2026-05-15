const express = require('express');
const { getAllUsers, getUserById, updateUserRole, updateUserStatus } = require('../controllers/admin.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { requirePermission } = require('../middlewares/permission.middleware');

const router = express.Router();

router.get("/", isAuthenticated, requirePermission("users.view"), getAllUsers);
router.get("/:id", isAuthenticated, requirePermission("users.detail"), getUserById);
router.patch("/:id/role", isAuthenticated, requirePermission("users.change_role"), updateUserRole);
router.patch("/:id/status", isAuthenticated, requirePermission("users.change_status"), updateUserStatus);
module.exports = router;

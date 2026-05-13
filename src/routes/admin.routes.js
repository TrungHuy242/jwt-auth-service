const express = require('express');
const { getAllUsers, getUserById, updateUserRole, updateUserStatus} = require('../controllers/admin.controller');
const { isAuthenticated, allowRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get("/users", isAuthenticated, allowRoles("ADMIN"), getAllUsers);
router.get("/users/:id", isAuthenticated, allowRoles("ADMIN"), getUserById);
router.patch("/users/:id/role", isAuthenticated, allowRoles("ADMIN"), updateUserRole);
router.patch("/users/:id/status", isAuthenticated, allowRoles("ADMIN"), updateUserStatus);
module.exports = router;
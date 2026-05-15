const express = require("express");
const {
  getRolesController,
  getRoleByIdController,
  createRoleController,
  updateRoleController,
  deleteRoleController,
  getPermissionsController,
  updateRolePermissionsController,
  updateUserRolesController,
} = require("../controllers/role.controller");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

const router = express.Router();

router.use(isAuthenticated);
router.use(isAdmin);

router.get("/permissions", requirePermission("roles.view"), getPermissionsController);
router.get("/", requirePermission("roles.view"), getRolesController);
router.post("/", requirePermission("roles.create"), createRoleController);
router.get("/:id", requirePermission("roles.view"), getRoleByIdController);
router.patch("/:id", requirePermission("roles.update"), updateRoleController);
router.delete("/:id", requirePermission("roles.delete"), deleteRoleController);
router.patch("/:id/permissions", requirePermission("roles.assign_permissions"), updateRolePermissionsController);
router.patch("/users/:id/roles", requirePermission("roles.assign_users"), updateUserRolesController);

module.exports = router;

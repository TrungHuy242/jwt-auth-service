const {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  updateRolePermissions,
  updateUserRoles,
} = require("../services/role.service");

const getRolesController = async (req, res, next) => {
  try {
    const roles = await getRoles();
    return res.status(200).json({
      message: "Lấy danh sách role thành công",
      roles,
    });
  } catch (error) {
    next(error);
  }
};

const getRoleByIdController = async (req, res, next) => {
  try {
    const role = await getRoleById(req.params.id);
    return res.status(200).json({
      message: "Lấy chi tiết role thành công",
      role,
    });
  } catch (error) {
    next(error);
  }
};

const createRoleController = async (req, res, next) => {
  try {
    const role = await createRole(req.body);
    return res.status(201).json({
      message: "Tạo role thành công",
      role,
    });
  } catch (error) {
    next(error);
  }
};

const updateRoleController = async (req, res, next) => {
  try {
    const role = await updateRole(req.params.id, req.body);
    return res.status(200).json({
      message: "Cập nhật role thành công",
      role,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRoleController = async (req, res, next) => {
  try {
    const result = await deleteRole(req.params.id);
    return res.status(200).json({
      message: "Xóa role thành công",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getPermissionsController = async (req, res, next) => {
  try {
    const permissions = await getPermissions();
    return res.status(200).json({
      message: "Lấy danh sách permission thành công",
      permissions,
    });
  } catch (error) {
    next(error);
  }
};

const updateRolePermissionsController = async (req, res, next) => {
  try {
    const role = await updateRolePermissions(
      req.params.id,
      req.body.permissionIds || []
    );
    return res.status(200).json({
      message: "Cập nhật permission cho role thành công",
      role,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRolesController = async (req, res, next) => {
  try {
    const user = await updateUserRoles(req.params.id, req.body.roleIds || []);
    return res.status(200).json({
      message: "Cập nhật role cho user thành công",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRolesController,
  getRoleByIdController,
  createRoleController,
  updateRoleController,
  deleteRoleController,
  getPermissionsController,
  updateRolePermissionsController,
  updateUserRolesController,
};

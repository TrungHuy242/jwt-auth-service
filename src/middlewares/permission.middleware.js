const {
  userHasPermission,
  userHasAnyPermission,
  userHasAllPermissions,
} = require("../services/permission.service");

const requirePermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: "Bạn cần đăng nhập để thực hiện thao tác này",
        });
      }

      if (user.role === "ADMIN") {
        return next();
      }

      const hasPermission = await userHasPermission(user.id, permissionKey);

      if (!hasPermission) {
        return res.status(403).json({
          message: "Bạn không có quyền thực hiện thao tác này",
          requiredPermission: permissionKey,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const requireAnyPermission = (permissionKeys = []) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: "Bạn cần đăng nhập để thực hiện thao tác này",
        });
      }

      if (user.role === "ADMIN") {
        return next();
      }

      const hasPermission = await userHasAnyPermission(user.id, permissionKeys);

      if (!hasPermission) {
        return res.status(403).json({
          message: "Bạn không có quyền thực hiện thao tác này",
          requiredPermissions: permissionKeys,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const requireAllPermissions = (permissionKeys = []) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: "Bạn cần đăng nhập để thực hiện thao tác này",
        });
      }

      if (user.role === "ADMIN") {
        return next();
      }

      const hasPermissions = await userHasAllPermissions(user.id, permissionKeys);

      if (!hasPermissions) {
        return res.status(403).json({
          message: "Bạn không có đủ quyền để thực hiện thao tác này",
          requiredPermissions: permissionKeys,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
};

const prisma = require("../config/prisma");

const getUserPermissions = async (userId) => {
  const userRoles = await prisma.userRole.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
      appRole: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  const permissions = new Map();

  userRoles.forEach((userRole) => {
    userRole.appRole.rolePermissions.forEach((rolePermission) => {
      permissions.set(rolePermission.permission.key, rolePermission.permission);
    });
  });

  return Array.from(permissions.values());
};

const getUserPermissionKeys = async (userId) => {
  const permissions = await getUserPermissions(userId);
  return permissions.map((permission) => permission.key);
};

const userHasPermission = async (userId, permissionKey) => {
  const permissionKeys = await getUserPermissionKeys(userId);
  return permissionKeys.includes(permissionKey);
};

const userHasAnyPermission = async (userId, permissionKeys = []) => {
  const userPermissionKeys = await getUserPermissionKeys(userId);
  return permissionKeys.some((permissionKey) =>
    userPermissionKeys.includes(permissionKey)
  );
};

const userHasAllPermissions = async (userId, permissionKeys = []) => {
  const userPermissionKeys = await getUserPermissionKeys(userId);
  return permissionKeys.every((permissionKey) =>
    userPermissionKeys.includes(permissionKey)
  );
};

module.exports = {
  getUserPermissions,
  getUserPermissionKeys,
  userHasPermission,
  userHasAnyPermission,
  userHasAllPermissions,
};

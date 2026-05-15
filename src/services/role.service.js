const prisma = require("../config/prisma");

const getRoles = async () => {
  return prisma.appRole.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
      _count: {
        select: { userRoles: true },
      },
    },
  });
};

const getRoleById = async (id) => {
  const role = await prisma.appRole.findUnique({
    where: { id: Number(id) },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
      userRoles: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!role) {
    const error = new Error("Không tìm thấy role");
    error.statusCode = 404;
    throw error;
  }

  return role;
};

const createRole = async (data) => {
  const name = String(data.name || "").trim().toUpperCase();

  if (!name) {
    const error = new Error("Tên role không được để trống");
    error.statusCode = 400;
    throw error;
  }

  const existedRole = await prisma.appRole.findUnique({ where: { name } });

  if (existedRole) {
    const error = new Error("Role đã tồn tại");
    error.statusCode = 400;
    throw error;
  }

  return prisma.appRole.create({
    data: {
      name,
      description: data.description || "",
      isSystem: false,
    },
  });
};

const updateRole = async (id, data) => {
  const role = await getRoleById(id);

  if (role.isSystem && data.name && data.name !== role.name) {
    const error = new Error("Không được đổi tên role hệ thống");
    error.statusCode = 400;
    throw error;
  }

  const updateData = {};

  if (data.name !== undefined && !role.isSystem) {
    const name = String(data.name || "").trim().toUpperCase();
    if (!name) {
      const error = new Error("Tên role không được để trống");
      error.statusCode = 400;
      throw error;
    }
    updateData.name = name;
  }

  if (data.description !== undefined) {
    updateData.description = String(data.description || "").trim();
  }

  return prisma.appRole.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

const deleteRole = async (id) => {
  const role = await getRoleById(id);

  if (role.isSystem) {
    const error = new Error("Không được xóa role hệ thống");
    error.statusCode = 400;
    throw error;
  }

  if (role.userRoles.length > 0) {
    const error = new Error("Không thể xóa role đang được gán cho user");
    error.statusCode = 400;
    throw error;
  }

  await prisma.appRole.delete({ where: { id: Number(id) } });

  return { deletedRoleId: Number(id) };
};

const getPermissions = async () => {
  return prisma.permission.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });
};

const updateRolePermissions = async (roleId, permissionIds = []) => {
  const role = await getRoleById(roleId);

  const ids = permissionIds.map((id) => Number(id)).filter(Boolean);

  if (ids.length === 0) {
    await prisma.rolePermission.deleteMany({
      where: { roleId: Number(roleId) },
    });
    return getRoleById(role.id);
  }

  const permissions = await prisma.permission.findMany({
    where: { id: { in: ids } },
  });

  if (permissions.length !== ids.length) {
    const error = new Error("Một số permission không tồn tại");
    error.statusCode = 400;
    throw error;
  }

  await prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { roleId: Number(roleId) } }),
    prisma.rolePermission.createMany({
      data: ids.map((permissionId) => ({
        roleId: Number(roleId),
        permissionId,
      })),
      skipDuplicates: true,
    }),
  ]);

  return getRoleById(role.id);
};

const updateUserRoles = async (userId, roleIds = []) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    const error = new Error("Không tìm thấy user");
    error.statusCode = 404;
    throw error;
  }

  const ids = roleIds.map((id) => Number(id)).filter(Boolean);

  if (ids.length === 0) {
    const error = new Error("User phải có ít nhất một role");
    error.statusCode = 400;
    throw error;
  }

  const roles = await prisma.appRole.findMany({
    where: { id: { in: ids } },
  });

  if (roles.length !== ids.length) {
    const error = new Error("Một số role không tồn tại");
    error.statusCode = 400;
    throw error;
  }

  await prisma.$transaction([
    prisma.userRole.deleteMany({ where: { userId: Number(userId) } }),
    prisma.userRole.createMany({
      data: ids.map((roleId) => ({
        userId: Number(userId),
        roleId,
      })),
      skipDuplicates: true,
    }),
    prisma.user.update({
      where: { id: Number(userId) },
      data: {
        role: roles.some((r) => r.name === "ADMIN") ? "ADMIN" : "USER",
      },
    }),
  ]);

  return prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      userRoles: { include: { appRole: true } },
    },
  });
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  updateRolePermissions,
  updateUserRoles,
};

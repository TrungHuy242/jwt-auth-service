const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const DEFAULT_ROLES = [
  {
    name: "ADMIN",
    description: "Quản trị viên hệ thống",
    isSystem: true,
  },
  {
    name: "USER",
    description: "Người dùng mặc định",
    isSystem: true,
  },
];

const DEFAULT_PERMISSIONS = [
  { key: "dashboard.view", name: "Xem dashboard", group: "Dashboard" },

  { key: "users.view", name: "Xem danh sách người dùng", group: "Users" },
  { key: "users.detail", name: "Xem chi tiết người dùng", group: "Users" },
  { key: "users.change_role", name: "Đổi role người dùng", group: "Users" },
  { key: "users.change_status", name: "Khóa / mở khóa người dùng", group: "Users" },

  { key: "files.view", name: "Xem file cá nhân", group: "Files" },
  { key: "files.view_all", name: "Xem toàn bộ file", group: "Files" },
  { key: "files.upload", name: "Upload file", group: "Files" },
  { key: "files.delete", name: "Xóa file cá nhân", group: "Files" },
  { key: "files.delete_all", name: "Xóa toàn bộ file", group: "Files" },

  { key: "notifications.view", name: "Xem thông báo cá nhân", group: "Notifications" },
  { key: "notifications.send", name: "Gửi thông báo cho user", group: "Notifications" },
  { key: "notifications.broadcast", name: "Gửi thông báo hàng loạt", group: "Notifications" },

  { key: "activity_logs.view", name: "Xem activity logs", group: "Activity Logs" },
  { key: "activity_logs.detail", name: "Xem chi tiết activity log", group: "Activity Logs" },
  { key: "activity_logs.export", name: "Xuat activity logs ra Excel", group: "Activity Logs" },

  { key: "settings.view", name: "Xem cấu hình hệ thống", group: "Settings" },
  { key: "settings.manage", name: "Quản lý cấu hình hệ thống", group: "Settings" },

  { key: "roles.view", name: "Xem danh sách role", group: "Roles" },
  { key: "roles.create", name: "Tạo role", group: "Roles" },
  { key: "roles.update", name: "Cập nhật role", group: "Roles" },
  { key: "roles.delete", name: "Xóa role", group: "Roles" },
  { key: "roles.assign_permissions", name: "Gán permission cho role", group: "Roles" },
  { key: "roles.assign_users", name: "Gán role cho user", group: "Roles" },
];

const USER_PERMISSION_KEYS = [
  "files.view",
  "files.upload",
  "files.delete",
  "notifications.view",
];

const seedRolePermissions = async () => {
  console.log("Seeding roles and permissions...");

  // 1. Create roles
  const roleMap = {};
  for (const role of DEFAULT_ROLES) {
    const createdRole = await prisma.appRole.upsert({
      where: { name: role.name },
      update: { description: role.description, isSystem: role.isSystem },
      create: role,
    });
    roleMap[createdRole.name] = createdRole;
  }
  console.log("  Roles created:", Object.keys(roleMap).join(", "));

  // 2. Create permissions
  const permissionMap = {};
  for (const permission of DEFAULT_PERMISSIONS) {
    const created = await prisma.permission.upsert({
      where: { key: permission.key },
      update: { name: permission.name, description: null, group: permission.group },
      create: permission,
    });
    permissionMap[created.key] = created;
  }
  console.log("  Permissions created:", Object.keys(permissionMap).length);

  // 3. Assign all permissions to ADMIN
  const adminRole = roleMap.ADMIN;
  for (const perm of Object.values(permissionMap)) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id },
      },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }
  console.log("  ADMIN assigned all", Object.keys(permissionMap).length, "permissions");

  // 4. Assign limited permissions to USER
  const userRole = roleMap.USER;
  for (const key of USER_PERMISSION_KEYS) {
    const perm = permissionMap[key];
    if (!perm) continue;
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: userRole.id, permissionId: perm.id },
      },
      update: {},
      create: { roleId: userRole.id, permissionId: perm.id },
    });
  }
  console.log("  USER assigned", USER_PERMISSION_KEYS.length, "permissions");

  // 5. Sync existing users to UserRole
  const users = await prisma.user.findMany();
  for (const user of users) {
    const roleName = user.role === "ADMIN" ? "ADMIN" : "USER";
    const role = roleMap[roleName];
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id },
    });
  }
  console.log("  Synced", users.length, "users to UserRole table");

  console.log("Roles and permissions seeded successfully.");
};

const run = async () => {
  try {
    await seedRolePermissions();
  } catch (error) {
    console.error("Seed role permission failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

run();

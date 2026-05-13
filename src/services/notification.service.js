const prisma = require("../config/prisma");

const createNotification = async ({
  userId,
  title,
  message,
  type = "SYSTEM",
  link = null,
}) => {
  if (!userId || !title || !message) {
    throw new Error("Thiếu userId, title hoặc message khi tạo thông báo");
  }

  const allowedTypes = [
    "SYSTEM",
    "SECURITY",
    "ACCOUNT",
    "ORDER",
    "APPOINTMENT",
    "COURSE",
    "OTHER",
  ];

  if (!allowedTypes.includes(type)) {
    throw new Error("Loại thông báo không hợp lệ");
  }

  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link,
    },
  });
};

const createNotificationsForUsers = async ({
  userIds,
  title,
  message,
  type = "SYSTEM",
  link = null,
}) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("Danh sách userIds không hợp lệ");
  }

  if (!title || !message) {
    throw new Error("Thiếu title hoặc message khi tạo thông báo");
  }

  const allowedTypes = [
    "SYSTEM",
    "SECURITY",
    "ACCOUNT",
    "ORDER",
    "APPOINTMENT",
    "COURSE",
    "OTHER",
  ];

  if (!allowedTypes.includes(type)) {
    throw new Error("Loại thông báo không hợp lệ");
  }

  const data = userIds.map((userId) => ({
    userId,
    title,
    message,
    type,
    link,
  }));

  return prisma.notification.createMany({
    data,
  });
};

module.exports = {
  createNotification,
  createNotificationsForUsers,
};

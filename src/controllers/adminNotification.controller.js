const prisma = require("../config/prisma");
const {
  createNotification,
  createNotificationsForUsers,
} = require("../services/notification.service");

const allowedTypes = [
  "SYSTEM",
  "SECURITY",
  "ACCOUNT",
  "ORDER",
  "APPOINTMENT",
  "COURSE",
  "OTHER",
];

const sendNotificationToUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, type = "SYSTEM", link = null } = req.body;

    const userId = Number(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: "ID người dùng không hợp lệ",
      });
    }

    if (!title || !message) {
      return res.status(400).json({
        message: "Vui lòng nhập title và message",
      });
    }

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message:
          "Type không hợp lệ. Chỉ chấp nhận SYSTEM, SECURITY, ACCOUNT, ORDER, APPOINTMENT, COURSE hoặc OTHER",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    const notification = await createNotification({
      userId,
      title,
      message,
      type,
      link,
    });

    return res.status(201).json({
      message: "Gửi thông báo cho người dùng thành công",
      user,
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi gửi thông báo cho người dùng",
      error: error.message,
    });
  }
};

const broadcastNotification = async (req, res) => {
  try {
    const { title, message, type = "SYSTEM", link = null, role } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Vui lòng nhập title và message",
      });
    }

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message:
          "Type không hợp lệ. Chỉ chấp nhận SYSTEM, SECURITY, ACCOUNT, ORDER, APPOINTMENT, COURSE hoặc OTHER",
      });
    }

    const allowedRoles = ["USER", "ADMIN"];

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Role không hợp lệ. Chỉ chấp nhận USER hoặc ADMIN",
      });
    }

    const users = await prisma.user.findMany({
      where: {
        status: "ACTIVE",
        ...(role && { role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (users.length === 0) {
      return res.status(404).json({
        message: "Không có người dùng phù hợp để gửi thông báo",
      });
    }

    const userIds = users.map((user) => user.id);

    const result = await createNotificationsForUsers({
      userIds,
      title,
      message,
      type,
      link,
    });

    return res.status(201).json({
      message: "Gửi thông báo hàng loạt thành công",
      totalUsers: users.length,
      createdCount: result.count,
      filters: {
        role: role || null,
        status: "ACTIVE",
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi gửi thông báo hàng loạt",
      error: error.message,
    });
  }
};

module.exports = {
  sendNotificationToUser,
  broadcastNotification,
};

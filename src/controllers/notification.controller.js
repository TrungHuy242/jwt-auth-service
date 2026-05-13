const prisma = require("../config/prisma");

const getMyNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, isRead, type } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        message: "Page không hợp lệ",
      });
    }

    if (isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({
        message: "Limit không hợp lệ",
      });
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

    if (type && !allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Type thông báo không hợp lệ",
      });
    }

    let isReadFilter = {};

    if (isRead !== undefined) {
      if (isRead !== "true" && isRead !== "false") {
        return res.status(400).json({
          message: "isRead chỉ nhận giá trị true hoặc false",
        });
      }

      isReadFilter = {
        isRead: isRead === "true",
      };
    }

    const where = {
      userId: req.user.id,
      ...isReadFilter,
      ...(type && { type }),
    };

    const skip = (pageNumber - 1) * limitNumber;

    const [notifications, totalNotifications] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.notification.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalNotifications / limitNumber);

    return res.status(200).json({
      message: "Lấy danh sách thông báo thành công",
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalNotifications,
        totalPages,
      },
      filters: {
        isRead: isRead ?? null,
        type: type || null,
      },
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi lấy danh sách thông báo",
      error: error.message,
    });
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const unreadCount = await prisma.notification.count({
      where: {
        userId: req.user.id,
        isRead: false,
      },
    });

    return res.status(200).json({
      message: "Lấy số thông báo chưa đọc thành công",
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi lấy số thông báo chưa đọc",
      error: error.message,
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notificationId = Number(id);

    if (isNaN(notificationId)) {
      return res.status(400).json({
        message: "ID thông báo không hợp lệ",
      });
    }

    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!notification) {
      return res.status(404).json({
        message: "Không tìm thấy thông báo",
      });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({
        message: "Bạn không có quyền cập nhật thông báo này",
      });
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    return res.status(200).json({
      message: "Đánh dấu thông báo đã đọc thành công",
      notification: updatedNotification,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi đánh dấu thông báo đã đọc",
      error: error.message,
    });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return res.status(200).json({
      message: "Đánh dấu tất cả thông báo đã đọc thành công",
      updatedCount: result.count,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi đánh dấu tất cả thông báo đã đọc",
      error: error.message,
    });
  }
};

module.exports = {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};

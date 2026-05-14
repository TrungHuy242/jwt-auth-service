const prisma = require("../config/prisma");

const getDashboardOverview = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      newUsersToday,
      blockedUsers,
      totalFiles,
      totalNotifications,
      totalActivityLogs,
      loginToday,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfToday,
          },
        },
      }),

      prisma.user.count({
        where: {
          status: "BLOCKED",
        },
      }),

      prisma.uploadedFile.count(),

      prisma.notification.count(),

      prisma.activityLog.count(),

      prisma.activityLog.count({
        where: {
          action: "LOGIN",
          createdAt: {
            gte: startOfToday,
          },
        },
      }),
    ]);

    return res.status(200).json({
      message: "Lay thong ke tong quan dashboard thanh cong",
      overview: {
        totalUsers,
        newUsersToday,
        blockedUsers,
        activeUsers: totalUsers - blockedUsers,
        totalFiles,
        totalNotifications,
        totalActivityLogs,
        loginToday,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Loi server khi lay thong ke dashboard",
      error: error.message,
    });
  }
};

const getUserStatistics = async (req, res) => {
  try {
    const [
      totalUsers,
      usersByRole,
      usersByProvider,
      usersByStatus,
      verifiedUsers,
      unverifiedUsers,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.groupBy({
        by: ["role"],
        _count: {
          role: true,
        },
      }),

      prisma.user.groupBy({
        by: ["provider"],
        _count: {
          provider: true,
        },
      }),

      prisma.user.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      }),

      prisma.user.count({
        where: {
          isVerified: true,
        },
      }),

      prisma.user.count({
        where: {
          isVerified: false,
        },
      }),
    ]);

    return res.status(200).json({
      message: "Lay thong ke nguoi dung thanh cong",
      statistics: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
        usersByRole: usersByRole.map((item) => ({
          role: item.role,
          count: item._count.role,
        })),
        usersByProvider: usersByProvider.map((item) => ({
          provider: item.provider,
          count: item._count.provider,
        })),
        usersByStatus: usersByStatus.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Loi server khi lay thong ke nguoi dung",
      error: error.message,
    });
  }
};

const getFileStatistics = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalFiles,
      filesUploadedToday,
      filesByType,
      filesByFolder,
      totalSizeResult,
    ] = await Promise.all([
      prisma.uploadedFile.count(),

      prisma.uploadedFile.count({
        where: {
          createdAt: {
            gte: startOfToday,
          },
        },
      }),

      prisma.uploadedFile.groupBy({
        by: ["type"],
        _count: {
          type: true,
        },
      }),

      prisma.uploadedFile.groupBy({
        by: ["folder"],
        _count: {
          folder: true,
        },
      }),

      prisma.uploadedFile.aggregate({
        _sum: {
          size: true,
        },
      }),
    ]);

    const totalSizeBytes = totalSizeResult._sum.size || 0;
    const totalSizeMB = Number((totalSizeBytes / (1024 * 1024)).toFixed(2));

    return res.status(200).json({
      message: "Lay thong ke file upload thanh cong",
      statistics: {
        totalFiles,
        filesUploadedToday,
        totalSizeBytes,
        totalSizeMB,
        filesByType: filesByType.map((item) => ({
          type: item.type,
          count: item._count.type,
        })),
        filesByFolder: filesByFolder.map((item) => ({
          folder: item.folder || "general",
          count: item._count.folder,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Loi server khi lay thong ke file upload",
      error: error.message,
    });
  }
};

const getSystemStatistics = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalNotifications,
      unreadNotifications,
      notificationsByType,
      totalActivityLogs,
      activityLogsToday,
      activityLogsByAction,
      activityLogsByMethod,
    ] = await Promise.all([
      prisma.notification.count(),

      prisma.notification.count({
        where: {
          isRead: false,
        },
      }),

      prisma.notification.groupBy({
        by: ["type"],
        _count: {
          type: true,
        },
      }),

      prisma.activityLog.count(),

      prisma.activityLog.count({
        where: {
          createdAt: {
            gte: startOfToday,
          },
        },
      }),

      prisma.activityLog.groupBy({
        by: ["action"],
        _count: {
          action: true,
        },
      }),

      prisma.activityLog.groupBy({
        by: ["method"],
        _count: {
          method: true,
        },
      }),
    ]);

    return res.status(200).json({
      message: "Lay thong ke he thong thanh cong",
      statistics: {
        notifications: {
          totalNotifications,
          unreadNotifications,
          readNotifications: totalNotifications - unreadNotifications,
          notificationsByType: notificationsByType.map((item) => ({
            type: item.type,
            count: item._count.type,
          })),
        },
        activityLogs: {
          totalActivityLogs,
          activityLogsToday,
          activityLogsByAction: activityLogsByAction.map((item) => ({
            action: item.action,
            count: item._count.action,
          })),
          activityLogsByMethod: activityLogsByMethod.map((item) => ({
            method: item.method || "UNKNOWN",
            count: item._count.method,
          })),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Loi server khi lay thong ke he thong",
      error: error.message,
    });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({
        message: "Limit khong hop le",
      });
    }

    const [
      recentUsers,
      recentFiles,
      recentNotifications,
      recentActivityLogs,
    ] = await Promise.all([
      prisma.user.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          provider: true,
          status: true,
          isVerified: true,
          createdAt: true,
        },
      }),

      prisma.uploadedFile.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),

      prisma.notification.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),

      prisma.activityLog.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return res.status(200).json({
      message: "Lay hoat dong gan day thanh cong",
      recent: {
        recentUsers,
        recentFiles,
        recentNotifications,
        recentActivityLogs,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Loi server khi lay hoat dong gan day",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardOverview,
  getUserStatistics,
  getFileStatistics,
  getSystemStatistics,
  getRecentActivities,
};

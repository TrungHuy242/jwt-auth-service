const prisma = require("../config/prisma");

const getActivityLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      userId,
      action,
      method,
    } = req.query;

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

    let userIdFilter = {};

    if (userId !== undefined) {
      const parsedUserId = Number(userId);

      if (isNaN(parsedUserId)) {
        return res.status(400).json({
          message: "userId không hợp lệ",
        });
      }

      userIdFilter = {
        userId: parsedUserId,
      };
    }

    const allowedMethods = ["GET", "POST", "PATCH", "PUT", "DELETE"];

    if (method && !allowedMethods.includes(method)) {
      return res.status(400).json({
        message: "Method không hợp lệ",
      });
    }

    const where = {
      AND: [
        search
          ? {
              OR: [
                {
                  action: {
                    contains: search,
                  },
                },
                {
                  details: {
                    contains: search,
                  },
                },
                {
                  path: {
                    contains: search,
                  },
                },
              ],
            }
          : {},
        userIdFilter,
        action ? { action } : {},
        method ? { method } : {},
      ],
    };

    const skip = (pageNumber - 1) * limitNumber;

    const [logs, totalLogs] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take: limitNumber,
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
      prisma.activityLog.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalLogs / limitNumber);

    return res.status(200).json({
      message: "Lấy danh sách activity log thành công",
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalLogs,
        totalPages,
      },
      filters: {
        search,
        userId: userId || null,
        action: action || null,
        method: method || null,
      },
      logs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi lấy danh sách activity log",
      error: error.message,
    });
  }
};

const getActivityLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const logId = Number(id);

    if (isNaN(logId)) {
      return res.status(400).json({
        message: "ID activity log không hợp lệ",
      });
    }

    const log = await prisma.activityLog.findUnique({
      where: {
        id: logId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            provider: true,
            status: true,
          },
        },
      },
    });

    if (!log) {
      return res.status(404).json({
        message: "Không tìm thấy activity log",
      });
    }

    return res.status(200).json({
      message: "Lấy chi tiết activity log thành công",
      log,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi lấy chi tiết activity log",
      error: error.message,
    });
  }
};

module.exports = {
  getActivityLogs,
  getActivityLogById,
};

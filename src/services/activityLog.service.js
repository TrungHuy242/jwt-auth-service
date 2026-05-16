const prisma = require("../config/prisma");
const ExcelJS = require("exceljs");

const createActivityLog = async ({
  userId = null,
  action,
  method = null,
  path = null,
  ip = null,
  userAgent = null,
  details = null,
}) => {
  if (!action) {
    throw new Error("Thiếu action khi tạo activity log");
  }

  return prisma.activityLog.create({
    data: {
      userId,
      action,
      method,
      path,
      ip,
      userAgent,
      details,
    },
  });
};

const getRequestInfo = (req) => {
  return {
    method: req.method,
    path: req.originalUrl,
    ip:
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      req.ip,
    userAgent: req.headers["user-agent"] || null,
  };
};

const buildActivityLogWhere = (query = {}) => {
  const where = {};

  if (query.action) {
    where.action = String(query.action);
  }

  if (query.method) {
    where.method = String(query.method);
  }

  if (query.userId) {
    where.userId = Number(query.userId);
  }

  if (query.search) {
    where.OR = [
      {
        action: {
          contains: String(query.search),
        },
      },
      {
        path: {
          contains: String(query.search),
        },
      },
      {
        ip: {
          contains: String(query.search),
        },
      },
      {
        user: {
          email: {
            contains: String(query.search),
          },
        },
      },
      {
        user: {
          name: {
            contains: String(query.search),
          },
        },
      },
    ];
  }

  if (query.startDate || query.endDate) {
    where.createdAt = {};

    if (query.startDate) {
      where.createdAt.gte = new Date(query.startDate);
    }

    if (query.endDate) {
      const endDate = new Date(query.endDate);
      endDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = endDate;
    }
  }

  return where;
};

const exportActivityLogsToExcel = async (query = {}) => {
  const where = buildActivityLogWhere(query);

  const logs = await prisma.activityLog.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: 5000,
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
  });

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Full-stack Admin Starter";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Activity Logs");

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "User ID", key: "userId", width: 12 },
    { header: "User Name", key: "userName", width: 25 },
    { header: "User Email", key: "userEmail", width: 32 },
    { header: "User Role", key: "userRole", width: 14 },
    { header: "Action", key: "action", width: 28 },
    { header: "Method", key: "method", width: 12 },
    { header: "Path", key: "path", width: 42 },
    { header: "IP Address", key: "ipAddress", width: 20 },
    { header: "User Agent", key: "userAgent", width: 45 },
    { header: "Details", key: "details", width: 30 },
    { header: "Created At", key: "createdAt", width: 24 },
  ];

  logs.forEach((log) => {
    worksheet.addRow({
      id: log.id,
      userId: log.userId || "",
      userName: log.user?.name || "",
      userEmail: log.user?.email || "",
      userRole: log.user?.role || "",
      action: log.action || "",
      method: log.method || "",
      path: log.path || "",
      ipAddress: log.ip || "",
      userAgent: log.userAgent || "",
      details: log.details || "",
      createdAt: log.createdAt
        ? new Date(log.createdAt).toLocaleString("vi-VN")
        : "",
    });
  });

  const headerRow = worksheet.getRow(1);

  headerRow.font = {
    bold: true,
    color: { argb: "FFFFFFFF" },
  };

  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2563EB" },
  };

  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  headerRow.height = 22;

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };

      if (rowNumber > 1) {
        cell.alignment = {
          vertical: "top",
          wrapText: true,
        };
      }
    });
  });

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  worksheet.autoFilter = {
    from: "A1",
    to: "L1",
  };

  return workbook.xlsx.writeBuffer();
};

module.exports = {
  createActivityLog,
  getRequestInfo,
  exportActivityLogsToExcel,
};

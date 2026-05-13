const prisma = require("../config/prisma");

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

module.exports = {
  createActivityLog,
  getRequestInfo,
};

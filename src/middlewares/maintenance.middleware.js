const { getPublicSettings } = require("../services/setting.service");

const maintenanceGuard = async (req, res, next) => {
  try {
    const settings = await getPublicSettings();

    if (!settings.maintenanceMode) {
      return next();
    }

    const user = req.user;

    if (user && user.role === "ADMIN") {
      return next();
    }

    return res.status(503).json({
      message: "Hệ thống đang bảo trì. Vui lòng thử lại sau.",
      maintenanceMode: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  maintenanceGuard,
};

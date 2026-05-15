const {
  getAdminSettings,
  getPublicSettings,
  updateAdminSettings,
} = require("../services/setting.service");

const getAdminSettingsController = async (req, res, next) => {
  try {
    const settings = await getAdminSettings();

    return res.status(200).json({
      message: "Lấy cấu hình hệ thống thành công",
      settings,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdminSettingsController = async (req, res, next) => {
  try {
    const settings = await updateAdminSettings(req.body);

    return res.status(200).json({
      message: "Cập nhật cấu hình hệ thống thành công",
      settings,
    });
  } catch (error) {
    next(error);
  }
};

const getPublicSettingsController = async (req, res, next) => {
  try {
    const settings = await getPublicSettings();

    return res.status(200).json({
      message: "Lấy cấu hình public thành công",
      settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminSettingsController,
  updateAdminSettingsController,
  getPublicSettingsController,
};

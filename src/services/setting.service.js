const prisma = require("../config/prisma");

const DEFAULT_SETTINGS = {
  siteName: "Full-stack Auth Core",
  siteLogo: "",
  systemEmail: "system@example.com",
  allowRegister: true,
  allowGoogleLogin: true,
  allowFacebookLogin: true,
  maintenanceMode: false,
  maxUploadSizeMB: 10,
  defaultUserRole: "USER",
  supportEmail: "support@example.com",
  footerText: "Full-stack Auth Core © 2026",
};

const getOrCreateSettings = async () => {
  let settings = await prisma.systemSetting.findUnique({
    where: { id: 1 },
  });

  if (!settings) {
    settings = await prisma.systemSetting.create({
      data: {
        id: 1,
        ...DEFAULT_SETTINGS,
      },
    });
  }

  return settings;
};

const getAdminSettings = async () => {
  return getOrCreateSettings();
};

const getPublicSettings = async () => {
  const settings = await getOrCreateSettings();

  return {
    siteName: settings.siteName,
    siteLogo: settings.siteLogo,
    allowRegister: settings.allowRegister,
    allowGoogleLogin: settings.allowGoogleLogin,
    allowFacebookLogin: settings.allowFacebookLogin,
    maintenanceMode: settings.maintenanceMode,
    supportEmail: settings.supportEmail,
    footerText: settings.footerText,
  };
};

const updateAdminSettings = async (data) => {
  await getOrCreateSettings();

  const updateData = {};

  if (data.siteName !== undefined) {
    updateData.siteName = String(data.siteName).trim();
  }

  if (data.siteLogo !== undefined) {
    updateData.siteLogo = String(data.siteLogo || "").trim();
  }

  if (data.systemEmail !== undefined) {
    updateData.systemEmail = String(data.systemEmail || "").trim();
  }

  if (data.allowRegister !== undefined) {
    updateData.allowRegister = Boolean(data.allowRegister);
  }

  if (data.allowGoogleLogin !== undefined) {
    updateData.allowGoogleLogin = Boolean(data.allowGoogleLogin);
  }

  if (data.allowFacebookLogin !== undefined) {
    updateData.allowFacebookLogin = Boolean(data.allowFacebookLogin);
  }

  if (data.maintenanceMode !== undefined) {
    updateData.maintenanceMode = Boolean(data.maintenanceMode);
  }

  if (data.maxUploadSizeMB !== undefined) {
    const maxUploadSizeMB = Number(data.maxUploadSizeMB);

    if (!Number.isFinite(maxUploadSizeMB) || maxUploadSizeMB <= 0) {
      const error = new Error("Dung lượng upload tối đa không hợp lệ");
      error.statusCode = 400;
      throw error;
    }

    updateData.maxUploadSizeMB = Math.floor(maxUploadSizeMB);
  }

  if (data.defaultUserRole !== undefined) {
    const role = String(data.defaultUserRole).trim().toUpperCase();

    if (!["USER", "ADMIN"].includes(role)) {
      const error = new Error("Role mặc định không hợp lệ");
      error.statusCode = 400;
      throw error;
    }

    updateData.defaultUserRole = role;
  }

  if (data.supportEmail !== undefined) {
    updateData.supportEmail = String(data.supportEmail || "").trim();
  }

  if (data.footerText !== undefined) {
    updateData.footerText = String(data.footerText || "").trim();
  }

  return prisma.systemSetting.update({
    where: { id: 1 },
    data: updateData,
  });
};

module.exports = {
  getOrCreateSettings,
  getAdminSettings,
  getPublicSettings,
  updateAdminSettings,
};

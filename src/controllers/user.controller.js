const prisma = require("../config/prisma");
const fs = require("fs");
const path = require("path");

const getMyProfile = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Lấy hồ sơ cá nhân thành công",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi lấy hồ sơ cá nhân",
      error: error.message,
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name && !phone && !address) {
      return res.status(400).json({
        message: "Vui lòng nhập ít nhất một thông tin cần cập nhật",
      });
    }

    if (name && name.trim().length < 2) {
      return res.status(400).json({
        message: "Tên phải có ít nhất 2 ký tự",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        ...(name && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(address !== undefined && { address: address.trim() }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        provider: true,
        avatar: true,
        phone: true,
        address: true,
        status: true,
        isVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: "Cập nhật hồ sơ cá nhân thành công",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi cập nhật hồ sơ cá nhân",
      error: error.message,
    });
  }
};

const updateMyAvatar = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Vui lòng chọn ảnh avatar",
        });
      }
  
      const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;
  
      const currentUser = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        select: {
          avatar: true,
        },
      });
  
      if (currentUser?.avatar && currentUser.avatar.includes("/uploads/avatars/")) {
        const oldFileName = currentUser.avatar.split("/uploads/avatars/")[1];
        const oldFilePath = path.join(__dirname, "../../uploads/avatars", oldFileName);
  
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
  
      const updatedUser = await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          avatar: avatarUrl,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          provider: true,
          avatar: true,
          phone: true,
          address: true,
          status: true,
          isVerified: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });
  
      return res.status(200).json({
        message: "Cập nhật avatar thành công",
        user: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi server khi cập nhật avatar",
        error: error.message,
      });
    }
};


const deleteMyAvatar = async (req, res) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        avatar: true,
      },
    });

    if (!currentUser || !currentUser.avatar) {
      return res.status(400).json({
        message: "Bạn chưa có avatar để xóa",
      });
    }

    if (currentUser.avatar.includes("/uploads/avatars/")) {
      const oldFileName = currentUser.avatar.split("/uploads/avatars/")[1];
      const oldFilePath = path.join(__dirname, "../../uploads/avatars", oldFileName);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        avatar: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        provider: true,
        avatar: true,
        phone: true,
        address: true,
        status: true,
        isVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: "Xóa avatar thành công",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi xóa avatar",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  updateMyAvatar,
  deleteMyAvatar,
};
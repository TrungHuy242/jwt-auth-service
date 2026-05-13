const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const { sendEmail } = require("../services/email.service");
const {
  resetPasswordTemplate,
  verifyEmailTemplate,
  securityAlertTemplate,
} = require("../templates/email.templates");

const {
  createActivityLog,
  getRequestInfo,
} = require("../services/activityLog.service");

const register = async (req, res) => {
    try{
        const { name, email, password} = req.body;

        // 1. kiểm tra dữ liệu đầu vào
        if (!name || !email || !password) {
            return res.status(400).json({
                message : "Vui lòng nhập đầy đủ name, email, password",
            });
        }

        // 2. Kiểm tra email đã tồn tại chưa
        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        if(existingUser){
            return res.status(400).json({
                message : "Email đã được sử dụng",
            });
        }

        // 3. hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Tạo verify token
        const verifyToken = crypto.randomBytes(32).toString("hex");

        const verifyEmailExpires = new Date();
        verifyEmailExpires.setHours(verifyEmailExpires.getHours() + 24);

        // 5. Tạo user mới
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER",
                provider: "local",
                verifyEmailToken: verifyToken,
                verifyEmailExpires,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                provider: true,
                isVerified: true,
                createdAt: true,
            },
        });

        // 6. Gửi email xác thực
        const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;

        await sendEmail({
            to: newUser.email,
            subject: "Xác thực tài khoản - JWT Auth Service",
            text: `Vui lòng truy cập link sau để xác thực tài khoản: ${verifyUrl}`,
            html: verifyEmailTemplate({
                name: newUser.name,
                verifyUrl,
            }),
        });

        // 7. Trả về kết quả
        return res.status(201).json({
            message: "Đăng ký tài khoản thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
            user: newUser,
        }); 
    } catch(error) {
        console.error("Register error:", error);

        return res.status(500).json({
            message: "Lỗi server khi đăng ký tài khoản",
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    try{
        const { email, password} = req.body;

        //1. kiểm tra dữ liệu đầu vào
        if(!email || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập email và password",
            });
        }

        //2. tìm user theo email
        const user = await prisma.user.findUnique({
            where: {email},
        });

        if (!user) {
            return res.status(400).json({
                message: "Email hoặc mật khẩu không đúng",
            });
        }

        if (user.status === "BLOCKED") {
            return res.status(403).json({
                message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
            });
        }

        if (user.provider === "local" && !user.isVerified) {
            return res.status(403).json({
                message: "Tài khoản chưa xác thực email. Vui lòng kiểm tra email để xác thực tài khoản.",
            });
        }

        // 3. Nếu tài khoản OAuth không có password
        if(!user.password) {
            return res.status(400).json({
                message: "Tài khoản này đăng nhập bằng Google/ Facebook",
            });
        }

        // 4. So sánh password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(400).json({
                message: "Email hoặc mật khẩu không đúng",
            });
        }

        // 5. Cập nhật thời gian đăng nhập gần nhất
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                lastLoginAt: new Date(),
            }
        })

        // 6. Tạo access token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // 7. Lưu refresh token vào database
        const expireAt = new Date();
        expireAt.setDate(expireAt.getDate() + 7);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: expireAt,
            },
        });

        const requestInfo = getRequestInfo(req);

        await createActivityLog({
            userId: user.id,
            action: "LOGIN",
            ...requestInfo,
            details: "User logged in successfully",
        });

        // 8. Trả về kết quả
        return res.status(200).json({
            message: "Đăng nhập thành công",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                provider: user.provider,
                avatar: user.avatar,
                isVerified: user.isVerified,
            },
        });
    } catch(error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Lỗi server khi đăng nhập",
            error: error.message,
        });
    }
};


const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            message: " Lấy thông tin người dùng thành công",
            user: req.user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server khi lấy thông tin người dùng",
            error: error.message,
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if(!refreshToken) {
            return res.status(400).json({
                message: "Vui lòng gửi refresh token",
            });
        }

        // 1. Kiểm tra refresh token có tồn tại trong database không
        const storedToken = await prisma.refreshToken.findUnique({
            where: {
                token: refreshToken,
            },
            include: {
                user: true,
            },
        });

        if (!storedToken) {
            return res.status(401).json({
                message: "Refresh token không hợp lệ",
            });
        }

        // 2. Kiểm tra token đã bị logot/ revoked chưa
        if (storedToken.revokedAt) {
            return res.status(401).json({
                message: "Refresh token đã bị thu hồi",
            });
        }

        // 3. Kiểm tra token đã hết hạn trong database chưa
        if(storedToken.expiresAt < new Date()) {
            return res.status(401).json({
                message: "Refresh token đã hết hạn",
            });
        }

        // 4. Verify refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        if (storedToken.user.status === "BLOCKED") {
            return res.status(403).json({
                message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
            });
        }

        // 5. Tạo access token mới
        const accessToken = generateAccessToken(storedToken.user);

        return res.status(200).json({
            message: "Cấp access token mới thành công",
            accessToken: accessToken,
        });
    } catch (error) {
        if(error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Refresh token đã hết hạn",
            });
        }

        if(error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Refresh token không hợp lệ",
            });
        }

        return res.status(500).json({
            message: "Lỗi server khi refresh token",
            error: error.message,
        });
    }
};

const logout = async (req, res) => {
    try{
        const { refreshToken } = req.body;

        if(!refreshToken) {
            return res.status(400).json({
                message: "Vui lòng gửi refresh token",
            });
        }

        const storedToken = await prisma.refreshToken.findUnique({
            where: {
                token: refreshToken,
            },
        });

        if(!storedToken) {
            return res.status(404).json({
                message: "Refresh token không tồn tại",
            });
        }

        await prisma.refreshToken.update({
            where: {
                token: refreshToken,
            },
            data: {
                revokedAt: new Date(),
            },
        });

        const requestInfo = getRequestInfo(req);

        await createActivityLog({
            userId: storedToken.userId,
            action: "LOGOUT",
            ...requestInfo,
            details: "User logged out successfully",
        });

        return res.status(200).json({
            message: "Đăng xuất thành công",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server khi đăng xuất",
            error: error.message,
        });
    }
};


const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if(!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Vui lòng nhập mật khẩu cũ và mật khẩu mới",
            });
        }

        if(newPassword.length < 8) {
            return res.status(400).json({
                message: "Mật khẩu mới phải có ít nhất 8 ký tự",
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại",
            });
        }

        if(!user.password) {
            return res.status(400).json({
                message: "Tài khoản Google/Facebook không thể đổi mật khẩu theo cách này",
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);

        if(isSamePassword){
            return res.status(400).json({
                message: "Mật khẩu mới không được trùng với mật khẩu cũ",
            });
        }

        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            },
        });

        await prisma.refreshToken.updateMany({
            where: {
                userId: user.id,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });

        await sendEmail({
            to: user.email,
            subject: "Thông báo đổi mật khẩu - JWT Auth Service",
            text: "Mật khẩu tài khoản của bạn vừa được thay đổi.",
            html: securityAlertTemplate({
                name: user.name,
                action: "Đổi mật khẩu tài khoản",
            }),
        });

        const requestInfo = getRequestInfo(req);

        await createActivityLog({
            userId: user.id,
            action: "CHANGE_PASSWORD",
            ...requestInfo,
            details: "User changed password successfully",
        });

        return res.status(200).json({
            message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server khi đổi mật khẩu",
            error: error.message,
        });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Vui lòng nhập email",
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(200).json({
                message: "Nếu email tồn tại, hệ thống sẽ gửi hướng dẫn đặt lại mật khẩu",
            });
        }

        if (user.provider !== "local") {
            return res.status(400).json({
                message: "Tài khoản này đăng nhập bằng Google/Facebook, không thể reset mật khẩu theo cách này",
            });
        }

        if (user.status === "BLOCKED") {
            return res.status(403).json({
                message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const resetPasswordExpires = new Date();
        resetPasswordExpires.setMinutes(resetPasswordExpires.getMinutes() + 15);

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires,
            },
        });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Đặt lại mật khẩu - JWT Auth Service",
            text: `Vui lòng truy cập link sau để đặt lại mật khẩu: ${resetUrl}`,
            html: resetPasswordTemplate({
                name: user.name,
                resetUrl,
            }),
        });

        return res.status(200).json({
            message: "Nếu email tồn tại, hệ thống sẽ gửi hướng dẫn đặt lại mật khẩu",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server khi yêu cầu quên mật khẩu",
            error: error.message,
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
  
      if (!resetToken || !newPassword) {
        return res.status(400).json({
          message: "Vui lòng nhập resetToken và newPassword",
        });
      }
  
      if (newPassword.length < 8) {
        return res.status(400).json({
          message: "Mật khẩu mới phải có ít nhất 8 ký tự",
        });
      }
  
      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: {
            gt: new Date(),
          },
        },
      });
  
      if (!user) {
        return res.status(400).json({
          message: "Reset token không hợp lệ hoặc đã hết hạn",
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });
  
      await prisma.refreshToken.updateMany({
        where: {
          userId: user.id,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      await sendEmail({
        to: user.email,
        subject: "Thông báo đặt lại mật khẩu - JWT Auth Service",
        text: "Mật khẩu tài khoản của bạn vừa được đặt lại.",
        html: securityAlertTemplate({
          name: user.name,
          action: "Đặt lại mật khẩu tài khoản",
        }),
      });

      const requestInfo = getRequestInfo(req);

      await createActivityLog({
        userId: user.id,
        action: "RESET_PASSWORD",
        ...requestInfo,
        details: "User reset password successfully",
      });

      return res.status(200).json({
        message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi server khi đặt lại mật khẩu",
        error: error.message,
      });
    }
};


const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Thiếu token xác thực email",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        verifyEmailToken: token,
        verifyEmailExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token xác thực không hợp lệ hoặc đã hết hạn",
      });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        verifyEmailToken: null,
        verifyEmailExpires: null,
      },
    });

    return res.status(200).json({
      message: "Xác thực email thành công. Bạn có thể đăng nhập.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi xác thực email",
      error: error.message,
    });
  }
};


const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Vui lòng nhập email",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(200).json({
        message: "Nếu email tồn tại và chưa xác thực, hệ thống sẽ gửi lại email xác thực",
      });
    }

    if (user.provider !== "local") {
      return res.status(400).json({
        message: "Tài khoản này đăng nhập bằng Google/Facebook, không cần xác thực email theo cách này",
      });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({
        message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Tài khoản này đã được xác thực email",
      });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const verifyEmailExpires = new Date();
    verifyEmailExpires.setHours(verifyEmailExpires.getHours() + 24);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verifyEmailToken: verifyToken,
        verifyEmailExpires,
      },
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;

    await sendEmail({
      to: user.email,
      subject: "Gửi lại email xác thực - JWT Auth Service",
      text: `Vui lòng truy cập link sau để xác thực tài khoản: ${verifyUrl}`,
      html: verifyEmailTemplate({
        name: user.name,
        verifyUrl,
      }),
    });

    return res.status(200).json({
      message: "Nếu email tồn tại và chưa xác thực, hệ thống sẽ gửi lại email xác thực",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi gửi lại email xác thực",
      error: error.message,
    });
  }
};


const googleCallback = async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/auth/error?message=google_login_failed`);
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt,
        },
      });

      return res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:3000"}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      return res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/auth/error?message=google_login_failed`);
    }
};


const facebookCallback = async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/auth/error?message=facebook_login_failed`);
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt,
        },
      });

      return res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:3000"}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      return res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/auth/error?message=facebook_login_failed`);
    }
};

module.exports = {
    register,
    login,
    getMe,
    refreshToken,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    googleCallback,
    facebookCallback,
};
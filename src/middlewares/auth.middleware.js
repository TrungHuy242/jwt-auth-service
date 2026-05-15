const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { getUserPermissionKeys } = require('../services/permission.service');

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Ban chua dang nhap hoac thieu token",
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token){
            return res.status(401).json({
                message: "Token khong hop le",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
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
                userRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        if(!user) {
            return res.status(401).json({
                message: "Nguoi dung khong ton tai",
            });
        }

        if (user.status === "BLOCKED") {
            return res.status(403).json({
                message: "Tai khoan cua ban da bi khoa. Vui long lien he quan tri vien.",
            });
        }

        const permissionKeys = await getUserPermissionKeys(user.id);

        req.user = {
            ...user,
            permissions: permissionKeys,
        };
        next();
    } catch(error) {
        if(error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token da het han",
            });
        }

        if(error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Token khong hop le",
            });
        }

        return res.status(500).json({
            message: "Loi xac thuc token",
            error: error.message,
        });
    }
};

const isAdmin = async (req, res, next) => {
    if(!req.user){
        return res.status(401).json({
            message: "Bạn chưa đăng nhập",
        });
    }

    if(req.user.role !=="ADMIN") {
        return res.status(403).json({
            message: "Bạn không có quyền ADMIN để truy cập chức năng này",
        });
    }
    next();
};

const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Bạn chưa đăng nhập",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Bạn không có quyền truy cập chức năng này",
            });
        }

        next();
    };
};

module.exports = {
    isAuthenticated,
    isAdmin,
    allowRoles,
};
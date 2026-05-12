const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const isAuthenticated = async (req, res, next) => {
    try {
        // 1. Lấy token từ header Authorization
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Bạn chưa đăng nhập hoặc thiếu token",
            });
        }

        // 2. Tách token ra khỏi chuỗi Bearer
        const token = authHeader.split(' ')[1];

        if (!token){
            return res.status(401).json({
                message: "Token không hợp lệ"
            })
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // 4. Tìm user trong database
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
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if(!user) {
            return res.status(401).json({
                message: "Người dùng không tồn tại",
            });
        }

        // 5.Gắn user vào request để controller dùng tiếp
        req.user = user;
        next();
    } catch(error) {
        if(error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token đã hết hạn",
            });
        }

        if(error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Token không hợp lệ",
            });
        }

        return res.status(500).json({
            message: "Lỗi xác thực token",
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

module.exports = {
    isAuthenticated,
    isAdmin,
};
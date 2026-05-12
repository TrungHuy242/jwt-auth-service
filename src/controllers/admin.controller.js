const prisma = require('../config/prisma');

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
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

        return res.status(200).json({
            message: "Lấy danh sách người dùng thành công",
            total: users.length,
            users,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server khi lấy danh sách người dùng",
            error: error.message,
        });
    }
};

module.exports = {
    getAllUsers,
};
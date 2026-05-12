const prisma = require('../config/prisma');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const getAllUsers = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || DEFAULT_PAGE);
        const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit) || DEFAULT_LIMIT));
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
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
            }),
            prisma.user.count(),
        ]);

        return res.status(200).json({
            message: "Lấy danh sách người dùng thành công",
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
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
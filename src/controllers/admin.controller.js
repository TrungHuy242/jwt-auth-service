const prisma = require('../config/prisma');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            role,
            status,
            provider,
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (isNaN(pageNumber) || pageNumber < 1) {
            return res.status(400).json({
                message: "Page không hợp lệ",
            });
        }

        if (isNaN(limitNumber) || limitNumber < 1) {
            return res.status(400).json({
                message: "Limit không hợp lệ",
            });
        }

        const allowedRoles = ["USER", "ADMIN"];
        const allowedStatuses = ["ACTIVE", "BLOCKED"];
        const allowedProviders = ["local", "google", "facebook"];

        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Role không hợp lệ",
            });
        }

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Status không hợp lệ",
            });
        }

        if (provider && !allowedProviders.includes(provider)) {
            return res.status(400).json({
                message: "Provider không hợp lệ",
            });
        }

        const where = {
            AND: [
                search
                    ? {
                          OR: [
                              { name: { contains: search } },
                              { email: { contains: search } },
                              { phone: { contains: search } },
                          ],
                      }
                    : {},
                role ? { role } : {},
                status ? { status } : {},
                provider ? { provider } : {},
            ],
        };

        const skip = (pageNumber - 1) * limitNumber;

        const [users, totalUsers] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limitNumber,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true, name: true, email: true, role: true,
                    provider: true, avatar: true, phone: true,
                    address: true, status: true, isVerified: true,
                    lastLoginAt: true, createdAt: true, updatedAt: true,
                },
            }),
            prisma.user.count({ where }),
        ]);

        const totalPages = Math.ceil(totalUsers / limitNumber);

        return res.status(200).json({
            message: "Lấy danh sách người dùng thành công",
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                totalUsers,
                totalPages,
            },
            filters: {
                search,
                role: role || null,
                status: status || null,
                provider: provider || null,
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

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const userId = Number(id);

        if (isNaN(userId)) {
            return res.status(400).json({
                message: "ID người dùng không hợp lệ",
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                provider: true,
                providerId: true,
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

        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng",
            });
        }

        return res.status(200).json({
            message: "Lấy chi tiết người dùng thành công",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server khi lấy chi tiết người dùng",
            error: error.message,
        });
    }
};


const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const userId = Number(id);

        if (isNaN(userId)) {
            return res.status(400).json({
                message: "ID người dùng không hợp lệ",
            });
        }

        if (!role) {
            return res.status(400).json({
                message: "Vui lòng nhập role",
            });
        }

        const allowedRoles = ["USER", "ADMIN"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Role không hợp lệ. Chỉ chấp nhận USER hoặc ADMIN",
            });
        }

        if (req.user.id === userId) {
            return res.status(400).json({
                message: "Bạn không thể tự đổi role của chính mình",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!existingUser) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng",
            });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                role,
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

        await prisma.refreshToken.updateMany({
            where: {
                userId,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });

        return res.status(200).json({
            message: "Cập nhật role người dùng thành công. Người dùng cần đăng nhập lại.",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server khi cập nhật role người dùng",
            error: error.message,
        });
    }
};


const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const userId = Number(id);

        if (isNaN(userId)) {
            return res.status(400).json({
                message: "ID người dùng không hợp lệ",
            });
        }

        if (!status) {
            return res.status(400).json({
                message: "Vui lòng nhập status",
            });
        }

        const allowedStatuses = ["ACTIVE", "BLOCKED"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Status không hợp lệ. Chỉ chấp nhận ACTIVE hoặc BLOCKED",
            });
        }

        if (req.user.id === userId) {
            return res.status(400).json({
                message: "Bạn không thể tự khóa/mở khóa tài khoản của chính mình",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!existingUser) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng",
            });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                status,
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

        if (status === "BLOCKED") {
            await prisma.refreshToken.updateMany({
                where: {
                    userId,
                    revokedAt: null,
                },
                data: {
                    revokedAt: new Date(),
                },
            });
        }

        return res.status(200).json({
            message:
                status === "BLOCKED"
                    ? "Khóa tài khoản người dùng thành công"
                    : "Mở khóa tài khoản người dùng thành công",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server khi cập nhật trạng thái người dùng",
            error: error.message,
        });
    }
};


module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    updateUserStatus,
};
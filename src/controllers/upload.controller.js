const fs = require("fs");
const path = require("path");
const prisma = require("../config/prisma");

const {
  createActivityLog,
  getRequestInfo,
} = require("../services/activityLog.service");

const getFileType = (mimeType) => {
  if (mimeType.startsWith("image/")) {
    return "IMAGE";
  }

  if (mimeType.startsWith("video/")) {
    return "VIDEO";
  }

  if (mimeType.startsWith("audio/")) {
    return "AUDIO";
  }

  const documentMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
  ];

  if (documentMimeTypes.includes(mimeType)) {
    return "DOCUMENT";
  }

  return "OTHER";
};

const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Vui lòng chọn file để upload",
      });
    }

    const folder = req.body.folder || req.query.folder || "general";

    const fileUrl = `${req.protocol}://${req.get("host")}/${req.file.path.replace(
      /\\/g,
      "/"
    )}`;

    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path.replace(/\\/g, "/"),
        fileUrl,
        mimeType: req.file.mimetype,
        size: req.file.size,
        folder,
        type: getFileType(req.file.mimetype),
        uploadedById: req.user.id,
      },
    });

    const requestInfo = getRequestInfo(req);

    await createActivityLog({
      userId: req.user.id,
      action: "UPLOAD_FILE",
      ...requestInfo,
      details: `Uploaded file: ${uploadedFile.originalName}`,
    });

    return res.status(201).json({
      message: "Upload file thành công",
      file: uploadedFile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi upload file",
      error: error.message,
    });
  }
};

const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Vui lòng chọn ít nhất một file để upload",
      });
    }

    const folder = req.body.folder || req.query.folder || "general";

    const filesData = req.files.map((file) => {
      const fileUrl = `${req.protocol}://${req.get("host")}/${file.path.replace(
        /\\/g,
        "/"
      )}`;

      return {
        originalName: file.originalname,
        fileName: file.filename,
        filePath: file.path.replace(/\\/g, "/"),
        fileUrl,
        mimeType: file.mimetype,
        size: file.size,
        folder,
        type: getFileType(file.mimetype),
        uploadedById: req.user.id,
      };
    });

    await prisma.uploadedFile.createMany({
      data: filesData,
    });

    const uploadedFiles = await prisma.uploadedFile.findMany({
      where: {
        uploadedById: req.user.id,
        fileName: {
          in: filesData.map((file) => file.fileName),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const requestInfo = getRequestInfo(req);

    await createActivityLog({
      userId: req.user.id,
      action: "UPLOAD_MULTIPLE_FILES",
      ...requestInfo,
      details: `Uploaded ${uploadedFiles.length} files`,
    });

    return res.status(201).json({
      message: "Upload nhiều file thành công",
      total: uploadedFiles.length,
      files: uploadedFiles,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi upload nhiều file",
      error: error.message,
    });
  }
};

const getUploadedFiles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      folder,
      type,
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

    const allowedTypes = ["IMAGE", "DOCUMENT", "VIDEO", "AUDIO", "OTHER"];

    if (type && !allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Type không hợp lệ. Chỉ chấp nhận IMAGE, DOCUMENT, VIDEO, AUDIO hoặc OTHER",
      });
    }

    const where = {
      AND: [
        req.user.role === "ADMIN" ? {} : { uploadedById: req.user.id },
        search
          ? {
              OR: [
                {
                  originalName: {
                    contains: search,
                  },
                },
                {
                  fileName: {
                    contains: search,
                  },
                },
              ],
            }
          : {},
        folder ? { folder } : {},
        type ? { type } : {},
      ],
    };

    const skip = (pageNumber - 1) * limitNumber;

    const [files, totalFiles] = await Promise.all([
      prisma.uploadedFile.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.uploadedFile.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalFiles / limitNumber);

    return res.status(200).json({
      message: "Lấy danh sách file thành công",
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalFiles,
        totalPages,
      },
      filters: {
        search,
        folder: folder || null,
        type: type || null,
      },
      files,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi lấy danh sách file",
      error: error.message,
    });
  }
};

const getUploadedFileById = async (req, res) => {
  try {
    const { id } = req.params;

    const fileId = Number(id);

    if (isNaN(fileId)) {
      return res.status(400).json({
        message: "ID file không hợp lệ",
      });
    }

    const file = await prisma.uploadedFile.findUnique({
      where: {
        id: fileId,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!file) {
      return res.status(404).json({
        message: "Không tìm thấy file",
      });
    }

    if (req.user.role !== "ADMIN" && file.uploadedById !== req.user.id) {
      return res.status(403).json({
        message: "Bạn không có quyền xem file này",
      });
    }

    return res.status(200).json({
      message: "Lấy chi tiết file thành công",
      file,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi lấy chi tiết file",
      error: error.message,
    });
  }
};

const deleteUploadedFile = async (req, res) => {
  try {
    const { id } = req.params;

    const fileId = Number(id);

    if (isNaN(fileId)) {
      return res.status(400).json({
        message: "ID file không hợp lệ",
      });
    }

    const file = await prisma.uploadedFile.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!file) {
      return res.status(404).json({
        message: "Không tìm thấy file",
      });
    }

    if (req.user.role !== "ADMIN" && file.uploadedById !== req.user.id) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa file này",
      });
    }

    const filePath = path.join(__dirname, "../../", file.filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.uploadedFile.delete({
      where: {
        id: fileId,
      },
    });

    const requestInfo = getRequestInfo(req);

    await createActivityLog({
      userId: req.user.id,
      action: "DELETE_FILE",
      ...requestInfo,
      details: `Deleted file: ${file.originalName}`,
    });

    return res.status(200).json({
      message: "Xóa file thành công",
      deletedFile: {
        id: file.id,
        originalName: file.originalName,
        fileName: file.fileName,
        fileUrl: file.fileUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi xóa file",
      error: error.message,
    });
  }
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
  getUploadedFiles,
  getUploadedFileById,
  deleteUploadedFile,
};

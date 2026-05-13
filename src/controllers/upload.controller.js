const prisma = require("../config/prisma");

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

module.exports = {
  uploadSingleFile,
};

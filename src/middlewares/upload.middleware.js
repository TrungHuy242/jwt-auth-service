const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || req.query.folder || "general";
    const uploadPath = path.join("uploads", folder);

    ensureFolderExists(uploadPath);

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const safeOriginalName = path
      .basename(file.originalname, fileExtension)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "");

    const fileName = `${safeOriginalName}-${Date.now()}${fileExtension}`;

    cb(null, fileName);
  },
});

const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/gif",

  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // PowerPoint
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Text
  "text/plain",

  // Audio
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",

  // Video
  "video/mp4",
  "video/mpeg",
  "video/webm",
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Loại file không được hỗ trợ"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

const uploadSingle = upload.single("file");
const uploadMultiple = upload.array("files", 10);

// Giữ lại uploadAvatar để các API avatar cũ không bị lỗi
const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join("uploads", "avatars");

      ensureFolderExists(uploadPath);

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname);
      const fileName = `avatar-${req.user.id}-${Date.now()}${fileExtension}`;

      cb(null, fileName);
    },
  }),

  fileFilter: (req, file, cb) => {
    const allowedAvatarTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (allowedAvatarTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Chỉ cho phép upload file ảnh jpg, jpeg, png hoặc webp"),
        false
      );
    }
  },

  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadAvatar,
};

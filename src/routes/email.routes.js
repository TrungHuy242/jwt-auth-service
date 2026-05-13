const express = require("express");
const { sendEmail } = require("../services/email.service");
const { isAuthenticated, allowRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/test",
  isAuthenticated,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const { to } = req.body;

      if (!to) {
        return res.status(400).json({
          message: "Vui lòng nhập email người nhận",
        });
      }

      const info = await sendEmail({
        to,
        subject: "Test Email - JWT Auth Service",
        text: "Đây là email test từ JWT Auth Service.",
        html: `
          <h2>Test Email</h2>
          <p>Đây là email test từ <b>JWT Auth Service</b>.</p>
          <p>Nếu bạn nhận được email này, cấu hình Nodemailer đã hoạt động.</p>
        `,
      });

      return res.status(200).json({
        message: "Gửi email test thành công",
        messageId: info.messageId,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi server khi gửi email test",
        error: error.message,
      });
    }
  }
);

module.exports = router;

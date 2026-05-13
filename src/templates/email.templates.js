const baseEmailTemplate = ({ title, content, buttonText, buttonUrl }) => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:30px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden;">
              <tr>
                <td style="background-color:#2563eb; padding:24px; text-align:center; color:#ffffff;">
                  <h1 style="margin:0; font-size:24px;">JWT Auth Service</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:32px;">
                  <h2 style="margin-top:0; color:#111827; font-size:22px;">
                    ${title}
                  </h2>

                  <div style="color:#374151; font-size:16px; line-height:1.6;">
                    ${content}
                  </div>

                  ${
                    buttonText && buttonUrl
                      ? `
                        <div style="text-align:center; margin:32px 0;">
                          <a href="${buttonUrl}"
                             style="background-color:#2563eb; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:8px; display:inline-block; font-weight:bold;">
                            ${buttonText}
                          </a>
                        </div>
                      `
                      : ""
                  }

                  <p style="color:#6b7280; font-size:14px; line-height:1.5;">
                    Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background-color:#f9fafb; padding:20px; text-align:center; color:#6b7280; font-size:13px;">
                  &copy; ${new Date().getFullYear()} JWT Auth Service. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

const testEmailTemplate = () => {
  return baseEmailTemplate({
    title: "Email test thành công",
    content: `
      <p>Xin chào,</p>
      <p>Đây là email test từ <b>JWT Auth Service</b>.</p>
      <p>Nếu bạn nhận được email này, cấu hình Nodemailer đã hoạt động thành công.</p>
    `,
  });
};

const resetPasswordTemplate = ({ name, resetUrl }) => {
  return baseEmailTemplate({
    title: "Đặt lại mật khẩu",
    content: `
      <p>Xin chào <b>${name}</b>,</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
      <p>Vui lòng bấm vào nút bên dưới để đặt lại mật khẩu.</p>
      <p>Liên kết này sẽ hết hạn sau <b>15 phút</b>.</p>
    `,
    buttonText: "Đặt lại mật khẩu",
    buttonUrl: resetUrl,
  });
};

const verifyEmailTemplate = ({ name, verifyUrl }) => {
  return baseEmailTemplate({
    title: "Xác thực tài khoản",
    content: `
      <p>Xin chào <b>${name}</b>,</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
      <p>Vui lòng bấm vào nút bên dưới để xác thực email của bạn.</p>
    `,
    buttonText: "Xác thực email",
    buttonUrl: verifyUrl,
  });
};

const securityAlertTemplate = ({ name, action }) => {
  return baseEmailTemplate({
    title: "Thông báo bảo mật tài khoản",
    content: `
      <p>Xin chào <b>${name}</b>,</p>
      <p>Tài khoản của bạn vừa thực hiện hành động bảo mật sau:</p>
      <p style="background-color:#f3f4f6; padding:12px; border-radius:8px;">
        <b>${action}</b>
      </p>
      <p>Thời gian: <b>${new Date().toLocaleString("vi-VN")}</b></p>
      <p>Nếu đây là bạn, bạn không cần làm gì thêm.</p>
      <p>Nếu bạn không thực hiện hành động này, vui lòng liên hệ quản trị viên ngay.</p>
    `,
  });
};

const accountStatusTemplate = ({ name, status }) => {
  const isBlocked = status === "BLOCKED";

  return baseEmailTemplate({
    title: isBlocked
      ? "Tài khoản của bạn đã bị khóa"
      : "Tài khoản của bạn đã được mở khóa",
    content: `
      <p>Xin chào <b>${name}</b>,</p>
      ${
        isBlocked
          ? `
            <p>Tài khoản của bạn đã bị quản trị viên khóa.</p>
            <p>Trong thời gian bị khóa, bạn sẽ không thể đăng nhập hoặc sử dụng các chức năng riêng tư của hệ thống.</p>
            <p>Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ quản trị viên để được hỗ trợ.</p>
          `
          : `
            <p>Tài khoản của bạn đã được quản trị viên mở khóa.</p>
            <p>Bây giờ bạn có thể đăng nhập và sử dụng lại hệ thống bình thường.</p>
          `
      }
      <p>Thời gian: <b>${new Date().toLocaleString("vi-VN")}</b></p>
    `,
  });
};

module.exports = {
  baseEmailTemplate,
  testEmailTemplate,
  resetPasswordTemplate,
  verifyEmailTemplate,
  securityAlertTemplate,
  accountStatusTemplate,
};

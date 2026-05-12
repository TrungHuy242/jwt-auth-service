const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ name, email và password",
      });
    }
  
    if (name.trim().length < 2) {
      return res.status(400).json({
        message: "Tên phải có ít nhất 2 ký tự",
      });
    }
  
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Email không hợp lệ",
      });
    }
  
    if (password.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
    }
  
    next();
  };
  
  const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập email và password",
      });
    }
  
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Email không hợp lệ",
      });
    }
  
    next();
  };
  
  const validateChangePassword = (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
  
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Vui lòng nhập mật khẩu cũ và mật khẩu mới",
      });
    }
  
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
    }
  
    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "Mật khẩu mới không được trùng với mật khẩu cũ",
      });
    }
  
    next();
  };
  
  const validateForgotPassword = (req, res, next) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({
        message: "Vui lòng nhập email",
      });
    }
  
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Email không hợp lệ",
      });
    }
  
    next();
  };
  
  const validateResetPassword = (req, res, next) => {
    const { resetToken, newPassword } = req.body;
  
    if (!resetToken || !newPassword) {
      return res.status(400).json({
        message: "Vui lòng nhập resetToken và newPassword",
      });
    }
  
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
    }
  
    next();
};
  
module.exports = {
    validateRegister,
    validateLogin,
    validateChangePassword,
    validateForgotPassword,
    validateResetPassword,
};
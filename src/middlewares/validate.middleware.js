const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRequirements = (password) => {
  if (password.length < 8) {
    return "Mật khẩu phải có ít nhất 8 ký tự";
  }
  if (!/[A-Z]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 chữ hoa";
  }
  if (!/[a-z]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 chữ thường";
  }
  if (!/\d/.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 số";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt";
  }
  return null;
};

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

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Email không hợp lệ",
      });
    }

    const passwordError = passwordRequirements(password);
    if (passwordError) {
      return res.status(400).json({
        message: passwordError,
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

    if (!emailRegex.test(email)) {
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

    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "Mật khẩu mới không được trùng với mật khẩu cũ",
      });
    }

    const passwordError = passwordRequirements(newPassword);
    if (passwordError) {
      return res.status(400).json({
        message: passwordError,
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

    if (!emailRegex.test(email)) {
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

    const passwordError = passwordRequirements(newPassword);
    if (passwordError) {
      return res.status(400).json({
        message: passwordError,
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

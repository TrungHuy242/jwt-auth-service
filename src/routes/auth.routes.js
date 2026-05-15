const express = require('express');
const { register , login , getMe , logout , refreshToken , changePassword, forgotPassword, resetPassword, verifyEmail, resendVerificationEmail, googleCallback, facebookCallback } = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const {
    validateRegister,
    validateLogin,
    validateChangePassword,
    validateForgotPassword,
    validateResetPassword,
  } = require("../middlewares/validate.middleware");
const {
    authLimiter,
    passwordLimiter,
  } = require("../middlewares/rateLimit.middleware");
const passport = require("../config/passport");
const { getPublicSettings } = require("../services/setting.service");

const checkGoogleLoginEnabled = async (req, res, next) => {
  try {
    const settings = await getPublicSettings();

    if (!settings.allowGoogleLogin) {
      return res.status(403).json({
        message: "Hệ thống hiện đang tắt đăng nhập bằng Google",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const checkFacebookLoginEnabled = async (req, res, next) => {
  try {
    const settings = await getPublicSettings();

    if (!settings.allowFacebookLogin) {
      return res.status(403).json({
        message: "Hệ thống hiện đang tắt đăng nhập bằng Facebook",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const router = express.Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);

router.get(
    "/google",
    checkGoogleLoginEnabled,
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);
  
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/api/auth/google/failure",
    }),
    googleCallback
);
  
router.get("/google/failure", (req, res) => {
    return res.status(401).json({
        message: "Đăng nhập Google thất bại",
    });
});

router.get(
    "/facebook",
    checkFacebookLoginEnabled,
    passport.authenticate("facebook", {
        scope: ["email"],
    })
);
  
router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: "/api/auth/facebook/failure",
    }),
    facebookCallback
);
  
router.get("/facebook/failure", (req, res) => {
    return res.status(401).json({
        message: "Đăng nhập Facebook thất bại",
    });
});

router.get("/me", isAuthenticated, getMe);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.patch("/change-password", validateChangePassword, isAuthenticated, changePassword);
router.post("/forgot-password", passwordLimiter, validateForgotPassword, forgotPassword);
router.post("/reset-password", passwordLimiter, validateResetPassword, resetPassword);
module.exports = router;
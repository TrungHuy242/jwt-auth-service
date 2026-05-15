import axiosClient from "../api/axiosClient";

export const authApi = {
  register: async (data) => axiosClient.post("/api/auth/register", data),

  login: async (data) => axiosClient.post("/api/auth/login", data),

  logout: async () => axiosClient.post("/api/auth/logout"),

  getMe: async () => axiosClient.get("/api/auth/me"),

  refreshToken: async (refreshToken) =>
    axiosClient.post("/api/auth/refresh-token", { refreshToken }),

  changePassword: async (data) =>
    axiosClient.patch("/api/auth/change-password", data),

  verifyEmail: async (token) =>
    axiosClient.get(`/api/auth/verify-email?token=${token}`),

  resendVerificationEmail: async (email) =>
    axiosClient.post("/api/auth/resend-verification-email", { email }),

  forgotPassword: async (email) =>
    axiosClient.post("/api/auth/forgot-password", { email }),

  resetPassword: async (data) =>
    axiosClient.post("/api/auth/reset-password", data),
};

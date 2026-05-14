import apiClient from '../utils/apiClient';

export const authApi = {
  register: async (data) => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post('/api/auth/refresh-token');
    return response.data;
  },

  changePassword: async (data) => {
    const response = await apiClient.patch('/api/auth/change-password', data);
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await apiClient.get(`/api/auth/verify-email?token=${token}`);
    return response.data;
  },

  resendVerificationEmail: async (email) => {
    const response = await apiClient.post('/api/auth/resend-verification-email', { email });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await apiClient.post('/api/auth/reset-password', data);
    return response.data;
  },
};

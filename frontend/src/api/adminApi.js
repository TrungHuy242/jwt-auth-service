import apiClient from '../utils/apiClient';

export const adminApi = {
  getDashboardOverview: async () => {
    const response = await apiClient.get('/api/admin/dashboard/overview');
    return response.data;
  },

  getUserStatistics: async () => {
    const response = await apiClient.get('/api/admin/dashboard/users');
    return response.data;
  },

  getFileStatistics: async () => {
    const response = await apiClient.get('/api/admin/dashboard/files');
    return response.data;
  },

  getSystemStatistics: async () => {
    const response = await apiClient.get('/api/admin/dashboard/system');
    return response.data;
  },

  getRecentActivities: async ({ limit = 5 } = {}) => {
    const response = await apiClient.get('/api/admin/dashboard/recent-activities', {
      params: { limit },
    });
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await apiClient.get('/api/admin/users', { params });
    return response.data;
  },

  updateUserRole: async (userId, newRole) => {
    const response = await apiClient.patch(`/api/admin/users/${userId}/role`, { role: newRole });
    return response.data;
  },

  updateUserStatus: async (userId, newStatus) => {
    const response = await apiClient.patch(`/api/admin/users/${userId}/status`, { status: newStatus });
    return response.data;
  },

  getActivityLogs: async (params = {}) => {
    const response = await apiClient.get('/api/admin/activity-logs', { params });
    return response.data;
  },

  getActivityLogById: async (id) => {
    const response = await apiClient.get(`/api/admin/activity-logs/${id}`);
    return response.data;
  },
};

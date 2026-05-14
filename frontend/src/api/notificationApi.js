import apiClient from '../utils/apiClient';

export const notificationApi = {
  getNotifications: async ({ page = 1, limit = 10, isRead, type } = {}) => {
    const params = { page, limit };
    if (isRead !== undefined && isRead !== '') {
      params.isRead = isRead;
    }
    if (type) {
      params.type = type;
    }
    const response = await apiClient.get('/api/notifications', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get('/api/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await apiClient.patch(`/api/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.patch('/api/notifications/read-all');
    return response.data;
  },
};

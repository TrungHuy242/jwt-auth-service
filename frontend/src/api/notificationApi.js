import axiosClient from "../api/axiosClient";

export const notificationApi = {
  getNotifications: async ({ page = 1, limit = 10, isRead, type } = {}) => {
    const params = { page, limit };
    if (isRead !== undefined && isRead !== "") {
      params.isRead = isRead;
    }
    if (type) {
      params.type = type;
    }
    return axiosClient.get("/api/notifications", { params });
  },

  getUnreadCount: async () =>
    axiosClient.get("/api/notifications/unread-count"),

  markAsRead: async (id) =>
    axiosClient.patch(`/api/notifications/${id}/read`),

  markAllAsRead: async () =>
    axiosClient.patch("/api/notifications/read-all"),
};

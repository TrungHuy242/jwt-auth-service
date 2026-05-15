import axiosClient from "../api/axiosClient";

export const adminApi = {
  getDashboardOverview: async () =>
    axiosClient.get("/api/admin/dashboard/overview"),

  getUserStatistics: async () =>
    axiosClient.get("/api/admin/dashboard/users"),

  getFileStatistics: async () =>
    axiosClient.get("/api/admin/dashboard/files"),

  getSystemStatistics: async () =>
    axiosClient.get("/api/admin/dashboard/system"),

  getRecentActivities: async ({ limit = 5 } = {}) =>
    axiosClient.get("/api/admin/dashboard/recent-activities", {
      params: { limit },
    }),

  getUsers: async (params = {}) =>
    axiosClient.get("/api/admin/users", { params }),

  updateUserRole: async (userId, newRole) =>
    axiosClient.patch(`/api/admin/users/${userId}/role`, { role: newRole }),

  updateUserStatus: async (userId, newStatus) =>
    axiosClient.patch(`/api/admin/users/${userId}/status`, { status: newStatus }),

  getActivityLogs: async (params = {}) =>
    axiosClient.get("/api/admin/activity-logs", { params }),

  getActivityLogById: async (id) =>
    axiosClient.get(`/api/admin/activity-logs/${id}`),
};

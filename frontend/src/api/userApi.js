import axiosClient from "../api/axiosClient";

export const userApi = {
  getMyProfile: async () => axiosClient.get("/api/users/me"),

  updateMyProfile: async (data) =>
    axiosClient.patch("/api/users/me", data),

  updateAvatar: async (formData) =>
    axiosClient.patch("/api/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteAvatar: async () => axiosClient.delete("/api/users/me/avatar"),
};

import axiosClient from "./axiosClient";

export const settingApi = {
  getPublicSettings: () => {
    return axiosClient.get("/settings/public");
  },

  getAdminSettings: () => {
    return axiosClient.get("/admin/settings");
  },

  updateAdminSettings: (data) => {
    return axiosClient.patch("/admin/settings", data);
  },
};

import axiosClient from "./axiosClient";

export const uploadApi = {
  uploadSingle: (formData) => {
    return axiosClient.post("/uploads/single", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  uploadMultiple: (formData) => {
    return axiosClient.post("/uploads/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getFiles: (params = {}) => {
    return axiosClient.get("/uploads", {
      params,
    });
  },

  getFileById: (id) => {
    return axiosClient.get(`/uploads/${id}`);
  },

  deleteFile: (id) => {
    return axiosClient.delete(`/uploads/${id}`);
  },
};

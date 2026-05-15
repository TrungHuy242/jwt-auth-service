import axiosClient from "./axiosClient";

export const roleApi = {
  getRoles: () => {
    return axiosClient.get("/admin/roles");
  },

  getRoleById: (id) => {
    return axiosClient.get(`/admin/roles/${id}`);
  },

  createRole: (data) => {
    return axiosClient.post("/admin/roles", data);
  },

  updateRole: (id, data) => {
    return axiosClient.patch(`/admin/roles/${id}`, data);
  },

  deleteRole: (id) => {
    return axiosClient.delete(`/admin/roles/${id}`);
  },

  getPermissions: () => {
    return axiosClient.get("/admin/roles/permissions");
  },

  updateRolePermissions: (roleId, permissionIds) => {
    return axiosClient.patch(`/admin/roles/${roleId}/permissions`, {
      permissionIds,
    });
  },

  updateUserRoles: (userId, roleIds) => {
    return axiosClient.patch(`/admin/roles/users/${userId}/roles`, {
      roleIds,
    });
  },
};

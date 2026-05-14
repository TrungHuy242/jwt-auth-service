import apiClient from '../utils/apiClient';

export const userApi = {
  getMyProfile: async () => {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  },

  updateMyProfile: async (data) => {
    const response = await apiClient.patch('/api/users/me', data);
    return response.data;
  },

  updateAvatar: async (formData) => {
    const response = await apiClient.patch('/api/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAvatar: async () => {
    const response = await apiClient.delete('/api/users/me/avatar');
    return response.data;
  },
};

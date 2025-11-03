import axiosInstance from './axios';

export const favoriteApi = {
  addFavorite: async (recipeId) => {
    const response = await axiosInstance.post(`/favorites/${recipeId}`);
    return response.data;
  },

  removeFavorite: async (recipeId) => {
    const response = await axiosInstance.delete(`/favorites/${recipeId}`);
    return response.data;
  },

  getUserFavorites: async (page = 0, size = 12) => {
    const response = await axiosInstance.get('/favorites', {
      params: { page, size },
    });
    return response.data;
  },

  isFavorite: async (recipeId) => {
    const response = await axiosInstance.get(`/favorites/check/${recipeId}`);
    return response.data;
  },
};
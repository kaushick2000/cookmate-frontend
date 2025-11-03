import axiosInstance from './axios';

export const reviewApi = {
  createReview: async (recipeId, reviewData) => {
    const response = await axiosInstance.post(`/reviews/recipe/${recipeId}`, reviewData);
    return response.data;
  },

  updateReview: async (reviewId, reviewData) => {
    const response = await axiosInstance.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  deleteReview: async (reviewId) => {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  getRecipeReviews: async (recipeId, page = 0, size = 10) => {
    const response = await axiosInstance.get(`/reviews/recipe/${recipeId}`, {
      params: { page, size },
    });
    return response.data;
  },

  getUserReviews: async (page = 0, size = 10) => {
    const response = await axiosInstance.get('/reviews/my-reviews', {
      params: { page, size },
    });
    return response.data;
  },
};
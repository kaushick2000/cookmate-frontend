import axiosInstance from './axios';

export const recipeApi = {
  getAllRecipes: async (page = 0, size = 12, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await axiosInstance.get('/recipes', {
      params: { page, size, sortBy, sortDir },
    });
    return response.data;
  },

  getRecipeById: async (id) => {
    const response = await axiosInstance.get(`/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (recipeData) => {
    const response = await axiosInstance.post('/recipes', recipeData);
    return response.data;
  },

  updateRecipe: async (id, recipeData) => {
    const response = await axiosInstance.put(`/recipes/${id}`, recipeData);
    return response.data;
  },

  deleteRecipe: async (id) => {
    const response = await axiosInstance.delete(`/recipes/${id}`);
    return response.data;
  },

  searchRecipes: async (keyword, page = 0, size = 12) => {
    const response = await axiosInstance.get('/recipes/search', {
      params: { keyword, page, size },
    });
    return response.data;
  },

  filterRecipes: async (filters, page = 0, size = 12) => {
    const response = await axiosInstance.get('/recipes/filter', {
      params: { ...filters, page, size },
    });
    return response.data;
  },

  searchByIngredients: async (ingredients, page = 0, size = 12) => {
    const response = await axiosInstance.get('/recipes/search-by-ingredients', {
      params: { ingredients, page, size },
    });
    return response.data;
  },

  getTopRated: async (page = 0, size = 12) => {
    const response = await axiosInstance.get('/recipes/top-rated', {
      params: { page, size },
    });
    return response.data;
  },

  getMostViewed: async (page = 0, size = 12) => {
    const response = await axiosInstance.get('/recipes/most-viewed', {
      params: { page, size },
    });
    return response.data;
  },

  getRecent: async (page = 0, size = 12) => {
    const response = await axiosInstance.get('/recipes/recent', {
      params: { page, size },
    });
    return response.data;
  },

  getMyRecipes: async (page = 0, size = 12) => {
    const response = await axiosInstance.get('/recipes/my-recipes', {
      params: { page, size },
    });
    return response.data;
  },

  // AI-Powered Features
  getRecommendations: async (type = 'personalized', limit = 10) => {
    const response = await axiosInstance.get('/recipes/recommendations', {
      params: { type, limit },
    });
    return response.data;
  },

  getRecommendationsByHistory: async (limit = 10) => {
    const response = await axiosInstance.get('/recipes/recommendations/history', {
      params: { limit },
    });
    return response.data;
  },

  getRecommendationsByPreferences: async (preferences = {}, limit = 10) => {
    const response = await axiosInstance.get('/recipes/recommendations/preferences', {
      params: { ...preferences, limit },
    });
    return response.data;
  },

  getTrendingRecipes: async (limit = 10) => {
    const response = await axiosInstance.get('/recipes/recommendations/trending', {
      params: { limit },
    });
    return response.data;
  },

  getIngredientSubstitutions: async (ingredientName, useAI = false) => {
    const response = await axiosInstance.get('/recipes/substitutions', {
      params: { ingredient: ingredientName, useAI },
    });
    return response.data;
  },
};
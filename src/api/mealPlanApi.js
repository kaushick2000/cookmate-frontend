import axiosInstance from './axios';

export const mealPlanApi = {
  createMealPlan: async (mealPlanData) => {
    const response = await axiosInstance.post('/meal-plans', mealPlanData);
    return response.data;
  },

  updateMealPlan: async (id, mealPlanData) => {
    const response = await axiosInstance.put(`/meal-plans/${id}`, mealPlanData);
    return response.data;
  },

  deleteMealPlan: async (id) => {
    const response = await axiosInstance.delete(`/meal-plans/${id}`);
    return response.data;
  },

  getMealPlanById: async (id) => {
    const response = await axiosInstance.get(`/meal-plans/${id}`);
    return response.data;
  },

  getUserMealPlans: async (page = 0, size = 10) => {
    const response = await axiosInstance.get('/meal-plans', {
      params: { page, size },
    });
    return response.data;
  },

  getActiveMealPlans: async () => {
    const response = await axiosInstance.get('/meal-plans/active');
    return response.data;
  },
};
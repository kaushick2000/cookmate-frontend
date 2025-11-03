import axiosInstance from './axios';

export const shoppingListApi = {
  createShoppingList: async (shoppingListData) => {
    const response = await axiosInstance.post('/shopping-lists', shoppingListData);
    return response.data;
  },

  updateShoppingList: async (id, shoppingListData) => {
    const response = await axiosInstance.put(`/shopping-lists/${id}`, shoppingListData);
    return response.data;
  },

  deleteShoppingList: async (id) => {
    const response = await axiosInstance.delete(`/shopping-lists/${id}`);
    return response.data;
  },

  getShoppingListById: async (id) => {
    const response = await axiosInstance.get(`/shopping-lists/${id}`);
    return response.data;
  },

  getUserShoppingLists: async (page = 0, size = 10) => {
    const response = await axiosInstance.get('/shopping-lists', {
      params: { page, size },
    });
    return response.data;
  },

  addItemToList: async (listId, itemData) => {
    const response = await axiosInstance.post(`/shopping-lists/${listId}/items`, itemData);
    return response.data;
  },

  toggleItemPurchased: async (itemId) => {
    const response = await axiosInstance.put(`/shopping-lists/items/${itemId}/toggle`);
    return response.data;
  },

  deleteItem: async (itemId) => {
    const response = await axiosInstance.delete(`/shopping-lists/items/${itemId}`);
    return response.data;
  },
};
import axios from './axios';

export const aiChatApi = {
  // Get recipe suggestions based on ingredients
  getRecipeSuggestions: async (request) => {
    const response = await axios.post('/ai-chat/recipe-suggestions', request);
    return response.data;
  },

  // Handle general cooking questions
  handleGeneralChat: async (message) => {
    const response = await axios.post('/ai-chat/general-chat', {
      message: message,
      chatType: 'general_chat'
    });
    return response.data;
  },

  // Quick recipe suggestions with simple ingredients string
  getQuickSuggestions: async (ingredients, mealType = null, dietary = null) => {
    const params = new URLSearchParams({ ingredients });
    if (mealType) params.append('mealType', mealType);
    if (dietary) params.append('dietary', dietary);
    
    const response = await axios.get(`/ai-chat/quick-suggestions?${params}`);
    return response.data;
  },
};
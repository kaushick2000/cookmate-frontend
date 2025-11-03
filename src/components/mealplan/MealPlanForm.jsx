import { useState, useEffect } from 'react';
import { recipeApi } from '../../api/recipeApi';
import { MEAL_TIMES } from '../../utils/constants';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MealPlanForm = ({ mealPlan, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    meals: [],
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mealPlan) {
      setFormData({
        name: mealPlan.name || '',
        startDate: mealPlan.startDate || '',
        endDate: mealPlan.endDate || '',
        meals: mealPlan.meals || [],
      });
    }
    fetchRecipes();
  }, [mealPlan]);

  const fetchRecipes = async () => {
    try {
      const response = await recipeApi.getAllRecipes(0, 100);
      setRecipes(response.content);
    } catch (error) {
      toast.error('Failed to fetch recipes');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMealChange = (index, field, value) => {
    const newMeals = [...formData.meals];
    newMeals[index][field] = value;
    setFormData({ ...formData, meals: newMeals });
  };

  const addMeal = () => {
    setFormData({
      ...formData,
      meals: [
        ...formData.meals,
        {
          recipeId: '',
          plannedDate: formData.startDate || '',
          mealTime: 'Lunch',
          servings: 1,
        },
      ],
    });
  };

  const removeMeal = (index) => {
    const newMeals = formData.meals.filter((_, i) => i !== index);
    setFormData({ ...formData, meals: newMeals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      toast.error('Failed to save meal plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Meal Plan Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Weekly Meal Plan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Planned Meals</h3>
          <button
            type="button"
            onClick={addMeal}
            className="flex items-center text-orange-500 hover:text-orange-600"
          >
            <FaPlus className="mr-1" /> Add Meal
          </button>
        </div>

        {formData.meals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No meals added yet. Click "Add Meal" to start planning.
          </p>
        ) : (
          <div className="space-y-4">
            {formData.meals.map((meal, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipe *
                    </label>
                    <select
                      value={meal.recipeId}
                      onChange={(e) => handleMealChange(index, 'recipeId', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select a recipe</option>
                      {recipes.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                          {recipe.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={meal.plannedDate}
                      onChange={(e) => handleMealChange(index, 'plannedDate', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meal Time
                    </label>
                    <select
                      value={meal.mealTime}
                      onChange={(e) => handleMealChange(index, 'mealTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {MEAL_TIMES.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Servings
                    </label>
                    <input
                      type="number"
                      value={meal.servings}
                      onChange={(e) => handleMealChange(index, 'servings', parseInt(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMeal(index)}
                    className="text-red-500 hover:text-red-600 p-2 mt-6"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : mealPlan ? 'Update Plan' : 'Create Plan'}
        </button>
      </div>
    </form>
  );
};

export default MealPlanForm;
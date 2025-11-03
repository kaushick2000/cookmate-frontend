import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeApi } from '../../api/recipeApi';
import { toast } from 'react-toastify';
import { CUISINE_TYPES, MEAL_TYPES, DIFFICULTY_LEVELS } from '../../utils/constants';
import { FaPlus, FaTrash } from 'react-icons/fa';

const RecipeForm = ({ recipe, isEdit = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: recipe?.title || '',
    description: recipe?.description || '',
    cuisineType: recipe?.cuisineType || '',
    mealType: recipe?.mealType || '',
    difficultyLevel: recipe?.difficultyLevel || '',
    prepTime: recipe?.prepTime || '',
    cookTime: recipe?.cookTime || '',
    servings: recipe?.servings || 4,
    calories: recipe?.calories || '',
    protein: recipe?.protein || '',
    carbs: recipe?.carbs || '',
    fat: recipe?.fat || '',
    imageUrl: recipe?.imageUrl || '',
    videoUrl: recipe?.videoUrl || '',
    isVegetarian: recipe?.isVegetarian || false,
    isVegan: recipe?.isVegan || false,
    isGlutenFree: recipe?.isGlutenFree || false,
    isDairyFree: recipe?.isDairyFree || false,
    ingredients: recipe?.ingredients || [{ ingredientName: '', quantity: '', unit: '' }],
    instructions: recipe?.instructions || [{ stepNumber: 1, instruction: '', timerMinutes: '' }],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { ingredientName: '', quantity: '', unit: '' }],
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleInstructionChange = (index, field, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index][field] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [
        ...formData.instructions,
        { stepNumber: formData.instructions.length + 1, instruction: '', timerMinutes: '' },
      ],
    });
  };

  const removeInstruction = (index) => {
    const newInstructions = formData.instructions
      .filter((_, i) => i !== index)
      .map((inst, i) => ({ ...inst, stepNumber: i + 1 }));
    setFormData({ ...formData, instructions: newInstructions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty ingredients
      const cleanedIngredients = formData.ingredients.filter(
        (ing) => ing.ingredientName.trim() !== ''
      );

      // Filter out empty instructions
      const cleanedInstructions = formData.instructions.filter(
        (inst) => inst.instruction.trim() !== ''
      );

      const recipeData = {
        ...formData,
        ingredients: cleanedIngredients,
        instructions: cleanedInstructions,
      };

      if (isEdit) {
        await recipeApi.updateRecipe(recipe.id, recipeData);
        toast.success('Recipe updated successfully!');
      } else {
        await recipeApi.createRecipe(recipeData);
        toast.success('Recipe created successfully!');
      }
      navigate('/my-recipes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Type
            </label>
            <select
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Cuisine</option>
              {CUISINE_TYPES.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <select
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Meal Type</option>
              {MEAL_TYPES.map((meal) => (
                <option key={meal} value={meal}>
                  {meal}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Difficulty</option>
              {DIFFICULTY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servings *
            </label>
            <input
              type="number"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prep Time (minutes)
            </label>
            <input
              type="number"
              name="prepTime"
              value={formData.prepTime}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cook Time (minutes)
            </label>
            <input
              type="number"
              name="cookTime"
              value={formData.cookTime}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isVegetarian"
              checked={formData.isVegetarian}
              onChange={handleChange}
              className="mr-2 rounded text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Vegetarian</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isVegan"
              checked={formData.isVegan}
              onChange={handleChange}
              className="mr-2 rounded text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Vegan</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isGlutenFree"
              checked={formData.isGlutenFree}
              onChange={handleChange}
              className="mr-2 rounded text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Gluten-Free</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isDairyFree"
              checked={formData.isDairyFree}
              onChange={handleChange}
              className="mr-2 rounded text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Dairy-Free</span>
          </label>
        </div>
      </div>

      {/* Nutrition Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Nutrition Information (Optional)</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calories
            </label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Protein (g)
            </label>
            <input
              type="number"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carbs (g)
            </label>
            <input
              type="number"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fat (g)
            </label>
            <input
              type="number"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ingredients</h3>
          <button
            type="button"
            onClick={addIngredient}
            className="flex items-center text-orange-500 hover:text-orange-600"
          >
            <FaPlus className="mr-1" /> Add Ingredient
          </button>
        </div>

        <div className="space-y-3">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.ingredientName}
                onChange={(e) =>
                  handleIngredientChange(index, 'ingredientName', e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="Qty"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, 'quantity', e.target.value)
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, 'unit', e.target.value)
                }
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-red-500 hover:text-red-600 p-2"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Instructions</h3>
          <button
            type="button"
            onClick={addInstruction}
            className="flex items-center text-orange-500 hover:text-orange-600"
          >
            <FaPlus className="mr-1" /> Add Step
          </button>
        </div>

        <div className="space-y-4">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="border-l-4 border-orange-500 pl-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-700">Step {instruction.stepNumber}</span>
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
              <textarea
                placeholder="Describe this step..."
                value={instruction.instruction}
                onChange={(e) =>
                  handleInstructionChange(index, 'instruction', e.target.value)
                }
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
              />
              <input
                type="number"
                placeholder="Timer (minutes, optional)"
                value={instruction.timerMinutes}
                onChange={(e) =>
                  handleInstructionChange(index, 'timerMinutes', e.target.value)
                }
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Recipe' : 'Create Recipe'}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
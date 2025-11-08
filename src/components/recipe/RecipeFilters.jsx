import { useState, useEffect } from 'react';
import { CUISINE_TYPES, MEAL_TYPES, DIFFICULTY_LEVELS } from '../../utils/constants';

const RecipeFilters = ({ onFilterChange, currentFilters = {}, usingUserPreferences = false }) => {
  const [filters, setFilters] = useState({
    cuisineType: '',
    mealType: '',
    difficultyLevel: '',
    maxTime: '',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
  });

  // Update local filters when currentFilters prop changes
  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...currentFilters
    }));
  }, [currentFilters]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      cuisineType: '',
      mealType: '',
      difficultyLevel: '',
      maxTime: '',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          {usingUserPreferences && (
            <span className="px-3 py-1 text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 rounded-full">
              Using Your Preferences
            </span>
          )}
        </div>
        <button
          onClick={handleReset}
          className="text-sm text-orange-500 hover:text-orange-600"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cuisine Type
          </label>
          <select
            name="cuisineType"
            value={filters.cuisineType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Cuisines</option>
            {CUISINE_TYPES.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meal Type
          </label>
          <select
            name="mealType"
            value={filters.mealType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Meals</option>
            {MEAL_TYPES.map((meal) => (
              <option key={meal} value={meal}>
                {meal}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            name="difficultyLevel"
            value={filters.difficultyLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Levels</option>
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Time (minutes)
          </label>
          <input
            type="number"
            name="maxTime"
            value={filters.maxTime}
            onChange={handleChange}
            placeholder="e.g., 30"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isVegetarian"
            checked={filters.isVegetarian}
            onChange={handleChange}
            className="mr-2 rounded text-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Vegetarian</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="isVegan"
            checked={filters.isVegan}
            onChange={handleChange}
            className="mr-2 rounded text-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Vegan</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="isGlutenFree"
            checked={filters.isGlutenFree}
            onChange={handleChange}
            className="mr-2 rounded text-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Gluten-Free</span>
        </label>
      </div>
    </div>
  );
};

export default RecipeFilters;
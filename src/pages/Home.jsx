import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { recipeApi } from '../api/recipeApi';
import { useAuth } from '../context/AuthContext';
import RecipeList from '../components/recipe/RecipeList';
import RecipeFilters from '../components/recipe/RecipeFilters';
import RecipeRecommendations from '../components/ai/RecipeRecommendations';
import { FaSearch, FaRobot } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Home = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      // Only use filterRecipes if there are actual filter values (not empty strings or false booleans)
      const hasActiveFilters = 
        (filters.cuisineType && filters.cuisineType !== '') ||
        (filters.mealType && filters.mealType !== '') ||
        (filters.difficultyLevel && filters.difficultyLevel !== '') ||
        (filters.maxTime && filters.maxTime !== '') ||
        filters.isVegetarian ||
        filters.isVegan ||
        filters.isGlutenFree;

      if (hasActiveFilters) {
        // Build clean filter object with only non-empty values
        const cleanFilters = {};
        if (filters.cuisineType) cleanFilters.cuisineType = filters.cuisineType;
        if (filters.mealType) cleanFilters.mealType = filters.mealType;
        if (filters.difficultyLevel) cleanFilters.difficultyLevel = filters.difficultyLevel;
        if (filters.maxTime) cleanFilters.maxTime = filters.maxTime;
        if (filters.isVegetarian) cleanFilters.isVegetarian = filters.isVegetarian;
        if (filters.isVegan) cleanFilters.isVegan = filters.isVegan;
        if (filters.isGlutenFree) cleanFilters.isGlutenFree = filters.isGlutenFree;
        
        response = await recipeApi.filterRecipes(cleanFilters, page, 12);
      } else {
        response = await recipeApi.getAllRecipes(page, 12);
      }
      setRecipes(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchRecipes();
  }, [page, filters, fetchRecipes]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await recipeApi.searchRecipes(searchTerm, 0, 12);
      setRecipes(response.content);
      setTotalPages(response.totalPages);
      setPage(0);
    } catch (error) {
      toast.error('Failed to search recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Discover Amazing Recipes
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Find, cook, and share your favorite meals
        </p>

        {/* AI Assistant Button */}
        <div className="flex justify-center items-center mb-8">
          <Link 
            to="/ai-chatbot"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200"
          >
            <FaRobot className="mr-2 text-xl" />
            Ask AI for Recipe Suggestions
          </Link>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {user 
              ? 'Use the recommendation buttons below to see personalized recipes based on your profile'
              : 'Tell AI what ingredients you have and get instant recipe ideas!'
            }
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for recipes..."
              className="w-full px-6 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600"
            >
              <FaSearch size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <RecipeFilters onFilterChange={handleFilterChange} currentFilters={filters} />

      {/* Recipe Grid */}
      <RecipeList recipes={recipes} loading={loading} />

      {/* AI-Powered Recipe Recommendations */}
      <RecipeRecommendations type="personalized" />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages - 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
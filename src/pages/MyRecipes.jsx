import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeApi } from '../api/recipeApi';
import RecipeList from '../components/recipe/RecipeList';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import { FaPlus, FaRobot } from 'react-icons/fa';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchMyRecipes();
  }, [page]);

  const fetchMyRecipes = async () => {
    setLoading(true);
    try {
      const response = await recipeApi.getMyRecipes(page, 12);
      setRecipes(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to fetch your recipes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Recipes</h1>
        <div className="flex space-x-4">
          <Link
            to="/ai-chatbot"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-md hover:from-orange-600 hover:to-orange-700 transition-colors flex items-center"
          >
            <FaRobot className="mr-2" />
            AI Recipe Ideas
          </Link>
          <Link
            to="/create-recipe"
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Create Recipe
          </Link>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No recipes yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start sharing your culinary creations with the community!
          </p>
          <Link
            to="/create-recipe"
            className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Create Your First Recipe
          </Link>
        </div>
      ) : (
        <>
          <RecipeList recipes={recipes} loading={false} onFavoriteChange={fetchMyRecipes} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages - 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyRecipes;
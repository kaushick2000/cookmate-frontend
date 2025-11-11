import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaFire, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { favoriteApi } from '../../api/favoriteApi';
// shopping list actions moved to RecipeDetails
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const RecipeCard = ({ recipe, onFavoriteChange }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [checkingFavorite, setCheckingFavorite] = useState(false);

  // Check if recipe is favorite when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isAuthenticated && recipe.id) {
        setCheckingFavorite(true);
        try {
          const result = await favoriteApi.isFavorite(recipe.id);
          setIsFavorite(result.isFavorite || result === true);
        } catch (error) {
          // If error checking favorite status, assume it's not a favorite
          setIsFavorite(false);
        } finally {
          setCheckingFavorite(false);
        }
      }
    };

    checkFavoriteStatus();
  }, [isAuthenticated, recipe.id]);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await favoriteApi.removeFavorite(recipe.id);
        toast.success('Removed from favorites');
        setIsFavorite(false);
      } else {
        await favoriteApi.addFavorite(recipe.id);
        toast.success('Added to favorites');
        setIsFavorite(true);
      }
      if (onFavoriteChange) onFavoriteChange();
    } catch (error) {
      // Handle duplicate error gracefully
      if (error.response?.data?.message?.includes('already in favorites')) {
        setIsFavorite(true);
        toast.info('Recipe is already in your favorites');
      } else if (error.response?.data?.message?.includes('not found')) {
        setIsFavorite(false);
        toast.info('Recipe was not in favorites');
      } else {
        toast.error('Failed to update favorite');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add-to-shopping-list moved into RecipeDetails for better context

  return (
    <Link to={`/recipes/${recipe.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <img
            src={getImageUrl(recipe.imageUrl)}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handleFavoriteToggle}
            disabled={loading || checkingFavorite}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {checkingFavorite ? (
              <FaRegHeart className="text-gray-400 text-xl animate-pulse" />
            ) : isFavorite ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegHeart className="text-gray-600 text-xl" />
            )}
          </button>
          {recipe.difficultyLevel && (
            <span className="absolute top-2 left-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {recipe.difficultyLevel}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              {recipe.totalTime && (
                <div className="flex items-center">
                  <FaClock className="mr-1 text-orange-500" />
                  <span>{recipe.totalTime} min</span>
                </div>
              )}
              {recipe.calories && (
                <div className="flex items-center">
                  <FaFire className="mr-1 text-red-500" />
                  <span>{recipe.calories} cal</span>
                </div>
              )}
            </div>
            {/* {recipe.averageRating > 0 && (
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{recipe.averageRating.toFixed(1)}</span>
                <span className="text-gray-400 ml-1">({recipe.totalReviews})</span>
              </div>
            )} */}
          </div>

          {(recipe.isVegetarian || recipe.isVegan || recipe.isGlutenFree) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {recipe.isVegetarian && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Vegetarian
                </span>
              )}
              {recipe.isVegan && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Vegan
                </span>
              )}
              {recipe.isGlutenFree && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Gluten-Free
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
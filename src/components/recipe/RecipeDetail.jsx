import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeApi } from '../../api/recipeApi';
import { favoriteApi } from '../../api/favoriteApi';
import { reviewApi } from '../../api/reviewApi';
import { useAuth } from '../../context/AuthContext';
import ReviewList from '../review/ReviewList';
import ReviewForm from '../review/ReviewForm';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';
import { 
  FaClock, 
  FaFire, 
  FaUsers, 
  FaStar, 
  FaEdit, 
  FaTrash, 
  FaHeart, 
  FaRegHeart,
  FaArrowLeft 
} from 'react-icons/fa';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState({});

  useEffect(() => {
    fetchRecipe();
    fetchReviews();
    checkIfFavorite();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const data = await recipeApi.getRecipeById(id);
      setRecipe(data);
    } catch (error) {
      toast.error('Failed to fetch recipe');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await reviewApi.getRecipeReviews(id, 0, 10);
      setReviews(data.content);
    } catch (error) {
      console.error('Failed to fetch reviews');
    }
  };

  const checkIfFavorite = async () => {
    if (!isAuthenticated) return;
    try {
      const result = await favoriteApi.isFavorite(id);
      setIsFavorite(result);
    } catch (error) {
      console.error('Failed to check favorite status');
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await favoriteApi.removeFavorite(id);
        toast.success('Removed from favorites');
        setIsFavorite(false);
      } else {
        await favoriteApi.addFavorite(id);
        toast.success('Added to favorites');
        setIsFavorite(true);
      }
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeApi.deleteRecipe(id);
        toast.success('Recipe deleted successfully');
        navigate('/my-recipes');
      } catch (error) {
        toast.error('Failed to delete recipe');
      }
    }
  };

  const startTimer = (minutes, stepNumber) => {
    setActiveTimer(stepNumber);
    let seconds = minutes * 60;
    
    const interval = setInterval(() => {
      seconds--;
      setTimerSeconds(prev => ({ ...prev, [stepNumber]: seconds }));
      
      if (seconds <= 0) {
        clearInterval(interval);
        setActiveTimer(null);
        setTimerSeconds(prev => {
          const newState = { ...prev };
          delete newState[stepNumber];
          return newState;
        });
        toast.success(`Step ${stepNumber} timer completed!`, {
          position: 'top-center',
          autoClose: 5000,
        });
        // Play sound if available
        if (typeof Audio !== 'undefined') {
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXxx3k1CBFgsuracUgPDFCn4/C2YxwGN5HX8sx6LQUjd8bw3o5ACRVetOnrp1UVDFKR4PC9ayQGKn')
          } catch (e) {}
        }
      }
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <Loader />;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const canEdit = user && recipe.createdById === user.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold text-gray-900 flex-1">{recipe.title}</h1>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleToggleFavorite}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              {isFavorite ? (
                <FaHeart className="text-red-500 text-2xl" />
              ) : (
                <FaRegHeart className="text-gray-600 text-2xl" />
              )}
            </button>
            {canEdit && (
              <>
                <button
                  onClick={() => navigate(`/recipes/${id}/edit`)}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {recipe.description && (
          <p className="text-gray-600 text-lg mb-4">{recipe.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-6 text-gray-600">
          {recipe.totalTime && (
            <div className="flex items-center">
              <FaClock className="mr-2 text-orange-500" />
              <span className="font-medium">{recipe.totalTime} min</span>
            </div>
          )}
          {recipe.calories && (
            <div className="flex items-center">
              <FaFire className="mr-2 text-red-500" />
              <span className="font-medium">{recipe.calories} cal</span>
            </div>
          )}
          <div className="flex items-center">
            <FaUsers className="mr-2 text-blue-500" />
            <span className="font-medium">{recipe.servings} servings</span>
          </div>
          {recipe.averageRating > 0 && (
            <div className="flex items-center">
              <FaStar className="mr-2 text-yellow-400" />
              <span className="font-medium">
                {recipe.averageRating.toFixed(1)} ({recipe.totalReviews} reviews)
              </span>
            </div>
          )}
        </div>

        {(recipe.isVegetarian || recipe.isVegan || recipe.isGlutenFree || recipe.isDairyFree) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {recipe.isVegetarian && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                🌱 Vegetarian
              </span>
            )}
            {recipe.isVegan && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                🥬 Vegan
              </span>
            )}
            {recipe.isGlutenFree && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                🌾 Gluten-Free
              </span>
            )}
            {recipe.isDairyFree && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                🥛 Dairy-Free
              </span>
            )}
          </div>
        )}
      </div>

      {/* Image */}
      {recipe.imageUrl && (
        <div className="mb-8">
          <img
            src={getImageUrl(recipe.imageUrl)}
            alt={recipe.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Ingredients */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Ingredients</h2>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={ingredient.id || index} className="flex items-start">
                    <span className="text-orange-500 mr-3 mt-1">•</span>
                    <span className="text-gray-700">
                      {ingredient.quantity && (
                        <span className="font-semibold">{ingredient.quantity} </span>
                      )}
                      {ingredient.unit && `${ingredient.unit} `}
                      <span className="font-medium">{ingredient.ingredientName}</span>
                      {ingredient.notes && (
                        <span className="text-gray-500 text-sm block ml-0">
                          ({ingredient.notes})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No ingredients listed</p>
            )}

            {/* Nutrition Info */}
            {(recipe.calories || recipe.protein || recipe.carbs || recipe.fat) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-3 text-gray-900">Nutrition Info</h3>
                <div className="text-sm text-gray-600">
                  <p className="mb-1 text-xs text-gray-500">Per serving</p>
                  <div className="space-y-2">
                    {recipe.calories && (
                      <div className="flex justify-between">
                        <span>Calories</span>
                        <span className="font-semibold text-gray-900">{recipe.calories}</span>
                      </div>
                    )}
                    {recipe.protein && (
                      <div className="flex justify-between">
                        <span>Protein</span>
                        <span className="font-semibold text-gray-900">{recipe.protein}g</span>
                      </div>
                    )}
                    {recipe.carbs && (
                      <div className="flex justify-between">
                        <span>Carbs</span>
                        <span className="font-semibold text-gray-900">{recipe.carbs}g</span>
                      </div>
                    )}
                    {recipe.fat && (
                      <div className="flex justify-between">
                        <span>Fat</span>
                        <span className="font-semibold text-gray-900">{recipe.fat}g</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Instructions</h2>
            {recipe.instructions && recipe.instructions.length > 0 ? (
              <div className="space-y-6">
                {recipe.instructions.map((instruction) => (
                  <div key={instruction.id} className="border-l-4 border-orange-500 pl-6 py-2">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-gray-900">
                        Step {instruction.stepNumber}
                      </h3>
                      {instruction.timerMinutes && (
                        <button
                          onClick={() => startTimer(instruction.timerMinutes, instruction.stepNumber)}
                          disabled={activeTimer !== null && activeTimer !== instruction.stepNumber}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTimer === instruction.stepNumber
                              ? 'bg-green-500 text-white'
                              : 'bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
                          }`}
                        >
                          <FaClock className="inline mr-2" />
                          {activeTimer === instruction.stepNumber
                            ? formatTime(timerSeconds[instruction.stepNumber] || 0)
                            : `${instruction.timerMinutes} min`}
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{instruction.instruction}</p>
                    {instruction.imageUrl && (
                      <img
                        src={getImageUrl(instruction.imageUrl)}
                        alt={`Step ${instruction.stepNumber}`}
                        className="mt-3 rounded-lg w-full max-w-md"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No instructions available</p>
            )}
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
            
            {isAuthenticated && (
              <ReviewForm recipeId={id} onReviewSubmitted={fetchReviews} />
            )}

            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-blue-800">
                  <Link to="/login" className="font-semibold underline">
                    Login
                  </Link>{' '}
                  to leave a review
                </p>
              </div>
            )}

            <ReviewList reviews={reviews} loading={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
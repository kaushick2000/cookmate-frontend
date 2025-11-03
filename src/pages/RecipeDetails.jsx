import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeApi } from '../api/recipeApi';
import { reviewApi } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import ReviewList from '../components/review/ReviewList';
import ReviewForm from '../components/review/ReviewForm';
import RecipeRecommendations from '../components/ai/RecipeRecommendations';
import IngredientSubstitutions from '../components/ai/IngredientSubstitutions';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import { FaClock, FaFire, FaUsers, FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUtils';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTimer, setActiveTimer] = useState(null);

  useEffect(() => {
    fetchRecipe();
    fetchReviews();
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
    const endTime = Date.now() + minutes * 60 * 1000;
    
    const timer = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        clearInterval(timer);
        setActiveTimer(null);
        toast.success(`Step ${stepNumber} timer completed!`);
      }
    }, 1000);
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold text-gray-900">{recipe.title}</h1>
          {canEdit && (
            <div className="flex space-x-2">
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
            </div>
          )}
        </div>

        {recipe.description && (
          <p className="text-gray-600 text-lg mb-4">{recipe.description}</p>
        )}

        <div className="flex items-center space-x-6 text-gray-600">
          {recipe.totalTime && (
            <div className="flex items-center">
              <FaClock className="mr-2 text-orange-500" />
              <span>{recipe.totalTime} min</span>
            </div>
          )}
          {recipe.calories && (
            <div className="flex items-center">
              <FaFire className="mr-2 text-red-500" />
              <span>{recipe.calories} cal</span>
            </div>
          )}
          <div className="flex items-center">
            <FaUsers className="mr-2 text-blue-500" />
            <span>{recipe.servings} servings</span>
          </div>
          {recipe.averageRating > 0 && (
            <div className="flex items-center">
              <FaStar className="mr-2 text-yellow-400" />
              <span>{recipe.averageRating.toFixed(1)} ({recipe.totalReviews} reviews)</span>
            </div>
          )}
        </div>

        {(recipe.isVegetarian || recipe.isVegan || recipe.isGlutenFree) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {recipe.isVegetarian && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Vegetarian
              </span>
            )}
            {recipe.isVegan && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Vegan
              </span>
            )}
            {recipe.isGlutenFree && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Gluten-Free
              </span>
            )}
          </div>
        )}
      </div>

      {/* Image */}
      {recipe.imageUrl && (
        <img
          src={getImageUrl(recipe.imageUrl)}
          alt={recipe.title}
          className="w-full h-96 object-cover rounded-lg shadow-lg mb-8"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Ingredients */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients?.map((ingredient) => (
                <li key={ingredient.id} className="flex flex-col items-start">
                  <div className="flex items-start w-full">
                    <span className="text-orange-500 mr-2 mt-1">•</span>
                    <span className="flex-1">
                      {ingredient.quantity && `${ingredient.quantity} `}
                      {ingredient.unit && `${ingredient.unit} `}
                      {ingredient.ingredientName}
                    </span>
                  </div>
                  <div className="ml-6 mt-1">
                    <IngredientSubstitutions 
                      ingredient={ingredient}
                      onSubstitute={(sub) => {
                        toast.success(`Substitution suggestion: Use ${sub.substitute} instead of ${sub.original}`);
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            {/* Nutrition Info */}
            {recipe.calories && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Nutrition (per serving)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Calories</span>
                    <span className="font-semibold">{recipe.calories}</span>
                  </div>
                  {recipe.protein && (
                    <div className="flex justify-between">
                      <span>Protein</span>
                      <span className="font-semibold">{recipe.protein}g</span>
                    </div>
                  )}
                  {recipe.carbs && (
                    <div className="flex justify-between">
                      <span>Carbs</span>
                      <span className="font-semibold">{recipe.carbs}g</span>
                    </div>
                  )}
                  {recipe.fat && (
                    <div className="flex justify-between">
                      <span>Fat</span>
                      <span className="font-semibold">{recipe.fat}g</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6">Instructions</h2>
            <div className="space-y-6">
              {recipe.instructions?.map((instruction) => (
                <div key={instruction.id} className="border-l-4 border-orange-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">
                      Step {instruction.stepNumber}
                    </h3>
                    {instruction.timerMinutes && (
                      <button
                        onClick={() => startTimer(instruction.timerMinutes, instruction.stepNumber)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          activeTimer === instruction.stepNumber
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <FaClock className="inline mr-1" />
                        {instruction.timerMinutes} min
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">{instruction.instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reviews</h2>
            
            {isAuthenticated && (
              <ReviewForm recipeId={id} onReviewSubmitted={fetchReviews} />
            )}

            <ReviewList reviews={reviews} loading={false} />
          </div>
        </div>
      </div>

      {/* AI-Powered Recipe Recommendations */}
      <RecipeRecommendations recipeId={id} type="personalized" />
    </div>
  );
};

export default RecipeDetails;
import { useState, useEffect } from 'react';
import { recipeApi } from '../../api/recipeApi';
import RecipeCard from '../recipe/RecipeCard';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';
import { FaMagic, FaHistory, FaHeart, FaFire } from 'react-icons/fa';

const RecipeRecommendations = ({ recipeId, type = 'personalized' }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(type);

  useEffect(() => {
    fetchRecommendations(selectedType);
  }, [selectedType, recipeId]);

  const fetchRecommendations = async (recType) => {
    setLoading(true);
    try {
      let response;
      switch (recType) {
        case 'history':
          response = await recipeApi.getRecommendationsByHistory(8);
          break;
        case 'preferences':
          response = await recipeApi.getRecommendationsByPreferences({}, 8);
          break;
        case 'trending':
          response = await recipeApi.getTrendingRecipes(8);
          break;
        case 'personalized':
        default:
          response = await recipeApi.getRecommendations('personalized', 8);
          break;
      }
      
      // If response is an array, use it directly; otherwise extract content
      const recipes = Array.isArray(response) ? response : (response.content || response || []);
      setRecommendations(recipes);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const recommendationTypes = [
    { value: 'personalized', label: 'For You', icon: FaMagic },
    { value: 'history', label: 'Based on History', icon: FaHistory },
    { value: 'preferences', label: 'Your Preferences', icon: FaHeart },
    { value: 'trending', label: 'Trending Now', icon: FaFire },
  ];

  if (loading && recommendations.length === 0) {
    return <Loader />;
  }

  if (!loading && recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaMagic className="mr-2 text-orange-500" />
          Recommended Recipes
        </h2>
        
        {/* Recommendation Type Selector */}
        <div className="flex gap-2">
          {recommendationTypes.map((recType) => {
            const Icon = recType.icon;
            return (
              <button
                key={recType.value}
                onClick={() => setSelectedType(recType.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                  selectedType === recType.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="mr-1" />
                {recType.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {!loading && recommendations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No recommendations available at the moment.
        </div>
      )}
    </div>
  );
};

export default RecipeRecommendations;


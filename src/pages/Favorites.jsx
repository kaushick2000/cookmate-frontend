import { useState, useEffect } from 'react';
import { favoriteApi } from '../api/favoriteApi';
import RecipeList from '../components/recipe/RecipeList';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const Favorites = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await favoriteApi.getUserFavorites(0, 20);
      setRecipes(response.content);
    } catch (error) {
      toast.error('Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>
      
      {recipes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No favorite recipes yet</p>
        </div>
      ) : (
        <RecipeList recipes={recipes} loading={false} onFavoriteChange={fetchFavorites} />
      )}
    </div>
  );
};

export default Favorites;
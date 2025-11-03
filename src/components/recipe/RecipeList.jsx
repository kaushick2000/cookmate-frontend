import RecipeCard from './RecipeCard';
import Loader from '../common/Loader';

const RecipeList = ({ recipes, loading, onFavoriteChange }) => {
  if (loading) {
    return <Loader />;
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No recipes found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          onFavoriteChange={onFavoriteChange}
        />
      ))}
    </div>
  );
};

export default RecipeList;
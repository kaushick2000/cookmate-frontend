import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeApi } from '../api/recipeApi';
import RecipeForm from '../components/recipe/RecipeForm';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Recipe</h1>
      <RecipeForm recipe={recipe} isEdit={true} />
    </div>
  );
};

export default EditRecipe;
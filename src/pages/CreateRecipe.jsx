import RecipeForm from '../components/recipe/RecipeForm';

const CreateRecipe = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Recipe</h1>
      <RecipeForm />
    </div>
  );
};

export default CreateRecipe;
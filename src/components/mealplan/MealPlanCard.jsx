import { format } from 'date-fns';
import { FaCalendar, FaTrash, FaEdit } from 'react-icons/fa';

const MealPlanCard = ({ mealPlan, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {mealPlan.name || 'Meal Plan'}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(mealPlan)}
            className="text-blue-500 hover:text-blue-600 p-2"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(mealPlan.id)}
            className="text-red-500 hover:text-red-600 p-2"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="flex items-center text-gray-600 mb-3">
        <FaCalendar className="mr-2" />
        <span className="text-sm">
          {format(new Date(mealPlan.startDate), 'MMM dd, yyyy')} -{' '}
          {format(new Date(mealPlan.endDate), 'MMM dd, yyyy')}
        </span>
      </div>

      <div className="border-t pt-3 mt-3">
        <p className="text-gray-600 text-sm">
          <span className="font-semibold text-gray-900">
            {mealPlan.meals?.length || 0}
          </span>{' '}
          meals planned
        </p>
      </div>

      {mealPlan.meals && mealPlan.meals.length > 0 && (
        <div className="mt-4 space-y-2">
          {mealPlan.meals.slice(0, 3).map((meal, index) => (
            <div key={index} className="text-sm text-gray-600 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              {meal.recipeTitle} - {format(new Date(meal.plannedDate), 'MMM dd')}
            </div>
          ))}
          {mealPlan.meals.length > 3 && (
            <p className="text-xs text-gray-500 ml-4">
              +{mealPlan.meals.length - 3} more meals
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MealPlanCard;
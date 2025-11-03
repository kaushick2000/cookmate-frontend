import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

const MealPlanCalendar = ({ mealPlan }) => {
  if (!mealPlan || !mealPlan.meals || mealPlan.meals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No meals planned yet
      </div>
    );
  }

  const startDate = new Date(mealPlan.startDate);
  const endDate = new Date(mealPlan.endDate);
  const days = [];
  
  let currentDate = startDate;
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  const getMealsForDay = (date) => {
    return mealPlan.meals.filter((meal) =>
      isSameDay(new Date(meal.plannedDate), date)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">Calendar View</h3>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day, index) => {
          const mealsForDay = getMealsForDay(day);
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-3 min-h-[120px]"
            >
              <div className="font-semibold text-sm mb-2">
                {format(day, 'EEE')}
                <div className="text-xs text-gray-500">
                  {format(day, 'MMM dd')}
                </div>
              </div>
              <div className="space-y-1">
                {mealsForDay.map((meal, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-orange-100 text-orange-800 rounded p-1"
                  >
                    <div className="font-medium">{meal.mealTime}</div>
                    <div className="truncate">{meal.recipeTitle}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealPlanCalendar;
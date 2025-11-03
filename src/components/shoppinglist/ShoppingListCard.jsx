import { Link } from 'react-router-dom';

const ShoppingListCard = ({ shoppingList }) => {
  const itemCount = shoppingList.items ? shoppingList.items.length : 0;
  const completedCount = shoppingList.items
    ? shoppingList.items.filter((item) => item.completed).length
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {shoppingList.name || `Shopping List ${shoppingList.id}`}
        </h3>
        <p className="text-gray-600 mb-4">
          {shoppingList.description || 'No description'}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {completedCount} / {itemCount} items completed
          </span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{
                width: `${itemCount > 0 ? (completedCount / itemCount) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>
        <Link
          to={`/shopping-lists/${shoppingList.id}`}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default ShoppingListCard;


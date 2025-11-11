import { useState, useEffect } from 'react';
import { shoppingListApi } from '../api/shoppingListApi';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa';
import Loader from '../components/common/Loader';

const ShoppingLists = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  const fetchShoppingLists = async () => {
    try {
      const response = await shoppingListApi.getUserShoppingLists(0, 20);
      setShoppingLists(response.content);
      // If we have a selected list, try to keep it selected after refresh
      if (selectedList) {
        const updatedList = response.content.find(list => list.id === selectedList.id);
        if (updatedList) {
          setSelectedList(updatedList);
        } else if (response.content.length > 0) {
          setSelectedList(response.content[0]);
        }
      } else if (response.content.length > 0) {
        setSelectedList(response.content[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch shopping lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleItem = async (itemId) => {
    try {
      await shoppingListApi.toggleItemPurchased(itemId);
      fetchShoppingLists();
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await shoppingListApi.deleteItem(itemId);
      toast.success('Item deleted');
      fetchShoppingLists();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm('Are you sure you want to delete this shopping list?')) {
      try {
        await shoppingListApi.deleteShoppingList(listId);
        toast.success('Shopping list deleted');
        setSelectedList(null);
        fetchShoppingLists();
      } catch (error) {
        toast.error('Failed to delete shopping list');
      }
    }
  };

  const handleGenerateFromMealPlans = async () => {
    setLoading(true);
    try {
      const listId = selectedList ? selectedList.id : null;
      const generatedList = await shoppingListApi.generateFromMealPlans(listId);
      toast.success('Shopping list generated from meal plans!');
      // Refresh the shopping lists to get updated item counts
      const response = await shoppingListApi.getUserShoppingLists(0, 20);
      setShoppingLists(response.content);
      // Select the generated list - find it in the refreshed list
      if (generatedList) {
        const refreshedList = response.content.find(list => list.id === generatedList.id) || generatedList;
        setSelectedList(refreshedList);
      } else if (response.content.length > 0) {
        setSelectedList(response.content[0]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate shopping list from meal plans');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Lists</h1>
        <div className="flex gap-3">
          <button
            onClick={handleGenerateFromMealPlans}
            disabled={loading}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400"
          >
            <FaPlus className="mr-2" /> Generate from Meal Plans
          </button>
          <button
            onClick={() => toast.info('Shopping list creation coming soon!')}
            className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          >
            <FaPlus className="mr-2" /> Create List
          </button>
        </div>
      </div>

      {shoppingLists.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">No shopping lists yet</p>
          <button
            onClick={() => toast.info('Shopping list creation coming soon!')}
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600"
          >
            Create Your First Shopping List
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - List of shopping lists */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="font-semibold mb-4">My Lists</h2>
              <div className="space-y-2">
                {shoppingLists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => setSelectedList(list)}
                    className={`w-full text-left p-3 rounded-md ${
                      selectedList?.id === list.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{list.name || 'Shopping List'}</div>
                    <div className="text-sm text-gray-500">
                      {list.items?.length || 0} items
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content - Selected list items */}
          <div className="lg:col-span-3">
            {selectedList ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {selectedList.name || 'Shopping List'}
                  </h2>
                  <button
                    onClick={() => handleDeleteList(selectedList.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>

                {selectedList.items && selectedList.items.length > 0 ? (
                  <div className="space-y-6">
                    {/* Group items by source recipe title */}
                    {(() => {
                      const groups = {};
                      const ungrouped = [];

                      selectedList.items.forEach((item) => {
                        // Check if item has recipe information from backend
                        if (item.sourceRecipeTitle) {
                          // Group by the recipe title provided by backend
                          const groupTitle = item.sourceRecipeTitle;
                          groups[groupTitle] = groups[groupTitle] || [];
                          groups[groupTitle].push(item);
                        } else {
                          // Items without recipe information go to ungrouped
                          ungrouped.push(item);
                        }
                      });

                      // Render grouped sections
                      const groupEntries = Object.entries(groups);

                      return (
                        <div className="space-y-4">
                          {groupEntries.map(([title, items]) => (
                            <div key={title} className="bg-gray-50 p-4 rounded-md border border-orange-200">
                              <div className="flex items-center justify-between mb-3">
                                <div className="font-semibold text-orange-700">
                                  <span className="mr-2">📖</span> {title}
                                </div>
                                <div className="text-sm text-gray-500">{items.length} ingredient{items.length !== 1 ? 's' : ''}</div>
                              </div>
                              <div className="space-y-2 bg-white p-3 rounded-md">
                                {items.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-white">
                                    <div className="flex items-center flex-1">
                                      <button
                                        onClick={() => handleToggleItem(item.id)}
                                        className={`mr-3 ${item.isPurchased ? 'text-green-500' : 'text-gray-400'}`}
                                      >
                                        <FaCheck size={18} />
                                      </button>
                                      <div className={item.isPurchased ? 'line-through text-gray-400' : ''}>
                                        <span className="font-medium">{item.ingredientName}</span>
                                        {item.quantity && (
                                          <span className="text-gray-600 ml-2">{item.quantity} {item.unit}</span>
                                        )}
                                      </div>
                                    </div>
                                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-600 ml-4">
                                      <FaTrash size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}

                          {ungrouped.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <div className="font-semibold text-gray-700">
                                  <span className="mr-2">🛒</span> Other Ingredients
                                </div>
                                <div className="text-sm text-gray-500">{ungrouped.length} ingredient{ungrouped.length !== 1 ? 's' : ''}</div>
                              </div>
                              <div className="space-y-2 bg-white p-3 rounded-md">
                                {ungrouped.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-white">
                                    <div className="flex items-center flex-1">
                                      <button
                                        onClick={() => handleToggleItem(item.id)}
                                        className={`mr-3 ${item.isPurchased ? 'text-green-500' : 'text-gray-400'}`}
                                      >
                                        <FaCheck size={18} />
                                      </button>
                                      <div className={item.isPurchased ? 'line-through text-gray-400' : ''}>
                                        <span className="font-medium">{item.ingredientName}</span>
                                        {item.quantity && (
                                          <span className="text-gray-600 ml-2">{item.quantity} {item.unit}</span>
                                        )}
                                      </div>
                                    </div>
                                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-600 ml-4">
                                      <FaTrash size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No items in this list</p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                Select a shopping list to view items
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingLists;
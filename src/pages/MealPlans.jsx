import { useState, useEffect } from 'react';
import { mealPlanApi } from '../api/mealPlanApi';
import MealPlanCard from '../components/mealplan/MealPlanCard';
import MealPlanForm from '../components/mealplan/MealPlanForm';
import MealPlanCalendar from '../components/mealplan/MealPlanCalendar';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';

const MealPlans = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    setLoading(true);
    try {
      const response = await mealPlanApi.getUserMealPlans(0, 20);
      setMealPlans(response.content);
      if (response.content.length > 0 && !selectedPlan) {
        setSelectedPlan(response.content[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch meal plans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setShowForm(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      try {
        await mealPlanApi.deleteMealPlan(id);
        toast.success('Meal plan deleted');
        if (selectedPlan?.id === id) {
          setSelectedPlan(null);
        }
        fetchMealPlans();
      } catch (error) {
        toast.error('Failed to delete meal plan');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPlan) {
        await mealPlanApi.updateMealPlan(editingPlan.id, formData);
        toast.success('Meal plan updated!');
      } else {
        await mealPlanApi.createMealPlan(formData);
        toast.success('Meal plan created!');
      }
      setShowForm(false);
      setEditingPlan(null);
      fetchMealPlans();
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Meal Plans</h1>
        <button
          onClick={handleCreate}
          className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
        >
          <FaPlus className="mr-2" /> Create Meal Plan
        </button>
      </div>

      {mealPlans.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No meal plans yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start planning your meals for the week!
          </p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600"
          >
            <FaPlus className="mr-2" />
            Create Your First Meal Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - List of meal plans */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {mealPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full text-left transition-all ${
                    selectedPlan?.id === plan.id ? '' : ''
                  }`}
                >
                  <MealPlanCard
                    mealPlan={plan}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Main content - Calendar view */}
          <div className="lg:col-span-2">
            {selectedPlan ? (
              <MealPlanCalendar mealPlan={selectedPlan} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                Select a meal plan to view details
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for Create/Edit Form */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPlan(null);
        }}
        title={editingPlan ? 'Edit Meal Plan' : 'Create Meal Plan'}
      >
        <MealPlanForm
          mealPlan={editingPlan}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPlan(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default MealPlans;
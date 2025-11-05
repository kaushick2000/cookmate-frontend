import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCamera, FaEdit, FaSave, FaTimes, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.imageUrl || null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
    preferences: {
      dietaryRestrictions: user?.preferences?.dietaryRestrictions || [],
      cuisinePreferences: user?.preferences?.cuisinePreferences || [],
      difficultyLevel: user?.preferences?.difficultyLevel || 'medium',
      mealTypes: user?.preferences?.mealTypes || []
    }
  });

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
    'Low-Carb', 'Keto', 'Paleo', 'Halal', 'Kosher'
  ];

  const cuisineOptions = [
    'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'Thai', 
    'Mediterranean', 'French', 'American', 'Greek', 'Korean', 'Spanish'
  ];

  const mealTypeOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      username: user?.username || '',
      preferences: {
        dietaryRestrictions: user?.preferences?.dietaryRestrictions || [],
        cuisinePreferences: user?.preferences?.cuisinePreferences || [],
        difficultyLevel: user?.preferences?.difficultyLevel || 'medium',
        mealTypes: user?.preferences?.mealTypes || []
      }
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayPreferenceChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: prev.preferences[category].includes(value)
          ? prev.preferences[category].filter(item => item !== value)
          : [...prev.preferences[category], value]
      }
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Here you would typically make an API call to update the profile
      // For now, we'll just update the local state
      await updateProfile(formData);
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      username: user?.username || '',
      preferences: {
        dietaryRestrictions: user?.preferences?.dietaryRestrictions || [],
        cuisinePreferences: user?.preferences?.cuisinePreferences || [],
        difficultyLevel: user?.preferences?.difficultyLevel || 'medium',
        mealTypes: user?.preferences?.mealTypes || []
      }
    });
    setImagePreview(user?.imageUrl || null);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {user?.firstName ? `${user.firstName}'s Profile` : 'My Profile'}
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          <FaEdit className="w-4 h-4" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Image and Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div 
                  className={`w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden ${
                    isEditing ? 'cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600' : ''
                  }`}
                  onClick={isEditing ? handleImageClick : undefined}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="w-16 h-16 text-gray-400" />
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity">
                      <FaCamera className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.username}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user?.firstName || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user?.lastName || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user?.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white">{user?.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Food Preferences</h4>
              
              {/* Dietary Restrictions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dietary Restrictions
                </label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleArrayPreferenceChange('dietaryRestrictions', option)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          formData.preferences.dietaryRestrictions.includes(option)
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-500'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(user?.preferences?.dietaryRestrictions || []).length > 0 ? (
                      user.preferences.dietaryRestrictions.map(restriction => (
                        <span key={restriction} className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm">
                          {restriction}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No dietary restrictions set</p>
                    )}
                  </div>
                )}
              </div>

              {/* Cuisine Preferences */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favorite Cuisines
                </label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {cuisineOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleArrayPreferenceChange('cuisinePreferences', option)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          formData.preferences.cuisinePreferences.includes(option)
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-500'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(user?.preferences?.cuisinePreferences || []).length > 0 ? (
                      user.preferences.cuisinePreferences.map(cuisine => (
                        <span key={cuisine} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                          {cuisine}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No cuisine preferences set</p>
                    )}
                  </div>
                )}
              </div>

              {/* Meal Types */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Meal Types
                </label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {mealTypeOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleArrayPreferenceChange('mealTypes', option)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          formData.preferences.mealTypes.includes(option)
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-500'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(user?.preferences?.mealTypes || []).length > 0 ? (
                      user.preferences.mealTypes.map(mealType => (
                        <span key={mealType} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                          {mealType}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No meal type preferences set</p>
                    )}
                  </div>
                )}
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Recipe Difficulty
                </label>
                {isEditing ? (
                  <select
                    name="preferences.difficultyLevel"
                    value={formData.preferences.difficultyLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="any">Any</option>
                  </select>
                ) : (
                  <p className="text-gray-900 dark:text-white capitalize">
                    {user?.preferences?.difficultyLevel || 'Medium'}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                >
                  <FaSave className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaUser, FaHeart, FaCalendar, FaShoppingCart, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { MdRestaurantMenu } from 'react-icons/md';

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MdRestaurantMenu className="text-orange-500 text-3xl" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">Cook Mate</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium"
            >
              Recipes
            </Link>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-recipes"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Recipes
                </Link>
                <Link
                  to="/favorites"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FaHeart className="mr-1" /> Favorites
                </Link>
                <Link
                  to="/meal-plans"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FaCalendar className="mr-1" /> Meal Plans
                </Link>
                <Link
                  to="/shopping-lists"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FaShoppingCart className="mr-1" /> Shopping
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FaUser className="mr-1" /> Profile
                </Link>
                <Link
                  to="/create-recipe"
                  className="bg-orange-500 dark:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-200"
                >
                  Create Recipe
                </Link>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 p-2"
                    title="Logout"
                  >
                    <FaSignOutAlt />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
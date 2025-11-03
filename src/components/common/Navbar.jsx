import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaHeart, FaCalendar, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { MdRestaurantMenu } from 'react-icons/md';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MdRestaurantMenu className="text-orange-500 text-3xl" />
              <span className="text-2xl font-bold text-gray-800">Cook Mate</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Recipes
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-recipes"
                  className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Recipes
                </Link>
                <Link
                  to="/favorites"
                  className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FaHeart className="mr-1" /> Favorites
                </Link>
                <Link
                  to="/meal-plans"
                  className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FaCalendar className="mr-1" /> Meal Plans
                </Link>
                <Link
                  to="/shopping-lists"
                  className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FaShoppingCart className="mr-1" /> Shopping
                </Link>
                <Link
                  to="/create-recipe"
                  className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600"
                >
                  Create Recipe
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 text-sm">{user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-500 p-2"
                  >
                    <FaSignOutAlt />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
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
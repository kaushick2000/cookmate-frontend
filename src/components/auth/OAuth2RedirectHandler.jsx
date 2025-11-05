import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      // Store the JWT token
      localStorage.setItem('token', token);
      
      // Set user in context (you might want to decode the JWT or make an API call)
      // For now, we'll redirect to home and let the app verify the token
      navigate('/', { replace: true });
    } else if (error) {
      // Handle OAuth2 error
      console.error('OAuth2 authentication error:', error);
      navigate('/login', { 
        replace: true, 
        state: { error: 'Social media login failed. Please try again.' }
      });
    } else {
      // No token or error, redirect to login
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Completing social media login...
        </p>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;
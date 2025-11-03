import Cookies from 'js-cookie';

export const getToken = () => {
  return Cookies.get('token');
};

export const setToken = (token) => {
  Cookies.set('token', token, { expires: 7 });
};

export const removeToken = () => {
  Cookies.remove('token');
};

export const getUser = () => {
  const userStr = Cookies.get('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const setUser = (user) => {
  Cookies.set('user', JSON.stringify(user), { expires: 7 });
};

export const removeUser = () => {
  Cookies.remove('user');
};

export const isAuthenticated = () => {
  return !!getToken();
};
// Environment-specific configuration
export const config = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
};
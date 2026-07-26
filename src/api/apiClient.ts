import axios from 'axios';
import { tokenStorage } from './tokenStorage';

const clearAuthState = () => {
  tokenStorage.removeItem('token');
  tokenStorage.removeItem('user');
  if (typeof window !== 'undefined') {
    window.sessionStorage.clear();
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
  }
};

const handleApiError = (error: any) => {
  if (typeof window !== 'undefined') {
    console.error('API Error:', error);
    alert('An error occurred while communicating with the server.');
  }
};

const apiClient = axios.create({
  baseURL: '/api-bank',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = tokenStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (like 401 unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 403) {
        handleApiError(error);
        return Promise.reject(error);
      }
      if (error.response.status === 401) {
        // Only redirect if we are not already on the login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          clearAuthState();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

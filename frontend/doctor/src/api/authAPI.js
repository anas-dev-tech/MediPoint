import axios from 'axios';
import { refreshToken, logout } from '../services/authService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const authAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Ensures cookies are sent with requests
});

// Request Interceptor: Attach access token if available
authAPI.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token refresh on 401 errors
authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If request was unauthorized (401) and hasn't been retried, try refreshing token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken(); // Try refreshing the token
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return authAPI(originalRequest); // Retry the failed request with the new token
        }
      } catch (err) {
        logout(); // If refresh token is invalid, log out the user
        toast.error("Session expired. Please log in again.");
        useNavigate('/login')
        return Promise.reject(err);
      }
    }

    // // Handle other errors
    // if (error.response?.status === 400) {
    //   toast.error(error?.response?.data?.detail || "Invalid request.");
    // } else if (error.response?.status === 500) {
    //   toast.error("Server error. Please try again later.");
    // }

    return Promise.reject(error);
  }
);

export default authAPI;

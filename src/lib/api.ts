/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';

// Support VITE_API_URL or default to same-origin relative paths for API endpoints
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('transitops_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Intercept 401 errors and redirect to login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user details on authentication failures
      localStorage.removeItem('transitops_token');
      localStorage.removeItem('transitops_user');
      
      // Redirect to login page if we aren't already there
      if (window.location.pathname !== '/login') {
        window.location.pathname = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

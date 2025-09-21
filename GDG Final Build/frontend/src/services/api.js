import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const loginUser = (name, grade) => {
  return api.post('/login', { name, grade });
};

export const getDashboardData = (name) => {
  return api.get(`/get-dashboard-data?name=${encodeURIComponent(name)}`);
};

export const getTasks = (grade) => {
  return api.get(`/get-tasks?grade=${grade}`);
};

export const saveAnswers = (name, answers) => {
  return api.post('/save-answers', { name, answers });
};

export const analyzeAnswers = (name) => {
  return api.post('/analyze', { name });
};

export default api;
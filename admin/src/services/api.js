import axios from 'axios';
export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '').replace(/\/$/, ''),
  withCredentials: true,
  timeout: 20000,
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = new Error(
      error.response?.data?.message ||
        (error.code === 'ECONNABORTED' ? 'The request timed out.' : 'Unable to reach the server.'),
    );
    normalized.status = error.response?.status;
    normalized.errors = error.response?.data?.errors || {};
    return Promise.reject(normalized);
  },
);

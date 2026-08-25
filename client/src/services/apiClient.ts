import axios, { AxiosInstance, AxiosError } from 'axios';
import { DEFAULT_TIMEOUT } from '../constants/api';
import { STORAGE_KEYS } from '../constants/storage';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const storedAuth = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed?.state?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.token}`;
        }
      }
    } catch {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Standardize error messaging
    const message = (error.response?.data as { message?: string })?.message || error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
    return Promise.reject(new Error(message));
  }
);

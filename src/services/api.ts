import { useAuthStore } from '@/store/authstore';
import axios from 'axios';

export const api = axios.create({
  
 
  baseURL: 'http://localhost:3000',
  timeout: 90000, 
});

const publicAuthEndpoints = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/check-cpf',
]);

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token?.trim();
  const endpoint = config.url?.split('?')[0];

  if (token && !publicAuthEndpoints.has(endpoint ?? '')) {
    const normalizedToken = token.replace(/^Bearer\s+/i, '');
    config.headers.set('Authorization', `Bearer ${normalizedToken}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !publicAuthEndpoints.has(error.config?.url?.split('?')[0] ?? '')
    ) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);
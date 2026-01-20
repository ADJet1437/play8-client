import axios from 'axios';
import { Booking, DeleteResponse, Machine, PagedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
});

// Add request interceptor to include token if available
api.interceptors.request.use(
  (config) => {
    // Token is sent via cookie, so we don't need to add it manually
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401/403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401/403 errors are expected when not authenticated
    // Don't log them as errors, just pass them through
    if (error.response?.status === 401 || error.response?.status === 403) {
      // These are handled by the calling code
    }
    return Promise.reject(error);
  }
);

// Booking API
export const bookingApi = {
  list: async (limit = 100, offset = 0): Promise<PagedResponse<Booking>> => {
    const response = await api.get<PagedResponse<Booking>>('/bookings', {
      params: { limit, offset },
    });
    return response.data;
  },
  
  get: async (id: string): Promise<Booking> => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },
  
  create: async (booking: Omit<Booking, 'id' | 'user_id'>): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', booking);
    return response.data;
  },
  
  update: async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    const response = await api.put<Booking>(`/bookings/${id}`, booking);
    return response.data;
  },
  
  delete: async (id: string): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(`/bookings/${id}`);
    return response.data;
  },
};

// Machine API
export const machineApi = {
  list: async (limit = 100, offset = 0): Promise<PagedResponse<Machine>> => {
    const response = await api.get<PagedResponse<Machine>>('/machines', {
      params: { limit, offset },
    });
    return response.data;
  },
  
  get: async (id: string): Promise<Machine> => {
    const response = await api.get<Machine>(`/machines/${id}`);
    return response.data;
  },
  
  create: async (machine: Omit<Machine, 'id'>): Promise<Machine> => {
    const response = await api.post<Machine>('/machines', machine);
    return response.data;
  },
  
  update: async (id: string, machine: Partial<Machine>): Promise<Machine> => {
    const response = await api.put<Machine>(`/machines/${id}`, machine);
    return response.data;
  },
  
  delete: async (id: string): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(`/machines/${id}`);
    return response.data;
  },
};

// Auth API
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export const authApi = {
  getGoogleAuthUrl: async (): Promise<{ auth_url: string }> => {
    const response = await api.get<{ auth_url: string }>('/auth/google');
    return response.data;
  },
  
  handleGoogleCallback: async (code: string): Promise<Token> => {
    const response = await api.post<Token>('/auth/google/callback', { code });
    return response.data;
  },
  
  getCurrentUser: async (): Promise<{ user: User | null }> => {
    const response = await api.get<{ user: User | null }>('/auth/me');
    return response.data;
  },
  
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response.data;
  },
};
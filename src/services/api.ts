import axios from 'axios';
import { Booking, DeleteResponse, Machine, PagedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

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
  
  create: async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
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
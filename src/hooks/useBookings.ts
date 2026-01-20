import { useState, useEffect } from 'react';
import { bookingApi } from '../services/api';
import { Booking, PagedResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useBookings(limit = 100, initialOffset = 0) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<PagedResponse<Booking> | null>(null);
  const [offset, setOffset] = useState(initialOffset);

  useEffect(() => {
    // Don't fetch bookings if not authenticated or auth is still loading
    if (!isAuthenticated || authLoading) {
      setBookings([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingApi.list(limit, offset);
        setBookings(data.data);
        setResponse(data);
        setError(null);
      } catch (err: any) {
        // Handle 401/403 errors gracefully (user might have logged out)
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setBookings([]);
          setError(null);
        } else {
          setError(err instanceof Error ? err : new Error('Failed to fetch bookings'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [limit, offset, isAuthenticated, authLoading]);

  const createBooking = async (booking: Omit<Booking, 'id'>) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to create a booking');
    }
    try {
      setLoading(true);
      const newBooking = await bookingApi.create(booking);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create booking'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, booking: Partial<Booking>) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to update a booking');
    }
    try {
      setLoading(true);
      const updatedBooking = await bookingApi.update(id, booking);
      setBookings(prev => 
        prev.map(b => b.id === id ? updatedBooking : b)
      );
      return updatedBooking;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update booking'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to delete a booking');
    }
    try {
      setLoading(true);
      await bookingApi.delete(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete booking'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (response && response.data.length === limit) {
      setOffset(prev => prev + limit);
    }
  };

  const prevPage = () => {
    setOffset(prev => Math.max(0, prev - limit));
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBooking,
    deleteBooking,
    pagination: {
      total: response?.total || 0,
      limit,
      offset,
      nextPage,
      prevPage,
      hasNext: response ? response.data.length === limit : false,
      hasPrev: offset > 0,
    },
  };
}
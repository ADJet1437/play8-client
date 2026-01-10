import { useState, useEffect } from 'react';
import { bookingApi } from '../services/api';
import { Booking, PagedResponse } from '../types';

export function useBookings(limit = 100, initialOffset = 0) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<PagedResponse<Booking> | null>(null);
  const [offset, setOffset] = useState(initialOffset);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingApi.list(limit, offset);
        setBookings(data.data);
        setResponse(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch bookings'));
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [limit, offset]);

  const createBooking = async (booking: Omit<Booking, 'id'>) => {
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
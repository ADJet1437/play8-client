import { useState } from 'react';
import { BookingForm } from './BookingForm';
import { BookingList } from './BookingList';
import { useBookings } from '../hooks/useBookings';
import { useMachines } from '../hooks/useMachines';
import { Booking } from '../types';

export function Hero() {
  const { bookings, loading, error, createBooking, updateBooking } = useBookings();
  const { machines } = useMachines();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreateBooking = async (booking: Omit<Booking, 'id' | 'user_id'>) => {
    setIsSubmitting(true);
    try {
      await createBooking(booking as Omit<Booking, 'id'>);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEndBooking = async (id: string) => {
    setIsSubmitting(true);
    try {
      await updateBooking(id, {
        status: 'completed',
        end_time: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div id="booking" className="bg-gradient-to-br from-indigo-50 to-blue-100 py-16 md:py-24 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-200 rounded-full opacity-50"></div>
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
      
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
          alt="Tennis player practicing with ball machine" 
          className="w-full h-full object-cover opacity-80"
        />
      </div>
      
      {/* Dimmed overlay to make form stand out - lighter overlay to show more color */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-blue-100/40 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 max-w-4xl mx-auto">
            <p>Error loading bookings: {error.message}</p>
            <p className="text-sm mt-1">Please try refreshing the page.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <BookingForm 
            onSubmit={handleCreateBooking} 
            isLoading={isSubmitting || loading} 
          />
          
          <BookingList 
            bookings={bookings} 
            machines={machines}
            onEndBooking={handleEndBooking}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
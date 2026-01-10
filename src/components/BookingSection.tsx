import { useState } from 'react';
import { BookingForm } from './BookingForm';
import { BookingList } from './BookingList';
import { useBookings } from '../hooks/useBookings';
import { useMachines } from '../hooks/useMachines';
import { Booking } from '../types';

export function BookingSection() {
  const { bookings, loading, error, createBooking, updateBooking } = useBookings();
  const { machines } = useMachines();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreateBooking = async (booking: Omit<Booking, 'id'>) => {
    setIsSubmitting(true);
    try {
      await createBooking(booking);
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
    <section id="booking" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Book Your Tennis Ball Machine
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a machine and time slot to start your practice session. 
            Available machines are shown below.
          </p>
        </div>
        
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
    </section>
  );
}


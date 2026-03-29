import { useState } from 'react';
import { BookingForm } from './BookingForm';
import { BookingList } from './BookingList';
import { BookingHistory } from './BookingHistory';
import { useBookings } from '../hooks/useBookings';
import { useMachines } from '../hooks/useMachines';
import { Booking } from '../types';

export function BookingPage() {
  const { bookings, error, addBooking, refundBooking } = useBookings();
  const { machines } = useMachines();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBookingCreated = (booking: Booking) => {
    addBooking(booking);
    setRefreshKey((k) => k + 1);
  };

  const handleRefundBooking = async (id: string) => {
    setIsSubmitting(true);
    try {
      await refundBooking(id);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          <p>Error loading bookings: {error.message}</p>
          <p>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
        Tennis Ball Machine Booking
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <BookingForm onBookingCreated={handleBookingCreated} />

        <BookingList machines={machines} refreshKey={refreshKey} />
      </div>

      <div className="mt-12">
        <BookingHistory
          bookings={bookings}
          machines={machines}
          onRefund={handleRefundBooking}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}

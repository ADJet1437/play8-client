import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookingForm } from './BookingForm';
import { BookingList } from './BookingList';
import { useBookings } from '../hooks/useBookings';
import { useMachines } from '../hooks/useMachines';
import { Booking } from '../types';

export function Hero() {
  const { t } = useTranslation('home');
  const { error, addBooking } = useBookings();
  const { machines } = useMachines();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBookingCreated = (booking: Booking) => {
    addBooking(booking);
    setRefreshKey((k) => k + 1);
  };
  
  return (
    <div id="booking" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/booking-bg.jpg"
          alt="Booking background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
            {t('booking.heading')}
          </h2>
          <p className="text-base md:text-lg text-white/80">
            {t('booking.subtitle')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-md mb-6 max-w-4xl mx-auto border border-red-200 dark:border-red-800">
            <p>Error loading bookings: {error.message}</p>
            <p className="text-sm mt-1">Please try refreshing the page.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <BookingForm onBookingCreated={handleBookingCreated} />

          <BookingList machines={machines} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
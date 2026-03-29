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
    <div id="booking" className="bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/80 dark:to-blue-800/80 py-16 md:py-24 relative overflow-hidden transition-colors">
      {/* Decorative circles */}
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-200 dark:bg-indigo-700 rounded-full opacity-50 dark:opacity-40 pointer-events-none"></div>
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 dark:bg-blue-700 rounded-full opacity-50 dark:opacity-40 pointer-events-none"></div>

      {/* Background image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
          alt="Tennis player practicing with ball machine"
          className="w-full h-full object-cover opacity-80 dark:opacity-40"
        />
      </div>
      
      {/* Dimmed overlay to make form stand out - lighter overlay to show more color */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-blue-100/40 dark:from-indigo-900/50 dark:to-blue-800/50 z-0 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('booking.heading')}
          </h2>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300">
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
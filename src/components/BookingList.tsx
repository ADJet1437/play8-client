import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { Booking, Machine } from '../types';
import { Button } from './Button';

interface BookingListProps {
  bookings: Booking[];
  machines: Machine[];
  onEndBooking: (id: string) => Promise<void>;
  isLoading: boolean;
}

export function BookingList({ bookings, machines, onEndBooking, isLoading }: BookingListProps) {
  const { t } = useTranslation('booking');
  // Filter active bookings
  const activeBookings = bookings.filter(booking => booking.status === 'active');
  
  // Get machine name by id
  const getMachineName = (machineId: string) => {
    const machine = machines.find(m => m.id === machineId);
    return machine ? machine.name : t('history.unknownMachine');
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  if (activeBookings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('activeBookings.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t('activeBookings.noActiveBookings')}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('activeBookings.title')}</h2>
      
      <div className="space-y-4">
        {activeBookings.map((booking) => (
          <div 
            key={booking.id} 
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div className="mb-4 md:mb-0">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                {getMachineName(booking.machine_id)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('activeBookings.started')}: {formatDate(booking.start_time)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('activeBookings.status')}: <span className="text-green-600 dark:text-green-400 font-medium">{t('activeBookings.active')}</span>
              </p>
            </div>
            
            <Button
              variant="danger"
              size="sm"
              onClick={() => booking.id && onEndBooking(booking.id)}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {t('activeBookings.endSession')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
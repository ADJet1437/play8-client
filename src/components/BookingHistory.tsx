import { useTranslation } from 'react-i18next';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { Booking, Machine } from '../types';

interface BookingHistoryProps {
  bookings: Booking[];
  machines: Machine[];
}

export function BookingHistory({ bookings, machines }: BookingHistoryProps) {
  // Filter completed bookings
  const completedBookings = bookings.filter(booking => 
    booking.status === 'completed' && booking.end_time
  ).sort((a, b) => {
    // Sort by start time, most recent first
    return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
  });
  
  const { t } = useTranslation(['booking', 'common']);
  
  // Get machine name by id
  const getMachineName = (machineId: string) => {
    const machine = machines.find(m => m.id === machineId);
    return machine ? machine.name : t('booking:history.unknownMachine');
  };
  
  // Calculate session duration
  const calculateDuration = (startTime: string, endTime: string) => {
    try {
      const start = parseISO(startTime);
      const end = parseISO(endTime);
      const minutes = differenceInMinutes(end, start);
      
      if (minutes < 60) {
        return `${minutes} ${t('common:minutes')}`;
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        const hoursText = hours === 1 ? t('common:hour') : t('common:hours');
        const minsText = remainingMinutes > 0 ? ` ${remainingMinutes} ${t('common:min')}` : '';
        return `${hours} ${hoursText}${minsText}`;
      }
    } catch (error) {
      return t('booking:history.unknownDuration');
    }
  };
  
  if (completedBookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('booking:history.title')}</h2>
        <p className="text-gray-600">{t('booking:history.noBookings')}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('booking:history.title')}</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('booking:history.machine')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('booking:history.date')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('booking:history.startTime')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('booking:history.endTime')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('booking:history.duration')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {completedBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getMachineName(booking.machine_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(parseISO(booking.start_time), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(parseISO(booking.start_time), 'h:mm a')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.end_time ? format(parseISO(booking.end_time), 'h:mm a') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.end_time ? calculateDuration(booking.start_time, booking.end_time) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
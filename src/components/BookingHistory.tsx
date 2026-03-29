import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, parseISO, differenceInMinutes, differenceInHours } from 'date-fns';
import { Booking, Machine } from '../types';
import { Button } from './Button';

interface BookingHistoryProps {
  bookings: Booking[];
  machines: Machine[];
  onRefund: (id: string) => Promise<void>;
  isLoading: boolean;
}

export function BookingHistory({ bookings, machines, onRefund, isLoading }: BookingHistoryProps) {
  const { t } = useTranslation(['booking', 'common']);
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundError, setRefundError] = useState<string | null>(null);

  const historyBookings = bookings
    .filter((b) => ['completed', 'cancelled'].includes(b.status) || b.payment_status != null)
    .filter((b) => b.status !== 'pending') // hide pending (awaiting payment)
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  const getMachineName = (machineId: string) => {
    const machine = machines.find((m) => m.id === machineId);
    return machine ? machine.name : t('booking:history.unknownMachine');
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    try {
      const start = parseISO(startTime);
      const end = parseISO(endTime);
      const minutes = differenceInMinutes(end, start);
      if (minutes < 60) return `${minutes} ${t('common:minutes')}`;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      const hoursText = hours === 1 ? t('common:hour') : t('common:hours');
      const minsText = remainingMinutes > 0 ? ` ${remainingMinutes} ${t('common:min')}` : '';
      return `${hours} ${hoursText}${minsText}`;
    } catch {
      return t('booking:history.unknownDuration');
    }
  };

  const canRefund = (booking: Booking) => {
    if (booking.payment_status !== 'paid') return false;
    if (booking.status === 'cancelled') return false;
    try {
      const start = parseISO(booking.start_time);
      return differenceInHours(start, new Date()) >= 24;
    } catch {
      return false;
    }
  };

  const handleRefund = async (id: string) => {
    setRefundingId(id);
    setRefundError(null);
    try {
      await onRefund(id);
    } catch (err: any) {
      setRefundError(err?.response?.data?.detail ?? 'Refund failed. Please try again.');
    } finally {
      setRefundingId(null);
    }
  };

  const paymentBadge = (booking: Booking) => {
    const s = booking.payment_status;
    if (s === 'paid') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          Paid {booking.amount_paid != null ? `${(booking.amount_paid / 100).toFixed(0)} SEK` : ''}
        </span>
      );
    }
    if (s === 'refunded') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
          Refunded
        </span>
      );
    }
    if (s === 'unpaid') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          Unpaid
        </span>
      );
    }
    return null;
  };

  if (historyBookings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {t('booking:history.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{t('booking:history.noBookings')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        {t('booking:history.title')}
      </h2>

      {refundError && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 border border-red-200 dark:border-red-800 text-sm">
          {refundError}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('booking:history.machine')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('booking:history.date')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('booking:history.startTime')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('booking:history.endTime')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('booking:history.duration')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" />
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {historyBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {getMachineName(booking.machine_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {format(parseISO(booking.start_time), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {format(parseISO(booking.start_time), 'h:mm a')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {booking.end_time ? format(parseISO(booking.end_time), 'h:mm a') : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {booking.end_time ? calculateDuration(booking.start_time, booking.end_time) : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {paymentBadge(booking)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {canRefund(booking) && booking.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefund(booking.id!)}
                      isLoading={refundingId === booking.id}
                      disabled={isLoading || refundingId !== null}
                    >
                      Refund
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

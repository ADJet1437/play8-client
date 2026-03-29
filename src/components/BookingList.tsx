import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { bookingApi } from '../services/api';
import { Booking, Machine } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface BookingListProps {
  machines: Machine[];
  refreshKey?: number;
}

function BookingCard({ booking, machineName }: { booking: Booking; machineName: string }) {
  const { t } = useTranslation('booking');

  const formatDate = (s: string) => {
    try { return format(parseISO(s), 'MMM d, yyyy h:mm a'); }
    catch { return 'Invalid date'; }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="font-medium text-gray-800 dark:text-gray-200">{machineName}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {t('activeBookings.started')}: {formatDate(booking.start_time)}
      </p>
      {booking.end_time && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('history.endTime')}: {formatDate(booking.end_time)}
        </p>
      )}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {t('activeBookings.status')}:{' '}
        <span className="text-green-600 dark:text-green-400 font-medium">
          {t('activeBookings.active')}
        </span>
      </p>
    </div>
  );
}

function AllBookingsModal({
  bookings,
  machines,
  onClose,
}: {
  bookings: Booking[];
  machines: Machine[];
  onClose: () => void;
}) {
  const { t } = useTranslation('booking');

  const getMachineName = (id: string) =>
    machines.find(m => m.id === id)?.name ?? t('history.unknownMachine');

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 dark:bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('activeBookings.title')}
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({bookings.length})
            </span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-4 space-y-3">
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} machineName={getMachineName(b.machine_id)} />
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function BookingList({ machines, refreshKey = 0 }: BookingListProps) {
  const { t } = useTranslation('booking');
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { setBookings([]); return; }

    let cancelled = false;
    setLoading(true);

    bookingApi.list(100, 0, 'confirmed,active')
      .then((data) => { if (!cancelled) setBookings(data.data); })
      .catch(() => { if (!cancelled) setBookings([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [isAuthenticated, refreshKey]);

  const getMachineName = (id: string) =>
    machines.find(m => m.id === id)?.name ?? t('history.unknownMachine');

  const visible = bookings.slice(0, 2);
  const overflow = bookings.length - 2;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {t('activeBookings.title')}
        </h2>
        <p className="text-gray-400 dark:text-gray-500 text-sm">Loading…</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {t('activeBookings.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{t('activeBookings.noActiveBookings')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          {t('activeBookings.title')}
        </h2>

        <div className="space-y-4">
          {visible.map((b) => (
            <BookingCard key={b.id} booking={b} machineName={getMachineName(b.machine_id)} />
          ))}
        </div>

        {overflow > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-4 w-full text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium py-2 rounded-lg border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            +{overflow} more — view all {bookings.length} bookings
          </button>
        )}
      </div>

      {showAll && (
        <AllBookingsModal
          bookings={bookings}
          machines={machines}
          onClose={() => setShowAll(false)}
        />
      )}
    </>
  );
}

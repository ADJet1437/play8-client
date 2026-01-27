import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Button } from './Button';
import { useMachines } from '../hooks/useMachines';
import { Booking } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';

interface BookingFormProps {
  onSubmit: (booking: Omit<Booking, 'id' | 'user_id'>) => Promise<void>;
  isLoading: boolean;
}

export function BookingForm({ onSubmit, isLoading }: BookingFormProps) {
  const { t } = useTranslation('booking');
  const { machines, loading: loadingMachines } = useMachines();
  const { isAuthenticated } = useAuth();
  const [machineId, setMachineId] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store current location for redirect after login
      const currentUrl = window.location.pathname + window.location.hash;
      setShowLoginModal(true);
      // Store the return URL in case user closes modal and logs in from navbar
      sessionStorage.setItem('oauth_return_url', currentUrl);
      return;
    }
    
    if (!machineId) {
      setFormError(t('pleaseSelectMachine'));
      return;
    }
    
    if (!startTime) {
      setFormError(t('pleaseSelectStartTime'));
      return;
    }
    
    try {
      await onSubmit({
        machine_id: machineId,
        start_time: new Date(startTime).toISOString(),
        status: 'active',
      });
      
      // Reset form
      setMachineId('');
      setStartTime('');
    } catch (error) {
      setFormError(t('failedToCreate'));
    }
  };
  
  // Get current date and time for min datetime value
  const now = new Date();
  const minDateTime = format(now, "yyyy-MM-dd'T'HH:mm");
  
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('title')}</h2>
        
        {formError && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 border border-red-200 dark:border-red-800">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="machine" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('selectMachine')}
            </label>
            <select
              id="machine"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              disabled={loadingMachines || isLoading}
              required
            >
              <option value="">{t('selectMachinePlaceholder')}</option>
              {machines.map((machine) => (
                <option key={machine.id} value={machine.id}>
                  {machine.name} - {machine.location}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('startTime')}
            </label>
            <input
              type="datetime-local"
              id="startTime"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              min={minDateTime}
              disabled={isLoading}
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('endSessionNote')}
            </p>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={loadingMachines || isLoading}
          >
            {t('bookNow')}
          </Button>
        </div>
      </form>
    </div>
    
    <LoginModal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      onLoginSuccess={() => {
        setShowLoginModal(false);
        // Retry form submission after login
        const form = document.querySelector('form');
        if (form) {
          form.requestSubmit();
        }
      }}
    />
    </>
  );
}
import { FormEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from './Button';
import { useMachines } from '../hooks/useMachines';
import { Booking, Machine } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';
import { paymentApi } from '../services/api';
import { PaymentForm } from './PaymentForm';
import { SlotPicker } from './SlotPicker';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

interface MachineSelectProps {
  machines: Machine[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  placeholder: string;
}

function MachineSelect({ machines, value, onChange, disabled, placeholder }: MachineSelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const selected = machines.find(m => m.id === value);

  const openDropdown = () => {
    if (disabled) return;
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
    setOpen(true);
  };

  // Close on scroll or resize so the dropdown doesn't drift
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDropdown}
        disabled={disabled}
        className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400' :
          'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:border-indigo-400 cursor-pointer'}`}
      >
        <span className={selected ? '' : 'text-gray-400 dark:text-gray-500'}>
          {selected ? `${selected.name} — ${selected.location}` : placeholder}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && createPortal(
        <>
          {/* invisible backdrop to catch outside clicks */}
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <ul
            style={dropdownStyle}
            className="rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
          >
            {machines.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-3 text-sm transition-colors
                    ${m.id === value
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  onClick={() => { onChange(m.id ?? ''); setOpen(false); }}
                >
                  <span className="font-medium">{m.name}</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">— {m.location}</span>
                </button>
              </li>
            ))}
          </ul>
        </>,
        document.body
      )}
    </>
  );
}

interface BookingFormProps {
  onBookingCreated: (booking: Booking) => void;
}

type Step = 'details' | 'payment' | 'success';

export function BookingForm({ onBookingCreated }: BookingFormProps) {
  const { t } = useTranslation('booking');
  const { machines, loading: loadingMachines } = useMachines();
  const { isAuthenticated } = useAuth();

  const [machineId, setMachineId] = useState('');
  const [startISO, setStartISO] = useState<string | null>(null);
  const [endISO, setEndISO] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState<Step>('details');
  const [clientSecret, setClientSecret] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [amountSek, setAmountSek] = useState(0);

  const handleSelectionChange = (start: string | null, end: string | null) => {
    setStartISO(start);
    setEndISO(end);
    setFormError(null);
  };

  const handleDetailsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isAuthenticated) {
      const currentUrl = window.location.pathname + window.location.hash;
      sessionStorage.setItem('oauth_return_url', currentUrl);
      setShowLoginModal(true);
      return;
    }

    if (!machineId) {
      setFormError(t('pleaseSelectMachine'));
      return;
    }
    if (!startISO || !endISO) {
      setFormError('Please select at least one time slot.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await paymentApi.createIntent({
        machine_id: machineId,
        start_time: startISO,
        end_time: endISO,
      });
      setClientSecret(result.client_secret);
      setBookingId(result.booking_id);
      setAmountSek(result.amount_sek);
      setStep('payment');
    } catch (err: any) {
      setFormError(err?.response?.data?.detail ?? 'Failed to initiate booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Confirm booking in DB immediately (don't wait for webhook)
      const confirmedBooking = await paymentApi.verify(paymentIntentId);
      onBookingCreated(confirmedBooking);
    } catch {
      // Fallback: add optimistic booking so UI updates even if verify fails
      onBookingCreated({
        id: bookingId,
        machine_id: machineId,
        start_time: startISO!,
        end_time: endISO!,
        status: 'confirmed',
        payment_status: 'paid',
        amount_paid: Math.round(amountSek * 100),
      });
    }
    setStep('success');
  };

  const handleReset = () => {
    setMachineId('');
    setStartISO(null);
    setEndISO(null);
    setFormError(null);
    setClientSecret('');
    setBookingId('');
    setAmountSek(0);
    setStep('details');
  };

  if (step === 'success') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
        <div className="text-center py-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your payment of {amountSek.toFixed(0)} SEK was successful. Your session is confirmed.
          </p>
          <Button variant="primary" onClick={handleReset}>
            Book Another Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('title')}</h2>

        {formError && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 border border-red-200 dark:border-red-800">
            {formError}
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="space-y-5">
            {/* Machine selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('selectMachine')}
              </label>
              <MachineSelect
                machines={machines}
                value={machineId}
                onChange={(id) => { setMachineId(id); setStartISO(null); setEndISO(null); }}
                disabled={loadingMachines || isSubmitting}
                placeholder={t('selectMachinePlaceholder')}
              />
            </div>

            {/* Slot picker (shown once a machine is selected) */}
            {machineId && (
              <SlotPicker
                machineId={machineId}
                onSelectionChange={handleSelectionChange}
              />
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              disabled={loadingMachines || isSubmitting || !machineId || !startISO}
            >
              Continue to Payment
            </Button>
          </form>
        )}

        {step === 'payment' && clientSecret && (
          <Elements stripe={stripePromise}>
            <PaymentForm
              clientSecret={clientSecret}
              amountSek={amountSek}
              onSuccess={handlePaymentSuccess}
              onCancel={handleReset}
            />
          </Elements>
        )}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          const form = document.querySelector('form');
          if (form) form.requestSubmit();
        }}
      />
    </>
  );
}

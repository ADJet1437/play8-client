import { FormEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { Booking, Machine } from '../types';
import { waitingListApi } from '../services/api';
import { cn } from '../lib/utils';


type BookingTab = 'book' | 'rent';
type RentalPlan = 'week' | 'month';
type RentalStep = 'select' | 'email' | 'success';

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
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <ul style={dropdownStyle} className="rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
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



const RENTAL_PLANS: { id: RentalPlan; weeks?: number; months?: number; price: number; label: string; sublabel: string }[] = [
  { id: 'week', label: '1 Week', sublabel: '499 kr', price: 499 },
  { id: 'month', label: '1 Month', sublabel: '1 999 kr', price: 1999 },
];

export function BookingForm({ onBookingCreated: _onBookingCreated }: BookingFormProps) {
  const { t } = useTranslation('booking');

  // Tab
  const [activeTab, setActiveTab] = useState<BookingTab>('rent');

  // Rental state
  const [selectedPlan, setSelectedPlan] = useState<RentalPlan | null>(null);
  const [rentalStep, setRentalStep] = useState<RentalStep>('select');
  const [rentalEmail, setRentalEmail] = useState('');
  const [rentalMessage, setRentalMessage] = useState('');
  const [rentalError, setRentalError] = useState('');
  const [rentalLoading, setRentalLoading] = useState(false);

  // ── Rental handlers ──────────────────────────────────────────────────────

  const handleJoinClick = () => {
    setRentalError('');
    setRentalStep('email');
  };

  const handleRentalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRentalError('');
    if (!rentalEmail) { setRentalError(t('emailRequired')); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rentalEmail)) { setRentalError(t('emailInvalid')); return; }
    if (!selectedPlan) return;

    setRentalLoading(true);
    try {
      await waitingListApi.join(rentalEmail, selectedPlan, rentalMessage || undefined);
      setRentalStep('success');
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? '';
      setRentalError(detail.includes('already on the list') ? "You're already on the list for this plan." : 'Something went wrong. Please try again.');
    } finally {
      setRentalLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">

        {/* ── Tabs ── */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('rent')}
            className={cn(
              'pb-3 px-1 mr-6 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'rent'
                ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent',
            )}
          >
            {t('tabRent')}
          </button>
          <button
            onClick={() => setActiveTab('book')}
            className={cn(
              'pb-3 px-1 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'book'
                ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent',
            )}
          >
            {t('tabBook')}
          </button>
        </div>

        {/* ── Book a Machine (greyed out) ── */}
        {activeTab === 'book' && (
          <div className="opacity-50 pointer-events-none select-none">
            <div className="mb-5">
              <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">
                {t('comingSoon')}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{t('bookComingSoonNote')}</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('selectMachine')}</label>
                <MachineSelect machines={[]} value="" onChange={() => {}} disabled placeholder={t('selectMachinePlaceholder')} />
              </div>
              <button
                disabled
                className="w-full h-10 px-4 rounded-md bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm font-medium cursor-not-allowed"
              >
                {t('continueToPayment')}
              </button>
            </div>
          </div>
        )}

        {/* ── Rent a Machine ── */}
        {activeTab === 'rent' && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{t('rentSubtitle')}</p>

            {/* Plan cards */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {RENTAL_PLANS.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => { setSelectedPlan(plan.id); setRentalStep('select'); setRentalError(''); }}
                  className={cn(
                    'rounded-lg border-2 p-4 text-left transition-all',
                    selectedPlan === plan.id
                      ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600',
                  )}
                >
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{plan.label}</p>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{plan.sublabel}</p>
                </button>
              ))}
            </div>

            {/* Email step */}
            {rentalStep === 'select' && (
              <Button
                variant="primary"
                fullWidth
                disabled={!selectedPlan}
                onClick={handleJoinClick}
              >
                {t('joinWaitingList')}
              </Button>
            )}

            {rentalStep === 'email' && (
              <form onSubmit={handleRentalSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('yourEmail')}</label>
                  <input
                    type="email"
                    value={rentalEmail}
                    onChange={(e) => setRentalEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {rentalError && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{rentalError}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('message')} <span className="text-gray-400 dark:text-gray-500 font-normal">({t('optional')})</span>
                  </label>
                  <textarea
                    value={rentalMessage}
                    onChange={(e) => setRentalMessage(e.target.value)}
                    placeholder={t('messagePlaceholder')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" fullWidth isLoading={rentalLoading}>
                    {t('confirm')}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => { setRentalStep('select'); setRentalError(''); }}>
                    {t('cancel')}
                  </Button>
                </div>
              </form>
            )}

            {rentalStep === 'success' && (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-green-600 text-white text-sm font-medium cursor-default"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('onTheList')}
              </button>
            )}
          </div>
        )}

      </div>
    </>
  );
}

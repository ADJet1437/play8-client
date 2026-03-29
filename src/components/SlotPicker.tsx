import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { machineApi } from '../services/api';
import { SlotInfo } from '../types';

interface SlotPickerProps {
  machineId: string;
  onSelectionChange: (startISO: string | null, endISO: string | null) => void;
}

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

function toDateInputValue(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}


export function SlotPicker({ machineId, onSelectionChange }: SlotPickerProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string>(toDateInputValue(today));
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [showSoonWarning, setShowSoonWarning] = useState(false);

  // Fetch slots whenever machine or date changes
  useEffect(() => {
    if (!machineId || !selectedDate) return;

    let cancelled = false;
    setLoadingSlots(true);
    setSelectedHours([]);

    machineApi.getSlots(machineId, selectedDate).then((data) => {
      if (!cancelled) setSlots(data.slots);
    }).catch(() => {
      if (!cancelled) setSlots([]);
    }).finally(() => {
      if (!cancelled) setLoadingSlots(false);
    });

    return () => { cancelled = true; };
  }, [machineId, selectedDate]);

  // Notify parent whenever selection changes; also check "within 1 hour" warning
  useEffect(() => {
    if (selectedHours.length === 0) {
      onSelectionChange(null, null);
      setShowSoonWarning(false);
      return;
    }
    const startHour = selectedHours[0];
    const endHour = selectedHours[selectedHours.length - 1] + 1;
    // Force UTC so slot hours are stored as-displayed (no local timezone offset applied)
    const [y, m, d] = selectedDate.split('-').map(Number);
    const startUTC = Date.UTC(y, m - 1, d, startHour);
    const startISO = new Date(startUTC).toISOString();
    const endISO = new Date(Date.UTC(y, m - 1, d, endHour)).toISOString();
    onSelectionChange(startISO, endISO);

    const msUntilStart = startUTC - Date.now();
    setShowSoonWarning(msUntilStart > 0 && msUntilStart < 60 * 60 * 1000);
  }, [selectedHours, selectedDate]);

  // Past-slot guard: on today (local), slots at or before the current local hour are gone
  const isSlotPast = (hour: number): boolean => {
    if (selectedDate !== toDateInputValue(new Date())) return false;
    return hour <= new Date().getHours();
  };

  const handleSlotClick = (hour: number, status: string) => {
    if (status === 'booked' || isSlotPast(hour)) return;

    setSelectedHours((prev) => {
      if (prev.includes(hour)) {
        // Deselect from an edge; clear if middle
        if (hour === prev[0]) return prev.slice(1);
        if (hour === prev[prev.length - 1]) return prev.slice(0, -1);
        return []; // middle slot clicked — clear
      }

      if (prev.length === 0) return [hour];

      const min = prev[0];
      const max = prev[prev.length - 1];
      if (hour === max + 1) return [...prev, hour];
      if (hour === min - 1) return [hour, ...prev];
      // Not adjacent — start fresh
      return [hour];
    });
  };

  const selectedCount = selectedHours.length;
  const estimatedCost = selectedCount * 120;

  return (
    <div className="space-y-4">
      {/* Date selector */}
      <div>
        <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date
        </label>
        <input
          type="date"
          id="bookingDate"
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedDate}
          min={toDateInputValue(today)}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Slot grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Available slots
          </span>
          {loadingSlots && (
            <span className="text-xs text-gray-400 dark:text-gray-500">Loading…</span>
          )}
        </div>

        {!loadingSlots && slots.length > 0 && (
          <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-8 lg:grid-cols-5 xl:grid-cols-8">
            {slots.map((slot) => {
              const isSelected = selectedHours.includes(slot.hour);
              const isBooked = slot.status === 'booked';
              const isPast = isSlotPast(slot.hour);
              const isDisabled = isBooked || isPast;

              let className =
                'relative flex flex-col items-center justify-center rounded-md py-2 px-1 text-xs font-medium transition-colors select-none ';

              if (isPast) {
                className += 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed';
              } else if (isBooked) {
                className += 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed';
              } else if (isSelected) {
                className += 'bg-indigo-600 text-white ring-2 ring-indigo-400 cursor-pointer';
              } else {
                className += 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer';
              }

              return (
                <button
                  key={slot.hour}
                  type="button"
                  className={className}
                  onClick={() => handleSlotClick(slot.hour, slot.status)}
                  disabled={isDisabled}
                  title={
                    isPast
                      ? 'This time has already passed'
                      : isBooked
                      ? 'Already booked'
                      : `${formatHour(slot.hour)} – ${formatHour(slot.hour + 1)}`
                  }
                >
                  <span>{formatHour(slot.hour)}</span>
                  {isBooked && !isPast && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="block w-full h-px bg-gray-300 dark:bg-gray-600 rotate-12" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {!loadingSlots && slots.length === 0 && machineId && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No slots available for this date.</p>
        )}
      </div>

      {/* Selection summary */}
      {selectedCount > 0 && (
        <div className="space-y-2">
          <div className="rounded-md bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-indigo-700 dark:text-indigo-300">
                <span className="font-medium">{formatHour(selectedHours[0])}</span>
                {' → '}
                <span className="font-medium">{formatHour(selectedHours[selectedHours.length - 1] + 1)}</span>
                <span className="ml-2 text-indigo-500 dark:text-indigo-400">
                  ({selectedCount} {selectedCount === 1 ? 'hour' : 'hours'})
                </span>
              </div>
              <span className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
                {estimatedCost} SEK
              </span>
            </div>
          </div>

          {showSoonWarning && (
            <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-4 py-3">
              <span className="mt-0.5 text-amber-500 dark:text-amber-400 shrink-0">⚠</span>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <span className="font-medium">Heads up — this slot starts in less than 1 hour.</span>
                {' '}Make sure you're ready to head to the court right after booking. You can still proceed if you'd like.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

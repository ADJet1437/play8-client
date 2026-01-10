import { useState, FormEvent } from 'react';
import { format } from 'date-fns';
import { Button } from './Button';
import { useMachines } from '../hooks/useMachines';
import { Booking } from '../types';

interface BookingFormProps {
  onSubmit: (booking: Omit<Booking, 'id'>) => Promise<void>;
  isLoading: boolean;
}

export function BookingForm({ onSubmit, isLoading }: BookingFormProps) {
  const { machines, loading: loadingMachines } = useMachines();
  const [userId] = useState<string>('user-1'); // Default user ID
  const [machineId, setMachineId] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!machineId) {
      setFormError('Please select a machine');
      return;
    }
    
    if (!startTime) {
      setFormError('Please select a start time');
      return;
    }
    
    try {
      await onSubmit({
        user_id: userId,
        machine_id: machineId,
        start_time: new Date(startTime).toISOString(),
        status: 'active',
      });
      
      // Reset form
      setMachineId('');
      setStartTime('');
    } catch (error) {
      setFormError('Failed to create booking. Please try again.');
    }
  };
  
  // Get current date and time for min datetime value
  const now = new Date();
  const minDateTime = format(now, "yyyy-MM-dd'T'HH:mm");
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Book a Tennis Ball Machine</h2>
      
      {formError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="machine" className="block text-sm font-medium text-gray-700 mb-1">
              Select Machine
            </label>
            <select
              id="machine"
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              disabled={loadingMachines || isLoading}
              required
            >
              <option value="">Select a machine</option>
              {machines.map((machine) => (
                <option key={machine.id} value={machine.id}>
                  {machine.name} - {machine.location}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              min={minDateTime}
              disabled={isLoading}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              You can end your session manually after starting.
            </p>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={loadingMachines || isLoading}
          >
            Book Now
          </Button>
        </div>
      </form>
    </div>
  );
}
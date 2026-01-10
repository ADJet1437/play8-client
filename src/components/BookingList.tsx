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
  // Filter active bookings
  const activeBookings = bookings.filter(booking => booking.status === 'active');
  
  // Get machine name by id
  const getMachineName = (machineId: string) => {
    const machine = machines.find(m => m.id === machineId);
    return machine ? machine.name : 'Unknown Machine';
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
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Active Bookings</h2>
        <p className="text-gray-600">You don't have any active bookings.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Active Bookings</h2>
      
      <div className="space-y-4">
        {activeBookings.map((booking) => (
          <div 
            key={booking.id} 
            className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div className="mb-4 md:mb-0">
              <h3 className="font-medium text-gray-800">
                {getMachineName(booking.machine_id)}
              </h3>
              <p className="text-sm text-gray-600">
                Started: {formatDate(booking.start_time)}
              </p>
              <p className="text-sm text-gray-600">
                Status: <span className="text-green-600 font-medium">Active</span>
              </p>
            </div>
            
            <Button
              variant="danger"
              size="sm"
              onClick={() => booking.id && onEndBooking(booking.id)}
              isLoading={isLoading}
              disabled={isLoading}
            >
              End Session
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { ClockIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getMyBookings } from '../services/bookingsService';
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'path';
import { useAuth } from '../contexts/authContext';

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const currentDateTime = new Date(); // Current date and time
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (user == null || user.userid == undefined) return;
      try {
        const data = await getMyBookings(user.userid, user.access_token);
        const sortedData = {
          upcoming: data.records.filter(booking => {
              const startDate = new Date(booking.start_date);
              return startDate >= currentDateTime; // Upcoming if start date is greater than the current date
          }),
          past: data.records.filter(booking => {
              const startDate = new Date(booking.start_date);
              return startDate < currentDateTime; // Past if start date is less than the current date
          })
        };
        setBookings(sortedData);
      } catch (error) {
        toast.error(error);
        console.error(error);
      }
    };

    fetchBookings();
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className='p-6'>
      <ToastContainer/>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Upcoming Bookings Section */}
        <div className='bg-white shadow rounded-lg p-4'>
          <h2 className='text-xl font-semibold mb-4'>Upcoming Bookings</h2>
          <div className='space-y-4'>
            {bookings.upcoming.map((booking) => (
              <div key={booking.id} className='flex justify-between items-center bg-gray-50 p-3 rounded-lg'>
                <div>
                  <h3 className='text-lg font-medium'>
                    <Link href={`/booking_details/${booking.id}`}>{booking.space.name}</Link>
                  </h3>
                  <p className='flex items-center text-sm text-gray-600'>
                    <CalendarIcon className='w-5 h-5 mr-2' />
                    {formatDate(booking.start_date)} to {formatDate(booking.end_date)}
                  </p>
                  <p className='flex items-center text-sm text-gray-600'>
                    <ClockIcon className='w-5 h-5 mr-2' />
                    Upcoming
                  </p>
                </div>
                <p className='flex items-center text-lg font-semibold'>
                  <CurrencyDollarIcon className='w-5 h-5 mr-2'/>
                  ${booking.amount_paid}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Past Bookings Section */}
        <div className='bg-white shadow rounded-lg p-4'>
          <h2 className='text-xl font-semibold mb-4'>Past Bookings</h2>
          <div className='space-y-4'>
            {bookings.past.map((booking) => (
              <div key={booking.id} className='flex justify-between items-center bg-gray-100 p-3 rounded-lg'>
                <div>
                  <h3 className='text-lg font-medium'>
                    <Link href={`booking_details/${booking.id}`}>{booking.space.name}</Link>
                  </h3>
                  <p className='flex items-center text-sm text-gray-600'>
                    <CalendarIcon className='w-5 h-5 mr-2' />
                    {formatDate(booking.start_date)} to {formatDate(booking.end_date)}
                  </p>
                  <p className='flex items-center text-sm text-gray-600'>
                    <ClockIcon className='w-5 h-5 mr-2' />
                    Completed
                  </p>
                </div>
                <p className='flex items-center text-lg font-semibold'>
                  <CurrencyDollarIcon className='w-5 h-5 mr-2'/>
                  ${booking.amount_paid}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PlusCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { getBookings } from '../services/bookingsService';
import { useAuth } from '../contexts/authContext';

const bookingStatuses = ['All', 'Pending', 'Confirmed', 'Cancelled'];
const spaceTypes = ['All', 'Meeting Room', 'Desk', 'Private Office'];

const AdminBookingsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [spaceTypeFilter, setSpaceTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  const [bookings, setBookings] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user == undefined || user.userid == undefined) return;
        const params = {
          skip: (currentPage - 1) * bookingsPerPage,
          limit: bookingsPerPage,
          ...((statusFilter !== 'All' || spaceTypeFilter !== 'All') && { type: spaceTypeFilter.toLowerCase().replace(/\s+/g, '_'), status: statusFilter.toLowerCase() }),
        };
        const data = await getBookings(params, user);
        setBookings(data.records.filter(booking => booking.space.name.toLowerCase().includes(searchTerm.toLowerCase())));
      } catch (error) {
        toast.error('Failed to fetch bookings.', error);
        console.log(error);
      }
    };
    fetchData();
  }, [searchTerm, statusFilter, spaceTypeFilter, currentPage, bookingsPerPage, user]);

  const handleBooking = () => {
    router.push('/booking_management');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSpaceTypeFilterChange = (e) => {
    setSpaceTypeFilter(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex justify-between items-center p-6 bg-white shadow'>
        <input
          type='text'
          placeholder='Search by booking name...'
          className='input input-bordered w-full max-w-xs'
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className='select select-bordered'
          value={statusFilter}
          onChange={handleStatusFilterChange}
        >
          {bookingStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          className='select select-bordered'
          value={spaceTypeFilter}
          onChange={handleSpaceTypeFilterChange}
        >
          {spaceTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button
          className='btn btn-primary flex items-center gap-2'
          onClick={handleBooking}
        >
          <PlusCircleIcon className='h-6 w-6' />
          Make a Booking
        </button>
      </div>
      <div className='overflow-x-auto w-full mt-6'>
        <table className='min-w-full leading-normal shadow-md rounded-lg overflow-hidden'>
          <thead>
            <tr className='bg-gray-300 text-white'>
              <th scope='col' className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider'>
                Booking ID
              </th>
              <th scope='col' className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider'>
                Space Name
              </th>
              <th scope='col' className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider'>
                Space Type
              </th>
              <th scope='col' className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider'>
                Fee
              </th>
              <th scope='col' className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider'>
                Status
              </th>
              <th scope='col' className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className='border-b border-gray-200 hover:bg-gray-100'>
                <td className='px-5 py-5 text-sm bg-white'>
                  {booking.user.username}<br/>
                  {booking.id}
                </td>
                <td className='px-5 py-5 text-sm bg-white'>
                  <Link href={`/booking_details/${booking.id}`}
                    className='text-blue-500 hover:text-blue-600'>{booking.space.name}
                  </Link>
                </td>
                <td className='px-5 py-5 text-sm bg-white'>
                  {booking.space.type}
                </td>
                <td className='px-5 py-5 text-sm bg-white'>
                  ${booking.payments[0]?.amount.toFixed(2)}
                </td>
                <td className='px-5 py-5 text-sm bg-white'>
                  <span className={`inline-block text-xs px-2 py-1 leading-none rounded-full text-white ${booking.status === 'Confirmed' ? 'bg-green-600' : booking.status === 'Pending' ? 'bg-yellow-600' : 'bg-red-600'}`}> 
                    {booking.status}
                  </span>
                </td>
                <td className='px-5 py-5 text-sm bg-white'>
                  <button className='text-blue-500 hover:text-blue-600'>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      <nav className='bg-white px-4 py-3 flex items-center justify-between sm:px-6' aria-label='Pagination'>
          <div className='hidden sm:block'>
            <p className='text-sm text-gray-700'>
              Showing <span className='font-medium'>{((currentPage - 1) * bookingsPerPage) + 1}</span> to <span className='font-medium'>{currentPage * bookingsPerPage}</span> of <span className='font-medium'>{bookings.length}</span> results
            </p>
          </div>
          <div className='flex-1 flex justify-between sm:justify-end'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50'
              disabled={currentPage <= 1}
            >
              <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50'
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
            </button>
          </div>
        </nav>
      <ToastContainer />
    </div>
  );
};

export default AdminBookingsList;


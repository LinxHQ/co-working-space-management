import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { searchRentals } from '../services/rentalSearchService';
import { useAuth } from '../contexts/authContext';

export default function AdminRentalList() {
  const router = useRouter();
  const [rentals, setRentals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rentalsPerPage = 5;
  const { user } = useAuth();

  useEffect(() => {
    if (user == undefined || user.userid == undefined) return;

    searchRentals({ skip: (currentPage - 1) * rentalsPerPage, limit: rentalsPerPage }, user).then(data => {
      setRentals(data.records);
      setTotalCount(data.total_records);
    }).catch(error => {
      toast.error(error.message || 'Failed to load rentals');
    });
  }, [currentPage, user]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchRentals({ skip: 0, limit: rentalsPerPage, start_date: searchTerm }).then(data => {
        setRentals(data.results);
        setTotalCount(data.total);
        setCurrentPage(1);
      }).catch(error => {
        toast.error(error.message || 'Failed to search rentals');
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const indexOfLastRental = currentPage * rentalsPerPage;
  const indexOfFirstRental = indexOfLastRental - rentalsPerPage;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
      <ToastContainer />
      <div className='py-4'>
        <div className='flex mb-4 items-center'>
          <div className='flex-1 min-w-0'>
            <h2 className='text-lg font-semibold text-gray-900'>Rental List</h2>
          </div>
          <div className='flex items-center'>
            <label htmlFor='search' className='sr-only'>Search</label>
            <input
              type='text'
              name='search'
              id='search'
              className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
              placeholder='Search by date...'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <MagnifyingGlassIcon className='h-5 w-5 text-gray-500' />
          </div>
          <div className='flex items-center text-gray-600'>
            <PlusCircleIcon className='h-6 w-6' />
            <Link href="/create_rental">Add rental</Link>
          </div>
        </div>
        <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Space Type</th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Lease Start</th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Lease End</th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Monthly Fee</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {rentals?.map((rental) => (
                <tr key={rental.id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    <Link href={`/adminRentalDetails/${rental.id}`}>{rental.user.username}</Link>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <Link href={`/adminRentalDetails?id=${rental.id}`}>
                    {rental.space.name}
                    </Link>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{rental.start_date}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{rental.end_date}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{rental.monthly_fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <nav className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6' aria-label='Pagination'>
          <div className='hidden sm:block'>
            <p className='text-sm text-gray-700'>
              Showing <span className='font-medium'>{indexOfFirstRental + 1}</span> to <span className='font-medium'>{indexOfLastRental}</span> of <span className='font-medium'>{totalCount}</span> results
            </p>
          </div>
          <div className='flex-1 flex justify-between sm:justify-end'>
            <a
              href='#'
              className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
              onClick={(e) => { e.preventDefault(); paginate(currentPage - 1)}}
            >
              <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
              Previous
            </a>
            <a
              href='#'
              className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
              onClick={(e) => { e.preventDefault(); paginate(currentPage + 1)}}
            >
              Next
              <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}


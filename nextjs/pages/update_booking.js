// my_next_mvp/pages/updateBooking.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBookingById, updateBooking } from '../services/bookingsService';
import { formatDate, parseDate } from '../services/app_service';
import { useAuth } from '../contexts/authContext';

const UpdateBooking = () => {
    const [booking, setBooking] = useState({});
    const router = useRouter();
    const { query: { bookingId } } = router;
    const { user } = useAuth();

    useEffect(() => {
        if (bookingId) {
            fetchBooking(bookingId);
        }
    }, [bookingId, user]);

    const fetchBooking = async (bookingId) => {
        if (!user || !user.userid) return;
        try {
            const response = await getBookingById(bookingId, user);
            if (response) {
                setBooking({
                    ...response,
                    start_date: response.start_date,
                    end_date: response.end_date
                });
            } else {
                toast.info('No booking details found.');
            }
        } catch (error) {
            toast.error('Failed to fetch booking details!');
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBooking(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await updateBooking(bookingId, booking, user);
            toast.success('Booking updated successfully!');
            router.push('/booking_details/' + bookingId);
        } catch (error) {
            toast.error('Failed to update booking: ' + error.message);
        }
    };

    return (
        <div className='container mx-auto p-8 bg-white shadow rounded-lg'>
            <ToastContainer />
            <div className='space-y-4'>
                <h1 className='text-2xl font-semibold'>Update Booking</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Start Date</label>
                        <input
                            type="datetime-local"
                            name="start_date"
                            value={booking.start_date || ''}
                            onChange={handleInputChange}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>End Date</label>
                        <input
                            type="datetime-local"
                            name="end_date"
                            value={booking.end_date || ''}
                            onChange={handleInputChange}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Status</label>
                        <select name='status'
                            value={booking.status} 
                            onChange={handleInputChange}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'>
                            <option value='active'>Active</option>
                            <option value='canceled'>Canceled</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Special Remarks</label>
                        <textarea
                            name="special_remarks"
                            value={booking.special_remarks || ''}
                            onChange={handleInputChange}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>
                    <button
                        type="submit"
                        className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    >
                        Update Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateBooking;

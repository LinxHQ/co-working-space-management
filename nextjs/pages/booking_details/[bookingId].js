// my_next_mvp/pages/bookingDetails.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBookingById } from '../../services/bookingsService'; 
import { formatDate } from '../../services/app_service';
import { useAuth } from '../../contexts/authContext';
import Link from 'next/link';

const BookingDetails = () => {
    const [booking, setBooking] = useState(null);
    const router = useRouter();
    const { query: { bookingId } } = router;
    const { user } = useAuth();

    useEffect(() => {
        if (bookingId) {
            getBooking(bookingId);
        }
    }, [bookingId, user]);

    const getBooking = async (bookingId) => {
        if (user == undefined || user.userid == undefined) return;
        try {
            const response = await getBookingById(bookingId, user);
            if (response) {
                setBooking({
                    id: response.id,
                    user_name: response.user.username, // Assuming 'user_id' is tied to 'users.name' in the DB
                    space_type: response.space.name, // Assuming 'space_id' is tied to 'spaces.type' in the DB
                    booking_duration: formatDate(response.start_date) + " to " + formatDate(response.end_date),
                    //amount_paid: response.amount_paid,
                    special_remarks: response.special_remarks || 'N/A',
                    status: response.status || 'Active',
                    payments: response.payments.map(payment => 
                        `$${payment.amount} paid on ${formatDate(payment.payment_date)}`).join(', ')
                });
            } else {
                toast.info('No booking details found.');
            }
        } catch (error) {
            toast.error('Failed to fetch booking details!');
        }
    };

    return (
        <div className='container mx-auto p-8 bg-white shadow'>
            <ToastContainer />
            <div className='space-y-4'>
                <h1 className='text-2xl font-semibold'>Booking Details$</h1>
                {booking ? (
                    Object.entries(booking).map(([key, value]) => (
                        <div key={key} className='border-b py-2 flex justify-between items-center'>
                            <span className='text-gray-600 capitalize'>{key.replace(/_/g, ' ')}</span>               
                            <span className='flex items-center gap-2'>                           
                                {value}
                            </span>
                        </div>
                    ))
                ) : (
                    <p>Loading booking details...</p>
                )}
                { booking ? 
                <Link href={`/update_booking?bookingId=${booking.id}`}
                    className="inline-block bg-indigo-600 text-white rounded-lg px-3 py-1 hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300 text-center">
                    Update
                </Link>
                : ''}                
            </div>
        </div>
    );
};

export default BookingDetails;


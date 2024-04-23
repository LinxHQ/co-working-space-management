// my_next_mvp/pages/booking_management.js
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { createBooking } from '../services/bookingsService';
import { getSpace } from '../services/spaceService';
import { getSpaces } from '../services/spacesService';
import { space } from 'postcss/lib/list';
import { useAuth } from '../contexts/authContext'; 

const BookingManagement = () => {
  const [booking, setBooking] = useState({
    user_id: '',
    space_id: '',
    start_date: '',
    end_date: '',
    status: 'active',
    special_remarks: '',
  });
  const [spaces, setSpaces] = useState([]);
  const [currentSpace, setCurrentSpace] = useState({});
  const router = useRouter();
  const spaceId = router.query.spaceId;
  const { user } = useAuth();

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        if (user == undefined) return;
        const data = await getSpaces({}, user);
        setSpaces(data.records);
        const current_data = await getSpace(spaceId, user);
        setCurrentSpace(current_data);
        setBooking({ ...booking, space_id: current_data.id, user_id: user.userid });
        //console.log("UserID " + user.userid);
      } catch (error) {
        toast.error(
          'Failed to fetch space: ' + error || error.message
        );
      }
    };

    if (spaceId) {
      fetchSpace();
    }
  }, [spaceId, user]);

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBooking(booking, user);
      toast.success('Booking created successfully!');
      router.push('/stripe_payment');
    } catch (error) {
      toast.error(
        'Failed to create booking: ' + error || error.message
      );
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-4xl mb-6'>Booking Management</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='user_id' className='block text-lg font-medium mb-2'>User ID</label>
          <input type='text' id='user_id' name='user_id' className='border p-2 rounded w-full' 
            value={booking.user_id} onChange={handleChange} required />
        </div>
        <div className='mb-4'>
          <label htmlFor='space_id' className='block text-lg font-medium mb-2'>Space</label>
          <select id='space_id' name='space_id' className='border p-2 rounded w-full' value={booking.space_id} onChange={handleChange} required>
            <option value="-1">Select Space</option>
            {spaces.map(space => (
              <option key={space.id} value={space.id}>{space.name}</option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label htmlFor='start_date' className='block text-lg font-medium mb-2'>Start Date and Time</label>
          <input type='datetime-local' id='start_date' name='start_date' className='border p-2 rounded w-full' value={booking.start_date} onChange={handleChange} required />
        </div>
        <div className='mb-4'>
          <label htmlFor='end_date' className='block text-lg font-medium mb-2'>End Date and Time</label>
          <input type='datetime-local' id='end_date' name='end_date' className='border p-2 rounded w-full' value={booking.end_date} onChange={handleChange} required />
        </div>
        <div className='mb-4'>
          <label htmlFor='amount_paid' className='block text-lg font-medium mb-2'>Fee</label>
          ${currentSpace.fee}/{currentSpace.fee_type}
        </div>
        <div className='mb-4'>
          <label htmlFor='special_remarks' className='block text-lg font-medium mb-2'>Special Remarks</label>
          <textarea id='special_remarks' name='special_remarks' className='border p-2 rounded w-full' value={booking.special_remarks} onChange={handleChange} />
        </div>
        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Create Booking</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default BookingManagement;

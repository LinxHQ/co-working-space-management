import { useState } from 'react';
import { useRouter } from 'next/router';
import { createRental } from '../services/rentalService';
import { createNotification } from '../services/notificationsService';

export default function CreateRental() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: '',
    spaceId: '',
    startDate: '',
    endDate: '',
    monthlyFee: '',
    remarks: ''
  });
  const [document, setDocument] = useState(null);

  const users = [
    { id: 'u1', name: 'Alice Smith' },
    { id: 'u2', name: 'Bob Johnson' },
    { id: 'u3', name: 'Charlie Brown' }
  ];

  const spaces = [
    { id: 's1', name: 'Private Office 101' },
    { id: 's2', name: 'Private Office 102' },
    { id: 's3', name: 'Private Office 103' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rentalData = {
        user_id: formData.userId,
        space_id: formData.spaceId,
        start_date: formData.startDate,
        end_date: formData.endDate,
        monthly_fee: parseFloat(formData.monthlyFee),
        special_remarks: formData.remarks
      };

      const rentalResponse = await createRental(rentalData);
      console.log('Rental Created:', rentalResponse);

      const notificationData = {
        message: `New rental for space ${formData.spaceId} has been created.`,
        read_status: false,
        user_id: formData.userId
      };
      await createNotification(notificationData);

      router.push(`/adminRentalDetails/${rentalResponse.id}`);
    } catch (error) {
      console.error('Failed to create rental:', error);
    }
  };

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Create New Rental</h1>
      <form onSubmit={handleSubmit} className='space-y-4' encType="multipart/form-data">
        <div className='flex flex-col'>
          <label htmlFor='userId' className='mb-2 text-sm font-medium'>User</label>
          <select
            id='userId'
            name='userId'
            value={formData.userId}
            onChange={handleInputChange}
            className='block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
          >
            <option value='' disabled>Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div className='flex flex-col'>
          <label htmlFor='spaceId' className='mb-2 text-sm font-medium'>Space Name</label>
          <select
            id='spaceId'
            name='spaceId'
            value={formData.spaceId}
            onChange={handleInputChange}
            className='block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
          >
            <option value='' disabled>Select Space</option>
            {spaces.map((space) => (
              <option key={space.id} value={space.id}>{space.name}</option>
            ))}
          </select>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <label htmlFor='startDate' className='mb-2 text-sm font-medium'>Start Date</label>
            <input
              type='date'
              id='startDate'
              name='startDate'
              value={formData.startDate}
              onChange={handleInputChange}
              className='block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='endDate' className='mb-2 text-sm font-medium'>End Date</label>
            <input
              type='date'
              id='endDate'
              name='endDate'
              value={formData.endDate}
              onChange={handleInputChange}
              className='block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
            />
          </div>
        </div>

        <div className='flex flex-col'>
          <label htmlFor='monthlyFee' className='mb-2 text-sm font-medium'>Monthly Fee</label>
          <input
            type='number'
            id='monthlyFee'
            name='monthlyFee'
            value={formData.monthlyFee}
            onChange={handleInputChange}
            className='block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor='remarks' className='mb-2 text-sm font-medium'>Remarks</label>
          <textarea
            id='remarks'
            name='remarks'
            value={formData.remarks}
            onChange={handleInputChange}
            className='block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
            rows='3'
          ></textarea>
        </div>

        <div className='flex items-center'>
          <label className='block'>
            <span className='sr-only'>Upload Document</span>
            <input
              type='file'
              name='document'
              onChange={handleFileChange}
              className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100'
            />
          </label>
        </div>

        <button
          type='submit'
          className='py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 transition-colors'
        >
          Create Rental
        </button>
      </form>
    </div>
  );
}


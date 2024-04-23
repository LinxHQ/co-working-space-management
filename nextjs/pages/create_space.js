import { useState } from 'react';
import { useRouter } from 'next/router';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { createSpace } from '../services/spacesService';
import { useAuth } from '../contexts/authContext';

export default function CreateSpace() {
  const router = useRouter();
  const [spaceType, setSpaceType] = useState('common_area');
  const [description, setDescription] = useState('');
  const [fee, setFee] = useState('');
  const [feeType, setFeeType] = useState('hourly');
  const [photos, setPhotos] = useState([]);
  const [name, setName] = useState('');
  const { user } = useAuth();

  const handlePhotoChange = (event) => {
    setPhotos([...event.target.files]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create FormData to include files for photo upload
    const formData = new FormData();
    for (const photo of photos) {
        formData.append('photos', photo);
    }

    // Add other data related to the space
    formData.append('name', name);
    formData.append('type', spaceType);
    formData.append('fee', fee);
    formData.append('fee_type', 'hourly'); // Assuming the fee_type is 'hourly' for this demo
    formData.append('description', description);
    formData.append('fee_type', feeType);

    try {
      // Submission logic to send data to the backend
      const createdSpace = await createSpace(formData, user);
      if (createdSpace && createdSpace.id) {
        // Redirect to the space_info screen after submission with the new space id
        router.push(`/space_info/${createdSpace.id}`);
      }
    } catch (error) {
      console.error('Failed to create the space:', error);
      // Include error handling logic as needed, such as displaying a notification to the user
    }
  };

  return (
    <div className='max-w-2xl mx-auto my-10 p-5 border rounded-md shadow-md'>
      <form onSubmit={handleSubmit} className='space-y-4' encType="multipart/form-data">
        <div>
          <label htmlFor='spaceType' className='block text-sm font-medium text-gray-700'>Type of Space</label>
          <select
            id='spaceType'
            name='spaceType'
            value={spaceType}
            onChange={(e) => setSpaceType(e.target.value)}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          >
            <option value='common_area'>Common Area</option>
            <option value='private_office'>Private Office</option>
            <option value='photo_studio'>Photo Studio</option>
            <option value='event_space'>Event Space</option>
          </select>
        </div>

        <div>
          <label htmlFor='name' className='block text-sm font-medium text-gray-700'>Name</label>
          <input
            type='text'
            id='name'
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            placeholder='Enter name for this space'
            required
          />
        </div>

        <div>
          <label htmlFor='description' className='block text-sm font-medium text-gray-700'>Description</label>
          <textarea
            id='description'
            name='description'
            rows='4'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            placeholder='Describe the space, what it includes, size, etc.'
          />
        </div>

        <div>
          <label htmlFor='fee' className='block text-sm font-medium text-gray-700'>Fee</label>
          <input
            type='text'
            id='fee'
            name='fee'
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            placeholder='Enter the fee for using the space'
            required
          />
        </div>
        
        <div>
          <label htmlFor='feeType' className='block text-sm font-medium text-gray-700'>Fee Type</label>
          <select
            id='feeType'
            name='feeType'
            value={feeType}
            onChange={(e) => setFeeType(e.target.value)}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          >
            <option value='hourly'>Hourly</option>
            <option value='monthly'>Monthly</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Photos</label>
          <div className='mt-1 flex items-center'>
            <span className='inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100'>
              <PhotoIcon className='h-full w-full text-gray-300' />
            </span>
            <input
              type='file'
              name='photos'
              multiple
              onChange={handlePhotoChange}
              className='ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            />
          </div>
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            className='py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Create Space
          </button>
        </div>
      </form>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { getSpace } from '../../services/spaceService';
import { downloadImage } from '../../services/fileService';
import { useAuth } from '../../contexts/authContext';

export default function SpaceInfo() {
  const router = useRouter();
  const { spaceId } = router.query; // Assuming spaceId is passed via the URL query parameter
  const [spaceDetails, setSpaceDetails] = useState({
    name: '',
    description: '',
    fee: '',
    fee_type: '',
    photos: [],
    isAvailable: true // Placeholder: Actual availability logic should be implemented based on real data
  });
  const [imageUrls, setImageUrls] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchImages() {
      const urls = await Promise.all(
        spaceDetails.photos.map(async (photo) => {
          try {
            return await downloadImage(photo, user);
          } catch (error) {
            console.error('Error downloading image:', error);
            return '/images/default-placeholder.png';  // Fallback image in case of error
          }
        })
      );
      setImageUrls(urls);
    }

    if (spaceDetails.photos && spaceDetails.photos.length > 0) {
      fetchImages();
    }
  }, [spaceDetails.photos]);

  useEffect(() => {
    if (spaceId) {
      getSpaceDetails(spaceId);
    }
  }, [spaceId, user]);

  const getSpaceDetails = async (id) => {
    try {
      const spaceData = await getSpace(id, user);
      setSpaceDetails({
        ...spaceData,
        fee: spaceData.fee ? spaceData.fee.toFixed(2) : '0.00',
      });
    } catch (error) {
      console.error('Error fetching space details:', error);
    }
  };

  const handleBooking = () => {
    router.push(`/booking_management?spaceId=${spaceId}`);
  };

  return (
    <div className='bg-white shadow rounded-lg p-6 space-y-4'>
      <div className='space-y-2'>
        <h1 className='text-2xl font-bold'>{spaceDetails.name}</h1>
        <p className='text-gray-600'>{spaceDetails.description}</p>
        <p className='text-lg font-semibold'>Price: ${spaceDetails.fee}{spaceDetails.fee_type ? `/${spaceDetails.fee_type}` : ''}</p>
        <div className='flex gap-2'>
          {(spaceDetails.isAvailable !== undefined) ? (
            spaceDetails.isAvailable ? (
              <span className='bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded'>Available</span>
            ) : (
              <span className='bg-red-100 text-red-800 text-sm font-semibold px-2.5 py-0.5 rounded'>Not Available</span>
            )
          ) : null}
        </div>
      </div>
      <div className='flex gap-4 overflow-x-auto'>
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={`Space photo ${index + 1}`} className='rounded-lg w-40 h-40 object-cover' />
      ))}
      </div>
      <button
        onClick={handleBooking}
        className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 justify-center'>
        <PhotoIcon className='h-5 w-5' />
        Book this Space
      </button>
    </div>
  );
}

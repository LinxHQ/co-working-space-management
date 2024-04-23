import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getSpaces } from '../services/spacesService';
import { downloadImage } from '../services/fileService';
import { useAuth } from '../contexts/authContext';

const BrowseSpacesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [spaces, setSpaces] = useState([]);
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchSpaces();
  }, [filterType, user]);

  useEffect(() => {
    const loadImageUrls = async () => {
      const urls = {};
      for (const space of spaces) {
        if (space.photos[0]) {
          try {
            urls[space.id] = await downloadImage(space.photos[0], user);
          } catch (error) {
            urls[space.id] = '/images/co-working.jpg'; // Provide a default image path
            toast.error("Cannot download image for space");
          }
        }
      }
      setImageUrls(urls);
    };

    if (spaces && spaces.length > 0) {
      loadImageUrls();
    }
  }, [spaces]);

  const fetchSpaces = async () => {
    try {
      if (user == undefined) return;
      const params = filterType === 'all' ? {} : { type: filterType };
      const data = await getSpaces(params, user);
      setSpaces(data.records);
    } catch (error) {
      toast.error(
        `Error fetching spaces: ${error.message}`
      );
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    toast.info(`Search for: ${event.target.value}`);
    // Implement search filtering on the spaces
    const filteredSpaces = spaces.filter((space) =>
      space.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSpaces(filteredSpaces);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    toast.info(`Filter by: ${event.target.value}`);
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search spaces..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          <select value={filterType} onChange={handleFilterChange} className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="all">All Types</option>
            <option value="common_area">Common Area</option>
            <option value="private_office">Private Office</option>
            <option value="photo_studio">Photo Studio</option>
            <option value="event_space">Event Space</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {spaces?.map((space) => (
          <div key={space.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-2xl flex flex-col">
          <img 
            className="h-40 w-full object-cover" 
            src={imageUrls[space.id] || '/images/loading.png'} // Use a loading image or similar
            alt={space.name} 
          />
          <div className="flex-grow px-5 py-4 flex flex-col justify-between">  {/* This div will expand */}
              <div>
                    <h5 className="text-xl font-semibold mb-2 text-gray-800">
                        <Link href={`/space_info/${space.id}`} className='capitalize'>{space.type.replace(/_/g, ' ')} - {space.name}</Link> <span className="text-green-600">({space.fee} {space.fee_type})</span>
                    </h5>
                    <p className="text-gray-700 text-base mb-4">
                        {space.description}
                    </p>
                </div>
                <Link href={`/booking_management?spaceId=${space.id}`}
                    className="inline-block bg-indigo-600 text-white rounded-lg px-3 py-1 hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300 text-center">
                    Book This Space
                </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseSpacesPage;


// pages/more-actions.js

import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function MoreActions() {
  // Updated actions array with provided forms/pages information
  const actions = [
    { title: 'Booking Management', description: 'Form to create a new booking for a space.', link: '/booking_management' },
    { title: 'Booking Details', description: 'Details about booking events.', link: '/bookingDetails' },
    { title: 'Rental Management', description: 'Form to manage rentals for private office spaces.', link: '/rental_management' },
    { title: 'Rental Details', description: 'Detailed information related to the rental of a space.', link: '/rental_details' },
    { title: 'View Booking Details', description: 'Admin interface to view details of a specific booking entry in the system.', link: '/viewBookingDetails' },
    { title: 'Tenant Details', description: 'View details of a tenant including rental period, remarks, and payment history.', link: '/tenantdetails' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">More Actions</h1>
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Link key={index} href={action.link}
            className="card bg-white p-4 shadow-md rounded-lg hover:bg-gray-100 transition ease-in-out duration-150">
              <h2 className="text-xl font-semibold mb-2 flex justify-between items-center">
                {action.title}
                <ChevronRightIcon className="h-5 w-5 text-gray-500" />
              </h2>
              <p>{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

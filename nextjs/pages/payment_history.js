import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from 'react-csv';
import { QuestionMarkCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { listPayments } from '../services/paymentService';
import { useAuth } from '../contexts/authContext';
import { userAgent } from 'next/server';
import { useFormStatus } from 'react-dom';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [exportedData, setExportedData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user == undefined || user.userid == undefined) return;
      try {
        const data = await listPayments({}, user);
        setPayments(data.records);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
        toast.error('Failed to fetch payments.');
      }
    };
    fetchData();
  }, [user]);

  const handleSearch = async (event) => {
    const query = event.target.value.toLowerCase();
    if (query.trim() !== '') {
      try {
        const data = await listPayments({ query });
        setPayments(data);
      } catch (error) {
        toast.error('Failed to search payments.');
      }
    } else {
      try {
        const data = await listPayments();
        setPayments(data);
      } catch (error) {
        toast.error('Failed to fetch payments.');
      }
    }
  };

  const handleExport = () => {
    setExportedData(payments.map(payment => ({
      payment_date: new Date(payment.payment_date).toLocaleDateString(),
      booking_rental_id: payment.booking_id || payment.rental_id,
      user_id: payment.user_id,
      amount: payment.amount
    })));
    toast.success('Data prepared for export.');
  };

  // Headers for CSV
  const headers = [
    { label: 'Date of Payment', key: 'payment_date' },
    { label: 'Booking/Rental ID', key: 'booking_rental_id' },
    { label: 'Payer ID', key: 'user_id' },
    { label: 'Amount Paid', key: 'amount' }
  ];

  return (
    <div className='container mx-auto p-8'>
      <ToastContainer position='top-center' autoClose={3000} hideProgressBar={true} />
      <div className='flex justify-between items-center mb-6'>
        <div className='flex border rounded-lg overflow-hidden'>
          <button className='flex items-center justify-center px-3 border-r'>
            <MagnifyingGlassIcon className='h-4 w-4 text-gray-500' />
          </button>
          <input
            type='text'
            placeholder='Search payments...'
            className='p-2 focus:outline-none'
            onChange={handleSearch}
          />
        </div>
        <button
          onClick={handleExport}
          className='flex items-center bg-green-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-600 transition-colors'
        >
          <QuestionMarkCircleIcon className='h-4 w-4 mr-2' />
          Export CSV
        </button>
        <CSVLink
          hidden
          data={exportedData}
          headers={headers}
          filename={'payments_history.csv'}
          //ref={link => this.link = link}
        />
      </div>
      <table className='min-w-full mb-4 bg-white rounded-lg overflow-hidden shadow-lg'>
        <thead className='bg-gray-300 text-gray-600'>
          <tr>
            <th className='w-1/4 px-4 py-2'>Date of Payment</th>
            <th className='w-1/4 px-4 py-2'>Booking/Rental ID</th>
            <th className='w-1/4 px-4 py-2'>Payer ID</th>
            <th className='w-1/4 px-4 py-2'>Amount Paid</th>
            <th className='px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments?.map((payment) => (
            <tr key={payment.id} className='text-center border-b bg-gray-50 hover:bg-gray-100'>
              <td className='px-4 py-2'>{new Date(payment.payment_date).toLocaleDateString()}</td>
              <td className='px-4 py-2'>
                <Link href={`/viewBookingDetails/${payment.booking_id || payment.rental_id}`}>{`${payment.booking_id || payment.rental_id}`}</Link>
              </td>
              <td className='px-4 py-2'>{payment.user_id}</td>
              <td className='px-4 py-2'>{payment.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


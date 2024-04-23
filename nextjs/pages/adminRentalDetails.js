import { useState, useEffect } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { ToastContainer } from 'react-toastify';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { readRental } from '../services/rentalService';
import { useAuth } from '../contexts/authContext';
import { listPayments } from '../services/paymentService';

export default function AdminRentalDetails() {
    const [tenantDetails, setTenantDetails] = useState({});
    const [paymentHistory, setPaymentHistory] = useState([]);
    const router = useRouter();
    const { id } = router.query; // Assuming ID refers to the rental ID
    const { user } = useAuth();

    useEffect(() => {
        if (id && user) {
            (async () => {
                const rentalDetails = await readRental(id, user);
                setTenantDetails(rentalDetails);

                const payments = await listPayments({ rental_id: id }, user);
                setPaymentHistory(payments.records);
            })();
        }
    }, [id, user]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="flex items-center py-4 space-x-2">
                <Link href='/admin_rental_list' className='p-2 rounded-full hover:bg-gray-200'>
                    <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Rental Details</h1>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg divide-y divide-gray-200">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Tenant Details</h2>
                    <div className="space-y-2 text-gray-600">
                        <p><strong>Name:</strong> {tenantDetails.user?.username}</p>
                        <p><strong>Space ID:</strong> {tenantDetails.space?.name}</p>
                        <p><strong>Start Date:</strong> {tenantDetails.start_date}</p>
                        <p><strong>End Date:</strong> {tenantDetails.end_date}</p>
                        <p><strong>Monthly Fee:</strong> ${tenantDetails.monthly_fee}</p>
                        <p><strong>Special Remarks:</strong> {tenantDetails.special_remarks || "None"}</p>
                    </div>
                </div>
                <div className="pt-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment History</h2>
                    <ul className="space-y-2 text-gray-600">
                        {paymentHistory?.map((payment, index) => (
                            <li key={index} className="bg-gray-50 p-3 rounded-lg">
                                <p><strong>Date:</strong> {payment.payment_date}</p>
                                <p><strong>Reference:</strong> {payment.payment_ref}</p>
                                <p><strong>Amount:</strong> ${payment.amount}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { useRouter } from 'next/router';
import { getBookings } from '../services/bookingsService';
import { listPayments } from '../services/paymentService';
import { searchRentals } from '../services/rentalSearchService';
import { useAuth } from '../contexts/authContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const Dashboard = () => {
  const [earningsChartData, setEarningsChartData] = useState(null);
  const [customerChartData, setCustomerChartData] = useState(null);
  const [bookingsChartData, setBookingsChartData] = useState(null);
  const [revenueComparisonChartData, setRevenueComparisonChartData] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (user == undefined || user.userid == undefined) return;

      try {
        // Load earnings data
        const paymentsData = await listPayments({}, user);
        setEarningsChartData({
          labels: paymentsData?.records.map(payment => new Date(payment.payment_date).toLocaleDateString()),
          datasets: [{
            label: 'Earnings',
            data: paymentsData?.records.map(payment => payment.amount),
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 2,
            tension: 0.4
          }]
        });

        // Load total customers data
        const rentalsData = await searchRentals({}, user);
        const uniqueCustomers = new Set();
        rentalsData?.records.forEach(rental => uniqueCustomers.add(rental.user_id));
        setCustomerChartData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Total Customers',
            data: Array.from({ length: 6 }, () => uniqueCustomers.size),
            backgroundColor: 'rgba(234, 88, 12, 0.5)',
            borderColor: 'rgba(234, 88, 12, 1)',
            borderWidth: 2,
          }]
        });

        // Load bookings data
        const bookingsData = await getBookings({ limit: 7 }, user);
        setBookingsChartData({
          labels: bookingsData?.records.map((_, i) => `Week ${i + 1}`),
          datasets: [{
            label: 'Bookings',
            data: bookingsData?.records.map(booking => booking.amount_paid),
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
          }]
        });

        // Mock revenue comparison chart data
        setRevenueComparisonChartData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [{
            label: 'Current Year Revenue',
            data: Array.from({ length: 4 }, () => Math.random() * 5000 + 5000),
            backgroundColor: 'rgba(251, 191, 36, 0.5)',
            borderColor: 'rgba(251, 191, 36, 1)',
            borderWidth: 2,
          }, {
            label: 'Last Year Revenue',
            data: Array.from({ length: 4 }, () => Math.random() * 5000 + 5000),
            backgroundColor: 'rgba(244, 63, 94, 0.5)',
            borderColor: 'rgba(244, 63, 94, 1)',
            borderWidth: 2,
          }]
        });

      } catch (error) {
        toast.error('Failed to load data');
      }
    }
    
    fetchData();
  }, [user]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          padding: 20,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          borderDash: [3, 3],
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>Dashboard</h2>
      
      <div className='grid grid-cols-2 gap-6'>
        <div className='p-4 bg-white shadow rounded-lg'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Earnings</h2>
          {earningsChartData && <Line data={earningsChartData} options={options} />}
        </div>
        <div className='p-4 bg-white shadow rounded-lg'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Customer Acquisition</h2>
          {customerChartData && <Bar data={customerChartData} options={options} />}
        </div>
      </div>
      
      <div className='grid grid-cols-2 gap-6 mt-6'>
        <div className='p-4 bg-white shadow rounded-lg'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Bookings</h2>
          {bookingsChartData && <Bar data={bookingsChartData} options={options} />}
        </div>
        <div className='p-4 bg-white shadow rounded-lg'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Revenue Growth</h2>
          {revenueComparisonChartData && <Bar data={revenueComparisonChartData} options={options} />}
        </div>
      </div>
      
      <ToastContainer />
    </>
    
  );
};

export default Dashboard;


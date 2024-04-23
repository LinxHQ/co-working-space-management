// UI Component Code with Integration (my_next_mvp/pages/stripe_payment.js)
import React, { useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { createPayment } from '../services/paymentService';
import Link from 'next/link';

// Load your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        console.log('[PaymentMethod]', paymentMethod);
        // Perform payment processing on the server
        const paymentData = {
          type: 'booking', // Assuming it's a booking payment for simplicity
          payment_date: new Date().toISOString(),
          payment_ref: paymentMethod.id,
          amount: 100, // The actual amount should be from the booking details
          booking_id: router.query.bookingId, // The booking ID should be retrieved from the booking process
        };

        const paymentResponse = await createPayment(paymentData);
        console.log('[PaymentResponse]', paymentResponse);

        // If the payment is successful, redirect user to booking details or a success page
        router.push(`/bookingDetails/${paymentResponse.id}`);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during payment processing');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="card-number">
          Card Number
        </label>
        <div className="relative">
          <CardNumberElement className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="card-number" />
        </div>
      </div>
      <div className="mb-4 md:flex md:justify-between">
        <div className="md:w-1/2 md:mr-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="card-expiry">
            Expiration Date
          </label>
          <CardExpiryElement className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="card-expiry" />
        </div>
        <div className="md:w-1/2 md:ml-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="card-cvc">
            CVC
          </label>
          <CardCvcElement className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="card-cvc" />
        </div>
      </div>
      {errorMessage && <div className="text-red-500 text-xs italic">{errorMessage}</div>}
      <button type="submit" disabled={!stripe} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
        Pay
      </button>
      <Link href="/my_bookings" className='text-gray-400 pl-4'>Skip</Link>
    </form>
  );
};

const StripePaymentForm = () => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Make payment</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </>
    
  );
};

export default StripePaymentForm;


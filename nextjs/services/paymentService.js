// my_next_mvp/services/paymentService.js

import axios from 'axios';
import * as yup from 'yup';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Validation schema for listing payments
const listPaymentsSchema = yup.object().shape({
  skip: yup.number().integer().min(0).default(0),
  limit: yup.number().integer().min(1).default(10)
});

// Validation schema for creating a payment
const createPaymentSchema = yup.object().shape({
  type: yup.string().required(),
  payment_date: yup.date().required(),
  payment_ref: yup.string().max(255).required(),
  amount: yup.number().positive().required(),
  booking_id: yup.string().max(60),
  rental_id: yup.string().max(60)
});

// List payments with optional skip and limit
export const listPayments = async (options = {}, user) => {
  try {
    await listPaymentsSchema.validate(options);
    const response = await axios.get(`${API_BASE_URL}/payments`, { 
      headers: {
        "Authorization": `Bearer ${user.access_token}`,
      },
      params: options 
    });
    return response.data;
  } catch (error) {
    console.error('Error listing payments:', error);
    throw error;
  }
};

// Create a new payment
export const createPayment = async (paymentData) => {
  try {
    await createPaymentSchema.validate(paymentData);
    const response = await axios.post(`${API_BASE_URL}/payments`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

const paymentIdSchema = yup.string().required('Payment ID is required.');

export const getPayment = async (paymentId, user) => {
  try {
    await paymentIdSchema.validate(paymentId);
    const response = await axios.get(`${API_BASE_URL}/payments/${paymentId}`, {
      headers: {
        "Authorization": `Bearer ${user.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred while fetching the payment.');
    }
  }
};

export const updatePayment = async (paymentId, paymentData) => {
  try {
    await paymentIdSchema.validate(paymentId);
    // Define a schema for payment edit data validation based on provided component schemas
    const paymentEditSchema = yup.object().shape({
      id: yup.string().required('Payment ID is required.'),
      type: yup.string().required('Payment type is required.'),
      payment_date: yup.date().required('Payment date is required.'),
      payment_ref: yup.string().required('Payment reference is required.'),
      amount: yup.number().positive('Amount must be a positive number.').required('Amount is required.')
    });
    await paymentEditSchema.validate(paymentData);
    const response = await axios.put(`${API_BASE_URL}/payments/${paymentId}`, paymentData);
    return response.data;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred while updating the payment.');
    }
  }
};

export const deletePayment = async (paymentId) => {
  try {
    await paymentIdSchema.validate(paymentId);
    const response = await axios.delete(`${API_BASE_URL}/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred while deleting the payment.');
    }
  }
};


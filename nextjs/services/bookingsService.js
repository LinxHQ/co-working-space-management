// my_next_mvp/services/bookingsService.js

import axios from 'axios';
import * as yup from 'yup';
import { useAuth } from '../contexts/authContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getBookingsSchema = yup.object().shape({
  skip: yup.number().integer().min(0).default(0),
  limit: yup.number().integer().min(1).default(10)
});

const bookingCreateSchema = yup.object().shape({
  user_id: yup.string().required(),
  space_id: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  special_remarks: yup.string().nullable()
});

export const getBookings = async (params, user) => {
  try {
    await getBookingsSchema.validate(params);
    const response = await axios.get(`${API_BASE_URL}/bookings`, { 
      headers: {
        "Authorization": `Bearer ${user.access_token}`
      },
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    throw error.response.data;
  }
};

export const getMyBookings = async (user_id, access_token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/user/${user_id}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching my bookings:', error.message);
    throw error.response.data;
  }
};

export const getBookingById = async (id, user) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/${id}`, {
      headers: {
        'Authorization': `Bearer ${user.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    throw error.response.data;
  }
};

export const createBooking = async (data, user) => {
  try {
    await bookingCreateSchema.validate(data);
    const response = await axios.post(`${API_BASE_URL}/bookings`, data, {
      headers: {
        'Authorization': `Bearer ${user.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error.message);
    throw error.response.data;
  }
};

export const updateBooking = async (bookingId, data, user) => {
  try {
    await bookingCreateSchema.validate(data);
    const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}`, data, {
      headers: {
        'Authorization': `Bearer ${user.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error.message);
    throw error.response.data;
  }
};
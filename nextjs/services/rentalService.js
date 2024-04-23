// my_next_mvp/services/rentalService.js

import axios from 'axios';
import * as yup from 'yup';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const rentalCreateSchema = yup.object().shape({
  user_id: yup.string().max(60).required(),
  space_id: yup.string().max(60).required(),
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  monthly_fee: yup.number().required(),
  special_remarks: yup.string()
});

export const createRental = async (rentalData) => {
  try {
    await rentalCreateSchema.validate(rentalData);
    const response = await axios.post(`${API_BASE_URL}/rentals/`, rentalData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response);
      throw new Error(error.response.data.detail || 'Error creating rental');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error('Validation failed or other error occured');
    }
  }
};

const rentalIdSchema = yup.string().required();
const rentalEditSchema = yup.object().shape({
  user_id: yup.string().max(60),
  space_id: yup.string().max(60),
  start_date: yup.date().nullable(),
  end_date: yup.date().nullable(),
  monthly_fee: yup.number().positive(),
  special_remarks: yup.string().nullable()
});

export const readRental = async (rentalId, user) => {
  try {
    await rentalIdSchema.validate(rentalId);
    const response = await axios.get(`${API_BASE_URL}/rentals/${rentalId}`, {
      headers: {
        "Authorization": `Bearer ${user.access_token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateRental = async (rentalId, rentalData) => {
  try {
    await rentalIdSchema.validate(rentalId);
    await rentalEditSchema.validate(rentalData);
    const response = await axios.put(`${API_BASE_URL}/rentals/${rentalId}`, rentalData);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteRental = async (rentalId) => {
  try {
    await rentalIdSchema.validate(rentalId);
    const response = await axios.delete(`${API_BASE_URL}/rentals/${rentalId}`);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};


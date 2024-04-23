// my_next_mvp/services/rentalSearchService.js

import axios from 'axios';
import * as yup from 'yup';

// Base API URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Schema for the query parameters using yup
const queryParamsSchema = yup.object().shape({
  start_date: yup.date().nullable(),
  end_date: yup.date().nullable(),
  skip: yup.number().integer().min(0).default(0),
  limit: yup.number().integer().min(1).default(10)
});

// Service method to search rentals with filters
export const searchRentals = async (queryParams, user) => {
  try {
    // Validate the query parameters
    const validatedQueryParams = await queryParamsSchema.validate(queryParams, {
      stripUnknown: true
    });

    // Make the GET request to the API
    const response = await axios.get(`${API_BASE_URL}/rentals/search`, {
      headers: {
        "Authorization": `Bearer ${user.access_token}`,
      },
      params: validatedQueryParams
    });
    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.detail || error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from the server');
    } else if (error instanceof yup.ValidationError) {
      // Validation error from yup
      throw new Error(error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error in setting up the request');
    }
  }
};

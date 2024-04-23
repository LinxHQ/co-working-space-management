// my_next_mvp/services/authService.js

import axios from 'axios';
import * as yup from 'yup';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const userCreateSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  name: yup.string()
});

const registerUser = async (userData) => {
  try {
    await userCreateSchema.validate(userData, { abortEarly: false });
    const response = await axios.post(`${API_BASE_URL}/default-auth/register`, userData);
    return response.data;
  } catch (error) {
    let errorMsg = 'An error occurred during registration.';
    if (error instanceof yup.ValidationError) {
      errorMsg += ' ' + error.errors.join(', ');
    } else if (axios.isAxiosError(error) && error.response) {
      errorMsg += ` Status: ${error.response.status}.`;
      errorMsg += ' ' + (error.response.data.detail || error.message);
    }
    throw new Error(errorMsg);
  }
};

export { registerUser };

// Schema for authentication request body
const authenticateSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
  grant_type: yup.string().matches(/password/),
  scope: yup.string().default(''),
  client_id: yup.string(),
  client_secret: yup.string()
});

export const authenticateUser = async (userData) => {
  try {
    // Validate user data with yup
    const validUserData = await authenticateSchema.validate(userData);

    // Perform the POST request to authenticate the user
    const response = await axios.post(`${API_BASE_URL}/default-auth/authenticate`, validUserData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    return response.data;
  } catch (error) {
    // Handle validation errors
    if (error instanceof yup.ValidationError) {
      throw new Error(`Validation Error: ${error.message}`);
    }
    // Handle HTTP errors
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || 'An error occurred during the request.';
      throw new Error(`HTTP Error: ${message}`);
    }
    // Generic error
    throw new Error('An unexpected error has occurred.');
  }
};

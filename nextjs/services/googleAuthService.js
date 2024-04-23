// my_next_mvp/services/googleAuthService.js

import axios from 'axios';
import * as yup from 'yup';

// Schema validation for Google Auth token
const googleAuthTokenSchema = yup.object().shape({
    token: yup.string().required('Token is required')
});

export const googleAuth = async (token) => {
  try {
    await googleAuthTokenSchema.validate({ token });
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/default-auth/auth/google`, null, {
      params: { token }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status code out of the range of 2xx
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    throw error;
  }
};

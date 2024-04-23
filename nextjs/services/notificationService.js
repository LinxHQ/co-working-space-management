// src/services/notificationService.js

import axios from 'axios';
import * as yup from 'yup';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const searchNotificationsSchema = yup.object().shape({
  user_id: yup.string().required(),
  read_status: yup.boolean().required(),
  skip: yup.number().integer().default(0),
  limit: yup.number().integer().default(10)
});

export const searchNotifications = async ({ user_id, read_status, skip, limit }) => {
  try {
    await searchNotificationsSchema.validate({ user_id, read_status, skip, limit });

    const response = await axios.get(`${API_BASE_URL}/notifications/search`, {
      params: { user_id, read_status, skip, limit }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      throw new Error(error.response.data.detail || error.response.statusText);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from the server.');
    } else {
      // Something happened in setting up the request that triggered an error
      throw (error);
    }
  }
};

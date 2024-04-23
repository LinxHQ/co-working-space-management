// my_next_mvp/services/notificationsService.js

import axios from 'axios';
import * as yup from 'yup';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const notificationCreateSchema = yup.object().shape({
  message: yup.string().required(),
  read_status: yup.boolean().required(),
  user_id: yup.string().required()
});

export const createNotification = async (notificationData) => {
  try {
    await notificationCreateSchema.validate(notificationData);
    const response = await axios.post(`${API_BASE_URL}/notifications/`, notificationData);
    return response.data;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(error.errors.join(', '));
    }
    throw new Error('An error occurred while creating the notification.');
  }
};

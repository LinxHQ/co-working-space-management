// my_next_mvp/services/spaceService.js

import axios from 'axios';
import * as yup from 'yup';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const spaceIdSchema = yup.string().required();

const getSpace = async (spaceId, user) => {
  try {
    await spaceIdSchema.validate(spaceId);
    const response = await axios.get(`${API_BASE_URL}/spaces/${spaceId}`, {
      headers: {
        'Authorization': `Bearer ${user.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting space:', error.message);
    throw error;
  }
};

const updateSpace = async (spaceId, spaceData) => {
  try {
    await spaceIdSchema.validate(spaceId);
    const response = await axios.put(`${API_BASE_URL}/spaces/${spaceId}`, spaceData);
    return response.data;
  } catch (error) {
    console.error('Error updating space:', error.message);
    throw error;
  }
};

const deleteSpace = async (spaceId) => {
  try {
    await spaceIdSchema.validate(spaceId);
    const response = await axios.delete(`${API_BASE_URL}/spaces/${spaceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting space:', error.message);
    throw error;
  }
};

export { getSpace, updateSpace, deleteSpace };

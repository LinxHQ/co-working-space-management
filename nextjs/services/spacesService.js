// my_next_mvp/services/spacesService.js

import axios from 'axios';
import * as yup from 'yup';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Schema for GET Spaces parameters
const getSpacesSchema = yup.object().shape({
  type: yup.string(),
  availability: yup.string(),
  skip: yup.number().integer().default(0),
  limit: yup.number().integer().default(10)
});

// Schema for POST Create Space
const createSpaceSchema = yup.object().shape({
  name: yup.string().required(),
  type: yup.string().required(),
  fee: yup.number().required(),
  fee_type: yup.string().required(),
});

export const getSpaces = async (params, user) => {
  try {
    await getSpacesSchema.validate(params);
    const response = await axios.get(`${API_BASE_URL}/spaces`, { 
      headers: {
        'Authorization': `Bearer ${user.access_token}`
      },
      params 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching spaces:', error);
    throw error;
  }
};

export const createSpace = async (spaceData, user) => {
  try {
    //await createSpaceSchema.validate(spaceData);
    const response = await axios.post(`${API_BASE_URL}/spaces`, spaceData, {
      headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating space:', error);
    throw error;
  }
};

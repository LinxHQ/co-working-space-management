import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Downloads an image and returns a URL that can be used in an <img> tag.
 * @param {string} imageName The name of the image to download.
 * @returns {Promise<string>} A promise that resolves to the URL of the downloaded image.
 */
export async function downloadImage(imageName, user) {
    try {
      const response = await axios.get(`${API_BASE_URL}/download/${imageName}`, {
        responseType: 'blob',  // Important: It instructs Axios to download the image as a Blob.
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      const imageUrl = URL.createObjectURL(response.data);
      return imageUrl;
    } catch (error) {
      console.error('Failed to download image:', error);
      throw error;
    }
}
import axios from 'axios';

/**
 * Axios API client configured for the application.
 *
 * @type {import('axios').AxiosInstance}
 */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

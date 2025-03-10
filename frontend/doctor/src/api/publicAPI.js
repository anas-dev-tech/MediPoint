import axios from 'axios';

const publicAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


// No token needed for public requests
export default publicAPI;

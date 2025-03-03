import axios from 'axios';

const publicAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});


// No token needed for public requests
export default publicAPI;

import axios from 'axios';

const publicAPI = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});


// No token needed for public requests
export default publicAPI;

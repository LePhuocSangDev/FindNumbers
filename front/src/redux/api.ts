import axios from 'axios';

const api = axios.create({
  baseURL: 'https://find-number.onrender.com/',
});

export default api;

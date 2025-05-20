import axios from 'axios';

const api = axios.create({
  baseURL: '/api',     
  timeout: 2000,
});

export default api;
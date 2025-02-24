import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // Tu URL de backend
});

export default api;

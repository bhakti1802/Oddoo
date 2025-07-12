// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api', // Your backend is running at localhost:5000
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

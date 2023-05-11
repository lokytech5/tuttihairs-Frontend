// src/api/index.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api', // Replace with your backend API URL
});

export default apiClient;

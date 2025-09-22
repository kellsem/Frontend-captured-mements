import axios from "axios";

// Use variável de ambiente para flexibilidade
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-captured-mements-yotb.vercel.app';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('cm:token');
    if(accessToken){
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratamento de erros
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      localStorage.removeItem('cm:token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
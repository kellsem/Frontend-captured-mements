import axios from "axios";
export const axiosInstance = axios.create({
  baseURL:'backend-captured-mements-yotb-j6lu9em4q.vercel.app',
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('cm:token');
    if(accessToken){
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
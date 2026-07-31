import axios from 'axios'
import { BASE_URL } from './apiPaths'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

// request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
);

// response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        //  handle common error globally
        if (error.response) {
            if (error.response.status === 401) {
                // redirect to login
                window.location.href = '/login';
            } else if (error.response.status === 500) {
                console.log("Server Error");
            }
        } else if (error.code === 'ECONNABORTED') {
            console.log("Request Timed Out");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance
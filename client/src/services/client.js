import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
});

// request interceptor - logging
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('chill-token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// response interceptor - logging
apiClient.interceptors.response.use(
    (response) => {
        // console.log(`[API] Response ${response.status} from ${response.config.url}`);
        return response;
    },
    (error) => {
        // console.log('[API] Error:', error.response?.status, error.message);
        return Promise.reject(error);
    }
);

export default apiClient;
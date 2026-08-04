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
        // console.log(`[API] ${config.method.toUpperCase()} ${config.url}`,
        //     config.data || '');
        
        const user = JSON.parse(localStorage.getItem('chill-user') || 'null');
        if (user?.id) {
            config.headers['X-User-Id'] = user.id;
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
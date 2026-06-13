import axios from 'axios';

const configuredBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const baseURL = configuredBaseURL.replace(/\/$/, '').endsWith('/api')
    ? configuredBaseURL.replace(/\/$/, '')
    : `${configuredBaseURL.replace(/\/$/, '')}/api`;

const api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('alumniToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401 -> redirect to login
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('alumniUser');
            localStorage.removeItem('alumniToken');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default api;

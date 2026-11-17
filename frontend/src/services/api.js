import axios from 'axios';

// Central Axios HTTP client instance configured for the AquaSense AI backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: automatically attaches the saved JWT token to outbound requests
apiClient.interceptors.request.use(
  (requestConfiguration) => {
    const savedToken = localStorage.getItem('aquasense_token');
    if (savedToken) {
      requestConfiguration.headers.Authorization = `Bearer ${savedToken}`;
    }
    return requestConfiguration;
  },
  (requestError) => Promise.reject(requestError)
);

// Response interceptor: automatically redirects to login if the session expired (HTTP 401)
apiClient.interceptors.response.use(
  (successfulResponse) => successfulResponse,
  (responseError) => {
    const isUnauthorized = responseError.response && responseError.response.status === 401;
    if (isUnauthorized) {
      localStorage.removeItem('aquasense_token');
      localStorage.removeItem('aquasense_user');

      const isAlreadyOnAuthPage =
        window.location.pathname.includes('/login') ||
        window.location.pathname.includes('/register');

      if (!isAlreadyOnAuthPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(responseError);
  }
);

export default apiClient;

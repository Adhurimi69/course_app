import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
axios.defaults.withCredentials = true;

// Attach token from localStorage (or any store you use)
axios.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    // ignore
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

axios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (!originalRequest) return Promise.reject(err);

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // call refresh endpoint; note: path depends on role, so use generic '/api/auth/students/refresh' or adjust in your app
        const r = await axios.get('/api/auth/students/refresh');
        const newToken = r.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Optionally redirect to login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default axios;

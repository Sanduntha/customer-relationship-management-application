import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users')
};

// Lead API
export const leadAPI = {
  getAll: (params) => api.get('/leads', { params }),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  bulkUpdateStatus: (data) => api.put('/leads/bulk/status', data),
  exportCSV: (params) => api.get('/leads/export/csv', { params, responseType: 'blob' })
};

// Note API
export const noteAPI = {
  getByLead: (leadId) => api.get(`/leads/${leadId}/notes`),
  add: (leadId, data) => api.post(`/leads/${leadId}/notes`, data),
  delete: (leadId, noteId) => api.delete(`/leads/${leadId}/notes/${noteId}`)
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats')
};

export default api;

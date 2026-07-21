/**
 * Admin API utility — authenticated requests
 */
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const adminApi = axios.create({ baseURL: API_URL });

// Inject JWT token on every request
adminApi.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('vil_admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, err => Promise.reject(err));

// Auto-redirect to login on 401
adminApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('vil_admin_token');
      localStorage.removeItem('vil_admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export const buildPDFUrl = (category, filename) => {
  if (!filename) return '#';
  return `${BACKEND_URL}/uploads/${encodeURIComponent(filename)}`;
};

export const buildImageUrl = (filename) => {
  if (!filename) return '/placeholder-image.jpg';
  return `${BACKEND_URL}/uploads/${encodeURIComponent(filename)}`;
};

/**
 * Normalize any stored URL to use current backend
 */
export const normalizeFileUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads/') || url.startsWith('/investor/')) return url;
  if (url.includes('/uploads/')) return url.substring(url.indexOf('/uploads/'));
  if (url.includes('/investor/')) return url.substring(url.indexOf('/investor/'));
  if (url.startsWith('http')) {
    try {
      const u = new URL(url);
      if (u.pathname.startsWith('/uploads/') || u.pathname.startsWith('/investor/')) return u.pathname;
    } catch {}
  }
  return url;
};

export { API_URL, BACKEND_URL };
export default adminApi;

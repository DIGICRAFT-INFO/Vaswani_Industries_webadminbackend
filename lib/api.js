/**
 * Frontend API utility
 * Unified project — API runs on same port
 */
import axios from 'axios';

// Same origin since API is on same port
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// API URL (with /api)
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({ baseURL: API_URL });

// ── Public helpers
export const getSettings = async () => {
  const { data } = await api.get('/settings');
  return data.settings;
};

export const getProducts = async () => {
  const { data } = await api.get('/products');
  return data.products || [];
};

export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data.product;
};

export const getNews = async (params = {}) => {
  const { data } = await api.get('/news', { params });
  return data;
};

export const getNewsBySlug = async (slug) => {
  const { data } = await api.get(`/news/${slug}`);
  return data.news;
};

export const getBoardMembers = async () => {
  const { data } = await api.get('/board-members');
  return data.members || [];
};

export const getCommittees = async () => {
  const { data } = await api.get('/board-members/committees');
  return data.data || {};
};

export const getDocuments = async (params = {}) => {
  const { data } = await api.get('/documents', { params });
  return data;
};

export const getDocumentsByCategory = async () => {
  const { data } = await api.get('/documents/by-category');
  return data.data || {};
};

export const getDocumentBySlug = async (slug) => {
  const { data } = await api.get(`/documents/slug/${slug}`);
  return data.document;
};

export const getCareers = async () => {
  const { data } = await api.get('/careers');
  return data.jobs || [];
};

export const applyForJob = async (id, formData) => {
  const { data } = await api.post(`/careers/${id}/apply`, formData);
  return data;
};

export const submitContact = async (formData) => {
  const { data } = await api.post('/contacts', formData);
  return data;
};

/**
 * Build a file URL for PDFs stored on the backend
 */
export const buildPDFUrl = (category, filename) => {
  if (!filename) return '#';
  return `${BACKEND_URL}/uploads/${encodeURIComponent(filename)}`;
};

export const buildImageUrl = (filename) => {
  if (!filename) return '/placeholder.jpg';
  return `${BACKEND_URL}/uploads/${encodeURIComponent(filename)}`;
};

/**
 * Normalize any stored URL to use current backend
 * Handles URLs stored as http://localhost:3001/uploads/... or full domain URLs
 */
export const normalizeFileUrl = (url) => {
  if (!url) return '';

  let relative = url;

  // Extract relative path from full URL
  if (url.startsWith('http')) {
    try {
      const u = new URL(url);
      relative = u.pathname;
    } catch {
      relative = url;
    }
  } else if (url.includes('/uploads/')) {
    relative = url.substring(url.indexOf('/uploads/'));
  } else if (url.includes('/investor/')) {
    relative = url.substring(url.indexOf('/investor/'));
  }

  // Both /uploads/ and /investor/ are served as Next.js static files from public/
  if (relative.startsWith('/uploads/') || relative.startsWith('/investor/')) {
    return relative;
  }

  return relative;
};

export { API_URL, BACKEND_URL };
export default api;

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

export const productService = {
  getAll: (params) => api.get('/products', { params }).then((r) => r.data),
  getById: (id) => api.get(`/products/${id}`).then((r) => r.data),
  create: (data) => api.post('/products', data).then((r) => r.data),
  update: (id, data) => api.put(`/products/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/products/${id}`).then((r) => r.data),
};

export const cartService = {
  getCart: () => api.get('/cart').then((r) => r.data),
  addItem: (productId, quantity = 1) =>
    api.post('/cart', { productId, quantity }).then((r) => r.data),
  updateItem: (id, quantity) => api.put(`/cart/${id}`, { quantity }).then((r) => r.data),
  removeItem: (id) => api.delete(`/cart/${id}`).then((r) => r.data),
  clearCart: () => api.delete('/cart').then((r) => r.data),
};

// API utility functions for Home Origin platform
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.homeorigin.co.uk' 
  : 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Get authentication headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Product methods
  async getProducts(params = {}) {
    return this.get('/products', params);
  }

  async getProduct(productId) {
    return this.get(`/products/${productId}`);
  }

  async getCategories() {
    return this.get('/categories');
  }

  // Vendor methods
  async getVendors(params = {}) {
    return this.get('/vendors', params);
  }

  async getVendor(vendorId) {
    return this.get(`/vendors/${vendorId}`);
  }

  // Order methods
  async createOrder(orderData) {
    return this.post('/orders', orderData);
  }

  async getOrders(params = {}) {
    return this.get('/orders', params);
  }

  async getOrder(orderId) {
    return this.get(`/orders/${orderId}`);
  }

  async updateOrderStatus(orderId, status, notes = '') {
    return this.put(`/orders/${orderId}/status`, { status, notes });
  }

  // User profile methods
  async updateProfile(userData) {
    const user = await this.getCurrentUser();
    return this.put(`/users/${user.user.id}`, userData);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export individual methods for convenience
export const {
  login,
  register,
  getCurrentUser,
  logout,
  getProducts,
  getProduct,
  getCategories,
  getVendors,
  getVendor,
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  updateProfile,
} = apiClient;


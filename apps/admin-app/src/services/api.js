// API service for Modern Market Connect Admin Dashboard
const API_BASE_URL = 'https://0vhlizckl8p1.manus.space'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // User Management APIs
  async getUsers() {
    return this.request('/users')
  }

  async getUserById(id) {
    return this.request(`/users/${id}`)
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  // Vendor Management APIs
  async getVendors() {
    return this.request('/vendors')
  }

  async getVendorById(id) {
    return this.request(`/vendors/${id}`)
  }

  async createVendor(vendorData) {
    return this.request('/vendors', {
      method: 'POST',
      body: JSON.stringify(vendorData),
    })
  }

  async updateVendor(id, vendorData) {
    return this.request(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vendorData),
    })
  }

  async approveVendor(id) {
    return this.request(`/vendors/${id}/approve`, {
      method: 'POST',
    })
  }

  async suspendVendor(id) {
    return this.request(`/vendors/${id}/suspend`, {
      method: 'POST',
    })
  }

  // Order Management APIs
  async getOrders() {
    return this.request('/orders')
  }

  async getOrderById(id) {
    return this.request(`/orders/${id}`)
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async assignRider(orderId, riderId) {
    return this.request(`/orders/${orderId}/assign-rider`, {
      method: 'POST',
      body: JSON.stringify({ rider_id: riderId }),
    })
  }

  // Rider Management APIs
  async getRiders() {
    return this.request('/riders')
  }

  async getRiderById(id) {
    return this.request(`/riders/${id}`)
  }

  async createRider(riderData) {
    return this.request('/riders', {
      method: 'POST',
      body: JSON.stringify(riderData),
    })
  }

  async updateRider(id, riderData) {
    return this.request(`/riders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(riderData),
    })
  }

  async approveRider(id) {
    return this.request(`/riders/${id}/approve`, {
      method: 'POST',
    })
  }

  async suspendRider(id) {
    return this.request(`/riders/${id}/suspend`, {
      method: 'POST',
    })
  }

  // Analytics APIs
  async getDashboardStats() {
    return this.request('/admin/dashboard-stats')
  }

  async getAnalytics(timeRange = '7d') {
    return this.request(`/admin/analytics?range=${timeRange}`)
  }

  async getSalesAnalytics(timeRange = '7d') {
    return this.request(`/admin/sales-analytics?range=${timeRange}`)
  }

  async getUserAnalytics(timeRange = '7d') {
    return this.request(`/admin/user-analytics?range=${timeRange}`)
  }

  async getVendorPerformance() {
    return this.request('/admin/vendor-performance')
  }

  async getDeliveryMetrics() {
    return this.request('/admin/delivery-metrics')
  }

  // Admin APIs
  async getSystemStatus() {
    return this.request('/admin/system-status')
  }

  async getSettings() {
    return this.request('/admin/settings')
  }

  async updateSettings(settings) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }

  // Payment APIs
  async getPaymentStats() {
    return this.request('/admin/payment-stats')
  }

  async processRefund(orderId, amount) {
    return this.request('/payments/refund', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, amount }),
    })
  }
}

export default new ApiService()


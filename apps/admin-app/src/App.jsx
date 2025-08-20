import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminHeader from './components/AdminHeader'
import AdminSidebar from './components/AdminSidebar'
import Dashboard from './components/Dashboard'
import UserManagement from './components/UserManagement'
import VendorManagement from './components/VendorManagement'
import ProductManagement from './components/ProductManagement'
import CategoryManagement from './components/CategoryManagement'
import OrderManagement from './components/OrderManagement'
import RiderManagement from './components/RiderManagement'
import DeliveryManagement from './components/DeliveryManagement'
import Analytics from './components/Analytics'
import AIAnalytics from './components/AIAnalytics'
import AIAnalyticsDashboard from './components/AIAnalyticsDashboard';
import AdminSlider from './components/AdminSlider';
import SettingsPage from './components/SettingsPage';
import AnalyticsTracker from './utils/analytics';
import './App.css'

// Initialize analytics tracker
const analytics = new AnalyticsTracker('admin');

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className={`transition-all duration-300 pt-16 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}>
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/vendors" element={<VendorManagement />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/categories" element={<CategoryManagement />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/riders" element={<RiderManagement />} />
              <Route path="/delivery" element={<DeliveryManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai-analytics" element={<AIAnalytics />} />
              <Route path="/ai-dashboard" element={<AIAnalyticsDashboard />} />
              <Route path="/admin-controls" element={<AdminSlider />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App


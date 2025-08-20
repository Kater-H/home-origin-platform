import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import VendorHeader from './components/VendorHeader'
import VendorDashboard from './components/VendorDashboard'
import ProductManagement from './components/ProductManagement'
import OrderFulfillment from './components/OrderFulfillment'
import DeliveryManagement from './components/DeliveryManagement';
import AIInsights from './components/AIInsights';
import AnalyticsTracker from './utils/analytics';
import './App.css'

// Initialize analytics tracker
const analytics = new AnalyticsTracker('vendor');

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <VendorHeader />
        
        <main>
          <Routes>
            <Route path="/" element={<VendorDashboard />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderFulfillment />} />
            <Route path="/delivery" element={<DeliveryManagement />} />
            <Route path="/ai-insights" element={<AIInsights />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App



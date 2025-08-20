import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RiderHeader from './components/RiderHeader'
import RiderDashboard from './components/RiderDashboard';
import RiderProfile from './components/RiderProfile';
import AnalyticsTracker from './utils/analytics';
import './App.css'

// Initialize analytics tracker
const analytics = new AnalyticsTracker('rider');

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <RiderHeader />
        
        <main>
          <Routes>
            <Route path="/" element={<RiderDashboard />} />
            <Route path="/profile" element={<RiderProfile riderId="rider_123" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App



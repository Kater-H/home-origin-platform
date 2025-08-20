import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import SearchHeader from './components/SearchHeader'
import NewHomepage from './components/NewHomepage'
import SearchPage from './components/SearchPage'
import BottomNavBar from './components/BottomNavBar'
import SmartShopperOCR from './components/SmartShopperOCR'
import EnhancedCart from './components/EnhancedCart'
import Checkout from './components/Checkout'
import OrderTracking from './components/OrderTracking'
import UserProfile from './components/UserProfile'
import AuthModal from './components/AuthModal'
import ThemeProvider from './components/ThemeProvider'
import CrossDeviceTracker from './components/CrossDeviceTracker'
import UltraReliableChatWidget from './components/UltraReliableChatWidget';
import AnalyticsTracker from './utils/analytics';
import apiClient from './utils/api';
import './App.css'

// Initialize analytics tracker
const analytics = new AnalyticsTracker('buyer');

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')
  const [cartItems, setCartItems] = useState([])
  const [currentOrder, setCurrentOrder] = useState(null)

  // Load cart from localStorage on app start
  useEffect(() => {
    const savedCart = localStorage.getItem('home_origin_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('home_origin_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
    
    // Track add to cart event
    analytics.trackAddToCart(product.id, product.name, 1, product.price)
    
    // Show cart briefly
    setIsCartOpen(true)
    setTimeout(() => setIsCartOpen(false), 2000)
  }

  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  }

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  }

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <SearchHeader 
              onCartClick={() => setIsCartOpen(true)} 
              onAuthClick={openAuthModal}
              cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            />
            
            <main>
              <Routes>
                <Route path="/" element={<NewHomepage onAddToCart={handleAddToCart} />} />
                <Route path="/search" element={<SearchPage onAddToCart={handleAddToCart} />} />
                <Route path="/smart-shopper" element={<SmartShopperOCR onAddToCart={handleAddToCart} />} />
                <Route path="/checkout" element={
                  <Checkout 
                    cartItems={cartItems}
                    onBack={() => window.history.back()}
                    onOrderComplete={(order) => {
                      // Track purchase completion
                      const cartValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                      const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
                      analytics.trackPurchase(order.id, cartValue, itemCount, order.paymentMethod)
                      
                      setCurrentOrder(order);
                      setCartItems([]);
                      window.location.href = '/track-order';
                    }}
                    onAuthRequired={() => openAuthModal('login')}
                  />
                } />
                <Route path="/track-order" element={<OrderTracking currentOrder={currentOrder} />} />
                <Route path="/profile" element={<UserProfile onAuthRequired={() => openAuthModal('login')} />} />
              </Routes>
            </main>

            {/* Bottom Navigation */}
            <BottomNavBar 
              cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              onCartClick={() => setIsCartOpen(true)}
            />
            
            {/* Cross-Device Tracking */}
            <CrossDeviceTracker userId="user_123" />
            
            {/* Enhanced Cart Sidebar */}
            <EnhancedCart 
              isOpen={isCartOpen} 
              onClose={() => setIsCartOpen(false)}
              cartItems={cartItems}
              onUpdateCart={setCartItems}
              onRemoveItem={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateCartQuantity}
            />

            {/* Authentication Modal */}
            <AuthModal 
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              initialMode={authModalMode}
            />

            {/* Chat Widget */}
            <UltraReliableChatWidget />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App


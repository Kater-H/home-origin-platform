import React from 'react'
import { Home, Search, ShoppingCart, User, Heart, Brain } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const BottomNavBar = ({ cartItemCount, onCartClick }) => {
  const location = useLocation()
  
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'search', icon: Search, label: 'Search', path: '/search' },
    { id: 'smart-shopper', icon: Brain, label: 'Smart Shopper', path: '/smart-shopper' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', path: '/cart', count: cartItemCount },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
  ]

  const handleNavClick = (item) => {
    if (item.id === 'cart') {
      onCartClick()
    } else if (item.id === 'smart-shopper') {
      // Navigate to Smart Shopper page
      window.location.href = item.path
    } else {
      // Handle navigation to other routes
      window.location.href = item.path
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const IconComponent = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-green-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="relative">
                  <IconComponent className="h-5 w-5" />
                  {item.count && item.count > 0 && (
                    <span className="absolute -top-2 -right-2 h-4 w-4 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.count > 99 ? '99+' : item.count}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default BottomNavBar


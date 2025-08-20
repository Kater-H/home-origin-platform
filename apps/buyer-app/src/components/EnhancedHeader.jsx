import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  MapPin, 
  Heart,
  Bell,
  ChevronDown,
  Package
} from 'lucide-react'

const EnhancedHeader = ({ onCartClick, cartItemCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  const navigationItems = [
    { name: 'Home', path: '/', icon: null },
    { name: 'Categories', path: '/categories', icon: null },
    { name: 'Smart Shopper', path: '/smart-shopper', icon: null },
    { name: 'Track Order', path: '/track-order', icon: Package },
    { name: 'My Account', path: '/profile', icon: User }
  ]

  const isActivePath = (path) => {
    return location.pathname === path
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log('Searching for:', searchQuery)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top Bar - Hidden on mobile */}
      <div className="bg-gray-50 border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Deliver to Makurdi, Nigeria</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome to Modern Market Connect</span>
              <span className="text-green-600 font-medium">Free delivery on orders above ₦5,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Free Delivery Banner */}
      <div className="bg-green-50 border-b md:hidden">
        <div className="px-4 py-2">
          <div className="text-center">
            <span className="text-green-600 font-medium text-sm">Free delivery on orders above ₦5,000</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MM</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Modern Market</h1>
                <p className="text-xs text-gray-500 -mt-1">Connect</p>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop only */}
          <div className="flex-1 max-w-2xl mx-8 hidden lg:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className={`relative transition-all duration-200 ${
                isSearchFocused ? 'ring-2 ring-green-500' : 'ring-1 ring-gray-300'
              } rounded-lg`}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search for products, vendors, or categories..."
                  className="w-full pl-4 pr-12 py-3 border-0 rounded-lg focus:outline-none text-gray-900 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              
              {/* Search Suggestions (placeholder) */}
              {isSearchFocused && searchQuery && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                  <div className="p-4">
                    <p className="text-sm text-gray-500">Search suggestions will appear here</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Wishlist - Hidden on mobile */}
            <button className="hidden lg:flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="text-sm">Wishlist</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>

            {/* Account - Hidden on mobile */}
            <div className="relative group hidden md:block">
              <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden lg:block text-sm">Account</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* Account Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Orders
                  </Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Wishlist
                  </Link>
                  <hr className="my-1" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:block text-sm font-medium">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop only */}
      <div className="bg-gray-50 border-t hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-8 h-12">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  isActivePath(item.path)
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden bg-white border-t px-4 py-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.name}</span>
              </Link>
            ))}
            
            <hr className="my-2" />
            
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 w-full">
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </button>

            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 w-full">
              <User className="w-4 h-4" />
              <span>My Account</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

export default EnhancedHeader


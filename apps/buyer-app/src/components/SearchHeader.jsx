import React, { useState } from 'react'
import { Search, MapPin, Bell, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SearchHeader = ({ onCartClick, cartItemCount }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentLocation] = useState('Lagos, Nigeria')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchInputClick = () => {
    navigate('/search')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top row with location and profile */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Deliver to</p>
              <p className="text-xs text-gray-600">{currentLocation}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            
            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <div className="relative">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </button>
            
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products, stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={handleSearchInputClick}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm cursor-pointer"
            />
          </div>
        </form>
      </div>
    </header>
  )
}

export default SearchHeader


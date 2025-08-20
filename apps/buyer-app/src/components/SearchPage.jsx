import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Star, Clock, Truck } from 'lucide-react'

const SearchPage = ({ onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('products') // 'products' or 'stores'
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    rating: 'all',
    deliveryTime: 'all'
  })

  // Mock data for search results
  const mockProducts = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      price: 500,
      vendor: 'Mama Kemi\'s Store',
      rating: 4.5,
      reviews: 128,
      image: '/api/placeholder/80/80',
      category: 'vegetables',
      deliveryTime: '15-25 min'
    },
    {
      id: 2,
      name: 'Rice (5kg)',
      price: 3500,
      vendor: 'Benue Grains',
      rating: 4.8,
      reviews: 89,
      image: '/api/placeholder/80/80',
      category: 'grains',
      deliveryTime: '25-35 min'
    },
    {
      id: 3,
      name: 'Cooking Oil (1L)',
      price: 1200,
      vendor: 'Fresh Mart',
      rating: 4.3,
      reviews: 145,
      image: '/api/placeholder/80/80',
      category: 'cooking',
      deliveryTime: '20-30 min'
    },
    {
      id: 4,
      name: 'Fresh Milk (1L)',
      price: 800,
      vendor: 'Fresh Mart',
      rating: 4.6,
      reviews: 156,
      image: '/api/placeholder/80/80',
      category: 'dairy',
      deliveryTime: '20-30 min'
    },
    {
      id: 5,
      name: 'Whole Chicken',
      price: 2500,
      vendor: 'Fresh Mart',
      rating: 4.7,
      reviews: 67,
      image: '/api/placeholder/80/80',
      category: 'meat',
      deliveryTime: '20-30 min'
    }
  ]

  const mockStores = [
    {
      id: 1,
      name: 'Mama Kemi\'s Store',
      rating: 4.8,
      reviews: 245,
      deliveryTime: '15-25 min',
      distance: '0.8 km',
      deliveryFee: 'Free',
      tags: ['Fast delivery', 'Popular'],
      image: '/api/placeholder/100/100'
    },
    {
      id: 2,
      name: 'Fresh Mart',
      rating: 4.6,
      reviews: 189,
      deliveryTime: '20-30 min',
      distance: '1.2 km',
      deliveryFee: '₦200',
      tags: ['Fresh produce', 'Organic'],
      image: '/api/placeholder/100/100'
    },
    {
      id: 3,
      name: 'Benue Grains',
      rating: 4.7,
      reviews: 156,
      deliveryTime: '25-35 min',
      distance: '1.5 km',
      deliveryFee: '₦300',
      tags: ['Bulk buying', 'Wholesale'],
      image: '/api/placeholder/100/100'
    }
  ]

  const handleSearch = (query) => {
    setIsLoading(true)
    setSearchQuery(query)
    
    // Simulate API call
    setTimeout(() => {
      if (activeTab === 'products') {
        const filtered = mockProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.vendor.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(filtered)
      } else {
        const filtered = mockStores.filter(store =>
          store.name.toLowerCase().includes(query.toLowerCase()) ||
          store.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
        setSearchResults(filtered)
      }
      setIsLoading(false)
    }, 500)
  }

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery)
    } else {
      setSearchResults([])
    }
  }, [activeTab, searchQuery])

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-start space-x-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.vendor}</p>
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{product.deliveryTime}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
            <button
              onClick={() => onAddToCart(product)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const StoreCard = ({ store }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-start space-x-4">
        <img
          src={store.image}
          alt={store.name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{store.name}</h3>
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{store.rating}</span>
              <span className="text-sm text-gray-500">({store.reviews})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{store.deliveryTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{store.distance}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Truck className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{store.deliveryFee} delivery</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {store.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products, stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              autoFocus
            />
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'stores'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Stores
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : searchQuery ? (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                {searchResults.length} {activeTab} found for "{searchQuery}"
              </p>
            </div>
            
            {searchResults.length > 0 ? (
              <div>
                {activeTab === 'products'
                  ? searchResults.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  : searchResults.map((store) => (
                      <StoreCard key={store.id} store={store} />
                    ))
                }
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try searching with different keywords or browse our categories
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for products and stores</h3>
            <p className="text-gray-600">
              Find your favorite products from local vendors
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage


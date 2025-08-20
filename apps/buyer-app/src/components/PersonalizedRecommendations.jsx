import { useState, useEffect } from 'react'
import { Star, ShoppingCart, Heart, TrendingUp } from 'lucide-react'

const PersonalizedRecommendations = ({ userId = 'user_123', onAddToCart }) => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPersonalizedRecommendations()
  }, [userId])

  const fetchPersonalizedRecommendations = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/recommendations/user/${userId}/personalized?top_k=6`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setRecommendations(data.personalized_products || [])
      } else {
        throw new Error(data.error || 'Failed to get recommendations')
      }
    } catch (err) {
      console.error('Error fetching personalized recommendations:', err)
      setError(err.message)
      // Fallback to mock data
      setRecommendations([
        {
          id: '1',
          name: 'Fresh Tomatoes',
          price: 500,
          image: '/api/placeholder/300/300',
          rating: 4.5,
          vendor: 'Mama Kemi\'s Store',
          predicted_rating: 4.8
        },
        {
          id: '2',
          name: 'Premium Rice (5kg)',
          price: 3500,
          image: '/api/placeholder/300/300',
          rating: 4.8,
          vendor: 'Benue Grains',
          predicted_rating: 4.7
        },
        {
          id: '3',
          name: 'Cooking Oil (1L)',
          price: 1200,
          image: '/api/placeholder/300/300',
          rating: 4.2,
          vendor: 'Fresh Mart',
          predicted_rating: 4.5
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        vendor: product.vendor
      })
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
          Recommended for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
          Recommended for You
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Unable to load personalized recommendations</p>
          <button 
            onClick={fetchPersonalizedRecommendations}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
          Recommended for You
        </h2>
        <span className="text-sm text-gray-500 bg-green-50 px-3 py-1 rounded-full">
          AI-Powered
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Product Image */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = '/api/placeholder/300/300'
                }}
              />
              
              {/* AI Prediction Badge */}
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {product.predicted_rating?.toFixed(1)}★ for you
              </div>

              {/* Wishlist Button */}
              <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50">
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-2">
                {product.vendor}
              </p>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  ({product.rating})
                </span>
              </div>

              {/* Price and Add to Cart */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">
                    ₦{product.price?.toLocaleString()}
                  </span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm">Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No personalized recommendations available yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Shop more products to get better recommendations!
          </p>
        </div>
      )}
    </div>
  )
}

export default PersonalizedRecommendations


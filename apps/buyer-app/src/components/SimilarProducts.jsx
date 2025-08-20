import { useState, useEffect } from 'react'
import { Star, ShoppingCart, Heart, ArrowRight } from 'lucide-react'

const SimilarProducts = ({ productId, onAddToCart }) => {
  const [similarProducts, setSimilarProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (productId) {
      fetchSimilarProducts()
    }
  }, [productId])

  const fetchSimilarProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/recommendations/product/${productId}/similar?top_k=4`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch similar products')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setSimilarProducts(data.similar_products || [])
      } else {
        throw new Error(data.error || 'Failed to get similar products')
      }
    } catch (err) {
      console.error('Error fetching similar products:', err)
      setError(err.message)
      // Fallback to mock data
      setSimilarProducts([
        {
          id: '2',
          name: 'Premium Rice (5kg)',
          price: 3500,
          image: '/api/placeholder/300/300',
          rating: 4.8,
          similarity_score: 0.85
        },
        {
          id: '3',
          name: 'Cooking Oil (1L)',
          price: 1200,
          image: '/api/placeholder/300/300',
          rating: 4.2,
          similarity_score: 0.72
        },
        {
          id: '4',
          name: 'Fresh Pepper (500g)',
          price: 300,
          image: '/api/placeholder/300/300',
          rating: 4.0,
          similarity_score: 0.68
        },
        {
          id: '5',
          name: 'Onions (1kg)',
          price: 800,
          image: '/api/placeholder/300/300',
          rating: 4.3,
          similarity_score: 0.65
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
        image: product.image
      })
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Customers who bought this also bought
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && similarProducts.length === 0) {
    return null // Don't show anything if there's an error and no fallback data
  }

  if (similarProducts.length === 0) {
    return null // Don't show the section if no similar products
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Customers who bought this also bought
        </h3>
        <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
          AI-Powered
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {similarProducts.map((product) => (
          <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
            {/* Product Image */}
            <div className="relative h-32 bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = '/api/placeholder/300/300'
                }}
              />
              
              {/* Similarity Score Badge */}
              <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {Math.round(product.similarity_score * 100)}% match
              </div>

              {/* Wishlist Button */}
              <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50">
                <Heart className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-3">
              <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                {product.name}
              </h4>

              {/* Rating */}
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600 ml-1">
                  ({product.rating})
                </span>
              </div>

              {/* Price and Add to Cart */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">
                  ₦{product.price?.toLocaleString()}
                </span>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center space-x-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors duration-200"
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="mt-4 text-center">
        <button className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
          View more similar products
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  )
}

export default SimilarProducts


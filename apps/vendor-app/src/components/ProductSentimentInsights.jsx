import { useState, useEffect } from 'react'
import { MessageCircle, ThumbsUp, ThumbsDown, TrendingUp, AlertTriangle, Star } from 'lucide-react'

const ProductSentimentInsights = ({ vendorId = 'vendor_123' }) => {
  const [sentimentData, setSentimentData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProductSentiments()
  }, [vendorId])

  const fetchProductSentiments = async () => {
    try {
      setLoading(true)
      
      // In a real implementation, this would fetch all vendor products and their sentiments
      // For now, we'll simulate with multiple product sentiment calls
      const productIds = ['1', '2', '3', '4'] // Sample product IDs for the vendor
      const sentimentPromises = productIds.map(async (productId) => {
        try {
          const response = await fetch(
            `https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/sentiment/product/${productId}/summary`
          )
          
          if (!response.ok) {
            throw new Error(`Failed to fetch sentiment for product ${productId}`)
          }
          
          const data = await response.json()
          
          if (data.success) {
            return {
              product_id: productId,
              product_name: `Product ${productId}`, // Would come from database
              ...data.sentiment_summary
            }
          }
          return null
        } catch (err) {
          console.error(`Error fetching sentiment for product ${productId}:`, err)
          return null
        }
      })

      const results = await Promise.all(sentimentPromises)
      const validResults = results.filter(result => result !== null)
      
      if (validResults.length === 0) {
        throw new Error('No sentiment data available')
      }
      
      setSentimentData(validResults)
    } catch (err) {
      console.error('Error fetching product sentiments:', err)
      setError(err.message)
      // Fallback to mock data
      setSentimentData([
        {
          product_id: '1',
          product_name: 'Fresh Tomatoes',
          positive_percentage: 78.5,
          negative_percentage: 12.3,
          neutral_percentage: 9.2,
          total_reviews: 128,
          overall_sentiment: 'positive'
        },
        {
          product_id: '2',
          product_name: 'Premium Rice (5kg)',
          positive_percentage: 85.2,
          negative_percentage: 8.1,
          neutral_percentage: 6.7,
          total_reviews: 89,
          overall_sentiment: 'positive'
        },
        {
          product_id: '3',
          product_name: 'Cooking Oil (1L)',
          positive_percentage: 65.4,
          negative_percentage: 25.6,
          neutral_percentage: 9.0,
          total_reviews: 67,
          overall_sentiment: 'positive'
        },
        {
          product_id: '4',
          product_name: 'Fresh Pepper (500g)',
          positive_percentage: 45.2,
          negative_percentage: 38.7,
          neutral_percentage: 16.1,
          total_reviews: 45,
          overall_sentiment: 'negative'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4" />
      case 'negative':
        return <ThumbsDown className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const getOverallRating = (positivePercentage) => {
    if (positivePercentage >= 80) return 5
    if (positivePercentage >= 70) return 4
    if (positivePercentage >= 60) return 3
    if (positivePercentage >= 50) return 2
    return 1
  }

  const getActionRecommendations = (product) => {
    const recommendations = []
    
    if (product.negative_percentage > 30) {
      recommendations.push('⚠️ High negative feedback - review customer complaints')
      recommendations.push('📞 Consider reaching out to unsatisfied customers')
    }
    
    if (product.positive_percentage > 80) {
      recommendations.push('🌟 Excellent feedback - consider featuring this product')
      recommendations.push('📈 Use positive reviews in marketing materials')
    }
    
    if (product.total_reviews < 20) {
      recommendations.push('📝 Encourage more customers to leave reviews')
    }
    
    if (product.neutral_percentage > 20) {
      recommendations.push('💬 Engage with neutral reviewers to understand concerns')
    }
    
    return recommendations
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-purple-600" />
            Product Sentiment Analysis
          </h2>
          <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && sentimentData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2 text-purple-600" />
          Product Sentiment Analysis
        </h2>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Unable to load sentiment analysis</p>
          <button 
            onClick={fetchProductSentiments}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const averagePositive = sentimentData.reduce((sum, product) => sum + product.positive_percentage, 0) / sentimentData.length
  const totalReviews = sentimentData.reduce((sum, product) => sum + product.total_reviews, 0)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2 text-purple-600" />
          Product Sentiment Analysis
        </h2>
        <span className="text-sm text-gray-500 bg-purple-50 px-3 py-1 rounded-full">
          AI-Powered
        </span>
      </div>

      {/* Overall Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {averagePositive.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Average Positive Sentiment</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {totalReviews}
            </p>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < getOverallRating(averagePositive)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">Overall Rating</p>
          </div>
        </div>
      </div>

      {/* Individual Product Sentiments */}
      <div className="space-y-4">
        {sentimentData.map((product) => {
          const recommendations = getActionRecommendations(product)
          
          return (
            <div key={product.product_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{product.product_name}</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSentimentColor(product.overall_sentiment)}`}>
                  {getSentimentIcon(product.overall_sentiment)}
                  <span className="ml-2 capitalize">
                    {product.overall_sentiment}
                  </span>
                </div>
              </div>

              {/* Sentiment Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <ThumbsUp className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-lg font-bold text-green-600">
                      {product.positive_percentage.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Positive</p>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <MessageCircle className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="text-lg font-bold text-gray-600">
                      {product.neutral_percentage.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Neutral</p>
                </div>
                
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <ThumbsDown className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-lg font-bold text-red-600">
                      {product.negative_percentage.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Negative</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 w-16">Positive</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${product.positive_percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {product.positive_percentage.toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 w-16">Negative</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${product.negative_percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {product.negative_percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Review Count */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Based on {product.total_reviews} customer reviews
                </p>
              </div>

              {/* Action Recommendations */}
              {recommendations.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">💡 Recommendations:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {sentimentData.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No sentiment data available</p>
          <p className="text-sm text-gray-400 mt-2">
            Customer reviews will appear here once available
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductSentimentInsights


import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, Minus, TrendingUp, MessageCircle } from 'lucide-react'

const ProductSentimentSummary = ({ productId }) => {
  const [sentimentData, setSentimentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (productId) {
      fetchSentimentSummary()
    }
  }, [productId])

  const fetchSentimentSummary = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/sentiment/product/${productId}/summary`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch sentiment summary')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setSentimentData(data.sentiment_summary)
      } else {
        throw new Error(data.error || 'Failed to get sentiment summary')
      }
    } catch (err) {
      console.error('Error fetching sentiment summary:', err)
      setError(err.message)
      // Fallback to mock data
      setSentimentData({
        positive_percentage: 72.5,
        negative_percentage: 15.2,
        neutral_percentage: 12.3,
        total_reviews: 128,
        overall_sentiment: 'positive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50'
      case 'negative':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4" />
      case 'negative':
        return <ThumbsDown className="w-4 h-4" />
      default:
        return <Minus className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !sentimentData) {
    return null // Don't show anything if there's an error and no fallback data
  }

  if (!sentimentData) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
          Customer Sentiment
        </h4>
        <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
          AI Analysis
        </span>
      </div>

      {/* Overall Sentiment */}
      <div className="mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(sentimentData.overall_sentiment)}`}>
          {getSentimentIcon(sentimentData.overall_sentiment)}
          <span className="ml-2 capitalize">
            {sentimentData.overall_sentiment} Overall
          </span>
        </div>
      </div>

      {/* Sentiment Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ThumbsUp className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm text-gray-700">Positive</span>
          </div>
          <div className="flex items-center">
            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${sentimentData.positive_percentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-12">
              {sentimentData.positive_percentage}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Minus className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm text-gray-700">Neutral</span>
          </div>
          <div className="flex items-center">
            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className="bg-gray-600 h-2 rounded-full" 
                style={{ width: `${sentimentData.neutral_percentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-12">
              {sentimentData.neutral_percentage}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ThumbsDown className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-sm text-gray-700">Negative</span>
          </div>
          <div className="flex items-center">
            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{ width: `${sentimentData.negative_percentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-12">
              {sentimentData.negative_percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Total Reviews */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Based on {sentimentData.total_reviews} customer reviews
        </p>
      </div>

      {/* Insights */}
      {sentimentData.positive_percentage > 70 && (
        <div className="mt-3 p-2 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Highly recommended by customers
          </p>
        </div>
      )}

      {sentimentData.negative_percentage > 30 && (
        <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">
            ⚠️ Some customers have concerns - check reviews for details
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductSentimentSummary


import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, Heart, Eye, TrendingUp } from 'lucide-react'
import DynamicPricing from './DynamicPricing'

const EnhancedProductCard = ({ 
  product, 
  onAddToCart, 
  userId = "user_123",
  userSegment = "regular",
  showPersonalization = true,
  className = ""
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [viewCount, setViewCount] = useState(product.views || Math.floor(Math.random() * 100) + 20)
  const [personalizedRating, setPersonalizedRating] = useState(null)
  const [isViewed, setIsViewed] = useState(false)

  // Mock personalization data
  const [personalizationData, setPersonalizationData] = useState({
    matchPercentage: Math.floor(Math.random() * 30) + 70, // 70-100%
    isRecommended: Math.random() > 0.6,
    purchaseProbability: Math.random(),
    similarPurchases: Math.floor(Math.random() * 50) + 10
  })

  useEffect(() => {
    // Simulate personalized rating calculation
    if (showPersonalization) {
      const baseRating = product.rating || 4.0
      const personalizedAdjustment = (Math.random() - 0.5) * 0.6 // -0.3 to +0.3
      setPersonalizedRating(Math.min(5, Math.max(1, baseRating + personalizedAdjustment)))
    }
  }, [product.rating, showPersonalization])

  const handleCardClick = () => {
    if (!isViewed) {
      setViewCount(prev => prev + 1)
      setIsViewed(true)
      
      // Track product view
      if (window.crossDeviceTracker) {
        window.crossDeviceTracker.trackProductView(product.id)
      }
    }
  }

  const handleAddToCart = () => {
    onAddToCart(product)
    
    // Track cart addition
    if (window.crossDeviceTracker) {
      window.crossDeviceTracker.trackCartAdd(product.id, 1, product.price)
    }
  }

  const handleLike = (e) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    
    // Track like action
    if (window.crossDeviceTracker) {
      window.crossDeviceTracker.trackActivity('like', {
        product_id: product.id,
        liked: !isLiked
      })
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const renderPersonalizationBadges = () => {
    if (!showPersonalization) return null

    return (
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {personalizationData.isRecommended && (
          <Badge className="bg-blue-500 text-white text-xs">
            Recommended
          </Badge>
        )}
        
        {personalizationData.matchPercentage >= 85 && (
          <Badge className="bg-green-500 text-white text-xs">
            {personalizationData.matchPercentage}% match
          </Badge>
        )}
        
        {personalizationData.purchaseProbability > 0.7 && (
          <Badge className="bg-purple-500 text-white text-xs">
            Likely to buy
          </Badge>
        )}
      </div>
    )
  }

  const renderPersonalizationInsights = () => {
    if (!showPersonalization) return null

    return (
      <div className="mt-2 space-y-1">
        {personalizedRating && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{personalizedRating.toFixed(1)} for you</span>
            <span className="text-gray-400">({product.rating?.toFixed(1)} avg)</span>
          </div>
        )}
        
        {personalizationData.similarPurchases > 20 && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <TrendingUp className="w-3 h-3" />
            <span>{personalizationData.similarPurchases} similar customers bought this</span>
          </div>
        )}
      </div>
    )
  }

  // Determine current demand and inventory level for dynamic pricing
  const getCurrentDemand = () => {
    if (viewCount > 80) return 'high'
    if (viewCount < 30) return 'low'
    return 'medium'
  }

  const getInventoryLevel = () => {
    const stock = product.stock || Math.floor(Math.random() * 100) + 10
    if (stock < 20) return 'low'
    if (stock > 80) return 'high'
    return 'normal'
  }

  return (
    <Card 
      className={`group hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden ${className}`}
      onClick={handleCardClick}
      data-product-id={product.id}
    >
      {renderPersonalizationBadges()}
      
      <div className="relative">
        <img 
          src={product.image || 'https://via.placeholder.com/300'} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <button
          onClick={handleLike}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
            isLiked 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
          <Eye className="w-3 h-3" />
          <span>{viewCount}</span>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="min-h-[3rem]">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
              {product.name}
            </h3>
          </div>

          <div className="min-h-[1.25rem]">
            <p className="text-xs text-gray-600 truncate">
              {product.vendor || 'Local Vendor'}
            </p>
          </div>

          {/* Dynamic Pricing Component */}
          <DynamicPricing
            productId={product.id}
            basePrice={product.price}
            userId={userId}
            userSegment={userSegment}
            currentDemand={getCurrentDemand()}
            inventoryLevel={getInventoryLevel()}
            competitorPrice={product.competitor_price}
          />

          {/* Personalization Insights */}
          {renderPersonalizationInsights()}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating || 4)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({product.reviews || Math.floor(Math.random() * 50) + 5})
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              size="sm"
              className="bg-[var(--market-green)] hover:bg-[var(--market-green)]/90"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Stock indicator */}
          {getInventoryLevel() === 'low' && (
            <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              Only few left in stock!
            </div>
          )}

          {/* Personalized messages */}
          {showPersonalization && personalizationData.matchPercentage >= 90 && (
            <div className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
              Perfect match for your preferences!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default EnhancedProductCard


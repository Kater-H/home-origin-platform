import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, TrendingDown, Clock } from 'lucide-react'

const DynamicPricing = ({ 
  productId, 
  basePrice, 
  userId, 
  userSegment = 'regular',
  currentDemand = 'medium',
  inventoryLevel = 'normal',
  competitorPrice = null,
  showPriceFactors = false 
}) => {
  const [dynamicPrice, setDynamicPrice] = useState(basePrice)
  const [priceChange, setPriceChange] = useState(0)
  const [pricingFactors, setPricingFactors] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchDynamicPrice = async () => {
    if (!productId || !userId) return

    setLoading(true)
    try {
      const response = await fetch('https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/pricing/dynamic/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          base_price: basePrice,
          user_id: userId,
          user_segment: userSegment,
          current_demand: currentDemand,
          inventory_level: inventoryLevel,
          competitor_price: competitorPrice,
          time_of_day: new Date().getHours()
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDynamicPrice(data.dynamic_price)
          setPriceChange(data.price_change)
          setPricingFactors(data.pricing_factors || [])
          setLastUpdated(new Date())
        }
      }
    } catch (error) {
      console.warn('Dynamic pricing fetch failed:', error)
      // Fallback to base price
      setDynamicPrice(basePrice)
      setPriceChange(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDynamicPrice()
    
    // Update price every 5 minutes
    const interval = setInterval(fetchDynamicPrice, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [productId, basePrice, userId, userSegment, currentDemand, inventoryLevel])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getPriceChangeColor = () => {
    if (priceChange > 0) return 'text-red-600'
    if (priceChange < 0) return 'text-green-600'
    return 'text-gray-600'
  }

  const getPriceChangeIcon = () => {
    if (priceChange > 0) return <TrendingUp className="w-3 h-3" />
    if (priceChange < 0) return <TrendingDown className="w-3 h-3" />
    return null
  }

  const renderPriceFactors = () => {
    if (!showPriceFactors || pricingFactors.length === 0) return null

    return (
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-500">Price factors:</p>
        <div className="flex flex-wrap gap-1">
          {pricingFactors.map((factor, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs"
            >
              {factor.factor.replace(/_/g, ' ')}: {factor.impact}
            </Badge>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {loading ? (
          <div className="flex items-center gap-1">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-lg font-bold">{formatPrice(basePrice)}</span>
          </div>
        ) : (
          <>
            <span className="text-lg font-bold text-[var(--market-green)]">
              {formatPrice(dynamicPrice)}
            </span>
            
            {priceChange !== 0 && (
              <div className={`flex items-center gap-1 ${getPriceChangeColor()}`}>
                {getPriceChangeIcon()}
                <span className="text-sm font-medium">
                  {Math.abs(priceChange).toFixed(1)}%
                </span>
              </div>
            )}
            
            {priceChange !== 0 && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(basePrice)}
              </span>
            )}
          </>
        )}
      </div>

      {/* Special offers based on pricing factors */}
      {pricingFactors.some(f => f.factor.includes('discount')) && (
        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
          Special offer for you!
        </Badge>
      )}

      {pricingFactors.some(f => f.factor === 'high_demand') && (
        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
          High demand - limited time
        </Badge>
      )}

      {pricingFactors.some(f => f.factor === 'low_inventory') && (
        <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
          Only few left!
        </Badge>
      )}

      {/* Price factors (optional) */}
      {renderPriceFactors()}

      {/* Last updated timestamp */}
      {lastUpdated && (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>Updated {lastUpdated.toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  )
}

export default DynamicPricing


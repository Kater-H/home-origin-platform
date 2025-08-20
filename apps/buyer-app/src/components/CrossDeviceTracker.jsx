import { useEffect } from 'react'

const CrossDeviceTracker = ({ userId }) => {
  useEffect(() => {
    if (!userId) return

    // Generate or retrieve device ID
    const getDeviceId = () => {
      let deviceId = localStorage.getItem('device_id')
      if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('device_id', deviceId)
      }
      return deviceId
    }

    // Get device type
    const getDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
        return 'mobile'
      } else if (/tablet|ipad/i.test(userAgent)) {
        return 'tablet'
      } else {
        return 'desktop'
      }
    }

    // Track user activity
    const trackActivity = async (activityType, activityData) => {
      try {
        const deviceId = getDeviceId()
        const deviceType = getDeviceType()
        const sessionId = sessionStorage.getItem('session_id') || `session_${Date.now()}`
        
        if (!sessionStorage.getItem('session_id')) {
          sessionStorage.setItem('session_id', sessionId)
        }

        const trackingData = {
          user_id: userId,
          device_id: deviceId,
          device_type: deviceType,
          activity_type: activityType,
          activity_data: activityData,
          session_id: sessionId
        }

        const response = await fetch('https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/personalization/cross-device/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trackingData)
        })

        if (!response.ok) {
          console.warn('Cross-device tracking failed:', response.statusText)
        }
      } catch (error) {
        console.warn('Cross-device tracking error:', error)
      }
    }

    // Track page views
    const trackPageView = () => {
      trackActivity('view', {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
      })
    }

    // Track product views
    const trackProductView = (productId) => {
      trackActivity('product_view', {
        product_id: productId,
        timestamp: new Date().toISOString()
      })
    }

    // Track cart additions
    const trackCartAdd = (productId, quantity, price) => {
      trackActivity('cart_add', {
        product_id: productId,
        quantity: quantity,
        price: price,
        timestamp: new Date().toISOString()
      })
    }

    // Track searches
    const trackSearch = (query, results_count) => {
      trackActivity('search', {
        query: query,
        results_count: results_count,
        timestamp: new Date().toISOString()
      })
    }

    // Track purchases
    const trackPurchase = (orderData) => {
      trackActivity('purchase', {
        order_id: orderData.order_id,
        total_amount: orderData.total_amount,
        items: orderData.items,
        timestamp: new Date().toISOString()
      })
    }

    // Initial page view tracking
    trackPageView()

    // Set up event listeners for tracking
    const handleProductClick = (event) => {
      const productElement = event.target.closest('[data-product-id]')
      if (productElement) {
        const productId = productElement.getAttribute('data-product-id')
        trackProductView(productId)
      }
    }

    const handleCartAdd = (event) => {
      if (event.target.textContent.includes('Add to Cart') || event.target.closest('button')?.textContent.includes('Add to Cart')) {
        const productElement = event.target.closest('[data-product-id]')
        if (productElement) {
          const productId = productElement.getAttribute('data-product-id')
          const priceElement = productElement.querySelector('[data-price]')
          const price = priceElement ? priceElement.getAttribute('data-price') : 0
          trackCartAdd(productId, 1, price)
        }
      }
    }

    const handleSearch = (event) => {
      if (event.target.type === 'search' || event.target.placeholder?.includes('Search')) {
        const query = event.target.value
        if (query.length > 2) {
          // Debounce search tracking
          clearTimeout(window.searchTimeout)
          window.searchTimeout = setTimeout(() => {
            trackSearch(query, 0) // Results count would be determined by search results
          }, 1000)
        }
      }
    }

    // Add event listeners
    document.addEventListener('click', handleProductClick)
    document.addEventListener('click', handleCartAdd)
    document.addEventListener('input', handleSearch)

    // Expose tracking functions globally for other components to use
    window.crossDeviceTracker = {
      trackProductView,
      trackCartAdd,
      trackSearch,
      trackPurchase,
      trackActivity
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', handleProductClick)
      document.removeEventListener('click', handleCartAdd)
      document.removeEventListener('input', handleSearch)
      clearTimeout(window.searchTimeout)
    }
  }, [userId])

  // This component doesn't render anything visible
  return null
}

export default CrossDeviceTracker


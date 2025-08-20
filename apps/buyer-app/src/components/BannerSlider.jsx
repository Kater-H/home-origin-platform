import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const BannerSlider = () => {
  const [banners, setBanners] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mock data for demo (will be replaced with API call)
  const mockBanners = [
    {
      banner_id: 'banner_welcome',
      title: 'Welcome to Modern Market Connect',
      content: 'Your one-stop shop for fresh produce and fast delivery in Makurdi',
      image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
      link_url: '/products',
      button_text: 'Shop Now',
      duration: 5000,
      background_color: '#10B981',
      text_color: '#ffffff'
    },
    {
      banner_id: 'banner_delivery',
      title: 'Fast Okada Delivery',
      content: 'Get your orders delivered within 30 minutes by our trusted riders',
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
      link_url: '/delivery',
      button_text: 'Learn More',
      duration: 4000,
      background_color: '#3B82F6',
      text_color: '#ffffff'
    },
    {
      banner_id: 'banner_vendors',
      title: 'Support Local Vendors',
      content: 'Shop from verified local vendors in Modern Market, Makurdi',
      image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
      link_url: '/vendors',
      button_text: 'Browse Vendors',
      duration: 4500,
      background_color: '#F59E0B',
      text_color: '#ffffff'
    }
  ]

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
      }, banners[currentSlide]?.duration || 5000)

      return () => clearInterval(timer)
    }
  }, [currentSlide, banners])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch('https://77h9ikcz967q.manus.space/api/banners/active')
      // const data = await response.json()
      // if (data.success && data.banners.length > 0) {
      //   setBanners(data.banners)
      // } else {
      //   setBanners(mockBanners)
      // }
      
      // Using mock data for now
      setBanners(mockBanners)
    } catch (error) {
      console.error('Failed to fetch banners:', error)
      setBanners(mockBanners)
      setError('Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const handleBannerClick = (banner) => {
    if (banner.link_url) {
      // For internal links, use React Router navigation
      if (banner.link_url.startsWith('/')) {
        window.location.href = banner.link_url
      } else {
        // For external links, open in new tab
        window.open(banner.link_url, '_blank', 'noopener,noreferrer')
      }
    }
  }

  if (loading) {
    return (
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading banners...</div>
        </div>
      </div>
    )
  }

  if (error || banners.length === 0) {
    return null // Don't show anything if there are no banners
  }

  const currentBanner = banners[currentSlide]

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg group">
      {/* Banner Content */}
      <div
        className="relative w-full h-full flex items-center justify-center text-white transition-all duration-500 cursor-pointer"
        style={{
          backgroundColor: currentBanner.background_color,
          color: currentBanner.text_color,
          backgroundImage: currentBanner.image_url ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${currentBanner.image_url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        onClick={() => handleBannerClick(currentBanner)}
      >
        <div className="text-center px-6 md:px-12 max-w-4xl">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
            {currentBanner.title}
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 drop-shadow-md opacity-90">
            {currentBanner.content}
          </p>
          {currentBanner.button_text && (
            <button
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              onClick={(e) => {
                e.stopPropagation()
                handleBannerClick(currentBanner)
              }}
            >
              {currentBanner.button_text}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Next banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-white scale-110'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {banners.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-30">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / banners.length) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  )
}

export default BannerSlider


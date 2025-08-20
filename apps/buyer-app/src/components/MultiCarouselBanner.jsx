import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Truck, Percent } from 'lucide-react'

const MultiCarouselBanner = () => {
  const [currentSlides, setCurrentSlides] = useState({
    hero: 0,
    deals: 0,
    categories: 0,
    vendors: 0
  })

  // Hero banners data
  const heroBanners = [
    {
      id: 'hero_1',
      title: 'Welcome to Modern Market Connect',
      subtitle: 'Your one-stop shop for fresh produce and fast delivery in Makurdi',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=500&fit=crop',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      gradient: 'from-green-600 to-green-800'
    },
    {
      id: 'hero_2',
      title: 'Fast Okada Delivery',
      subtitle: 'Get your orders delivered within 30 minutes by our trusted riders',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=500&fit=crop',
      buttonText: 'Learn More',
      buttonLink: '/delivery',
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      id: 'hero_3',
      title: 'Support Local Vendors',
      subtitle: 'Shop from verified local vendors in Modern Market, Makurdi',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=500&fit=crop',
      buttonText: 'Browse Vendors',
      buttonLink: '/vendors',
      gradient: 'from-orange-600 to-orange-800'
    }
  ]

  // Deals carousel data
  const dealsCarousel = [
    {
      id: 'deal_1',
      title: 'Flash Sale',
      discount: '50% OFF',
      description: 'Fresh vegetables',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
      color: 'bg-red-500'
    },
    {
      id: 'deal_2',
      title: 'Weekend Special',
      discount: '30% OFF',
      description: 'Rice & Grains',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
      color: 'bg-purple-500'
    },
    {
      id: 'deal_3',
      title: 'Free Delivery',
      discount: 'FREE',
      description: 'Orders above ₦5,000',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      color: 'bg-green-500'
    },
    {
      id: 'deal_4',
      title: 'Bundle Deal',
      discount: '25% OFF',
      description: 'Cooking essentials',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
      color: 'bg-blue-500'
    }
  ]

  // Categories carousel data
  const categoriesCarousel = [
    {
      id: 'cat_1',
      name: 'Fresh Vegetables',
      icon: '🥬',
      count: '156 items',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=250&h=200&fit=crop'
    },
    {
      id: 'cat_2',
      name: 'Grains & Rice',
      icon: '🌾',
      count: '89 items',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=250&h=200&fit=crop'
    },
    {
      id: 'cat_3',
      name: 'Fruits',
      icon: '🍎',
      count: '178 items',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=250&h=200&fit=crop'
    },
    {
      id: 'cat_4',
      name: 'Meat & Fish',
      icon: '🐟',
      count: '67 items',
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=250&h=200&fit=crop'
    },
    {
      id: 'cat_5',
      name: 'Dairy Products',
      icon: '🥛',
      count: '45 items',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=250&h=200&fit=crop'
    }
  ]

  // Vendors carousel data
  const vendorsCarousel = [
    {
      id: 'vendor_1',
      name: 'Mama Kemi\'s Store',
      rating: 4.8,
      products: 45,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=150&fit=crop',
      badge: 'Top Rated'
    },
    {
      id: 'vendor_2',
      name: 'Benue Grains',
      rating: 4.6,
      products: 32,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=150&fit=crop',
      badge: 'Premium'
    },
    {
      id: 'vendor_3',
      name: 'Fresh Mart',
      rating: 4.7,
      products: 67,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=150&fit=crop',
      badge: 'Fast Delivery'
    },
    {
      id: 'vendor_4',
      name: 'Garden Fresh',
      rating: 4.9,
      products: 28,
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&h=150&fit=crop',
      badge: 'Organic'
    }
  ]

  // Auto-slide effect for hero banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlides(prev => ({
        ...prev,
        hero: (prev.hero + 1) % heroBanners.length
      }))
    }, 5000)

    return () => clearInterval(timer)
  }, [heroBanners.length])

  // Navigation functions
  const nextSlide = (carousel) => {
    setCurrentSlides(prev => {
      const carouselData = {
        hero: heroBanners,
        deals: dealsCarousel,
        categories: categoriesCarousel,
        vendors: vendorsCarousel
      }
      return {
        ...prev,
        [carousel]: (prev[carousel] + 1) % carouselData[carousel].length
      }
    })
  }

  const prevSlide = (carousel) => {
    setCurrentSlides(prev => {
      const carouselData = {
        hero: heroBanners,
        deals: dealsCarousel,
        categories: categoriesCarousel,
        vendors: vendorsCarousel
      }
      const length = carouselData[carousel].length
      return {
        ...prev,
        [carousel]: (prev[carousel] - 1 + length) % length
      }
    })
  }

  const CarouselNavigation = ({ carousel, length }) => (
    <div className="flex items-center justify-between">
      <button
        onClick={() => prevSlide(carousel)}
        className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>
      <div className="flex space-x-2">
        {Array.from({ length }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlides(prev => ({ ...prev, [carousel]: index }))}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlides[carousel] ? 'bg-green-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <button
        onClick={() => nextSlide(carousel)}
        className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  )

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Carousel */}
      <div className="relative">
        <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden">
          {heroBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlides.hero ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="relative w-full h-full flex items-center justify-center text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${banner.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="text-center px-6 md:px-12 max-w-4xl">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                    {banner.title}
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl mb-6 drop-shadow-md opacity-90">
                    {banner.subtitle}
                  </p>
                  <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg">
                    {banner.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Hero Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {heroBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlides(prev => ({ ...prev, hero: index }))}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlides.hero
                      ? 'bg-white scale-110'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deals Carousel */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
            <Percent className="w-6 h-6 mr-2 text-red-500" />
            Today's Deals
          </h2>
          <CarouselNavigation carousel="deals" length={Math.ceil(dealsCarousel.length / 2)} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {dealsCarousel.slice(currentSlides.deals * 2, currentSlides.deals * 2 + 2).map((deal) => (
            <div key={deal.id} className="relative rounded-lg overflow-hidden group cursor-pointer">
              <div
                className="h-32 md:h-40 flex items-center justify-center text-white relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${deal.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold mb-1">{deal.discount}</div>
                  <div className="text-sm md:text-base font-medium">{deal.title}</div>
                  <div className="text-xs md:text-sm opacity-90">{deal.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Carousel */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Shop by Category</h2>
          <CarouselNavigation carousel="categories" length={Math.ceil(categoriesCarousel.length / 3)} />
        </div>
        
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {categoriesCarousel.slice(currentSlides.categories * 3, currentSlides.categories * 3 + 3).map((category) => (
            <div key={category.id} className="text-center group cursor-pointer">
              <div className="relative rounded-lg overflow-hidden mb-2">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-20 md:h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl md:text-3xl">{category.icon}</span>
                </div>
              </div>
              <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1">{category.name}</h3>
              <p className="text-xs md:text-sm text-gray-500">{category.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vendors Carousel */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
            <Truck className="w-6 h-6 mr-2 text-green-500" />
            Featured Vendors
          </h2>
          <CarouselNavigation carousel="vendors" length={Math.ceil(vendorsCarousel.length / 2)} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {vendorsCarousel.slice(currentSlides.vendors * 2, currentSlides.vendors * 2 + 2).map((vendor) => (
            <div key={vendor.id} className="border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">{vendor.name}</h3>
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                    <span className="text-xs md:text-sm text-gray-600">{vendor.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">{vendor.products} products</p>
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full mt-1">
                    {vendor.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MultiCarouselBanner


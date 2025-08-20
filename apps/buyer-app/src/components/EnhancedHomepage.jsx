import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  Star, 
  ShoppingCart, 
  Truck, 
  Shield, 
  Clock,
  TrendingUp,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import BannerSlider from './BannerSlider'
import MultiCarouselBanner from './MultiCarouselBanner'
import SmartShopperOCR from './SmartShopperOCR'
import AIRecommendations from './AIRecommendations'
import AIInsights from './AIInsights'
import PersonalizedRecommendations from './PersonalizedRecommendations'
import EnhancedProductCard from './EnhancedProductCard'

const EnhancedHomepage = ({ onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])

  // Mock data for featured products
  useEffect(() => {
    setFeaturedProducts([
      {
        id: 1,
        name: 'Fresh Tomatoes',
        price: 500,
        originalPrice: 600,
        image: '/api/placeholder/300/300',
        rating: 4.5,
        reviews: 128,
        vendor: 'Mama Kemi\'s Store',
        badge: 'Best Seller',
        discount: 17
      },
      {
        id: 2,
        name: 'Premium Rice (5kg)',
        price: 3500,
        originalPrice: 4000,
        image: '/api/placeholder/300/300',
        rating: 4.8,
        reviews: 89,
        vendor: 'Benue Grains',
        badge: 'Premium',
        discount: 13
      },
      {
        id: 3,
        name: 'Cooking Oil (1L)',
        price: 1200,
        originalPrice: null,
        image: '/api/placeholder/300/300',
        rating: 4.3,
        reviews: 67,
        vendor: 'Fresh Mart',
        badge: 'New',
        discount: 0
      },
      {
        id: 4,
        name: 'Fresh Pepper (500g)',
        price: 300,
        originalPrice: 350,
        image: '/api/placeholder/300/300',
        rating: 4.6,
        reviews: 45,
        vendor: 'Garden Fresh',
        badge: 'Organic',
        discount: 14
      }
    ])

    setCategories([
      { id: 1, name: 'Fresh Vegetables', icon: '🥬', count: 156, color: 'bg-green-100 text-green-600' },
      { id: 2, name: 'Grains & Rice', icon: '🌾', count: 89, color: 'bg-yellow-100 text-yellow-600' },
      { id: 3, name: 'Cooking Essentials', icon: '🧄', count: 234, color: 'bg-orange-100 text-orange-600' },
      { id: 4, name: 'Fruits', icon: '🍎', count: 178, color: 'bg-red-100 text-red-600' },
      { id: 5, name: 'Meat & Fish', icon: '🐟', count: 67, color: 'bg-blue-100 text-blue-600' },
      { id: 6, name: 'Dairy Products', icon: '🥛', count: 45, color: 'bg-purple-100 text-purple-600' }
    ])
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full ${
            product.badge === 'Best Seller' ? 'bg-orange-100 text-orange-600' :
            product.badge === 'Premium' ? 'bg-purple-100 text-purple-600' :
            product.badge === 'New' ? 'bg-green-100 text-green-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            {product.badge}
          </span>
        )}

        {/* Discount */}
        {product.discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">
            -{product.discount}%
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2">
            <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Heart className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.vendor}</p>
        </div>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => onAddToCart && onAddToCart(product)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Multi-Carousel Banners */}
      <section className="relative">
        <MultiCarouselBanner />
      </section>

      {/* Smart Shopper Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Shop with AI Assistant</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Tell us what you need in plain English, and our AI will find the best products for you
            </p>
          </div>
          <SmartShopperOCR onAddToCart={onAddToCart} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/categories" className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1 text-sm md:text-base">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="bg-white rounded-xl p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-xl md:text-2xl">{category.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{category.name}</h3>
                <p className="text-xs md:text-sm text-gray-500">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600 text-sm md:text-base">Handpicked items from our best vendors</p>
            </div>
            <Link to="/products" className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1 text-sm md:text-base">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <EnhancedProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart}
                userId="user_123"
                userSegment="regular"
                showPersonalization={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Why Choose Modern Market Connect?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Experience the future of shopping with our innovative platform designed for the Makurdi community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">AI-Powered Shopping</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Just tell us what you need in plain English, and our AI finds the best products and prices
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Truck className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Fast Okada Delivery</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Quick and reliable delivery by motorcycle riders who know Makurdi streets
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Track your order from Modern Market to your doorstep with live GPS updates
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Multiple payment options with bank-level security for your peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AIRecommendations currentProduct="p1" userId="u1" />
        </div>
      </section>

      {/* AI Insights Section */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AIInsights userId="u1" />
        </div>
      </section>

      {/* Personalized Recommendations Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PersonalizedRecommendations onAddToCart={onAddToCart} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-8 md:py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-green-100 mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
              Get the latest deals, new vendor announcements, and exclusive offers delivered to your inbox
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none border-0 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg sm:rounded-l-none sm:rounded-r-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EnhancedHomepage


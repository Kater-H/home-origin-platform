import React, { useState, useEffect } from 'react'
import CategoryGrid from './CategoryGrid'
import ShopSection from './ShopSection'
import ProductSection from './ProductSection'
import dataService from '../services/dataService'

const NewHomepage = ({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [shopSections, setShopSections] = useState([])
  const [productSections, setProductSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load shop and product sections in parallel
      const [shopSectionsData, productSectionsData] = await Promise.all([
        dataService.getShopSections(),
        dataService.getProductSections()
      ])
      
      setShopSections(shopSectionsData)
      setProductSections(productSectionsData)
    } catch (error) {
      console.error('Failed to load homepage data:', error)
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category)
    console.log('Selected category:', category)
    
    try {
      // Load products for selected category
      const products = await dataService.getProductsByCategory(category.id)
      
      // Update product sections to show category-specific products
      setProductSections([{
        title: `${category.name} Products`,
        products: products
      }])
    } catch (error) {
      console.error('Failed to load category products:', error)
    }
  }

  const handleShopClick = (shop) => {
    console.log('Selected shop:', shop)
    // Navigate to shop page - could be implemented with React Router
    window.location.href = `/shop/${shop.id}`
  }

  const handleViewAll = (section) => {
    console.log('View all for section:', section)
    // Navigate to search/browse page with appropriate filters
    window.location.href = `/search?section=${encodeURIComponent(section)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading heritage marketplace...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Category Grid */}
      <CategoryGrid onCategorySelect={handleCategorySelect} />

      {/* Shop Sections */}
      {shopSections.map((section, index) => (
        <ShopSection
          key={index}
          title={section.title}
          shops={section.shops}
          onShopClick={handleShopClick}
          onViewAll={() => handleViewAll(section.title)}
        />
      ))}

      {/* Product Sections */}
      {productSections.map((section, index) => (
        <ProductSection
          key={index}
          title={section.title}
          products={section.products}
          onAddToCart={onAddToCart}
          onViewAll={() => handleViewAll(section.title)}
        />
      ))}
    </div>
  )
}

export default NewHomepage


import React, { useState, useEffect } from 'react'
import { 
  Apple, 
  Milk, 
  Wheat, 
  Fish, 
  Beef, 
  Carrot, 
  Coffee, 
  ShoppingBag,
  Utensils,
  Baby,
  Sparkles,
  Soup
} from 'lucide-react'
import dataService from '../services/dataService'

const CategoryGrid = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Icon mapping for categories
  const categoryIcons = {
    'Spices & Seasonings': { icon: Sparkles, color: 'bg-orange-100', iconColor: 'text-orange-600' },
    'Rice & Grains': { icon: Wheat, color: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    'Fresh Produce': { icon: Carrot, color: 'bg-green-100', iconColor: 'text-green-600' },
    'Beverages': { icon: Coffee, color: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Snacks & Sweets': { icon: ShoppingBag, color: 'bg-purple-100', iconColor: 'text-purple-600' },
    'Cooking Essentials': { icon: Soup, color: 'bg-red-100', iconColor: 'text-red-600' },
    'Fruits': { icon: Apple, color: 'bg-red-100', iconColor: 'text-red-600' },
    'Dairy': { icon: Milk, color: 'bg-blue-100', iconColor: 'text-blue-600' },
    'Bakery': { icon: Wheat, color: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    'Seafood': { icon: Fish, color: 'bg-cyan-100', iconColor: 'text-cyan-600' },
    'Meat': { icon: Beef, color: 'bg-red-100', iconColor: 'text-red-700' },
    'Vegetables': { icon: Carrot, color: 'bg-green-100', iconColor: 'text-green-600' },
    'Snacks': { icon: ShoppingBag, color: 'bg-purple-100', iconColor: 'text-purple-600' },
    'Ready Meals': { icon: Utensils, color: 'bg-orange-100', iconColor: 'text-orange-600' },
    'Baby Care': { icon: Baby, color: 'bg-pink-100', iconColor: 'text-pink-600' }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const categoriesData = await dataService.getCategories()
      
      // Map categories with icons and colors
      const mappedCategories = categoriesData.map(category => {
        const iconData = categoryIcons[category.name] || categoryIcons['Snacks']
        return {
          ...category,
          ...iconData
        }
      })
      
      setCategories(mappedCategories)
    } catch (error) {
      console.error('Failed to load categories:', error)
      // Use fallback categories if API fails
      setCategories([
        { id: 1, name: 'Heritage Foods', icon: Sparkles, color: 'bg-orange-100', iconColor: 'text-orange-600' },
        { id: 2, name: 'Fresh Produce', icon: Carrot, color: 'bg-green-100', iconColor: 'text-green-600' },
        { id: 3, name: 'Spices', icon: Soup, color: 'bg-red-100', iconColor: 'text-red-600' }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-4 bg-white">
        <div className="grid grid-cols-5 gap-3">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mb-2"></div>
              <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 bg-white">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop by Category</h2>
      <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category)}
              className="flex-shrink-0 flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors min-w-[90px]"
            >
              <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center`}>
                <IconComponent className={`h-6 w-6 ${category.iconColor}`} />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                {category.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryGrid


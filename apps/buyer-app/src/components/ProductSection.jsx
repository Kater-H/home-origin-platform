import React from 'react'
import EnhancedProductCard from './EnhancedProductCard'
import { ChevronRight } from 'lucide-react'

const ProductSection = ({ title, products, onAddToCart, onViewAll }) => {
  return (
    <div className="bg-white py-4">
      <div className="px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center space-x-1 text-green-600 text-sm font-medium hover:text-green-700"
            >
              <span>View all</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <EnhancedProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductSection


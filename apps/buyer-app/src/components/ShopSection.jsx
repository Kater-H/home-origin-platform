import React from 'react'
import ShopCard from './ShopCard'
import { ChevronRight } from 'lucide-react'

const ShopSection = ({ title, shops, onShopClick, onViewAll }) => {
  return (
    <div className="bg-gray-50 py-4">
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

        {/* Shops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {shops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onClick={onShopClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShopSection


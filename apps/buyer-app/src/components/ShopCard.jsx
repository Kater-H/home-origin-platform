import React from 'react'
import { Star, Clock, MapPin, Truck } from 'lucide-react'

const ShopCard = ({ shop, onClick }) => {
  return (
    <button
      onClick={() => onClick(shop)}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="flex items-start space-x-3">
        {/* Shop Logo */}
        <div className="flex-shrink-0">
          <img
            src={shop.logo || 'https://via.placeholder.com/60'}
            alt={shop.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
        </div>

        {/* Shop Info */}
        <div className="flex-1 overflow-hidden">
          <div className="mb-1">
            <h3 className="font-semibold text-sm text-gray-900 leading-tight">
              {shop.name}
            </h3>
          </div>
          
          {/* Rating and Reviews */}
          <div className="flex items-center space-x-1 mb-2">
            <Star className="h-3 w-3 text-yellow-400 fill-current flex-shrink-0" />
            <span className="text-xs text-gray-600 whitespace-nowrap">
              {shop.rating} ({shop.reviewCount || 0})
            </span>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center space-x-3 mb-1 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="whitespace-nowrap">{shop.deliveryTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="whitespace-nowrap">{shop.distance}</span>
            </div>
          </div>

          {/* Delivery Fee */}
          <div className="flex items-center space-x-1 mb-2">
            <Truck className="h-3 w-3 text-green-600 flex-shrink-0" />
            <span className="text-xs text-green-600 font-medium whitespace-nowrap">
              {shop.deliveryFee === 0 ? 'Free delivery' : `₦${shop.deliveryFee} delivery`}
            </span>
          </div>

          {/* Tags */}
          {shop.tags && shop.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {shop.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex-shrink-0 mt-1">
          <div className={`w-2 h-2 rounded-full ${shop.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </div>
    </button>
  )
}

export default ShopCard


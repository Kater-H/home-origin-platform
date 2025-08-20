import { useState } from 'react'
import { X, Plus, Minus, ShoppingBag, Trash2, Heart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const EnhancedCart = ({ isOpen, onClose, cartItems, onUpdateCart }) => {
  const [isUpdating, setIsUpdating] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    setIsUpdating(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
      onUpdateCart(updatedItems)
      setIsUpdating(false)
    }, 300)
  }

  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId)
    onUpdateCart(updatedItems)
  }

  const moveToWishlist = (itemId) => {
    // Implement wishlist functionality
    removeItem(itemId)
    // Show success message
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = subtotal >= 5000 ? 0 : 200 // Free delivery above ₦5,000
  const total = subtotal + deliveryFee

  const CartItem = ({ item }) => (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0">
        <img
          src={item.image || '/api/placeholder/80/80'}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {item.vendor || 'Modern Market Vendor'}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="font-medium text-gray-900 min-w-[2rem] text-center">
              {item.quantity}
            </span>
            
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={isUpdating}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-right">
            <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
            <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-3">
          <button
            onClick={() => moveToWishlist(item.id)}
            className="text-sm text-gray-500 hover:text-green-600 flex items-center space-x-1 transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>Save for later</span>
          </button>
          
          <button
            onClick={() => removeItem(item.id)}
            className="text-sm text-red-500 hover:text-red-600 flex items-center space-x-1 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Cart Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Shopping Cart ({cartItems.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some products to get started</p>
                <button
                  onClick={onClose}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-0">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                {/* Delivery Info */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">
                      {deliveryFee === 0 ? 'Free Delivery!' : 'Almost there!'}
                    </span>
                  </div>
                  <p className="text-sm text-green-600">
                    {deliveryFee === 0 
                      ? 'You qualify for free delivery on this order.'
                      : `Add ${formatPrice(5000 - subtotal)} more for free delivery.`
                    }
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {/* Order Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                      {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <button
                    onClick={onClose}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Security Badge */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                    <span>🔒</span>
                    <span>Secure checkout with SSL encryption</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default EnhancedCart


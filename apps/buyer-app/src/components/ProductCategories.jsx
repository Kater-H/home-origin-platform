import { ShoppingBasket, Laptop, Shirt, Home, Utensils, Baby, Heart, Gift } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const ProductCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Fresh Produce',
      icon: ShoppingBasket,
      color: 'bg-green-100 text-green-600',
      description: 'Fruits, vegetables, herbs'
    },
    {
      id: 2,
      name: 'Groceries',
      icon: Utensils,
      color: 'bg-orange-100 text-orange-600',
      description: 'Rice, beans, spices, oils'
    },
    {
      id: 3,
      name: 'Meat & Fish',
      icon: Heart,
      color: 'bg-red-100 text-red-600',
      description: 'Fresh meat, fish, poultry'
    },
    {
      id: 4,
      name: 'Electronics',
      icon: Laptop,
      color: 'bg-blue-100 text-blue-600',
      description: 'Phones, accessories, gadgets'
    },
    {
      id: 5,
      name: 'Fashion',
      icon: Shirt,
      color: 'bg-purple-100 text-purple-600',
      description: 'Clothing, shoes, accessories'
    },
    {
      id: 6,
      name: 'Home & Living',
      icon: Home,
      color: 'bg-indigo-100 text-indigo-600',
      description: 'Furniture, decor, appliances'
    },
    {
      id: 7,
      name: 'Baby & Kids',
      icon: Baby,
      color: 'bg-pink-100 text-pink-600',
      description: 'Baby food, toys, clothing'
    },
    {
      id: 8,
      name: 'Gifts & More',
      icon: Gift,
      color: 'bg-yellow-100 text-yellow-600',
      description: 'Special occasions, crafts'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Categories</h2>
        <p className="text-[var(--market-gray)]">
          Browse products by category from Modern Market vendors
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <Card 
              key={category.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 border-2 hover:border-[var(--market-green)]"
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${category.color}`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-[var(--market-gray)] leading-relaxed">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Featured Section */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Trending Now</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-[var(--market-green)] to-[var(--market-blue)] text-white">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-2">Fresh Daily Deals</h4>
              <p className="text-sm opacity-90 mb-4">
                Get the freshest produce delivered daily from Modern Market
              </p>
              <div className="text-2xl font-bold">Up to 30% OFF</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[var(--market-orange)] to-yellow-500 text-white">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-2">Student Specials</h4>
              <p className="text-sm opacity-90 mb-4">
                Exclusive discounts for BSU students with valid ID
              </p>
              <div className="text-2xl font-bold">15% OFF</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-2">Free Delivery</h4>
              <p className="text-sm opacity-90 mb-4">
                Free okada delivery for orders above ₦5,000
              </p>
              <div className="text-2xl font-bold">₦0 Delivery</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProductCategories


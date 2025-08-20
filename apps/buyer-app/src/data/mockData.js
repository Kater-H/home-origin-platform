// Mock data for the redesigned UI

export const mockShops = [
  {
    id: 1,
    name: "Mama Kemi's Nigerian Spices",
    logo: "https://via.placeholder.com/60",
    rating: 4.8,
    reviewCount: 245,
    deliveryTime: "15-25 min",
    distance: "0.8 km",
    deliveryFee: 0,
    isOpen: true,
    tags: ["Fast delivery", "Popular"],
    categories: ["Fruits", "Vegetables", "Dairy"]
  },
  {
    id: 2,
    name: "Caribbean Delights",
    logo: "https://via.placeholder.com/60",
    rating: 4.6,
    reviewCount: 189,
    deliveryTime: "20-30 min",
    distance: "1.2 km",
    deliveryFee: 200,
    isOpen: true,
    tags: ["Fresh produce", "Organic"],
    categories: ["Fruits", "Vegetables", "Meat", "Seafood"]
  },
  {
    id: 3,
    name: "Ackee & Saltfish Market",
    logo: "https://via.placeholder.com/60",
    rating: 4.7,
    reviewCount: 156,
    deliveryTime: "25-35 min",
    distance: "1.5 km",
    deliveryFee: 300,
    isOpen: true,
    tags: ["Bulk buying", "Wholesale"],
    categories: ["Bakery", "Beverages", "Snacks"]
  },
  {
    id: 4,
    name: "Afro-Caribbean Express",
    logo: "https://via.placeholder.com/60",
    rating: 4.5,
    reviewCount: 98,
    deliveryTime: "10-15 min",
    distance: "0.5 km",
    deliveryFee: 0,
    isOpen: true,
    tags: ["24/7", "Quick delivery"],
    categories: ["Snacks", "Beverages", "Ready Meals"]
  },
  {
    id: 5,
    name: "Plantain Paradise",
    logo: "https://via.placeholder.com/60",
    rating: 4.9,
    reviewCount: 312,
    deliveryTime: "30-40 min",
    distance: "2.1 km",
    deliveryFee: 400,
    isOpen: true,
    tags: ["Organic", "Premium"],
    categories: ["Fruits", "Vegetables", "Dairy", "Baby Care"]
  },
  {
    id: 6,
    name: "Jollof Junction",
    logo: "https://via.placeholder.com/60",
    rating: 4.4,
    reviewCount: 567,
    deliveryTime: "35-45 min",
    distance: "2.8 km",
    deliveryFee: 500,
    isOpen: true,
    tags: ["Large selection", "Competitive prices"],
    categories: ["Fruits", "Vegetables", "Meat", "Seafood", "Bakery", "Dairy"]
  }
]

export const mockProducts = [
  {
    id: 1,
    name: 'Fresh Tomatoes',
    price: 500,
    originalPrice: 600,
    image: 'https://via.placeholder.com/300',
    rating: 4.5,
    reviews: 128,
    vendor: 'Mama Kemi\'s Nigerian Spices',
    badge: 'Best Seller',
    discount: 17,
    inStock: true,
    quickAdd: true,
    category: 'Vegetables',
    shopId: 1
  },
  {
    id: 2,
    name: 'Jollof Rice Mix (5kg)',
    price: 3500,
    originalPrice: 4000,
    image: 'https://via.placeholder.com/300',
    rating: 4.8,
    reviews: 89,
    vendor: 'Ackee & Saltfish Market',
    badge: 'Premium',
    discount: 13,
    inStock: true,
    quickAdd: true,
    category: 'Bakery',
    shopId: 3
  },
  {
    id: 3,
    name: 'Coconut Milk (1L)',
    price: 800,
    originalPrice: 900,
    image: 'https://via.placeholder.com/300',
    rating: 4.6,
    reviews: 156,
    vendor: 'Caribbean Delights',
    badge: 'Fresh',
    discount: 11,
    inStock: true,
    quickAdd: true,
    category: 'Dairy',
    shopId: 2
  },
  {
    id: 4,
    name: 'Goat Meat (1kg)',
    price: 2500,
    originalPrice: 2800,
    image: 'https://via.placeholder.com/300',
    rating: 4.7,
    reviews: 67,
    vendor: 'Caribbean Delights',
    badge: 'Fresh',
    discount: 11,
    inStock: true,
    quickAdd: false,
    category: 'Meat',
    shopId: 2
  },
  {
    id: 5,
    name: 'Plantains (1 bunch)',
    price: 300,
    originalPrice: 350,
    image: 'https://via.placeholder.com/300',
    rating: 4.4,
    reviews: 234,
    vendor: 'Plantain Paradise',
    badge: 'Popular',
    discount: 14,
    inStock: true,
    quickAdd: true,
    category: 'Fruits',
    shopId: 5
  },
  {
    id: 6,
    name: 'Cassava Bread',
    price: 450,
    originalPrice: 500,
    image: 'https://via.placeholder.com/300',
    rating: 4.3,
    reviews: 98,
    vendor: 'Ackee & Saltfish Market',
    badge: 'Fresh',
    discount: 10,
    inStock: true,
    quickAdd: true,
    category: 'Bakery',
    shopId: 3
  },
  {
    id: 7,
    name: 'Palm Oil (1L)',
    price: 1200,
    originalPrice: 1400,
    image: 'https://via.placeholder.com/300',
    rating: 4.5,
    reviews: 145,
    vendor: 'Caribbean Delights',
    badge: 'Essential',
    discount: 14,
    inStock: true,
    quickAdd: true,
    category: 'Snacks',
    shopId: 2
  },
  {
    id: 8,
    name: 'Red Snapper Fish',
    price: 1800,
    originalPrice: 2000,
    image: 'https://via.placeholder.com/300',
    rating: 4.6,
    reviews: 76,
    vendor: 'Caribbean Delights',
    badge: 'Fresh',
    discount: 10,
    inStock: true,
    quickAdd: false,
    category: 'Seafood',
    shopId: 2
  },
  {
    id: 9,
    name: 'Instant Yam Porridge (Pack of 5)',
    price: 600,
    originalPrice: 700,
    image: 'https://via.placeholder.com/300',
    rating: 4.2,
    reviews: 189,
    vendor: 'Afro-Caribbean Express',
    badge: 'Quick Meal',
    discount: 14,
    inStock: true,
    quickAdd: true,
    category: 'Ready Meals',
    shopId: 4
  },
  {
    id: 10,
    name: 'Sorrel Drink (1L)',
    price: 900,
    originalPrice: 1000,
    image: 'https://via.placeholder.com/300',
    rating: 4.4,
    reviews: 123,
    vendor: 'Afro-Caribbean Express',
    badge: 'Refreshing',
    discount: 10,
    inStock: true,
    quickAdd: true,
    category: 'Beverages',
    shopId: 4
  },
  {
    id: 11,
    name: 'Shea Butter Baby Cream (400g)',
    price: 3200,
    originalPrice: 3500,
    image: 'https://via.placeholder.com/300',
    rating: 4.8,
    reviews: 67,
    vendor: 'Plantain Paradise',
    badge: 'Premium',
    discount: 9,
    inStock: true,
    quickAdd: false,
    category: 'Baby Care',
    shopId: 5
  },
  {
    id: 12,
    name: 'Organic Okra (1kg)',
    price: 800,
    originalPrice: 900,
    image: 'https://via.placeholder.com/300',
    rating: 4.7,
    reviews: 145,
    vendor: 'Plantain Paradise',
    badge: 'Organic',
    discount: 11,
    inStock: true,
    quickAdd: true,
    category: 'Vegetables',
    shopId: 5
  }
]

// Group shops by sections
export const shopSections = [
  {
    title: "Shops near you",
    shops: mockShops.filter(shop => parseFloat(shop.distance) <= 1.5)
  },
  {
    title: "Large stores, more choice",
    shops: mockShops.filter(shop => shop.reviewCount > 200)
  },
  {
    title: "Quick essentials",
    shops: mockShops.filter(shop => shop.tags.includes("Quick delivery") || shop.tags.includes("24/7"))
  }
]

// Group products by sections
export const productSections = [
  {
    title: "Stock up on groceries",
    products: mockProducts.filter(product => 
      ['Vegetables', 'Fruits', 'Dairy', 'Meat'].includes(product.category)
    )
  },
  {
    title: "Ready-made meals",
    products: mockProducts.filter(product => 
      ['Ready Meals', 'Bakery'].includes(product.category)
    )
  },
  {
    title: "Quick essentials",
    products: mockProducts.filter(product => 
      ['Beverages', 'Snacks'].includes(product.category)
    )
  }
]


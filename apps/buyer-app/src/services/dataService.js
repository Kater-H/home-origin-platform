import apiClient from '../utils/api';

// Data transformation utilities
const transformProduct = (product) => {
  return {
    id: product.id,
    name: product.name,
    price: Math.round(product.price * 100), // Convert GBP to pence for UI consistency
    originalPrice: product.original_price ? Math.round(product.original_price * 100) : null,
    image: product.image_url || '/api/placeholder/300/300',
    rating: 4.5, // Default rating - could be calculated from reviews
    reviews: Math.floor(Math.random() * 200) + 50, // Mock review count
    vendor: product.vendor?.business_name || 'Unknown Vendor',
    vendorId: product.vendor_id,
    badge: product.is_featured ? 'Featured' : (product.cultural_significance ? 'Heritage' : null),
    discount: product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0,
    inStock: product.stock_quantity > 0,
    quickAdd: true,
    category: product.category?.name || 'Other',
    categoryId: product.category_id,
    description: product.description,
    weight: product.weight,
    unit: product.unit,
    origin_country: product.origin_country,
    cultural_significance: product.cultural_significance,
    stock_quantity: product.stock_quantity,
    priceGBP: product.price // Keep original GBP price for calculations
  };
};

const transformVendor = (vendor) => {
  return {
    id: vendor.id,
    name: vendor.business_name,
    logo: '/api/placeholder/60/60', // Default logo
    rating: vendor.rating || 4.5,
    reviewCount: vendor.total_orders || 0,
    deliveryTime: `${vendor.preparation_time || 30}-${(vendor.preparation_time || 30) + 15} min`,
    distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`, // Mock distance
    deliveryFee: Math.round((vendor.delivery_fee || 0) * 100), // Convert GBP to pence
    deliveryFeeGBP: vendor.delivery_fee || 0, // Keep original GBP price
    isOpen: vendor.is_active && vendor.is_verified,
    tags: [
      vendor.is_verified ? 'Verified' : null,
      vendor.delivery_fee === 0 ? 'Free delivery' : null,
      vendor.rating >= 4.7 ? 'Popular' : null
    ].filter(Boolean),
    categories: ['Heritage Foods'], // Default category
    description: vendor.business_description,
    address: vendor.business_address,
    phone: vendor.business_phone,
    preparation_time: vendor.preparation_time,
    free_delivery_threshold: Math.round((vendor.free_delivery_threshold || 0) * 100), // Convert to pence
    free_delivery_threshold_gbp: vendor.free_delivery_threshold || 0 // Keep original GBP
  };
};

class DataService {
  constructor() {
    this.cache = {
      products: null,
      vendors: null,
      categories: null,
      lastFetch: null
    };
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Check if cache is valid
  isCacheValid() {
    return this.cache.lastFetch && 
           (Date.now() - this.cache.lastFetch) < this.cacheTimeout;
  }

  // Get all products with caching
  async getProducts(params = {}) {
    try {
      if (!this.isCacheValid() || !this.cache.products) {
        const response = await apiClient.getProducts({
          per_page: 50,
          ...params
        });
        
        this.cache.products = response.products.map(transformProduct);
        this.cache.lastFetch = Date.now();
      }
      
      return this.cache.products;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return this.getFallbackProducts();
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId) {
    try {
      const response = await apiClient.getProducts({ category_id: categoryId });
      return response.products.map(transformProduct);
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      return [];
    }
  }

  // Get featured products
  async getFeaturedProducts() {
    try {
      const response = await apiClient.getProducts({ featured: true });
      return response.products.map(transformProduct);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      return [];
    }
  }

  // Search products
  async searchProducts(query, filters = {}) {
    try {
      const response = await apiClient.getProducts({
        search: query,
        ...filters
      });
      return response.products.map(transformProduct);
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  }

  // Get all vendors with caching
  async getVendors(params = {}) {
    try {
      if (!this.isCacheValid() || !this.cache.vendors) {
        const response = await apiClient.getVendors({
          verified: true,
          per_page: 20,
          ...params
        });
        
        this.cache.vendors = response.vendors.map(transformVendor);
        this.cache.lastFetch = Date.now();
      }
      
      return this.cache.vendors;
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      return this.getFallbackVendors();
    }
  }

  // Get vendor by ID
  async getVendor(vendorId) {
    try {
      const response = await apiClient.getVendor(vendorId);
      return transformVendor(response.vendor);
    } catch (error) {
      console.error('Failed to fetch vendor:', error);
      return null;
    }
  }

  // Get products by vendor
  async getProductsByVendor(vendorId) {
    try {
      const response = await apiClient.getProducts({ vendor_id: vendorId });
      return response.products.map(transformProduct);
    } catch (error) {
      console.error('Failed to fetch products by vendor:', error);
      return [];
    }
  }

  // Get categories
  async getCategories() {
    try {
      if (!this.isCacheValid() || !this.cache.categories) {
        const response = await apiClient.getCategories();
        this.cache.categories = response.categories;
        this.cache.lastFetch = Date.now();
      }
      
      return this.cache.categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return this.getFallbackCategories();
    }
  }

  // Get organized shop sections
  async getShopSections() {
    const vendors = await this.getVendors();
    
    return [
      {
        title: "Shops near you",
        shops: vendors.filter(shop => parseFloat(shop.distance) <= 1.5)
      },
      {
        title: "Popular heritage stores",
        shops: vendors.filter(shop => shop.rating >= 4.6)
      },
      {
        title: "Free delivery available",
        shops: vendors.filter(shop => shop.deliveryFee === 0)
      }
    ];
  }

  // Get organized product sections
  async getProductSections() {
    const products = await this.getProducts();
    const categories = await this.getCategories();
    
    // Group products by category
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = cat.name;
    });

    return [
      {
        title: "Heritage essentials",
        products: products.filter(product => 
          product.cultural_significance || product.badge === 'Heritage'
        ).slice(0, 8)
      },
      {
        title: "Fresh produce",
        products: products.filter(product => 
          product.category === 'Fresh Produce'
        ).slice(0, 8)
      },
      {
        title: "Spices & seasonings",
        products: products.filter(product => 
          product.category === 'Spices & Seasonings'
        ).slice(0, 8)
      },
      {
        title: "Featured products",
        products: products.filter(product => 
          product.badge === 'Featured'
        ).slice(0, 8)
      }
    ].filter(section => section.products.length > 0);
  }

  // Fallback data when API is unavailable
  getFallbackProducts() {
    return [
      {
        id: 1,
        name: 'Jollof Rice Spice Mix',
        price: 499, // £4.99 in pence
        priceGBP: 4.99,
        image: '/api/placeholder/300/300',
        rating: 4.8,
        reviews: 89,
        vendor: "Mama Kemi's Nigerian Spices",
        badge: 'Heritage',
        inStock: true,
        category: 'Spices & Seasonings'
      },
      {
        id: 2,
        name: 'Green Plantains',
        price: 250, // £2.50 in pence
        priceGBP: 2.50,
        image: '/api/placeholder/300/300',
        rating: 4.6,
        reviews: 156,
        vendor: 'Caribbean Delights',
        badge: 'Fresh',
        inStock: true,
        category: 'Fresh Produce'
      }
    ];
  }

  getFallbackVendors() {
    return [
      {
        id: 1,
        name: "Mama Kemi's Nigerian Spices",
        logo: '/api/placeholder/60/60',
        rating: 4.8,
        reviewCount: 245,
        deliveryTime: "30-45 min",
        distance: "0.8 km",
        deliveryFee: 350, // £3.50 in pence
        deliveryFeeGBP: 3.50,
        isOpen: true,
        tags: ["Heritage", "Verified"]
      }
    ];
  }

  getFallbackCategories() {
    return [
      { id: 1, name: 'Spices & Seasonings' },
      { id: 2, name: 'Fresh Produce' },
      { id: 3, name: 'Rice & Grains' }
    ];
  }

  // Clear cache
  clearCache() {
    this.cache = {
      products: null,
      vendors: null,
      categories: null,
      lastFetch: null
    };
  }
}

// Create and export singleton instance
const dataService = new DataService();
export default dataService;


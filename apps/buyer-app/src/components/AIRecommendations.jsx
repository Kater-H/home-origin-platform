import React, { useState, useEffect } from 'react';

const AIRecommendations = ({ currentProduct, userId = 'u1' }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock AI recommendations data (in production, this would come from the AI API)
  const mockRecommendations = [
    {
      product_id: 'p2',
      name: 'Local Rice',
      category: 'Grains',
      price: 3500,
      similarity_score: 0.85,
      image: '/api/placeholder/150/150',
      rating: 4.5,
      vendor: 'Benue Grains'
    },
    {
      product_id: 'p4',
      name: 'Fresh Onions',
      category: 'Fresh Produce',
      price: 800,
      similarity_score: 0.78,
      image: '/api/placeholder/150/150',
      rating: 4.2,
      vendor: 'Farm Fresh'
    },
    {
      product_id: 'p5',
      name: 'Hot Pepper',
      category: 'Spices',
      price: 500,
      similarity_score: 0.72,
      image: '/api/placeholder/150/150',
      rating: 4.0,
      vendor: 'Spice World'
    },
    {
      product_id: 'p6',
      name: 'Fresh Garlic',
      category: 'Spices',
      price: 300,
      similarity_score: 0.68,
      image: '/api/placeholder/150/150',
      rating: 4.3,
      vendor: 'Herb Garden'
    }
  ];

  useEffect(() => {
    if (currentProduct || userId) {
      fetchRecommendations();
    }
  }, [currentProduct, userId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would be:
      // const response = await fetch(`/api/ai/recommendations/hybrid/${userId}?product_id=${currentProduct}&top_k=4`);
      // const data = await response.json();
      // setRecommendations(data.recommendations);
      
      setRecommendations(mockRecommendations);
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    // Dispatch add to cart event
    const event = new CustomEvent('addToCart', {
      detail: {
        id: product.product_id,
        name: product.name,
        price: product.price,
        vendor: product.vendor,
        image: product.image
      }
    });
    window.dispatchEvent(event);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded mr-2"></span>
          AI Recommendations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-1"></div>
              <div className="bg-gray-200 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded mr-2"></span>
          AI Recommendations
        </h3>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchRecommendations}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded mr-2 flex items-center justify-center">
            <span className="text-white text-xs">🤖</span>
          </span>
          AI Recommendations
        </h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Powered by AI
        </span>
      </div>
      
      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">🔍</div>
          <p className="text-gray-600">No recommendations available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((product) => (
            <div key={product.product_id} className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-all duration-200 border hover:border-blue-200">
                <div className="relative mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                    {Math.round(product.similarity_score * 100)}% match
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h4>
                
                <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-green-600">₦{product.price.toLocaleString()}</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{product.rating}</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mb-3">{product.vendor}</p>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-500 text-white text-xs py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button 
          onClick={fetchRecommendations}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          Refresh Recommendations
        </button>
      </div>
    </div>
  );
};

export default AIRecommendations;


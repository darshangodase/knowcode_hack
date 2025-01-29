import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaFilter, FaSort, FaSearch, FaDonate, FaShoppingCart, FaClock } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all', // all, donate, sell
    sort: 'recent', // recent, price-low, price-high
    search: ''
  });
  const [showFilters, setShowFilters] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/ewaste/all');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const filteredProducts = products.filter(product => {
    if (filters.type === 'donate' && product.donationOrSale !== 'donate') return false;
    if (filters.type === 'sell' && product.donationOrSale === 'donate') return false;
    if (filters.search && !product.itemName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'recent':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const FilterButton = ({ active, onClick, children }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm ${active
          ? 'bg-green-500 text-white shadow-md'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        } transition-colors`}
    >
      {children}
    </motion.button>
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 font-rubik">
      <div className="max-w-7xl mx-auto">
        {/* Compact Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col space-y-4">
            {/* Header and Search */}
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">Available Products</h2>
              <div className="flex-1 relative max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-full border focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Filter Buttons in Two Rows */}
            <div className="flex flex-col gap-2">
              {/* Type Filters */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 w-16">Type:</span>
                <div className="flex gap-2">
                  <FilterButton
                    active={filters.type === 'all'}
                    onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
                  >
                    <FaShoppingCart className="text-xs" /> All
                  </FilterButton>
                  <FilterButton
                    active={filters.type === 'donate'}
                    onClick={() => setFilters(prev => ({ ...prev, type: 'donate' }))}
                  >
                    <FaDonate className="text-xs" /> Donations
                  </FilterButton>
                  <FilterButton
                    active={filters.type === 'sell'}
                    onClick={() => setFilters(prev => ({ ...prev, type: 'sell' }))}
                  >
                    <FaShoppingCart className="text-xs" /> For Sale
                  </FilterButton>
                </div>
              </div>

              {/* Sort Filters */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 w-16">Sort by:</span>
                <div className="flex gap-2">
                  <FilterButton
                    active={filters.sort === 'recent'}
                    onClick={() => setFilters(prev => ({ ...prev, sort: 'recent' }))}
                  >
                    <FaClock className="text-xs" /> Recent
                  </FilterButton>
                  <FilterButton
                    active={filters.sort === 'price-low'}
                    onClick={() => setFilters(prev => ({ ...prev, sort: 'price-low' }))}
                  >
                    <FaSort className="text-xs" /> Price: Low to High
                  </FilterButton>
                  <FilterButton
                    active={filters.sort === 'price-high'}
                    onClick={() => setFilters(prev => ({ ...prev, sort: 'price-high' }))}
                  >
                    <FaSort className="text-xs rotate-180" /> Price: High to Low
                  </FilterButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.itemName}
                  className="w-full h-48 object-cover"
                />
                {product.biddingEnabled && product.donationOrSale !== 'donate' && (
                  <div className="absolute top-2 right-2 bg-yellow-400/90 backdrop-blur-sm text-yellow-900 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    Bidding Active
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-lg ${product.donationOrSale === 'donate'
                      ? 'bg-green-400/90 text-green-900'
                      : 'bg-blue-400/90 text-blue-900'
                    }`}>
                    {product.donationOrSale === 'donate' ? 'Donation' : `₹${product.price}`}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.itemName}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">Category: {product.category}</p>
                  <p className="text-gray-600">Condition: {product.condition}</p>
                  <p className="text-gray-600">Location: {product.location}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewDetails(product._id)}
                  className="w-full py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No products found matching your criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;
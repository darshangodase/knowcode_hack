import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaMapMarkerAlt, FaBox } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const ProductCard = ({ product, onDelete }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isOwner = userInfo && userInfo.walletAddress === product.user;

  // Debug logs
  console.log('Product User:', product.user);
  console.log('Current User:', userInfo?.walletAddress);
  console.log('Is Owner:', isOwner);

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/ewaste/${product._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': userInfo.walletAddress,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete item');
        }

        // Call the onDelete callback to update the UI
        onDelete(product._id);
      } catch (error) {
        console.error('Delete failed:', error);
        alert(error.message || 'Failed to delete item');
      }
    }
  };

  return (
    <Link to={`/product/${product._id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        {/* Delete Button for Owner */}
        {isOwner && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white 
              p-2 rounded-full shadow-md transition duration-300 ease-in-out"
          >
            <FaTrash className="w-4 h-4" />
          </motion.button>
        )}

        {/* Product Image */}
        <div className="aspect-square">
          <img
            src={product.imageUrl}
            alt={product.itemName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400?text=No+Image';
            }}
          />
        </div>

        {/* Status Tags */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.biddingEnabled && product.donationOrSale === 'sell' && (
            <span className={`backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              product.biddingStatus === 'active' 
                ? 'bg-yellow-400/90 text-yellow-900'
                : 'bg-gray-400/90 text-gray-900'
            }`}>
              <MdVerified className="text-base" />
              {product.biddingStatus === 'active' ? 'Bidding Active' : 'Bidding Stopped'}
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            product.donationOrSale === 'donate'
              ? 'bg-green-400/90 text-green-900'
              : 'bg-blue-400/90 text-blue-900'
          }`}>
            {product.donationOrSale === 'donate' ? 'Donation' : `₹${product.price}`}
          </span>
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.itemName}</h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-green-500" />
              {product.location}
            </div>
            <div className="flex items-center gap-1">
              <FaBox className="text-green-500" />
              {product.quantity} available
            </div>
          </div>

          {product.donationOrSale === 'sell' && (
            <div className="mt-2">
              <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
              {product.biddingEnabled && product.lastBid && (
                <span className="ml-2 text-sm text-gray-500">
                  {product.biddingStatus === 'active' ? 'Current Bid:' : 'Final Bid:'} ₹{product.lastBid}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard; 
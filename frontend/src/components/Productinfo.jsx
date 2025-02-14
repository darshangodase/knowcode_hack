import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {toast } from 'react-hot-toast';
import { FaRecycle, FaLeaf, FaMapMarkerAlt, FaBox, FaWeightHanging, FaMinus, FaPlus, FaHistory, FaInfo, FaTrash, FaStop } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { BiDonateHeart } from 'react-icons/bi';

const ProductInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [showBidConfirm, setShowBidConfirm] = useState(false);
    const [showBuyConfirm, setShowBuyConfirm] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [bids, setBids] = useState([]);
    const [highestBid, setHighestBid] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showStopBidConfirm, setShowStopBidConfirm] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (id) {
            Promise.all([
                fetchProductDetails(),
                fetchBidHistory()
            ]);
        }
    }, [id]);

    useEffect(() => {
        if (product && userInfo) {
            console.log('Product Details:', {
                productUser: product.user,
                currentUserWallet: userInfo.walletAddress,
                isOwner: userInfo.walletAddress === product.user
            });
        }
    }, [product, userInfo]);

    useEffect(() => {
        if (product && userInfo) {
            console.log('Ownership Check:', {
                productWalletAddress: product.walletAddress,
                userWalletAddress: userInfo.walletAddress,
                isOwner: product.walletAddress === userInfo.walletAddress
            });
        }
    }, [product, userInfo]);

    const fetchProductDetails = async () => {
        try {
            console.log('Fetching product with ID:', id); // Log the ID being requested
            const response = await fetch(`http://localhost:3000/api/ewaste/${id}`);
            console.log('Response status:', response.status); // Log response status

            if (!response.ok) {
                console.error('Error response:', await response.text()); // Log error response
                throw new Error('Failed to fetch product details');
            }

            const data = await response.json();
            console.log('Received product data:', data); // Log received data
            setProduct(data);
            setLoading(false);
        } catch (error) {
            console.error('Error in fetchProductDetails:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchBidHistory = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/bids/${id}`);
            const data = await response.json();
            console.log('Bid history:', data); // Debug log
            if (response.ok) {
                setBids(data);
                // Update highest bid if there are bids
                if (data.length > 0) {
                    setHighestBid(Math.max(...data.map(bid => bid.amount)));
                }
            }
        } catch (error) {
            console.error('Error fetching bid history:', error);
        }
    };

    const formatWalletAddress = (address) => {
        if (!address) return 'Unknown';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const handleBidConfirm = async () => {
        if (!userInfo?.walletAddress) {
            toast.error('Please connect your wallet to place a bid');
            return;
        }

        const bidAmountNum = Number(bidAmount);
        if (!bidAmountNum || bidAmountNum <= 0) {
            toast.error('Please enter a valid bid amount');
            setShowBidConfirm(false);
            return;
        }
        console.log(bidAmountNum);
        console.log(highestBid);

        // Enhanced bid validation with better error messages
        if (Number(bidAmountNum) <= Number(highestBid)) {
            toast.error(`Bid too low! Current highest bid is ₹${highestBid}`, {
              duration: 4000,
              icon: '📉',
              style: {
                backgroundColor: '#FEF2F2',
                color: '#991B1B',
              },
            });
            setShowBidConfirm(false);
            return;
          }

        const loadingToast = toast.loading('Placing your bid...', {
            style: {
                backgroundColor: '#FEF3C7',
                color: '#92400E'
            }
        });

        try {
            const response = await fetch(`http://localhost:3000/api/bid/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${userInfo.walletAddress}`
                },
                body: JSON.stringify({ 
                    amount: bidAmountNum,
                    ewasteId: id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to place bid');
            }

            const data = await response.json();
            
            toast.success('🎉 Bid placed successfully!', {
                duration: 5000,
                icon: '🎯',
                style: {
                    backgroundColor: '#F0FDF4',
                    color: '#166534'
                }
            });
            setShowBidConfirm(false);
            setBidAmount('');
            
            await Promise.all([
                fetchProductDetails(),
                fetchBidHistory()
            ]);
        } catch (error) {
            console.error('Bid error:', error);
            toast.error(error.message || 'Failed to place bid', {
                duration: 4000,
                icon: '❌',
                style: {
                    backgroundColor: '#FEF2F2',
                    color: '#991B1B'
                }
            });
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const handleBidChange = (action) => {
        const currentBid = Number(bidAmount) || 0;
        const minBid = highestBid > 0 ? highestBid + 1 : product.price;
        const increment = 1; // Change increment to 1 rupee

        if (action === 'increase') {
            setBidAmount(String(currentBid + increment));
        } else if (action === 'decrease') {
            const newAmount = Math.max(minBid, currentBid - increment);
            setBidAmount(String(newAmount));
        }
    };

    const handleBuyNow = async () => {
        if (!userInfo?.walletAddress) {
            toast.error('Please connect your wallet first');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/bid/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userInfo.walletAddress
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to process request');

            toast.success('Request processed successfully! 🎉');
            setShowBuyConfirm(false);
            fetchProductDetails();
        } catch (error) {
            toast.error(error.message || 'Failed to process request');
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log('Attempting to delete:', id); // Debug log

            const response = await fetch(`http://localhost:3000/api/ewaste/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': userInfo.walletAddress,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete item');
            }

            const data = await response.json();
            console.log('Delete response:', data); // Debug log

            toast.success('Item deleted successfully! 🎉');
            navigate('/main');
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error(error.message || 'Failed to delete item');
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    const handleStopBidding = async () => {
        if (!userInfo || !userInfo.walletAddress) {
            toast.error('Please login first', {
                duration: 4000,
                icon: '❌',
                style: {
                    backgroundColor: '#FEF2F2',
                    color: '#991B1B'
                }
            });
            return;
        }

        const loadingToast = toast.loading('Stopping bidding...', {
            style: {
                backgroundColor: '#FEF3C7',
                color: '#92400E'
            }
        });

        try {
            const response = await fetch(`http://localhost:3000/api/ewaste/${product._id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': userInfo.walletAddress,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    biddingStatus: 'stopped'
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to stop bidding');
            }

            // Close the modal first
            setShowStopBidConfirm(false);

            toast.success('Bidding stopped successfully! 🛑', {
                duration: 5000,
                icon: '✅',
                style: {
                    backgroundColor: '#F0FDF4',
                    color: '#166534'
                }
            });
            
            fetchProductDetails();
        } catch (error) {
            console.error('Stop bidding failed:', error);
            toast.error(error.message || 'Failed to stop bidding', {
                duration: 4000,
                icon: '❌',
                style: {
                    backgroundColor: '#FEF2F2',
                    color: '#991B1B'
                }
            });
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const handleDonationRequest = async () => {
        if (!userInfo || !userInfo.walletAddress) {
            toast.error('Please login first');
            return;
        }

        const loadingToast = toast.loading('Sending donation request...');

        try {
            const response = await fetch(`http://localhost:3000/api/ewaste/${id}/donation-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userInfo.walletAddress
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to send donation request');
            }

            toast.success('Donation request sent successfully!');
            setMessage(''); // Clear the message after successful submission
        } catch (error) {
            console.error('Donation request error:', error);
            toast.error(error.message || 'Failed to send donation request');
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <FaRecycle className="text-green-500 text-4xl" />
            </motion.div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xl"
            >
                {error}
            </motion.div>
        </div>
    );

    if (!product) return null;

    const isOwner = userInfo && userInfo.walletAddress === product?.walletAddress;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-6 font-rubik">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Section - Image */}
                        <div className="lg:w-1/2 relative">
                            <div className="aspect-square">
                                <img
                                    src={product.imageUrl}
                                    alt={product.itemName}
                                    className="w-full h-full object-contain bg-gradient-to-br from-gray-50 to-gray-100 p-6"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                                    }}
                                />
                                {/* Status Tags */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    {product.donationOrSale === 'sell' && product.biddingEnabled && (
                                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                                            product.biddingStatus === 'active'
                                                ? 'bg-yellow-400/90 text-yellow-900'
                                                : 'bg-gray-400/90 text-gray-900'
                                        }`}>
                                            {product.biddingStatus === 'active' ? 'Bidding Active' : 'Bidding Stopped'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Details */}
                        <div className="lg:w-1/2 p-6 flex flex-col">
                            <div className="space-y-6">
                                {/* Title and Basic Info */}
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <h1 className="text-2xl font-bold text-gray-900">{product.itemName}</h1>
                                        {product.biddingEnabled && (
                                            <span className={` rounded-full text-xs font-medium ${
                                                product.biddingStatus === 'active' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                               
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">ID: {product._id}</p>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <InfoCard icon={<FaRecycle />} label="Category" value={product.category} />
                                    <InfoCard icon={<FaLeaf />} label="Condition" value={product.condition} />
                                    <InfoCard icon={<FaWeightHanging />} label="Weight" value={`${product.weight} kg`} />
                                    <InfoCard icon={<FaBox />} label="Quantity" value={product.quantity} />
                                    <InfoCard
                                        icon={<FaMapMarkerAlt />}
                                        label="Location"
                                        value={product.location}
                                        className="col-span-2"
                                    />
                                </div>

                                {/* Donation Request Section */}
                                {product.donationOrSale === 'donate' && !isOwner && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <BiDonateHeart className="text-2xl text-green-600" />
                                                <h3 className="text-lg font-semibold text-green-800">Request Donation</h3>
                                            </div>
                                            
                                            <textarea
                                                className="w-full p-4 border border-green-200 rounded-lg focus:ring-2 
                                                    focus:ring-green-500 focus:outline-none bg-white text-gray-700 
                                                    placeholder-gray-400 resize-none"
                                                placeholder="Write a message to the donor explaining why you need this item..."
                                                rows="4"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            />
                                            
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleDonationRequest}
                                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg
                                                    transition-colors duration-300 flex items-center justify-center gap-2
                                                    font-medium shadow-sm"
                                            >
                                                <BiDonateHeart className="text-xl" />
                                                Send Donation Request
                                            </motion.button>
                                            
                                            <p className="text-sm text-green-700 text-center">
                                                Your request will be sent to the donor for review
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Only show price and bidding for sale items */}
                                {product.donationOrSale === 'sell' && (
                                    <>
                                        {/* Price and Current Bid */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-gray-900">
                                                    ₹{product.price}
                                                </span>
                                                {highestBid > 0 && (
                                                    <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-full">
                                                        <span className="flex items-center gap-1">
                                                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                                            <span className="text-yellow-800 text-sm font-medium">Highest Bid:</span>
                                                        </span>
                                                        <span className="text-lg font-bold text-yellow-900">₹{highestBid}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bidding Interface */}
                                        {product.biddingEnabled && product.biddingStatus === 'active' && !isOwner && (
                                            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h3 className="text-base font-semibold text-yellow-800">Place Your Bid</h3>
                                                    <p className="text-xs text-gray-600">
                                                        Ends: {new Date(product.biddingEndTime).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleBidChange('decrease')}
                                                        className="w-8 h-8 flex items-center justify-center bg-yellow-200 text-yellow-800 rounded-full hover:bg-yellow-300 shadow-md"
                                                    >
                                                        <FaMinus className="text-xs" />
                                                    </motion.button>
                                                    <input
                                                        type="number"
                                                        value={bidAmount}
                                                        onChange={(e) => setBidAmount(e.target.value)}
                                                        placeholder="Enter amount"
                                                        className="flex-1 px-3 py-2 text-center text-lg font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                    />
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleBidChange('increase')}
                                                        className="w-8 h-8 flex items-center justify-center bg-yellow-200 text-yellow-800 rounded-full hover:bg-yellow-300 shadow-md"
                                                    >
                                                        <FaPlus className="text-xs" />
                                                    </motion.button>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => setShowBidConfirm(true)}
                                                    className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all text-sm font-medium shadow-md"
                                                >
                                                    Place Bid
                                                </motion.button>
                                            </div>
                                        )}

                                        {/* Stop Bidding Button */}
                                        {isOwner && product.biddingEnabled && product.biddingStatus === 'active' && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setShowStopBidConfirm(true)}
                                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg 
                                                    transition duration-300 ease-in-out flex items-center gap-2 text-sm font-medium shadow-sm"
                                            >
                                                <FaStop className="w-4 h-4" />
                                                Stop Bidding
                                            </motion.button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Add delete button with better visibility */}
                    {userInfo && userInfo.walletAddress === product?.walletAddress && (
                        <div className="p-4 border-t border-gray-100">
                            <div className="flex gap-4 justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg 
                                      transition duration-300 ease-in-out flex items-center gap-2 text-sm font-medium shadow-sm"
                                >
                                    <FaTrash className="w-4 h-4" />
                                    Delete
                                </motion.button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Update the bid history section to only show for sale items */}
            {product.donationOrSale === 'sell' && (
                <div className="mx-auto lg:mx-24">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-bold text-gray-900">Bid History</h3>
                            {product.biddingEnabled && (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    product.biddingStatus === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {product.biddingStatus === 'active' ? 'Bidding Active' : 'Bidding Stopped'}
                                </span>
                            )}
                        </div>
                        {highestBid > 0 && (
                            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full mt-4">
                                <span className="text-yellow-800 font-medium">Highest Bid:</span>
                                <span className="text-xl font-bold text-yellow-900">₹{highestBid}</span>
                            </div>
                        )}
                    </div>

                    {bids.length > 0 ? (
                        <div className="space-y-4">Bid History

                            {bids.map((bid, index) => (
                                <motion.div
                                    key={bid._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-white rounded-xl shadow-sm p-4 border ${
                                        index === 0 
                                            ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-white' 
                                            : 'border-gray-100'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    {bid.bidder.walletAddress.substring(2, 4)}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        {formatWalletAddress(bid.bidder.walletAddress)}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(bid.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">₹{bid.amount}</p>
                                            {index === 0 && (
                                                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                                    Highest Bid
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-xl shadow-sm p-8 text-center"
                        >
                            <div className="flex flex-col items-center gap-3">
                                <FaHistory className="text-4xl text-gray-300" />
                                <p className="text-gray-500">No bids yet. Be the first to bid!</p>
                                <p className="text-sm text-gray-400">
                                    Minimum bid amount: ₹{product.price}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Minimum Next Bid Info */}
            {product.biddingEnabled && highestBid > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 rounded-xl p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <FaInfo className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-yellow-800">
                                Minimum next bid must be at least ₹1 more than the current highest bid
                            </p>
                            <p className="text-lg font-bold text-yellow-900">
                                Minimum next bid: ₹{highestBid + 1}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Confirmation Modals */}
            <AnimatePresence>
                {showBuyConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg p-6 max-w-md w-full"
                        >
                            <h3 className="text-xl font-bold mb-4">Confirm Request</h3>
                            <p className="mb-4">Are you sure you want to request this donation?</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowBuyConfirm(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBuyNow}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Confirm Request
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Existing Bid Confirmation Modal */}
                {showBidConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg p-6 max-w-md w-full"
                        >
                            <h3 className="text-xl font-bold mb-4">Confirm Your Bid</h3>
                            <p className="mb-4">Are you sure you want to place a bid of ₹{bidAmount}?</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowBidConfirm(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBidConfirm}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                >
                                    Confirm Bid
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                    <FaTrash className="text-2xl text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete this item? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleDelete(product._id)}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                                        transition-colors duration-300 font-medium"
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {showStopBidConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg p-6 max-w-md w-full"
                        >
                            <h3 className="text-xl font-bold mb-4">Confirm Stop Bidding</h3>
                            <p className="mb-4">Are you sure you want to stop bidding for this item?</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowStopBidConfirm(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleStopBidding}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Confirm Stop
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Updated InfoCard Component
const InfoCard = ({ icon, label, value, className = '' }) => (
    <div className={`flex items-center gap-2.5 bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl ${className}`}>
        <div className="text-green-500 text-base">{icon}</div>
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-sm font-semibold text-gray-900">{value || 'N/A'}</p>
        </div>
    </div>
);

export default ProductInfo;

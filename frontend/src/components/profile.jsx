import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRecycle, FaHandshake, FaTimes, FaUser, FaEnvelope, FaWallet, FaMedal } from 'react-icons/fa';

const Profile = () => {
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [requests, setRequests] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [totalWeight, setTotalWeight] = useState(0);

    useEffect(() => {
        fetchUserPosts();
    }, []);

    useEffect(() => {
        // Calculate total weight whenever userPosts changes
        const total = userPosts.reduce((sum, post) => sum + (post.weight || 0), 0);
        setTotalWeight(total);
    }, [userPosts]);

    const fetchUserPosts = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/ewaste/user-posts`, {
                headers: {
                    'Authorization': userInfo.walletAddress
                }
            });
            const data = await response.json();
            if (response.ok) {
                setUserPosts(data);
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async (postId) => {
        try {
            let response;
            // Fetch bids for sale items
            response = await fetch(`http://localhost:3000/api/bids/${postId}`, {
                headers: {
                    'Authorization': userInfo.walletAddress
                }
            });
            
            const data = await response.json();
            if (response.ok) {
                setRequests(data);
                setSelectedPost(userPosts.find(post => post._id === postId));
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const RequestsModal = ({ post, requests, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {post.donationOrSale === 'donate' ? 'Donation Requests' : 'Bids'}
                        </h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <FaTimes className="text-xl" />
                        </button>
                    </div>

                    {post.donationOrSale === 'sale' && (
                        <div className="space-y-4">
                            {requests && requests.length > 0 ? (
                                requests.map((bid) => (
                                    <motion.div
                                        key={bid._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="border rounded-lg p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">{bid.bidder?.name || 'Anonymous'}</p>
                                                <p className="text-green-600 font-bold text-lg">₹{bid.amount}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(bid.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {bid.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                        onClick={() => handleBidAction(bid._id, 'accept')}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                        onClick={() => handleBidAction(bid._id, 'reject')}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No bids received yet
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4"
        >
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-bl-full opacity-50" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-6">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 
                                    rounded-full flex items-center justify-center text-white text-3xl"
                            >
                                <FaUser />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{userInfo?.name}</h1>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <FaEnvelope className="text-green-500" />
                                    {userInfo?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid - Now with 2 columns */}
                <motion.div 
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FaWallet className="text-2xl text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Wallet Address</h3>
                                <p className="text-sm text-gray-500 break-all">{userInfo?.walletAddress}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-md p-6 border-l-4 border-cyan-500"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-cyan-100 rounded-lg">
                                <FaRecycle className="text-2xl text-cyan-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Total Recycled</h3>
                                <p className="text-2xl font-bold text-cyan-600">{totalWeight.toFixed(1)} kg</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Recycled Items Section */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <FaRecycle className="text-2xl text-green-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Recycled Items</h2>
                    </div>
                    
                    <div className="space-y-4">
                        {userPosts.map((post) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: post._id.charCodeAt(0) * 0.1 }}
                                className="bg-gray-50 rounded-lg p-4 hover:bg-green-50 
                                    transition-colors duration-300"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{post.itemName}</h3>
                                        <p className="text-sm text-gray-600">Category: {post.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">{post.weight} kg</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* User Posts Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaRecycle className="text-green-600" />
                    Your E-Waste Posts
                </h2>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    </div>
                ) : userPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        You haven't posted any e-waste items yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userPosts.map((post) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                            >
                                <img
                                    src={post.imageUrl}
                                    alt={post.itemName}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {post.itemName}
                                    </h3>
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                                        <span>{post.category}</span>
                                        <span>{post.weight} kg</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            post.donationOrSale === 'donate' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {post.donationOrSale === 'donate' ? 'Donation' : `₹${post.price}`}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            post.biddingStatus === 'active' 
                                                ? 'bg-yellow-100 text-yellow-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {post.biddingEnabled 
                                                ? `Bidding ${post.biddingStatus}` 
                                                : 'No Bidding'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => fetchRequests(post._id)}
                                    className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                                >
                                    <FaHandshake />
                                    View {post.donationOrSale === 'donate' ? 'Requests' : 'Bids'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Requests Modal */}
            {selectedPost && (
                <RequestsModal
                    post={selectedPost}
                    requests={requests}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </motion.div>
    );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRecycle, FaHandshake, FaTimes } from 'react-icons/fa';

const Profile = () => {
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [requests, setRequests] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        fetchUserPosts();
    }, []);

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
            let donationData = [];
            let bidsData = [];
            
            const donationResponse = await fetch(`http://localhost:3000/api/ewaste/${postId}/donation-requests`, {
                headers: {
                    'Authorization': userInfo.walletAddress
                }
            });
            if (donationResponse.ok) {
                donationData = await donationResponse.json();
            }

            const post = userPosts.find(p => p._id === postId);
            if (post.donationOrSale === 'sale') {
                const bidsResponse = await fetch(`http://localhost:3000/api/ewaste/${postId}/bids`, {
                    headers: {
                        'Authorization': userInfo.walletAddress
                    }
                });
                if (bidsResponse.ok) {
                    bidsData = await bidsResponse.json();
                }
            }

            console.log('Fetched data:', { donations: donationData, bids: bidsData });

            setRequests({
                donations: donationData || [],
                bids: bidsData || []
            });
            setSelectedPost(post);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setRequests({
                donations: [],
                bids: []
            });
        }
    };

    const RequestsModal = ({ post, requests, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        {post.donationOrSale === 'donate' ? 'Donation Requests' : 'Bids'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes />
                    </button>
                </div>

                {post.donationOrSale === 'donate' ? (
                    <div className="space-y-4">
                        {requests.donations && requests.donations.length > 0 ? (
                            requests.donations.map((request) => (
                                <div key={request._id} className="border rounded-lg p-4">
                                    <div>
                                        <p className="font-medium">{request.requester?.name || 'Anonymous'}</p>
                                        <p className="text-gray-600">{request.message}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No donation requests yet
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.bids && requests.bids.length > 0 ? (
                            requests.bids.map((bid) => (
                                <div key={bid._id} className="border rounded-lg p-4">
                                    <div>
                                        <p className="font-medium">{bid.bidder?.name || 'Anonymous'}</p>
                                        <p className="text-green-600 font-bold">₹{bid.amount}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {new Date(bid.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No bids yet
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* User Info Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-green-600">
                                {userInfo?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {userInfo?.name || 'User'}
                            </h1>
                            <p className="text-gray-500">
                                {userInfo?.email || 'No email provided'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Posts Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
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
            </div>

            {/* Requests Modal */}
            {selectedPost && (
                <RequestsModal
                    post={selectedPost}
                    requests={requests}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </div>
    );
};

export default Profile;

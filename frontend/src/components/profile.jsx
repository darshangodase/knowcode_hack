import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaRecycle,
  FaHandshake,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaWallet,
  FaMedal,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const Profile = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [requests, setRequests] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [totalWeight, setTotalWeight] = useState(0);
  const [acceptedRequests, setAcceptedRequests] = useState({ donations: [], bids: [] });
  const [myAcceptedRequests, setMyAcceptedRequests] = useState({
    myAcceptedBids: [],
    myAcceptedDonations: []
  });

  useEffect(() => {
    fetchUserPosts();
    fetchAcceptedRequests();
    fetchMyAcceptedRequests();
  }, []);

  useEffect(() => {
    // Calculate total weight whenever userPosts changes
    const total = userPosts.reduce((sum, post) => sum + (post.weight || 0), 0);
    setTotalWeight(total);
  }, [userPosts]);

  const fetchUserPosts = async () => {
    try {
     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ewaste/user-posts`,
        {
          headers: {
            Authorization: userInfo.walletAddress,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUserPosts(data);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (postId) => {
    try {
      let response;
      const post = userPosts.find((post) => post._id === postId);

      if (post.donationOrSale === "donate") {
        // Fetch donation requests
        response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/ewaste/${postId}/donation-requests`,
          {
            headers: {
              Authorization: userInfo.walletAddress,
            },
          }
        );
      } else {
        // Fetch bids for sale items
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bids/${postId}`, {
          headers: {
            Authorization: userInfo.walletAddress,
          },
        });
      }

      const data = await response.json();
      if (response.ok) {
        setRequests(data);
        setSelectedPost(post);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const fetchAcceptedRequests = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/ewaste/user/accepted-requests`,
        {
          headers: {
            Authorization: userInfo.walletAddress,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAcceptedRequests(data);
      }
    } catch (error) {
      console.error("Error fetching accepted requests:", error);
    }
  };

  const fetchMyAcceptedRequests = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/ewaste/user/my-accepted-requests`,
        {
          headers: {
            Authorization: userInfo.walletAddress,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMyAcceptedRequests(data);
      }
    } catch (error) {
      console.error("Error fetching my accepted requests:", error);
    }
  };

  const RequestsModal = ({ post, requests, onClose }) => {
    const [acceptedRequest, setAcceptedRequest] = useState(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Check if post already has an accepted request/bid
    useEffect(() => {
      const accepted = requests.find(req => req.status === 'accepted');
      if (accepted) {
        setAcceptedRequest(accepted._id);
      }
    }, [requests]);

    const handleAcceptRequest = async (requestId) => {
      try {
        const endpoint = post.donationOrSale === 'donate' 
          ? `/api/ewaste/donation-request/${requestId}/accept`
          : `/api/ewaste/bid/${requestId}/accept`;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': userInfo.walletAddress,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setAcceptedRequest(requestId);
          post.status = post.donationOrSale === 'donate' ? 'accepted' : 'sold';
          post.biddingStatus = post.donationOrSale === 'sell' ? 'completed' : post.biddingStatus;
          
          toast.success(`${post.donationOrSale === 'donate' ? 'Donation request' : 'Bid'} accepted successfully`);
          // Refresh the requests list
          fetchRequests(post._id);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to accept request');
        }
      } catch (error) {
        console.error('Error accepting request:', error);
        toast.error(error.message || 'Failed to accept request');
      }
    };

    return (
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
                {post.biddingStatus === 'completed' && (
                  <span className="ml-2 text-sm text-green-600">(Completed)</span>
                )}
              </h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              {requests && requests.length > 0 ? (
                requests.map((request) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-lg p-4 ${
                      request.status === 'accepted' 
                        ? 'bg-green-50 border-green-200' 
                        : request.status === 'rejected'
                          ? 'bg-gray-50 opacity-50'
                          : acceptedRequest 
                            ? 'bg-gray-50 opacity-50' 
                            : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {post.donationOrSale === 'donate'
                              ? request.requester?.name || formatWalletAddress(request.requester?.walletAddress)
                              : request.bidder?.name || formatWalletAddress(request.bidder?.walletAddress)}
                          </p>
                          {request.status && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              request.status === 'accepted' 
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          )}
                        </div>
                        {post.donationOrSale === 'sell' && (
                          <p className="text-green-600 font-semibold mt-1">₹{request.amount}</p>
                        )}
                        {request.message && (
                          <p className="text-sm text-gray-600 mt-1">{request.message}</p>
                        )}
                      </div>
                      {!acceptedRequest && request.status !== 'accepted' && 
                       post.biddingStatus !== 'completed' && (
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                            transition-colors text-sm"
                        >
                          Accept
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No {post.donationOrSale === 'donate' ? 'donation requests' : 'bids'} yet.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const formatWalletAddress = (address) => {
    if (!address) return "Anonymous";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const AcceptedRequestsSection = () => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl shadow-lg p-8 mt-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaHandshake className="text-2xl text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Accepted Requests</h2>
      </div>

      {/* Accepted Donations */}
      {acceptedRequests.donations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Donations</h3>
          <div className="space-y-4">
            {acceptedRequests.donations.map((item) => (
              <div key={item.postId} className="bg-green-50 rounded-lg p-4">
                <div className="flex gap-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.itemName} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                    <p className="text-sm text-gray-600">Category: {item.category}</p>
                    <p className="text-sm text-gray-600">Weight: {item.weight} kg</p>
                    <p className="text-sm text-gray-600">Location: {item.location}</p>
                    <div className="mt-2 p-2 bg-white rounded-lg">
                      <p className="font-medium text-gray-800">Donated to:</p>
                      <p className="text-sm text-gray-600">
                        Name: {item.request.requester.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: {item.request.requester.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Wallet: {formatWalletAddress(item.request.requester.walletAddress)}
                      </p>
                      {item.request.message && (
                        <p className="text-sm text-gray-600 mt-1">
                          Message: {item.request.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted Bids */}
      {acceptedRequests.bids.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Accepted Bids</h3>
          <div className="space-y-4">
            {acceptedRequests.bids.map((item) => (
              <div key={item.postId} className="bg-blue-50 rounded-lg p-4">
                <div className="flex gap-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.itemName} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                    <p className="text-sm text-gray-600">Category: {item.category}</p>
                    <p className="text-sm text-gray-600">Weight: {item.weight} kg</p>
                    <p className="text-sm text-gray-600">Location: {item.location}</p>
                    <p className="text-sm font-medium text-blue-600">
                      Accepted Bid: ₹{item.bid.amount}
                    </p>
                    <div className="mt-2 p-2 bg-white rounded-lg">
                      <p className="font-medium text-gray-800">Sold to:</p>
                      <p className="text-sm text-gray-600">
                        Name: {item.bid.bidder.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: {item.bid.bidder.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Wallet: {formatWalletAddress(item.bid.bidder.walletAddress)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {acceptedRequests.donations.length === 0 && 
       acceptedRequests.bids.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No accepted requests yet.
        </div>
      )}
    </motion.div>
  );

  const MyAcceptedRequestsSection = () => (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* My Accepted Bids */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <FaHandshake className="text-blue-600" />
          My Accepted Bids
        </h3>
        <div className="space-y-4">
          {myAcceptedRequests.myAcceptedBids.length > 0 ? (
            myAcceptedRequests.myAcceptedBids.map((item) => (
              <div key={item.postId} className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-3">
                  <img 
                    src={item.imageUrl} 
                    alt={item.itemName} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                    <p className="text-sm text-gray-600">Category: {item.category}</p>
                    <p className="text-sm text-gray-600">Weight: {item.weight} kg</p>
                    <p className="text-sm text-gray-600">Location: {item.location}</p>
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      Bid Amount: ₹{item.bidAmount}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Owner: {formatWalletAddress(item.ownerWallet)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No accepted bids yet</p>
          )}
        </div>
      </div>

      {/* My Accepted Donations */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-2">
          <FaRecycle className="text-green-600" />
          My Accepted Donations
        </h3>
        <div className="space-y-4">
          {myAcceptedRequests.myAcceptedDonations.length > 0 ? (
            myAcceptedRequests.myAcceptedDonations.map((item) => (
              <div key={item.postId} className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-3">
                  <img 
                    src={item.imageUrl} 
                    alt={item.itemName} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                    <p className="text-sm text-gray-600">Category: {item.category}</p>
                    <p className="text-sm text-gray-600">Weight: {item.weight} kg</p>
                    <p className="text-sm text-gray-600">Location: {item.location}</p>
                    {item.message && (
                      <p className="text-sm text-gray-600 mt-1">
                        Message: {item.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Owner: {formatWalletAddress(item.ownerWallet)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No accepted donations yet</p>
          )}
        </div>
      </div>
    </div>
  );

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
                <h1 className="text-3xl font-bold text-gray-800">
                  {userInfo?.name}
                </h1>
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
                <h3 className="text-lg font-semibold text-gray-700">
                  Wallet Address
                </h3>
                <p className="text-sm text-gray-500 break-all">
                  {userInfo?.walletAddress}
                </p>
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
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Recycled
                </h3>
                <p className="text-2xl font-bold text-cyan-600">
                  {totalWeight.toFixed(1)} kg
                </p>
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
                initial={{ opacity: 1, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 rounded-lg p-4 hover:bg-green-50 
                                    transition-colors duration-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {post.itemName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Category: {post.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {post.weight} kg
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <AcceptedRequestsSection />
        <MyAcceptedRequestsSection />
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
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.donationOrSale === "donate"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {post.donationOrSale === "donate" ? "Donation" : `₹${post.price}`}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.status === "accepted" || post.status === "donated"
                          ? "bg-green-100 text-green-800"
                          : post.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {post.donationOrSale === "donate" 
                        ? post.status === "accepted" || post.status === "donated"
                          ? "Donated"
                          : "Pending Donation"
                        : post.biddingEnabled
                          ? `Bidding ${post.biddingStatus}`
                          : "No Bidding"
                      }
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => fetchRequests(post._id)}
                  className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <FaHandshake />
                  View {post.donationOrSale === "donate" ? "Requests" : "Bids"}
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

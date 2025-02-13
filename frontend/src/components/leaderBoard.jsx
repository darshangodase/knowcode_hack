import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaRecycle } from 'react-icons/fa';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/leaderboard');
            const data = await response.json();
            
            // Process users data to calculate total quantity and sort
            const processedUsers = data.map(user => ({
                ...user,
                totalQuantity: user.recycledItems.reduce((total, item) => total + item.quantity, 0)
            })).sort((a, b) => b.totalQuantity - a.totalQuantity);

            setUsers(processedUsers);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
            setLoading(false);
        }
    };

    const getRankIcon = (index) => {
        switch (index) {
            case 0:
                return <FaTrophy className="text-yellow-400 text-2xl" />;
            case 1:
                return <FaMedal className="text-gray-400 text-2xl" />;
            case 2:
                return <FaMedal className="text-amber-600 text-2xl" />;
            default:
                return <span className="text-gray-600 font-bold">{index + 1}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        E-Waste Champions
                    </h1>
                    <p className="text-lg text-gray-600">
                        Top contributors making a difference in e-waste management
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-green-50">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rank</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items Recycled</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Quantity (kg)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user, index) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={index < 3 ? 'bg-green-50/50' : 'hover:bg-gray-50'}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getRankIcon(index)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                            <span className="text-green-800 font-semibold">
                                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name || 'Anonymous User'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email || 'No email provided'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaRecycle className="text-green-500 mr-2" />
                                                    <span className="text-sm text-gray-900">
                                                        {user.recycledItems.length}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {user.totalQuantity.toFixed(2)} kg
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
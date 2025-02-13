import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaMedal, FaRecycle, FaCrown, FaLeaf, FaChartLine } from 'react-icons/fa';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/dashboard/leaderboard');
            const data = await response.json();
            setUsers(data.users);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
            setLoading(false);
        }
    };

    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0.8
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20, y: 20 },
        visible: { 
            opacity: 1, 
            x: 0, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const getRankIcon = (index) => {
        switch (index) {
            case 0:
                return (
                    <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <FaTrophy className="text-yellow-500 text-3xl" />
                        <motion.div
                            className="absolute -inset-1 bg-yellow-200 rounded-full -z-10"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity
                            }}
                        />
                    </motion.div>
                );
            case 1:
                return (
                    <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                        <FaMedal className="text-emerald-400 text-2xl" />
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                        <FaMedal className="text-green-500 text-2xl" />
                    </motion.div>
                );
            default:
                return (
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100"
                    >
                        <span className="text-green-800 font-bold">{index + 1}</span>
                    </motion.div>
                );
        }
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-50 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-3 mb-4">
                        <motion.div
                            animate={{ 
                                rotate: [0, 10, -10, 10, 0],
                                scale: [1, 1.1, 1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            <FaCrown className="text-4xl text-yellow-500" />
                        </motion.div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            E-Waste Champions
                        </h1>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center items-center gap-2"
                    >
                        <FaLeaf className="text-emerald-500" />
                        <p className="text-lg text-emerald-800">
                            Top contributors making a difference in e-waste management
                        </p>
                    </motion.div>
                </div>

                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center space-y-4"
                    >
                        <motion.div
                            animate={{ 
                                rotate: 360,
                                scale: [1, 1.2, 1],
                                borderColor: ['#10b981', '#059669', '#10b981']
                            }}
                            transition={{ 
                                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                                scale: { duration: 1, repeat: Infinity },
                                borderColor: { duration: 3, repeat: Infinity }
                            }}
                            className="w-16 h-16 border-4 border-t-transparent rounded-full"
                        />
                        <motion.p
                            animate={{ 
                                opacity: [0.5, 1, 0.5],
                                color: ['#10b981', '#059669', '#10b981']
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="font-medium"
                        >
                            Loading champions...
                        </motion.p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-emerald-200 hover:border-emerald-400 transition-colors duration-300"
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <motion.tr
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gradient-to-r from-emerald-600 to-green-600"
                                    >
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rank</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Champion</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Items Recycled</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Total Quantity (kg)</th>
                                    </motion.tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-100">
                                    <AnimatePresence>
                                        {users.map((user, index) => (
                                            <motion.tr
                                                key={user._id}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                whileHover={{ 
                                                    scale: 1.02,
                                                    backgroundColor: "rgba(16, 185, 129, 0.1)"
                                                }}
                                                onClick={() => setSelectedRow(selectedRow === index ? null : index)}
                                                className={`
                                                    cursor-pointer transition-all duration-300
                                                    hover:shadow-lg relative overflow-hidden
                                                    ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-l-yellow-400' : ''}
                                                    ${index === 1 ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-l-emerald-400' : ''}
                                                    ${index === 2 ? 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-l-green-400' : ''}
                                                    ${index > 2 ? 'bg-white hover:bg-emerald-50' : ''}
                                                    ${selectedRow === index ? 'shadow-inner' : ''}
                                                `}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {getRankIcon(index)}
                                                        {index < 3 && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ delay: 0.2 }}
                                                                className={`
                                                                    text-xs font-bold px-2 py-1 rounded-full
                                                                    ${index === 0 ? 'bg-yellow-100 text-yellow-800' : ''}
                                                                    ${index === 1 ? 'bg-emerald-100 text-emerald-800' : ''}
                                                                    ${index === 2 ? 'bg-green-100 text-green-800' : ''}
                                                                `}
                                                            >
                                                                Top {index + 1}
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <motion.div 
                                                        className="flex items-center"
                                                        whileHover={{ x: 5 }}
                                                    >
                                                        <div className={`
                                                            text-base font-medium
                                                            ${index === 0 ? 'text-yellow-900' : ''}
                                                            ${index === 1 ? 'text-emerald-900' : ''}
                                                            ${index === 2 ? 'text-green-900' : ''}
                                                            ${index > 2 ? 'text-gray-900' : ''}
                                                        `}>
                                                            {user.name}
                                                        </div>
                                                    </motion.div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <motion.div 
                                                        className="flex items-center"
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        <FaRecycle className={`
                                                            mr-2
                                                            ${index === 0 ? 'text-yellow-500' : ''}
                                                            ${index === 1 ? 'text-emerald-500' : ''}
                                                            ${index === 2 ? 'text-green-500' : ''}
                                                            ${index > 2 ? 'text-gray-500' : ''}
                                                        `} />
                                                        <span className="text-sm text-gray-900">{user.itemsRecycled}</span>
                                                    </motion.div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <motion.span 
                                                        className={`
                                                            text-sm font-medium
                                                            ${index === 0 ? 'text-yellow-900' : ''}
                                                            ${index === 1 ? 'text-emerald-900' : ''}
                                                            ${index === 2 ? 'text-green-900' : ''}
                                                            ${index > 2 ? 'text-gray-900' : ''}
                                                        `}
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        {user.totalQuantity.toFixed(1)} kg
                                                    </motion.span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Leaderboard;
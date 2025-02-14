import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRecycle, FaLeaf, FaTree, FaChartLine, FaGlobe } from 'react-icons/fa';

const Impact = () => {
    const [stats, setStats] = useState({
        totalEwaste: 0,
        co2Saved: 0,
        treesPlanted: 0,
        impactScore: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImpactData();
    }, []);

    const fetchImpactData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ewaste/impact-stats`);
            const data = await response.json();
            if (data.success) {
                setStats({
                    totalEwaste: data.stats.totalEwaste,
                    co2Saved: data.stats.co2Saved,
                    treesPlanted: Math.floor(data.stats.co2Saved / 20), // Approximate calculation
                    impactScore: data.stats.totalEwaste * 10 // Example calculation
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching impact data:', error);
            setLoading(false);
        }
    };

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

    const ImpactCard = ({ icon, title, value, description, color }) => (
        <motion.div
            variants={itemVariants}
            whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)"
            }}
            className={`relative overflow-hidden rounded-2xl p-6 bg-white shadow-lg
                border-t-4 ${color} transition-all duration-300`}
        >
            <div className="absolute -right-4 -top-4 opacity-10 text-6xl">
                {icon}
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`text-2xl ${color.replace('border-', 'text-')}`}>
                        {icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-teal-600 
                        bg-clip-text text-transparent"
                >
                    {value}
                </motion.div>
                <p className="text-gray-600">{description}</p>
            </div>
        </motion.div>
    );

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-16 px-4"
        >
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    variants={itemVariants}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="inline-block p-2 bg-green-100 rounded-full mb-4"
                    >
                        <FaGlobe className="text-3xl text-green-600" />
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 
                        bg-clip-text text-transparent">
                        Your Environmental Impact
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        See how your e-waste recycling efforts are making a difference in creating a sustainable future
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            animate={{ 
                                rotate: 360,
                                scale: [1, 1.2, 1]
                            }}
                            transition={{ 
                                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                                scale: { duration: 1, repeat: Infinity }
                            }}
                            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ImpactCard
                            icon={<FaRecycle />}
                            title="E-Waste Recycled"
                            value={`${stats.totalEwaste} kg`}
                            description="Total electronic waste properly recycled"
                            color="border-green-500"
                        />
                        <ImpactCard
                            icon={<FaLeaf />}
                            title="CO₂ Reduction"
                            value={`${stats.co2Saved} kg`}
                            description="Carbon dioxide emissions prevented"
                            color="border-teal-500"
                        />
                        <ImpactCard
                            icon={<FaTree />}
                            title="Tree Equivalent"
                            value={`${stats.treesPlanted} trees`}
                            description="Equivalent to trees planted"
                            color="border-emerald-500"
                        />
                        <ImpactCard
                            icon={<FaChartLine />}
                            title="Impact Score"
                            value={stats.impactScore}
                            description="Your environmental impact score"
                            color="border-cyan-500"
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Impact;
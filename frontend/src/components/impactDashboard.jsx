import React, { useState, useEffect } from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-cards";
import { motion } from "framer-motion";
import { FaRecycle, FaLeaf, FaDonate, FaShoppingCart, FaTree, FaChartLine } from "react-icons/fa";

function ImpactDashboard() {
    const [stats, setStats] = useState({
        totalEwaste: 0,
        totalDonated: 0,
        totalSold: 0,
        co2Saved: 0,
        donationCount: 0,
        saleCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchImpactStats = async () => {
        try {
            
            const response = await fetch('http://localhost:3000/api/ewaste/impact-stats');
          
            
            const data = await response.json();
          

            if (data.success) {
                setStats(data.stats);
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to fetch stats');
            }
        } catch (error) {
            console.error('Error fetching impact stats:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImpactStats();
        const interval = setInterval(fetchImpactStats, 300000);
        return () => clearInterval(interval);
    }, []);

    // Add error display
    if (error) {
        return (
            <div className="py-32 text-center text-red-600">
                Error loading impact stats: {error}
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const impactCards = [
        {
            icon: <FaRecycle />,
            title: "Total E-Waste",
            value: `${stats.totalEwaste.toFixed(1)} kg`,
            color: "green"
        },
        {
            icon: <FaLeaf />,
            title: "CO₂ Reduced",
            value: `${stats.co2Saved.toFixed(1)} kg`,
            color: "emerald"
        },
        {
            icon: <FaTree />,
            title: "Trees Saved",
            value: Math.floor(stats.co2Saved / 20),
            color: "teal"
        },
        {
            icon: <FaChartLine />,
            title: "Impact Score",
            value: Math.floor(stats.totalEwaste * 10),
            color: "cyan"
        }
    ];

    return (
        <div className="w-full p-4 sm:p-6">
            {/* Show responsive grid for smaller screens */}
            <div className="block lg:hidden">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {impactCards.map((card, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className={`bg-white rounded-xl shadow-md overflow-hidden
                                    border-l-4 border-${card.color}-500 p-4 sm:p-6
                                    transform transition-all duration-300`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 bg-${card.color}-100 rounded-lg`}>
                                        <span className={`text-2xl text-${card.color}-600`}>
                                            {card.icon}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-700">
                                            {card.title}
                                        </h3>
                                        <motion.p 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={`text-lg sm:text-xl font-bold text-${card.color}-600`}
                                        >
                                            {card.value}
                                        </motion.p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Show 3D card for large screens */}
            <div className="hidden lg:block py-32 font-rubik">
                <CardContainer className="inter-var">
                    <CardBody className="relative bg-white dark:bg-black border border-neutral-200 dark:border-white/[0.2] w-auto sm:w-[30rem] h-auto rounded-xl p-6">
                        <CardItem
                            translateZ={50}
                            className="text-xl font-bold text-neutral-600 dark:text-white mb-4"
                        >
                            Environmental Impact Dashboard
                        </CardItem>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Total E-Waste Processed */}
                            <StatsCard
                                icon={<FaRecycle />}
                                title="Total E-Waste"
                                value={`${stats.totalEwaste} kg`}
                                loading={loading}
                            />

                            {/* CO2 Saved */}
                            <StatsCard
                                icon={<FaLeaf />}
                                title="CO₂ Saved"
                                value={`${stats.co2Saved} kg`}
                                loading={loading}
                            />

                            {/* Donations */}
                            <StatsCard
                                icon={<FaDonate />}
                                title="Donated"
                                value={`${stats.totalDonated} kg`}
                                subtitle={`${stats.donationCount} items`}
                                loading={loading}
                            />

                            {/* Sales */}
                            <StatsCard
                                icon={<FaShoppingCart />}
                                title="Sold"
                                value={`${stats.totalSold} kg`}
                                subtitle={`${stats.saleCount} items`}
                                loading={loading}
                            />
                        </div>

                        <CardItem
                            as="p"
                            translateZ={60}
                            className="text-neutral-500 text-sm max-w-sm mt-4 dark:text-neutral-300"
                        >
                            Making a difference with every kilogram of e-waste recycled.
                            1.44 kg CO₂ saved per 1 kg e-waste processed.
                        </CardItem>
                    </CardBody>
                </CardContainer>
            </div>

            {/* Progress Section - Show on all screen sizes */}
            <motion.div
                variants={itemVariants}
                className="mt-6 bg-white rounded-xl shadow-md p-4 sm:p-6"
            >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    Recycling Progress
                </h3>
                <div className="space-y-4">
                    {[
                        { label: "E-Waste Goal", current: stats.totalEwaste, target: 100 },
                        { label: "CO₂ Reduction", current: stats.co2Saved, target: 200 }
                    ].map((item, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.label}</span>
                                <span className="text-gray-800 font-medium">
                                    {Math.round((item.current / item.target) * 100)}%
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((item.current / item.target) * 100, 100)}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

// Stats Card Component
const StatsCard = ({ icon, title, value, subtitle, loading }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl"
    >
        <div className="flex items-center gap-3 mb-2">
            <div className="text-green-600 text-xl">
                {icon}
            </div>
            <h3 className="text-sm font-semibold text-green-800">{title}</h3>
        </div>
        {loading ? (
            <div className="h-6 bg-green-200 animate-pulse rounded" />
        ) : (
            <>
                <p className="text-2xl font-bold text-green-900">{value}</p>
                {subtitle && (
                    <p className="text-sm text-green-700 mt-1">{subtitle}</p>
                )}
            </>
        )}
    </motion.div>
);

export default ImpactDashboard;
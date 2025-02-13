import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaRecycle, FaHandHoldingHeart, FaCoins, FaTruck } from 'react-icons/fa';

const HowWeWork = () => {
    const navigate = useNavigate();

    const steps = [
        {
            icon: <FaRecycle />,
            title: "Register Your E-Waste",
            description: "Sign up and list your electronic waste items with details and photos",
            color: "from-green-400 to-emerald-500"
        },
        {
            icon: <FaTruck />,
            title: "Schedule Pickup",
            description: "Choose a convenient time for our team to collect your e-waste",
            color: "from-teal-400 to-cyan-500"
        },
        {
            icon: <FaHandHoldingHeart />,
            title: "Responsible Recycling",
            description: "We ensure your e-waste is recycled following environmental standards",
            color: "from-cyan-400 to-blue-500"
        },
        {
            icon: <FaCoins />,
            title: "Earn Rewards",
            description: "Get points and rewards for your contribution to sustainability",
            color: "from-blue-400 to-indigo-500"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const handleStartRecycling = () => {
        navigate('/main');
    };

    return (
        <div id="how-it-works" className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                        How It Works
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Follow these simple steps to start your e-waste recycling journey
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)"
                            }}
                            className="relative bg-white rounded-2xl p-6 shadow-lg overflow-hidden
                                group hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50
                                transition-all duration-300"
                        >
                            {/* Step Number */}
                            <div className="absolute -right-4 -top-4 text-8xl font-bold text-gray-100 opacity-50 group-hover:opacity-70 transition-opacity">
                                {index + 1}
                            </div>

                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.1, rotate: 360 }}
                                className={`w-14 h-14 rounded-full bg-gradient-to-r ${step.color} 
                                    flex items-center justify-center text-white text-2xl mb-4
                                    shadow-lg group-hover:shadow-xl transition-all duration-300`}
                            >
                                {step.icon}
                            </motion.div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold text-gray-800 mb-3 relative z-10">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 relative z-10">
                                {step.description}
                            </p>

                            {/* Decorative Line */}
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <motion.button
                        onClick={handleStartRecycling}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                            px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl 
                            transition-all duration-300"
                    >
                        Start Recycling Now
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default HowWeWork;

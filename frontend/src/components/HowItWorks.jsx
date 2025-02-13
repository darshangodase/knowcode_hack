import React from 'react';
import { motion } from 'framer-motion';
import { FaRecycle, FaHandshake, FaLeaf, FaChartLine } from 'react-icons/fa';

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaRecycle />,
            title: "Register E-Waste",
            description: "List your electronic waste items for donation or sale on our platform.",
            color: "from-green-400 to-green-600"
        },
        {
            icon: <FaHandshake />,
            title: "Connect & Trade",
            description: "Connect with buyers or receive donation requests for your items.",
            color: "from-blue-400 to-blue-600"
        },
        {
            icon: <FaLeaf />,
            title: "Environmental Impact",
            description: "Track your contribution to reducing e-waste and CO₂ emissions.",
            color: "from-teal-400 to-teal-600"
        },
        {
            icon: <FaChartLine />,
            title: "Earn Rewards",
            description: "Get rewarded for your sustainable actions and contributions.",
            color: "from-purple-400 to-purple-600"
        }
    ];

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    return (
        <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        How It <span className="text-green-600">Works</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join our community and make a difference in four simple steps
                    </p>
                </motion.div>

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
                            variants={cardVariants}
                            whileHover={{ 
                                scale: 1.05,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl 
                                transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r opacity-0 
                                group-hover:opacity-5 transition-opacity duration-300"
                                style={{
                                    backgroundImage: `linear-gradient(to right, ${step.color.split(' ')[1]}, ${step.color.split(' ')[3]})`
                                }}
                            />
                            
                            <div className={`text-4xl mb-4 text-transparent bg-clip-text 
                                bg-gradient-to-r ${step.color}`}>
                                {step.icon}
                            </div>
                            
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {step.title}
                            </h3>
                            
                            <p className="text-gray-600">
                                {step.description}
                            </p>

                            <div className="absolute top-4 right-4 text-gray-300 font-bold text-xl">
                                {(index + 1).toString().padStart(2, '0')}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks; 
 
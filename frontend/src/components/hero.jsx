import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaRecycle, FaLeaf, FaArrowRight, FaShieldAlt, FaUsers } from 'react-icons/fa';
import { RiEarthLine, RiPlantLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const staggerContainer = {
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

const textVariant = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
};

const imageVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEwaste: 0,
    co2Saved: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch impact stats
      const response = await fetch('http://localhost:3000/api/ewaste/impact-stats');
      const data = await response.json();

      if (data.success) {
        setStats({
          totalEwaste: data.stats.totalEwaste,
          co2Saved: data.stats.co2Saved,
          totalUsers: data.stats.donationCount + data.stats.saleCount // Using total items as user engagement metric
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    navigate("/main");
  };

  const handleLearnMore = () => {
    const element = document.getElementById('about-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { icon: <FaShieldAlt />, text: "Secure Platform" },
    { icon: <RiPlantLine />, text: "Eco-Friendly" },
    { icon: <FaLeaf />, text: "Rewards Program" },
  ];

  const StatCard = ({ icon, value, label, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300
        bg-opacity-50 backdrop-blur-sm border border-gray-100"
    >
      <div className={`text-transparent bg-clip-text bg-gradient-to-r ${color} 
        flex justify-center lg:justify-start mb-2`}>
        {icon}
      </div>
      {loading ? (
        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
      ) : (
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      )}
      <div className="text-sm text-gray-600">{label}</div>
    </motion.div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100 font-rubik"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[url('/circuit-pattern.png')] opacity-5" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-green-300/40 to-green-400/40 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-300/40 to-green-300/40 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            variants={fadeInUp}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            {/* Features Bar */}
            <motion.div
              variants={fadeInUp}
              className="flex justify-center lg:justify-start gap-6 mb-8"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-green-700 text-sm">
                  <span className="text-lg">{feature.icon}</span>
                  <span className="hidden sm:inline">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="text-green-800">Transforming E-Waste into a </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                Sustainable Future
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-gray-600 text-lg sm:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 font-poppins"
            >
              Join our eco-friendly community and earn rewards while helping to protect our planet.
              Every device recycled makes a difference!
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 30px -10px rgba(4, 120, 87, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-green-600 to-teal-500 text-white px-8 py-4 rounded-full 
                  font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                  hover:from-green-500 hover:to-teal-400"
              >
                Get Started Now
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                onClick={handleLearnMore}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 30px -10px rgba(4, 120, 87, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full 
                  font-semibold hover:bg-green-50 transition-all duration-300 hover:border-teal-500 hover:text-teal-500"
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-6"
            >
              <StatCard
                icon={<FaRecycle className="text-3xl" />}
                value={`${stats.totalEwaste} kg`}
                label="E-Waste Processed"
                color="from-green-400 to-green-600"
              />
              <StatCard
                icon={<RiEarthLine className="text-3xl" />}
                value={`${stats.co2Saved} kg`}
                label="CO₂ Saved"
                color="from-blue-400 to-blue-600"
              />
              <StatCard
                icon={<BiDonateHeart className="text-3xl" />}
                value={stats.totalUsers}
                label="Active Contributors"
                color="from-purple-400 to-purple-600"
              />
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            variants={fadeInUp}
            className="relative flex justify-center order-1 lg:order-2"
          >
            <motion.div
              // variants={floatingAnimation}
              initial="initial"
              animate="animate"
              className="relative w-full max-w-lg xl:max-w-xl"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-teal-300/30 rounded-3xl blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <img
                src="/bin.jpg"
                alt="E-waste Recycling Illustration"
                className="relative rounded-3xl shadow-2xl h-[14cm] w-[13cm]
                  border-4 border-white/50 backdrop-blur-sm"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer
          hover:text-green-500 transition-colors duration-300"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        onClick={handleLearnMore}
      >
        <svg
          className="w-6 h-6 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;

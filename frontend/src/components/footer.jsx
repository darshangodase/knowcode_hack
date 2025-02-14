import React from 'react';
import { Link } from 'react-router-dom';
import { FaRecycle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.footer
      className="bg-gradient-to-r from-green-800 to-green-900 text-white font-rubik"
      initial="hidden"
      animate="visible"
      variants={footerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center mb-4 md:mb-0">
            <FaRecycle className="text-2xl mr-2" />
            <span className="text-xl font-bold">E-Waste-X</span>
          </div>

          {/* Essential Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/main" className="text-gray-300 hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link to="/impactdashboard" className="text-gray-300 hover:text-white transition-colors">
              Impact Dashboard
            </Link>
            <Link to="/leaderboard" className="text-gray-300 hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
              Profile
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} E-Waste-X. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
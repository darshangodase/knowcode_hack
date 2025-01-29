import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LeaderBoard = () => {
  // Sample data - replace with your actual data
  const [leaderboardData] = useState([
    { username: "EcoWarrior", coins: 15000, productsSold: 45 },
    { username: "GreenHero", coins: 12500, productsSold: 38 },
    { username: "EarthSaver", coins: 10000, productsSold: 30 },
    { username: "RecyclePro", coins: 8500, productsSold: 25 },
    { username: "EcoChampion", coins: 7200, productsSold: 22 },
    { username: "WasteReducer", coins: 6800, productsSold: 20 },
    { username: "GreenMaster", coins: 6500, productsSold: 18 },
    { username: "EcoInnovator", coins: 6000, productsSold: 15 },
    { username: "RecycleKing", coins: 5500, productsSold: 12 },
    { username: "EarthGuardian", coins: 5000, productsSold: 10 },
  ]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-300 to-yellow-500";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-400";
      case 2:
        return "bg-gradient-to-r from-amber-600 to-amber-700";
      default:
        return "bg-white hover:bg-gray-50";
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return "👑";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return index + 1;
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-24 px-4 sm:px-6 lg:px-8  font-rubik">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >

        <div className="text-center mb-12 ">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Eco<span className="text-green-600">Leaders</span>
          </h1>
          <p className="text-lg text-gray-600">
            Top contributors making a difference in e-waste management
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3 pb-5">
          <motion.div
            variants={itemVariants}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Participants
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {leaderboardData.length}
              </dd>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Coins Earned
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {leaderboardData
                  .reduce((sum, user) => sum + user.coins, 0)
                  .toLocaleString()}
              </dd>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5  sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Products Sold
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {leaderboardData
                  .reduce((sum, user) => sum + user.productsSold, 0)
                  .toLocaleString()}
              </dd>
            </div>
          </motion.div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 bg-gray-800 text-white py-4 px-6">
            <div className="font-semibold">Rank</div>
            <div className="font-semibold">Username</div>
            <div className="font-semibold text-right">Coins Earned</div>
            <div className="font-semibold text-right">Products Sold</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {leaderboardData.map((user, index) => (
              <motion.div
                key={user.username}
                variants={itemVariants}
                className={`grid grid-cols-4 py-4 px-6 items-center ${getRankStyle(index)} ${index < 3 ? 'text-white' : 'text-gray-900'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getRankIcon(index)}</span>
                </div>
                <div className="font-medium">{user.username}</div>
                <div className="text-right">
                  <span className="inline-flex items-center">
                    {user.coins.toLocaleString()}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1.002-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.548.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <div className="text-right">{user.productsSold}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}

      </motion.div>
    </div>
  );
};

export default LeaderBoard;
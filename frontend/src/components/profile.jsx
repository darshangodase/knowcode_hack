import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaMedal, FaRecycle, FaLeaf, FaCog } from 'react-icons/fa';
import { RiEarthLine } from 'react-icons/ri';
import { BiDonateHeart } from 'react-icons/bi';

const Profile = () => {
  // State to store user data and sign-in state
  const [user, setUser] = useState(null);
  const [signin, setSignin] = useState(false);

  useEffect(() => {
    // Check if user info is stored in localStorage
    const storedUser = localStorage.getItem("userInfo");

    if (storedUser) {
      try {
        // Parse and set the user data from localStorage
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setSignin(true);
      } catch (error) {
        console.error("Error parsing userInfo from localStorage", error);
      }
    } else {
      setSignin(false);
    }

    // Listen for storage changes to dynamically update the state
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("userInfo");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
        setSignin(true);
      } else {
        setUser(null);
        setSignin(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Variants for framer-motion animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const achievements = [
    {
      icon: <FaMedal className="text-yellow-500" size={40} />,
      title: "Top Recycler",
      description: "Recycled over 100 items",
      progress: 75
    },
    {
      icon: <FaLeaf className="text-green-500" size={40} />,
      title: "Eco Warrior",
      description: "Saved 50kg of e-waste",
      progress: 60
    },
    {
      icon: <BiDonateHeart className="text-red-500" size={40} />,
      title: "Generous Donor",
      description: "Made 20 donations",
      progress: 90
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8 font-rubik"
    >
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          variants={itemVariants}
          className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-90" />
          <div className="absolute inset-0 bg-[url('/circuit-pattern.png')] opacity-10" />

          <div className="relative px-8 py-12 sm:px-12 flex flex-col sm:flex-row items-center gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-green-600">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </motion.div>

            <div className="text-center sm:text-left text-white">
              <h1 className="text-3xl font-bold mb-2">{user?.name || "User Name"}</h1>
              <p className="text-green-100 mb-4">{user?.email || "user@example.com"}</p>
              <div className="flex flex-wrap gap-4">
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                  Level 5 Recycler
                </span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                  Verified Member
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: <FaRecycle />, title: "Items Recycled", value: user?.recycledItems?.length || 0 },
            { icon: <RiEarthLine />, title: "Environmental Impact", value: "100kg CO₂" },
            { icon: <FaMedal />, title: "Coins Earned", value: user?.rewardsEarned || 0 },
            { icon: <FaLeaf />, title: "Green Score", value: "850" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  {achievement.icon}
                  <div>
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-gray-500 text-sm">{achievement.description}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-full 
              font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Edit Profile
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-full 
              font-semibold hover:bg-green-50 transition-all duration-300"
          >
            View Activity History
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;

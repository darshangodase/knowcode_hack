import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // Replaced useHistory with useNavigate
import { HiMenu, HiX } from 'react-icons/hi';
import { usePrivy } from '@privy-io/react-auth';


const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { login, authenticated, user, logout } = usePrivy();
  const [storedUser, setStoredUser] = useState(null);
  const [signin, setSignin] = useState(authenticated); // Track sign-in state
  const navigate = useNavigate(); // For redirection after login or logout
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  const handleUserData = async () => 
  {
    if (authenticated && user) {
      const userInfo = {
        name: user.google?.name,
        email: user.google?.email,
        walletAddress: user.wallet?.address,
        recycledItems: [], 
        rewardsEarned: 0, 
      };
    
      try{
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userInfo),
        });
  
        const data = await response.json();
        if (response.ok) {
          console.log('Login successful:', data);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          setStoredUser(userInfo);
          setSignin(true); 

          }
          else{

          }
      }
      catch(error){
        console.error('Login error:', error);
      }
    }
  };

  // Function to handle user login
  const handleLogin = async () => {
    try {
   
      
      await login(); // Opens the popup with multiple login methods
     

      handleUserData();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setStoredUser(null);
    setSignin(false); // Set sign-in state to false
    logout(); // Call the logout method from Privy
    navigate('/'); // Redirect to homepage after logout
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false); // Close dropdown if clicked outside
    }
  };

  useEffect(() => {
    // If the user is authenticated, get user data and update the state
    if (authenticated && user) {
      handleUserData();
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [authenticated, user]); // Trigger when `authenticated` or `user` changes

  return (
    <div className="w-full font-rubik">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-20 items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-green-700 hover:scale-105 transition-transform"
        >
          E-Waste<span className="text-orange-500 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">-X</span>
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <HiX className="w-8 h-8 text-green-700" /> : <HiMenu className="w-8 h-8 text-green-700" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks />
          {signin ? (
            <ProfileDropdown
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              user={storedUser}
              handleLogout={handleLogout}
              dropdownRef={dropdownRef}
            />
          ) : (
            <button onClick={handleLogin} className="text-green-700 font-medium">Sign In</button>
          )}
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="md:hidden bg-white shadow-md py-4 space-y-4 flex flex-col items-center">
            <NavLinks />
            {signin ? (
              <ProfileDropdown
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                user={storedUser}
                handleLogout={handleLogout}
                dropdownRef={dropdownRef}
              />
            ) : (
              <button onClick={handleLogin} className="text-green-700 font-medium">Sign In</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavLinks = () => (
  <ul className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
    {[ 'Impact Dashboard', 'Leader Board'].map((item, index) => (
      <li key={index}>
        <Link
          to={`/${item.replace(/\s/g, '').toLowerCase()}`}
          className="relative inline-block px-3 py-2 text-gray-600 font-medium group"
        >
          <motion.span
            className="relative inline-block"
            whileHover={{
              rotateX: [-10, 10],
              y: [-3, 3],
              transition: {
                duration: 0.4,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          >
            {item}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-green-400
              group-hover:w-full transition-all duration-300" />
          </motion.span>
        </Link>
      </li>
    ))}
  </ul>
);

const ProfileDropdown = ({ isDropdownOpen, setIsDropdownOpen, user, handleLogout, dropdownRef }) => (
  <div className="relative">
    <motion.button whileHover={{ scale: 1.1 }} onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
      <span className="text-sm font-semibold text-green-800">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
    </motion.button>
    <AnimatePresence>
      {isDropdownOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50"
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name || "EcoWarrior"}</p>
            <p className="text-sm text-gray-500">{user.email || "eco@warrior.com"}</p>
          </div>
          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors">Profile</Link>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Logout</button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default Navbar;

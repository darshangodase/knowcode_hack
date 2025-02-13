import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Link } from 'react-router-dom';
import Products from './Products';
import Scan from './Scan';
import Profile from './profile';
import { FaQrcode, FaBoxOpen, FaUser, FaBars, FaTimes, FaDotCircle, FaRecycle } from 'react-icons/fa';
import ProductCard from './ProductCard';
import { toast } from 'react-hot-toast';

const MainPage = () => {
    const [activeComponent, setActiveComponent] = useState('products');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isExpanded, setIsExpanded] = useState(true);
    const dragControls = useDragControls();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'scan':
                return <Scan />;
            case 'products':
                return <Products />;
            case 'profile':
                return <Profile />;
            default:
                return <Products />;
        }
    };

    // Mobile Navigation with enhanced animations
    const MobileNav = () => (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl z-50 px-6 py-4"
        >
            <div className="flex items-center gap-8">
                <NavButton icon={<FaQrcode />} label="Scan" component="scan" />
                <NavButton icon={<FaBoxOpen />} label="Products" component="products" />
                <NavButton icon={<FaUser />} label="Profile" component="profile" />
            </div>
        </motion.div>
    );

    // Enhanced Desktop Floating Sidebar
    const FloatingSidebar = () => (
        <motion.div
            drag
            dragControls={dragControls}
            dragMomentum={false}
            dragElastic={0}
            initial={{ x: 20, y: '20%' }}
            className="fixed left-4 top-0 z-50 cursor-move font-rubik"
            whileHover={{ scale: 1.02 }}
            whileDrag={{ scale: 1.05 }}
        >
            <motion.div
                className={`bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${isExpanded ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Header with Logo */}
                <motion.div
                    className="p-6 border-b border-gray-100 flex justify-between items-center"
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                >
                    <motion.div
                        className="flex items-center gap-3 overflow-hidden"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="flex-shrink-0"
                        >
                            <FaRecycle className="text-2xl text-green-500" />
                        </motion.div>
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{
                                opacity: isExpanded ? 1 : 0,
                                width: isExpanded ? 'auto' : 0
                            }}
                            transition={{ duration: 0.3 }}
                            className="font-bold text-gray-800 whitespace-nowrap"
                        >
                            EcoRecycle
                        </motion.span>
                    </motion.div>
                    <motion.button
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"
                    >
                        {isExpanded ? <FaTimes /> : <FaBars />}
                    </motion.button>
                </motion.div>

                {/* Navigation Items */}
                <div className="p-4 space-y-3">
                    <SidebarButton
                        icon={<FaQrcode />}
                        label="Scan Items"
                        component="scan"
                        expanded={isExpanded}
                    />
                    <SidebarButton
                        icon={<FaBoxOpen />}
                        label="Browse Products"
                        component="products"
                        expanded={isExpanded}
                    />
                    <SidebarButton
                        icon={<FaUser />}
                        label="My Profile"
                        component="profile"
                        expanded={isExpanded}
                    />
                </div>
            </motion.div>
        </motion.div>
    );

    // Enhanced Mobile Navigation Button
    const NavButton = ({ icon, label, component }) => (
        <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveComponent(component)}
            className="relative"
        >
            <motion.div
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-colors ${activeComponent === component
                        ? 'text-green-500'
                        : 'text-gray-500 hover:text-green-500'
                    }`}
            >
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-medium">{label}</span>
                {activeComponent === component && (
                    <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 w-12 h-1 bg-green-500 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
            </motion.div>
        </motion.button>
    );

    // Enhanced Sidebar Button
    const SidebarButton = ({ icon, label, component, expanded }) => (
        <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveComponent(component)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all relative ${activeComponent === component
                    ? 'bg-green-100/80 text-green-600'
                    : 'hover:bg-gray-100/80 text-gray-600'
                }`}
        >
            <motion.div
                className="relative flex-shrink-0"
                animate={{
                    scale: activeComponent === component ? 1.2 : 1,
                    rotate: activeComponent === component ? 360 : 0
                }}
                transition={{ duration: 0.3 }}
            >
                <span className="text-xl">{icon}</span>
                {activeComponent === component && (
                    <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                        layoutId="activeDot"
                    />
                )}
            </motion.div>

            {expanded && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm font-medium whitespace-nowrap flex-grow text-left"
                >
                    {label}
                </motion.span>
            )}

            {activeComponent === component && expanded && (
                <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-green-500 rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
        </motion.button>
    );

    const handleDelete = (deletedId) => {
        setProducts(products.filter(product => product._id !== deletedId));
        toast.success('Product deleted successfully');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-rubik">
            {renderComponent()}
            {isMobile ? <MobileNav /> : <FloatingSidebar />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard 
                        key={product._id} 
                        product={product} 
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default MainPage;
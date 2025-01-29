import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const HowWeWork = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const steps = [
    {
      title: "Buy/Sell Products",
      description: "Browse and purchase eco-friendly products or sell your e-waste",
      icon: (
        <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      bgColor: "from-green-100 to-green-200",
      borderColor: "border-green-300",
      shadowColor: "shadow-green-200",
    },
    {
      title: "Earn Coins",
      description: "Get rewarded with coins for every sustainable action",
      icon: (
        <svg className="w-12 h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "Exchange Coins",
      description: "Convert your earned coins into various rewards",
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Get Crypto",
      description: "Convert your coins into cryptocurrency",
      icon: (
        <svg className="w-12 h-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  // Create separate refs for each step AFTER steps array is defined
  const stepRefs = steps.map(() => useInView({
    triggerOnce: true,
    threshold: 0.2,
  }));

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
  };

  const floatingBubblesVariants = {
    animate: {
      y: [-10, 10],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const arrowVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const scrollVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleNext = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="relative  bg-green-50 overflow-hidden flex items-center pt-10 justify-center font-rubik">
      {/* Animated Background */}
      <motion.div
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50"
      >
        {/* Floating Bubbles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            variants={floatingBubblesVariants}
            animate="animate"
            custom={i}
            className="absolute rounded-full bg-green-100 opacity-20"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={scrollVariants}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">
            How We <span className="text-green-600">Work</span>
          </h2>
          <p className="text-xl text-gray-600">
            Your journey to sustainable e-waste management
          </p>
        </motion.div>

        {/* Steps Container */}
        <div className="relative px-12 sm:px-16">
          {/* Navigation Arrows - Hidden on mobile */}
          <div className="hidden md:block">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 
                ${currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 hover:bg-green-100'} 
                transition-all duration-300 p-3 rounded-full`}
              disabled={currentStep === 0}
            >
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2
                ${currentStep === steps.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 hover:bg-green-100'} 
                transition-all duration-300 p-3 rounded-full`}
              disabled={currentStep === steps.length - 1}
            >
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Steps Display */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
            {steps.map((step, index) => {
              const [stepRef, stepInView] = stepRefs[index];
              return (
                <motion.div
                  key={index}
                  ref={stepRef}
                  initial="hidden"
                  animate={stepInView || index === currentStep ? "visible" : "hidden"}
                  variants={scrollVariants}
                  className={`relative w-full md:w-80 aspect-square rounded-2xl 
                    transform transition-all duration-500 cursor-pointer
                    ${index === currentStep ? 'scale-105 z-10' : 'scale-95 opacity-70'}
                    hover:scale-105 hover:opacity-100`}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  onClick={() => setCurrentStep(index)}
                >
                  {/* Card Content */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.bgColor}
                      border-2 ${step.borderColor} ${step.shadowColor} shadow-lg
                      backdrop-blur-sm p-6 flex flex-col items-center justify-center
                      transform transition-all duration-300 hover:border-green-400`}
                    animate={{
                      scale: index === currentStep ? 1.05 : 1,
                      rotateY: index === currentStep ? [0, 360] : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2
                      bg-green-400 px-4 py-1 rounded-full shadow-md">
                      <span className="text-sm font-bold text-gray-600">Step {index + 1}</span>
                    </div>

                    {/* Icon */}
                    <motion.div
                      className="mb-6"
                      animate={{
                        y: index === currentStep ? [0, -10, 0] : 0,
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {step.icon}
                    </motion.div>

                    {/* Text Content */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-center text-sm">
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300
                  ${index === currentStep ? 'w-8 bg-green-500' : 'bg-gray-300'}
                  hover:bg-green-300`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowWeWork;

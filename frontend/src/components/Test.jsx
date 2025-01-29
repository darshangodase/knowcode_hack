import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ScrollAnimation from 'react-animate-on-scroll';

const HowWeWork = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(null);
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
      bgColor: "bg-green-100",
      borderColor: "border-green-300",
    },
    {
      title: "Earn Coins",
      description: "Get rewarded with coins for every sustainable action",
      icon: (
        <svg className="w-16 h-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-300",
    },
    {
      title: "Exchange Coins",
      description: "Convert your earned coins into various rewards",
      icon: (
        <svg className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      bgColor: "bg-blue-100",
      borderColor: "border-blue-300",
    },
    {
      title: "Get Crypto",
      description: "Convert your coins into cryptocurrency",
      icon: (
        <svg className="w-16 h-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bgColor: "bg-purple-100",
      borderColor: "border-purple-300",
    },
  ];

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

  const handleNext = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const openModal = (index) => {
    setModalStep(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalStep(null);
  };

  return (
    <div className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How We <span className="text-green-600">Work</span>
          </h2>
          <p className="text-xl text-gray-600">Your journey to sustainable e-waste management</p>
        </motion.div>

        <div className="relative">
          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -left-12 transform -translate-y-1/2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`p-2 rounded-full ${currentStep === 0 ? 'text-gray-300' : 'text-green-600 hover:bg-green-50'}`}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div className="absolute top-1/2 -right-12 transform -translate-y-1/2">
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className={`p-2 rounded-full ${currentStep === steps.length - 1 ? 'text-gray-300' : 'text-green-600 hover:bg-green-50'}`}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Steps Display */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative"
          >
            <div className="flex justify-center items-center space-x-8">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <ScrollAnimation animateIn="fadeInUp" delay={index * 0.2} animateOnce={true}>
                    <motion.div
                      variants={stepVariants}
                      onClick={() => openModal(index)}
                      className={`relative w-64 p-8 rounded-3xl border-4 transform transition-all duration-300 ease-in-out ${step.bgColor} ${step.borderColor} 
                      ${index === currentStep ? 'scale-105 shadow-2xl' : 'scale-95 opacity-70 hover:scale-105 hover:shadow-xl'} 
                      hover:bg-green-200 cursor-pointer`}
                    >
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full">
                        <span className="text-sm font-bold text-gray-500">Step {index + 1}</span>
                      </div>
                      <div className="text-center">
                        <div className="mb-4 flex justify-center">{step.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-700 text-sm">{step.description}</p>
                      </div>
                    </motion.div>
                  </ScrollAnimation>

                  {index < steps.length - 1 && (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0.3 } },
                      }}
                      className="flex-shrink-0 text-green-500"
                    >
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`w-96 p-12 rounded-3xl border-4 ${steps[modalStep].bgColor} ${steps[modalStep].borderColor}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-900">{steps[modalStep].title}</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-900">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 text-gray-700">{steps[modalStep].description}</div>
            </motion.div>
          </div>
        )}

        {/* Progress Indicators */}
        <div className="flex justify-center mt-12 space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-green-600 w-6' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowWeWork;

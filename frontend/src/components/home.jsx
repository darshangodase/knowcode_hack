import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import HeroSection from './hero';
import HowWeWork from './howWeWork';
import { Impact } from './impact';
import { useState } from 'react';
import { LuCircleMinus, LuCirclePlus } from 'react-icons/lu';

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

const float = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: "easeInOut"
    }
  }
};

const gentlePulse = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const backgroundShimmer = {
  initial: { backgroundPosition: "0 0" },
  animate: {
    backgroundPosition: ["0 0", "100% 0"],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is this platform about?",
      answer:
        "Our platform provides a seamless way to buy, sell, and donate e-waste responsibly. We also offer rewards for contributing to a greener planet.",
    },
    {
      question: "How does the reward system work?",
      answer:
        "When you donate or sell e-waste through our platform, you earn points that can be redeemed for discounts, gift cards, or other incentives.",
    },
    {
      question: "What types of e-waste can I sell or donate?",
      answer:
        "You can sell or donate old phones, laptops, batteries, printers, chargers, and other electronic items that are no longer in use.",
    },
    {
      question: "How do I schedule a pickup for my e-waste?",
      answer:
        "Simply log in to your account, select the items you want to recycle, and choose a pickup date. Our team will collect the items from your location.",
    },
    {
      question: "Is donating e-waste free?",
      answer:
        "Yes! You can donate your e-waste for free, and you may also receive reward points based on the type and condition of the items.",
    },
    {
      question: "How is the e-waste processed after collection?",
      answer:
        "We partner with certified recycling facilities to ensure responsible disposal and recycling of e-waste, minimizing environmental impact.",
    },
    {
      question: "Can I track my e-waste after donating?",
      answer:
        "Yes! You can track the status of your e-waste through your dashboard to see when it's collected and processed.",
    },
  ];


  const [impactRef, impactInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [approachRef, approachInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [footerRef, footerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div className="bg-white min-h-screen w-full font-rubik">
      {/* Hero Section */}
      <HeroSection />

      <motion.div
        ref={approachRef}
        initial="hidden"
        animate={"visible"}
        variants={fadeInUp}
        className="bg-green-50 py-16 relative overflow-hidden"
      >
        <HowWeWork />
      </motion.div>
      <div className="hidden lg:block">
        <Impact />
      </div>


      {/* <motion.div
        ref={approachRef}
        initial="hidden"
        animate={approachInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="bg-green-50 py-16 relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-50 via-green-100 to-green-50 opacity-50"
          initial="initial"
          animate="animate"
          variants={backgroundShimmer}
          style={{ backgroundSize: "200% 100%" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.h2
            variants={slideInLeft}
            initial="initial"
            animate="animate"
            className="text-3xl font-bold text-green-700 text-center mb-8"
          >
            Our Sustainable Approach
          </motion.h2>
          <motion.p
            variants={slideInRight}
            className="text-gray-600 text-lg text-center max-w-2xl mx-auto"
          >
            Our sustainable approach helps recycling and reselling Electronic Waste
          </motion.p>
        </div>
      </motion.div> */}

      {/* Footer Section */}
      {/* <motion.footer
        ref={footerRef}
        initial="hidden"
        animate={footerInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="bg-green-700 text-white py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg">
            &copy; 2023 E-Waste-X. All rights reserved.
          </p>
          <div className="mt-4 space-x-6">
            <a href="/about-us" className="hover:text-green-300">About Us</a>
            <a href="/sustainability" className="hover:text-green-300">Sustainability</a>
            <a href="/lets-connect" className="hover:text-green-300">Let's Connect</a>
          </div>
        </div>
      </motion.footer> */}

      <section className="min-h-screen py-12 px-6 bg-gray-100  font-rubik">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-poppins text-3xl font-semibold text-black  mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-black  text-lg mb-10 max-w-4xl mx-auto font-rubik">
            Have questions? Find answers to the most commonly asked questions
            about our E-Waste Recycling Platform and its features below.
          </p>
          <div className="space-y-4 max-w-2xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b-2 border-black  relative"
              >
                <button
                  onClick={() => toggleAnswer(index)}
                  className="w-full text-left p-4 flex justify-between items-center text-gray-900 "
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <span className="absolute right-0 h-6 w-6">
                    {activeIndex === index ? (
                      <LuCircleMinus className="h-full w-full" />
                    ) : (
                      <LuCirclePlus className="h-full w-full" />
                    )}
                  </span>
                </button>
                {activeIndex === index && (
                  <div className="p-2 text-gray-700  text-base ml-4 text-justify">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;

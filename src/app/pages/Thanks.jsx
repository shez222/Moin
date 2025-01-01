import React from "react";
import { FiCheck } from "react-icons/fi"; // Importing a checkmark icon
import { motion } from "framer-motion"; // For animations
// import { Link } from "react-router-dom"; // For navigation

const ThankYouPage = () => {

  return (
    <section
      className="bg-gradient-to-r from-[#F4FBFF] to-[#E0F7FA] min-h-screen flex items-center justify-center px-4 relative"
    >

      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full z-10">
        {/* Success Icon with Animation */}
        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
        >
          <div className="w-24 h-24 flex items-center justify-center bg-green-100 rounded-full">
            <FiCheck className="text-green-500 w-20 h-20 animate-pulse" />
          </div>
        </motion.div>

        {/* Thank You Text with Animation */}
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-[#1D3851] mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Thank <span className="text-[#45C0C9]">You!</span>
        </motion.h1>

        {/* Confirmation Message with Animation */}
        <motion.p
          className="text-gray-600 mt-2 text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Your form has been submitted successfully. We appreciate your interest in joining the Pakistan Society of Neurology.Please check your email for Login Credentials
        </motion.p>

        {/* Call-to-Action Button with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {/* <Link to="/" className="inline-block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#45C0C9] hover:bg-[#3dadb7] text-white font-semibold py-3 px-6 rounded-full transition duration-300 shadow-md"
            >
              Go to Homepage
            </motion.button>
          </Link> */}
        </motion.div>
      </div>
    </section>
  );
};

export default ThankYouPage;

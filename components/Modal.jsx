// /components/Modal.js

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ children, onClose }) => {
  const modalRef = useRef(null);

  // Close the modal when the Escape key is pressed
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Prevent scrolling when the modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Focus the modal when it opens
  useEffect(() => {
    modalRef.current.focus();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <motion.div
          ref={modalRef}
          tabIndex="-1"
          className="bg-white rounded-lg overflow-auto shadow-xl transform transition-all sm:max-w-3xl sm:w-full max-h-full mx-4"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          role="document"
        >
          {children}
        </motion.div>

        {/* Click outside to close */}
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;

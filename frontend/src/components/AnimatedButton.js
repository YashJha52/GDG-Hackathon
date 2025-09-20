import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ children, onClick, type = 'button', disabled = false }) => {
  return (
    <motion.button
      type={type}
      className={`starfall-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { 
        scale: 1.05,
        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)"
      } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
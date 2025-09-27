// components/AnimatedButton.js
import React from 'react';
import { motion } from 'framer-motion';
import './AnimatedButton.css'; // Create this CSS file

const AnimatedButton = ({ children, onClick, type = 'button', disabled = false, className = '' }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`starfall-button ${className} ${disabled ? 'disabled' : ''}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ 
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1
      }}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
import React from 'react';
import { motion } from 'framer-motion';

const FloatingCharacter = ({ character, size = 'medium' }) => {
  const sizeClass = `character-${size}`;
  
  return (
    <motion.div
      className={`floating-character ${sizeClass}`}
      animate={{
        y: [0, -15, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {character}
    </motion.div>
  );
};

export default FloatingCharacter;
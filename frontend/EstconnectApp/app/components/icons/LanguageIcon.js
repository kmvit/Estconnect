import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const LanguageIcon = ({ width = 24, height = 24, color = '#000000' }) => {
  return (
    <Ionicons 
      name="language" 
      size={Math.min(width, height)} 
      color={color} 
    />
  );
};

export default LanguageIcon;
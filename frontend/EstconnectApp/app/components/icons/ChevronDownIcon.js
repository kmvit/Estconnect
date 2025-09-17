import React from 'react';
import Svg, { Path } from 'react-native-svg';

const ChevronDownIcon = ({ width = 12, height = 12, color = '#000' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9l6 6 6-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChevronDownIcon;

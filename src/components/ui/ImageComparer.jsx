import React, { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export default function ImageComparer({ 
  beforeImage, 
  afterImage, 
  beforeAlt, 
  afterAlt,
  beforeLabel = "Before",
  afterLabel = "After" 
}) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative">
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage 
            src={beforeImage} 
            alt={beforeAlt || "Before image"} 
          />
        }
        itemTwo={
          <ReactCompareSliderImage 
            src={afterImage} 
            alt={afterAlt || "After image"} 
          />
        }
        position={position}
        onPositionChange={setPosition}
        className="my-8"
      />
      
      {/* Before label - only visible on left side */}
      <div 
        className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded transition-opacity duration-300"
        style={{ opacity: position > 10 ? 1 : 0 }}
      >
        {beforeLabel}
      </div>
      
      {/* After label - only visible on right side */}
      <div 
        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded transition-opacity duration-300"
        style={{ opacity: position < 90 ? 1 : 0 }}
      >
        {afterLabel}
      </div>
    </div>
  );
}
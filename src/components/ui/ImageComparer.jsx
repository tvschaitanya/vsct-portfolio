import React, { useState, useEffect } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

// Valid focus positions are handled in the getFocusPosition function

export default function ImageComparer({ 
  beforeImage, 
  afterImage, 
  beforeAlt = "Before image",
  afterAlt = "After image",
  beforeLabel = "Before",
  afterLabel = "After",
  maxWidth = "100%",
  maxHeight = "600px", // Keep this for backward compatibility
  aspectRatio = "16/9",  // Added new prop
  containerHeight = "400px", // Added new prop
  beforeFocus = "center center", // Default focus position for before image
  afterFocus = "center center" // Default focus position for after image
}) {
  const [position, setPosition] = useState(50);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Convert focus position string to object-position CSS value
  const getFocusPosition = (focus) => {
    // Validate focus position or default to center center
    return typeof focus === 'string' && 
          ['center center', 'top center', 'bottom center', 
           'center left', 'center right', 
           'top left', 'top right', 
           'bottom left', 'bottom right'].includes(focus) 
          ? focus : 'center center';
  };

  // Add image preloading to avoid layout shifts
  useEffect(() => {
    const preloadImages = async () => {
      const loadImage = (src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.src = src;
        });
      };

      await Promise.all([
        loadImage(beforeImage),
        loadImage(afterImage)
      ]);
      
      setImageLoaded(true);
    };

    preloadImages();
  }, [beforeImage, afterImage]);

  // Convert focus positions to valid CSS object-position values
  const beforeFocusPosition = getFocusPosition(beforeFocus);
  const afterFocusPosition = getFocusPosition(afterFocus);

  return (
    <div 
      className="relative mx-auto rounded-lg overflow-hidden shadow-md border border-gray-200 bg-black" 
      style={{ 
        maxWidth,
        maxHeight, // Keep for backward compatibility
        height: containerHeight,
        aspectRatio
      }}
    >
      {!imageLoaded && (
        <div className="flex items-center justify-center bg-gray-800 h-full w-full">
          <div className="text-gray-300">Loading comparison...</div>
        </div>
      )}
      
      <div className={`${imageLoaded ? "block" : "hidden"} h-full w-full`}>
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage 
              src={beforeImage} 
              alt={beforeAlt}
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                objectPosition: beforeFocusPosition,
                backgroundColor: "#000"
              }}
            />
          }
          itemTwo={
            <ReactCompareSliderImage 
              src={afterImage} 
              alt={afterAlt}
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                objectPosition: afterFocusPosition,
                backgroundColor: "#000" 
              }}
            />
          }
          position={position}
          onPositionChange={setPosition}
          className="h-full w-full"
        />
      </div>
      
      {/* Before label */}
      <div 
        className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm transition-opacity duration-300"
        style={{ opacity: position > 10 ? 1 : 0 }}
      >
        {beforeLabel}
      </div>
      
      {/* After label */}
      <div 
        className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm transition-opacity duration-300"
        style={{ opacity: position < 90 ? 1 : 0 }}
      >
        {afterLabel}
      </div>
    </div>
  );
}
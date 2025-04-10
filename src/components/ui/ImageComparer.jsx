import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export default function ImageComparer({ beforeImage, afterImage, beforeAlt, afterAlt }) {
  return (
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
      position={50}
      className="my-8"
    />
  );
}
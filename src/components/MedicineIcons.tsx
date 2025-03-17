import React from 'react';

interface IconProps {
  color?: string;
  size?: number;
}

export const Pill: React.FC<IconProps> = ({ color = "#FF6B6B", size = 32 }) => {
  return (
    <div style={{ width: size, height: size }} className="relative">
      <div 
        style={{ 
          width: size, 
          height: size / 2, 
          backgroundColor: color,
          borderTopLeftRadius: size / 2,
          borderTopRightRadius: size / 2
        }}
      ></div>
      <div 
        style={{ 
          width: size, 
          height: size / 2, 
          backgroundColor: "#E0E0E0",
          borderBottomLeftRadius: size / 2,
          borderBottomRightRadius: size / 2
        }}
      ></div>
    </div>
  );
};

export const Capsule: React.FC<IconProps> = ({ color = "#4CAF50", size = 32 }) => {
  return (
    <div 
      style={{ 
        width: size, 
        height: size / 2, 
        backgroundColor: color,
        borderRadius: size / 4,
        transform: "rotate(-45deg)",
        marginTop: size / 4
      }}
    ></div>
  );
};

export const TabletBottle: React.FC<IconProps> = ({ size = 32 }) => {
  const bottleWidth = size * 0.8;
  const bottleHeight = size;
  const capHeight = size * 0.2;
  
  return (
    <div style={{ width: size, height: size }} className="relative">
      {/* Bottle Cap */}
      <div 
        style={{ 
          width: bottleWidth, 
          height: capHeight, 
          backgroundColor: "#9E9E9E",
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          position: "absolute",
          top: 0,
          left: (size - bottleWidth) / 2
        }}
      ></div>
      
      {/* Bottle Body */}
      <div 
        style={{ 
          width: bottleWidth, 
          height: bottleHeight - capHeight, 
          backgroundColor: "#FFEB3B",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          position: "absolute",
          top: capHeight,
          left: (size - bottleWidth) / 2
        }}
      >
        {/* Label */}
        <div 
          style={{ 
            width: bottleWidth * 0.8, 
            height: (bottleHeight - capHeight) * 0.4, 
            backgroundColor: "white",
            position: "absolute",
            top: (bottleHeight - capHeight) * 0.3,
            left: bottleWidth * 0.1
          }}
        ></div>
      </div>
    </div>
  );
};

export const Tablets: React.FC<IconProps> = ({ size = 32 }) => {
  const tabletSize = size / 3;
  
  return (
    <div style={{ width: size, height: size }} className="relative">
      {/* Top Row */}
      <div 
        style={{ 
          width: tabletSize, 
          height: tabletSize, 
          backgroundColor: "#E91E63",
          borderRadius: tabletSize / 2,
          position: "absolute",
          top: 0,
          left: 0
        }}
      ></div>
      <div 
        style={{ 
          width: tabletSize, 
          height: tabletSize, 
          backgroundColor: "#2196F3",
          borderRadius: tabletSize / 2,
          position: "absolute",
          top: 0,
          left: tabletSize
        }}
      ></div>
      <div 
        style={{ 
          width: tabletSize, 
          height: tabletSize, 
          backgroundColor: "#FFC107",
          borderRadius: tabletSize / 2,
          position: "absolute",
          top: 0,
          left: tabletSize * 2
        }}
      ></div>
      
      {/* Middle Row */}
      <div 
        style={{ 
          width: tabletSize, 
          height: tabletSize, 
          backgroundColor: "#4CAF50",
          borderRadius: tabletSize / 2,
          position: "absolute",
          top: tabletSize,
          left: 0
        }}
      ></div>
      <div 
        style={{ 
          width: tabletSize, 
          height: tabletSize, 
          backgroundColor: "#9C27B0",
          borderRadius: tabletSize / 2,
          position: "absolute",
          top: tabletSize,
          left: tabletSize
        }}
      ></div>
      <div 
        style={{ 
          width: tabletSize, 
          height: tabletSize, 
          backgroundColor: "#FF5722",
          borderRadius: tabletSize / 2,
          position: "absolute",
          top: tabletSize,
          left: tabletSize * 2
        }}
      ></div>
      
      {/* Bottom Row */}
      <div 
        style={{ 
          width: tabletSize, 
          height: tabletSize, 
          backgroundColor: "#3F51B5",
          borderRadius: tabletSize / 2,
          position: "absolute",
          top: tabletSize * 2,
          left: 0
        }}
      ></div>
      <div 
        style={{ 
          width: tabletSize, 
          height: tabletSize, 
          backgroundColor: "#009688",
          borderRadius: tabletSize / 2,
          position: "absolute",
          top: tabletSize * 2,
          left: tabletSize
        }}
      ></div>
      <div 
        style={{ 
          width: tabletSize, 
          height: tabletSize, 
          backgroundColor: "#795548",
          borderRadius: tabletSize / 2,
          position: "absolute",
          top: tabletSize * 2,
          left: tabletSize * 2
        }}
      ></div>
    </div>
  );
};

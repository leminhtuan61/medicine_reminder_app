import React from 'react';

interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

export const Pill: React.FC<IconProps> = ({ color = "#FF6B6B", size = 32, className = "" }) => {
  return (
    <div style={{ width: size, height: size }} className={`relative ${className}`}>
      <img 
        src="/images/pill.png" 
        alt="Pill"
        style={{ 
          width: size, 
          height: size,
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export const Capsule: React.FC<IconProps> = ({ color, size = 32, className = "" }) => {
  return (
    <div style={{ width: size, height: size }} className={`relative ${className}`}>
      <img 
        src="/images/pill.png" 
        alt="Pill"
        style={{ 
          width: size, 
          height: size,
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export const PillImage: React.FC<IconProps> = ({ size = 32, className = "" }) => {
  return (
    <div style={{ width: size, height: size }} className={`relative ${className}`}>
      <img 
        src="/images/pill.png" 
        alt="Pill"
        style={{ 
          width: size, 
          height: size,
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export const TabletBottle: React.FC<IconProps> = ({ size = 32, className = "" }) => {
  const bottleWidth = size * 0.8;
  const bottleHeight = size;
  const capHeight = size * 0.2;
  
  return (
    <div style={{ width: size, height: size }} className={`relative ${className}`}>
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

export const Tablets: React.FC<IconProps> = ({ size = 32, className = "" }) => {
  const tabletSize = size / 3;
  
  return (
    <div style={{ width: size, height: size }} className={`relative ${className}`}>
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

export const Syringe: React.FC<IconProps> = ({ color = "#4F46E5", size = 32, className = "" }) => {
  return (
    <div style={{ width: size, height: size }} className={`relative ${className}`}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.8057 2.25195C11.6909 2.25167 11.5774 2.27382 11.4725 2.31695C11.3677 2.36009 11.2737 2.42333 11.1957 2.50195L10.4357 3.26195C10.2809 3.41724 10.1941 3.62865 10.1941 3.84945C10.1941 4.07025 10.2809 4.28166 10.4357 4.43695L10.8057 4.80695L7.24572 8.36695L6.89572 8.01695C6.74037 7.86207 6.52885 7.77522 6.30793 7.77522C6.087 7.77522 5.87548 7.86207 5.72013 8.01695L4.96013 8.77695C4.80517 8.93249 4.71829 9.14411 4.71829 9.36508C4.71829 9.58605 4.80517 9.79768 4.96013 9.95322L5.87573 10.8682L3.09573 13.6482C2.86566 13.8783 2.73579 14.1843 2.73579 14.5032C2.73579 14.8221 2.86566 15.1281 3.09573 15.3582L8.64573 20.9082C8.87581 21.1382 9.18174 21.2681 9.50073 21.2681C9.81971 21.2681 10.1256 21.1382 10.3557 20.9082L13.1357 18.1282L14.0507 19.0432C14.2063 19.1982 14.4179 19.285 14.6389 19.285C14.8599 19.285 15.0714 19.1982 15.2271 19.0432L15.9871 18.2832C16.142 18.1279 16.2289 17.9165 16.2289 17.6957C16.2289 17.4749 16.142 17.2635 15.9871 17.1082L15.6371 16.7582L19.1957 13.1982L19.5457 13.5482C19.701 13.7042 19.9124 13.7921 20.1333 13.7931C20.3541 13.7941 20.5664 13.7081 20.7237 13.5532L21.4837 12.7932C21.6386 12.6378 21.7254 12.4264 21.7254 12.2057C21.7254 11.9849 21.6386 11.7735 21.4837 11.6182L15.0507 5.18495L11.9857 8.24995L15.7557 12.0232L13.1357 14.6432L9.36573 10.8682L11.9857 8.24995L8.21573 4.48195L11.8057 2.25195Z" fill={color}/>
        <path d="M4.62573 16.6532L3.89573 17.3832C3.74052 17.5385 3.65415 17.7502 3.65466 17.9712C3.65517 18.1923 3.74252 18.4034 3.89839 18.5581C4.05426 18.7127 4.26589 18.7985 4.48695 18.7975C4.70801 18.7965 4.91896 18.7087 5.07323 18.5525L5.80323 17.8225C5.9565 17.6677 6.04166 17.4572 6.04166 17.2375C6.04166 17.0178 5.9565 16.8073 5.80323 16.6525C5.64996 16.4976 5.43947 16.4118 5.21973 16.4118C4.99999 16.4118 4.7895 16.4976 4.63623 16.6525L4.62573 16.6532Z" fill={color}/>
      </svg>
    </div>
  );
};

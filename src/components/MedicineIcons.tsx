import React from 'react';

interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

export const Pill: React.FC<IconProps> = ({ color = "#FF6B6B", size = 32, className = "" }) => {
  return (
    <div style={{ width: size, height: size }} className={`relative ${className}`}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.8201 6.18C17.1898 5.5528 16.3995 5.1781 15.5701 5.1259C14.7406 5.0738 13.9171 5.3487 13.2601 5.89L5.48005 12.84C4.88757 13.3848 4.53259 14.144 4.49293 14.9503C4.45326 15.7565 4.7329 16.5484 5.26005 17.15C5.66901 17.6125 6.20431 17.9456 6.79985 18.1042C7.39539 18.2627 8.02214 18.2394 8.60505 18.038C9.18797 17.8366 9.69849 17.4666 10.0711 16.9759C10.4437 16.4851 10.6602 15.8972 10.7 15.28L12.8201 17.4C12.4505 18.0361 12.2698 18.7659 12.3033 19.5011C12.3368 20.2362 12.583 20.9462 13.0101 21.54C13.4098 22.004 13.9447 22.3425 14.5454 22.5112C15.1461 22.6799 15.7833 22.6712 16.3791 22.4865C16.9749 22.3018 17.5005 21.9494 17.887 21.4741C18.2735 20.9987 18.5028 20.4222 18.5501 19.82C18.5893 19.3056 18.5175 18.7889 18.3402 18.3082C18.1629 17.8275 17.8848 17.396 17.5301 17.04L19.6501 14.92C20.2577 15.289 20.969 15.4695 21.6869 15.4358C22.4048 15.4021 23.0962 15.1558 23.6701 14.73C24.1312 14.3233 24.468 13.7894 24.6379 13.1912C24.8077 12.593 24.8032 11.9586 24.6251 11.363C24.447 10.7674 24.1031 10.2389 23.6367 9.8395C23.1703 9.44009 22.6006 9.1873 22.0001 9.11C21.4855 9.07105 20.9687 9.14279 20.488 9.32011C20.0074 9.49743 19.5758 9.77552 19.2201 10.13L17.1001 8.01C17.4817 7.37092 17.6731 6.63736 17.6501 5.9C17.694 5.32785 17.5502 4.75639 17.2401 4.27C17.1446 4.13914 17.0246 4.02809 16.8862 3.94322C16.7478 3.85835 16.5939 3.8012 16.4338 3.77513C16.2736 3.74906 16.1103 3.75463 15.9528 3.79143C15.7954 3.82824 15.6471 3.89545 15.5172 3.9886C15.3873 4.08175 15.2784 4.19898 15.1963 4.33471C15.1142 4.47044 15.06 4.62245 15.037 4.7816C15.014 4.94075 15.0229 5.10372 15.0629 5.26013C15.103 5.4165 15.1734 5.56327 15.2701 5.69L17.3901 7.81L7.37005 17.11C7.12895 17.2718 6.84314 17.349 6.55382 17.3309C6.2645 17.3128 5.992 17.2005 5.77005 17.01C5.57556 16.8179 5.45139 16.5652 5.42005 16.29C5.37753 16.0069 5.45042 15.7179 5.62005 15.49L13.3501 8.56C13.7068 8.24267 14.1657 8.06632 14.6401 8.06632C15.1144 8.06632 15.5733 8.24267 15.9301 8.56C16.0986 8.75343 16.2308 8.98005 16.3199 9.22727C16.409 9.47448 16.4535 9.73811 16.4509 10.0039C16.4484 10.2697 16.399 10.5323 16.3052 10.7776C16.2115 11.0229 16.075 11.2468 15.9031 11.437C15.7312 11.6273 15.5272 11.7801 15.3024 11.8861C15.0776 11.9922 14.8366 12.0497 14.5918 12.0554C14.347 12.0612 14.1035 12.015 13.8735 11.9195C13.6435 11.824 13.4322 11.6808 13.2515 11.498C13.0707 11.3152 12.9256 11.097 12.825 10.8565C12.7244 10.6159 12.6702 10.3584 12.6657 10.0981C12.6612 9.83779 12.7064 9.57854 12.7986 9.3336C12.8908 9.08866 13.0282 8.86482 13.2025 8.67516C13.3769 8.48551 13.5839 8.33493 13.8135 8.23005C14.0431 8.12517 14.2911 8.06829 14.5426 8.06329C14.7941 8.05829 15.0441 8.10525 15.2776 8.20057C15.5111 8.29589 15.7238 8.43796 15.9051 8.61997C16.0864 8.80198 16.2307 9.02016 16.33 9.26057C16.4294 9.50098 16.482 9.757 16.485 10.0154C16.4879 10.2738 16.4412 10.5306 16.3473 10.7727C16.2534 11.0148 16.114 11.2354 15.9371 11.4205L13.9301 13.33C14.3017 13.9708 14.4849 14.7033 14.4534 15.4427C14.4219 16.1821 14.1773 16.895 13.7501 17.5C13.3524 17.9578 12.8195 18.2901 12.2219 18.4527C11.6242 18.6154 10.9908 18.6011 10.4019 18.4117C9.81297 18.2222 9.29718 17.8653 8.92013 17.3881C8.54308 16.9109 8.32507 16.3347 8.30005 15.74C8.29999 15.0009 8.52322 14.2782 8.94271 13.6693C9.3622 13.0604 9.9586 12.5942 10.6501 12.34L17.8201 6.18Z" fill={color}/>
      </svg>
    </div>
  );
};

export const Capsule: React.FC<IconProps> = ({ color = "#4CAF50", size = 32, className = "" }) => {
  return (
    <div style={{ width: size, height: size }} className={`relative ${className}`}>
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

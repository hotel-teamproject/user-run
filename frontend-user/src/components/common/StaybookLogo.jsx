import React from "react";
import "./StaybookLogo.scss";

const StaybookLogo = ({ size = "medium", showText = true }) => {
  return (
    <div className={`staybook-logo ${size} ${showText ? 'with-text' : 'icon-only'}`}>
      <div className="logo-icon">
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="logo-svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0066FF" />
              <stop offset="100%" stopColor="#00FF88" />
            </linearGradient>
          </defs>
          
          {/* H (Building) */}
          <path
            d="M 15 20 L 15 80 M 15 50 L 35 50 M 35 20 L 35 80"
            stroke="url(#logoGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Building windows */}
          <rect x="18" y="30" width="4" height="4" fill="url(#logoGradient)" />
          <rect x="23" y="30" width="4" height="4" fill="url(#logoGradient)" />
          <rect x="18" y="38" width="4" height="4" fill="url(#logoGradient)" />
          <rect x="23" y="38" width="4" height="4" fill="url(#logoGradient)" />
          
          {/* B (Globe with pin) */}
          <path
            d="M 45 20 L 45 80 M 45 20 Q 70 20 70 35 Q 70 50 45 50 Q 70 50 70 65 Q 70 80 45 80"
            stroke="url(#logoGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Globe grid lines */}
          <circle cx="57" cy="35" r="8" stroke="url(#logoGradient)" strokeWidth="1.5" fill="none" />
          <line x1="57" y1="27" x2="57" y2="43" stroke="url(#logoGradient)" strokeWidth="1.5" />
          <line x1="49" y1="35" x2="65" y2="35" stroke="url(#logoGradient)" strokeWidth="1.5" />
          {/* Navigation pin */}
          <path
            d="M 65 60 L 72 72 L 65 68 L 58 72 Z"
            fill="url(#logoGradient)"
          />
        </svg>
      </div>
      {showText && (
        <span className="logo-text">STAYBOOK</span>
      )}
    </div>
  );
};

export default StaybookLogo;


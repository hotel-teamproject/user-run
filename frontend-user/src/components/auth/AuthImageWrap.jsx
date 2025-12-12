import React, { useState } from "react";
import "../../styles/components/_authImageWrap.scss";

const AuthImageWrap = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="login-image-section">
      <div className="hotel-image-wrapper">
        {!imageLoaded && !imageError && (
          <div className="hotel-image-placeholder"></div>
        )}
        <img
          src="/images/eiffel-tower.jpg"
          alt="Eiffel Tower"
          className="hotel-image"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            console.error('이미지 로드 실패:', '/images/eiffel-tower.jpg');
          }}
          style={{ 
            display: imageError ? 'none' : 'block',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
        {imageError && (
          <div className="hotel-image-placeholder"></div>
        )}
      </div>
    </div>
  );
};

export default AuthImageWrap;

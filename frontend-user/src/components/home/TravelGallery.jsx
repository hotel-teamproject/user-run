import React from "react";
import "../../styles/components/home/TravelGallery.scss";

const TravelGallery = () => {
  return (
    <div className="travel-gallery">
      <div className="gallery-grid">
        <img src="/images/travel-1.png" alt="travel-1" className="gallery-img" />
        <img src="/images/travel-2.png" alt="travel-2" className="gallery-img" />
        <img src="/images/travel-3.png" alt="travel-3" className="gallery-img" />
        <img src="/images/travel-4.png" alt="travel-4" className="gallery-img" />
      </div>
    </div>
  );
};

export default TravelGallery;

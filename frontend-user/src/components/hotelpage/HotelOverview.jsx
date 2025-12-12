import React from "react";
import {
  FaStar,
  FaTree,
  FaGlassMartini,
  FaTheaterMasks,
  FaBroom,
} from "react-icons/fa";
import "../../styles/components/hotelpage/HotelOverview.scss";

const HotelOverview = ({ description, rating, reviewCount, tags = [] }) => {
  // 태그에 따른 아이콘 매핑
  const tagIcons = {
    park: { icon: <FaTree />, label: "Near park" },
    nightlife: { icon: <FaGlassMartini />, label: "Near nightlife" },
    theater: { icon: <FaTheaterMasks />, label: "Near theater" },
    clean: { icon: <FaBroom />, label: "Clean Hotel" },
    luxury: { icon: <FaStar />, label: "Luxury" },
    beach: { icon: <FaTree />, label: "Beach" },
    family: { icon: <FaStar />, label: "Family Friendly" },
  };

  // 평점 텍스트 변환
  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Very good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3.0) return "Fair";
    return "Average";
  };

  return (
    <div className="hotel-overview">
      <h2 className="overview-title">Overview</h2>

      <div className="overview-features">
        {/* 평점 카드 */}
        <div className="feature-card rating-card">
          <div className="rating-score">{rating?.toFixed(1) || "N/A"}</div>
          <div className="rating-label">{getRatingText(rating)}</div>
          <div className="review-count">{reviewCount || 0} reviews</div>
        </div>

        {/* 태그/특징 카드들 */}
        {tags.slice(0, 4).map((tag, index) => {
          const tagKey = tag.toLowerCase();
          const tagData = tagIcons[tagKey] || { icon: <FaStar />, label: tag };

          return (
            <div key={index} className="feature-card">
              <div className="feature-icon">{tagData.icon}</div>
              <div className="feature-label">{tagData.label}</div>
            </div>
          );
        })}
      </div>

      {/* 호텔 설명 */}
      <div className="overview-description">
        <p>{description || "호텔 설명이 없습니다."}</p>
      </div>
    </div>
  );
};

export default HotelOverview;

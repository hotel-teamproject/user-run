import React from "react";
import {
  FaStar,
  FaTree,
  FaGlassMartini,
  FaTheaterMasks,
  FaBroom,
  FaUmbrellaBeach,
  FaHeart,
  FaPlane,
  FaShoppingBag,
  FaMountain,
  FaSkiing,
  FaGolfBall,
  FaSun,
  FaCity,
  FaBriefcase,
  FaCar,
  FaUsers,
  FaSnowflake,
  FaFish,
  FaGem,
  FaLeaf,
  FaHotTub,
} from "react-icons/fa";
import "../../styles/components/hotelpage/HotelOverview.scss";

const HotelOverview = ({ description, rating, reviewCount, tags = [] }) => {
  // 태그에 따른 아이콘 매핑 (한국어 태그 지원)
  const tagIcons = {
    // 한국어 태그
    '럭셔리': { icon: <FaGem />, label: "럭셔리" },
    '프리미엄': { icon: <FaStar />, label: "프리미엄" },
    '비즈니스': { icon: <FaBriefcase />, label: "비즈니스" },
    '커플': { icon: <FaHeart />, label: "커플" },
    '로맨틱': { icon: <FaHeart />, label: "로맨틱" },
    '도심': { icon: <FaCity />, label: "도심" },
    '자연': { icon: <FaTree />, label: "자연" },
    '온천': { icon: <FaHotTub />, label: "온천" },
    '공항': { icon: <FaPlane />, label: "공항 근처" },
    '편리': { icon: <FaShoppingBag />, label: "편리한 위치" },
    '출장': { icon: <FaBriefcase />, label: "출장" },
    '쇼핑': { icon: <FaShoppingBag />, label: "쇼핑" },
    '관광': { icon: <FaCity />, label: "관광" },
    '가성비': { icon: <FaStar />, label: "가성비" },
    '모던': { icon: <FaCity />, label: "모던" },
    '리조트': { icon: <FaUmbrellaBeach />, label: "리조트" },
    '골프': { icon: <FaGolfBall />, label: "골프" },
    '해변': { icon: <FaUmbrellaBeach />, label: "해변" },
    '바다뷰': { icon: <FaUmbrellaBeach />, label: "바다뷰" },
    '가족': { icon: <FaUsers />, label: "가족" },
    '스키': { icon: <FaSkiing />, label: "스키" },
    '액티비티': { icon: <FaMountain />, label: "액티비티" },
    '겨울': { icon: <FaSnowflake />, label: "겨울" },
    '해안': { icon: <FaUmbrellaBeach />, label: "해안" },
    '일출': { icon: <FaSun />, label: "일출" },
    '해산물': { icon: <FaFish />, label: "해산물" },
    '렌터카': { icon: <FaCar />, label: "렌터카" },
    '휴양': { icon: <FaUmbrellaBeach />, label: "휴양" },
    // 영어 태그 (호환성)
    park: { icon: <FaTree />, label: "공원 근처" },
    nightlife: { icon: <FaGlassMartini />, label: "나이트라이프" },
    theater: { icon: <FaTheaterMasks />, label: "극장 근처" },
    clean: { icon: <FaBroom />, label: "청결한 호텔" },
    luxury: { icon: <FaGem />, label: "럭셔리" },
    beach: { icon: <FaUmbrellaBeach />, label: "해변" },
    family: { icon: <FaUsers />, label: "가족 친화적" },
  };

  // 평점 텍스트 변환 (한글)
  const getRatingText = (rating) => {
    if (rating >= 4.5) return "매우 좋음";
    if (rating >= 4.0) return "좋음";
    if (rating >= 3.5) return "보통";
    if (rating >= 3.0) return "나쁨";
    return "매우 나쁨";
  };

  // 실제 rating 값 (null 체크)
  const actualRating = rating || 0;
  const actualReviewCount = reviewCount || 0;

  return (
    <div className="hotel-overview">
      <h2 className="overview-title">개요</h2>

      <div className="overview-features">
        {/* 평점 카드 */}
        {actualRating > 0 && (
          <div className="feature-card rating-card">
            <div className="rating-score">{actualRating.toFixed(1)}</div>
            <div className="rating-label">{getRatingText(actualRating)}</div>
            {actualReviewCount > 0 && (
              <div className="review-count">리뷰 {actualReviewCount}개</div>
            )}
          </div>
        )}

        {/* 태그/특징 카드들 */}
        {tags && tags.length > 0 && tags.slice(0, 4).map((tag, index) => {
          // 한국어 태그는 그대로, 영어 태그는 소문자로 변환
          const tagKey = typeof tag === 'string' ? tag : String(tag);
          const tagData = tagIcons[tagKey] || tagIcons[tagKey.toLowerCase()] || { 
            icon: <FaStar />, 
            label: tagKey 
          };

          return (
            <div key={index} className="feature-card">
              <div className="feature-icon">{tagData.icon}</div>
              <div className="feature-label">{tagData.label}</div>
            </div>
          );
        })}
      </div>

      {/* 호텔 설명 */}
      {description && (
        <div className="overview-description">
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

export default HotelOverview;

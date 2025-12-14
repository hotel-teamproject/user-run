import React, { useState } from "react";
import "../../styles/components/hotelpage/Amenities.scss";

const Amenities = ({ amenities = [] }) => {
 const [showAll, setShowAll] = useState(false);

 // 아이콘 매핑
 const getAmenityIcon = (amenity) => {
  const amenityLower = amenity.toLowerCase();
  
  // 수영장
  if (amenityLower.includes("pool") || amenityLower.includes("수영장"))
   return "🏊";
  
  // 스파
  if (amenityLower.includes("spa") || amenityLower.includes("스파"))
   return "💆";
  
  // 와이파이
  if (amenityLower.includes("wifi") || amenityLower.includes("와이파이"))
   return "📶";
  
  // 피트니스
  if (
   amenityLower.includes("fitness") ||
   amenityLower.includes("피트니스") ||
   amenityLower.includes("헬스")
  )
   return "💪";
  
  // 레스토랑
  if (
   amenityLower.includes("restaurant") ||
   amenityLower.includes("레스토랑") ||
   amenityLower.includes("식당")
  )
   return "🍽️";
  
  // 바
  if (amenityLower.includes("bar") || amenityLower.includes("바")) 
   return "🍸";
  
  // 주차장
  if (amenityLower.includes("parking") || amenityLower.includes("주차"))
   return "🅿️";
  
  // 룸서비스
  if (
   amenityLower.includes("room service") ||
   amenityLower.includes("룸서비스")
  )
   return "🛎️";
  
  // 커피/카페
  if (
   amenityLower.includes("coffee") ||
   amenityLower.includes("tea") ||
   amenityLower.includes("커피") ||
   amenityLower.includes("카페")
  )
   return "☕";
  
  // 라운지
  if (amenityLower.includes("lounge") || amenityLower.includes("라운지"))
   return "🛋️";
  
  // 정원
  if (amenityLower.includes("garden") || amenityLower.includes("정원"))
   return "🌳";
  
  // 바비큐
  if (amenityLower.includes("bbq") || amenityLower.includes("바비큐"))
   return "🍖";
  
  // 자전거
  if (amenityLower.includes("bike") || amenityLower.includes("자전거"))
   return "🚴";
  
  // 24시간 프론트 데스크
  if (
   amenityLower.includes("24") ||
   amenityLower.includes("프론트") ||
   amenityLower.includes("front")
  )
   return "🕐";
  
  // 비즈니스 센터
  if (
   amenityLower.includes("business") ||
   amenityLower.includes("비즈니스")
  )
   return "💼";
  
  // 온천
  if (amenityLower.includes("온천") || amenityLower.includes("hot spring"))
   return "♨️";
  
  // 골프장
  if (amenityLower.includes("골프") || amenityLower.includes("golf"))
   return "⛳";
  
  // 해변
  if (
   amenityLower.includes("해변") ||
   amenityLower.includes("beach") ||
   amenityLower.includes("해변 접근")
  )
   return "🏖️";
  
  // 키즈클럽
  if (
   amenityLower.includes("키즈") ||
   amenityLower.includes("kids") ||
   amenityLower.includes("어린이")
  )
   return "👶";
  
  // 스키장
  if (amenityLower.includes("스키") || amenityLower.includes("ski"))
   return "⛷️";
  
  // 곤돌라
  if (amenityLower.includes("곤돌라") || amenityLower.includes("gondola"))
   return "🚠";
  
  // 사우나
  if (amenityLower.includes("사우나") || amenityLower.includes("sauna"))
   return "🧖";
  
  // 비치 체어
  if (amenityLower.includes("비치") || amenityLower.includes("beach chair"))
   return "🏖️";
  
  // 해수욕장
  if (amenityLower.includes("해수욕장"))
   return "🌊";
  
  // 해산물 식당
  if (amenityLower.includes("해산물"))
   return "🦞";
  
  // 냉난방
  if (amenityLower.includes("냉난방") || amenityLower.includes("난방"))
   return "🌡️";
  
  // TV
  if (amenityLower.includes("tv") || amenityLower.includes("티비"))
   return "📺";
  
  // 에어컨
  if (amenityLower.includes("에어컨") || amenityLower.includes("air"))
   return "❄️";
  
  // 욕실용품
  if (amenityLower.includes("욕실") || amenityLower.includes("bath"))
   return "🛁";
  
  // 셔틀버스
  if (amenityLower.includes("셔틀") || amenityLower.includes("shuttle"))
   return "🚌";
  
  return "✓";
 };

 const displayedAmenities = showAll ? amenities : amenities.slice(0, 10);
 const hasMore = amenities.length > 10;

 return (
  <div className="amenities">
   <h3 className="amenities-title">편의시설</h3>
   <div className="amenities-grid">
    {displayedAmenities.map((amenity, index) => (
     <div key={index} className="amenity-item">
      <span className="amenity-icon">{getAmenityIcon(amenity)}</span>
      <span className="amenity-name">{amenity}</span>
     </div>
    ))}
   </div>
   {hasMore && (
    <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
     {showAll ? "접기" : `+${amenities.length - 10}개 더보기`}
    </button>
   )}
  </div>
 );
};

export default Amenities;

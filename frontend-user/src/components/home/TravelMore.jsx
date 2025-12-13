import React from "react";
import RecommendedHotels from "./RecommendedHotels";
import "../../styles/components/home/TravelMore.scss";

const TravelMore = () => {
 return (
  <section className="travel-more">
   <div className="container">
    <div className="travel-more-header">
     <h2 className="travel-more-title">추천 숙소</h2>
     <button className="see-all-btn" onClick={() => window.location.href = '/search'}>전체보기</button>
    </div>
    <p className="section-subtitle">
     평점이 높고 인기 있는 숙소를 추천해드립니다. 특별한 여행을 위한 완벽한 선택을 만나보세요.
    </p>

    <RecommendedHotels />
   </div>
  </section>
 );
};

export default TravelMore;
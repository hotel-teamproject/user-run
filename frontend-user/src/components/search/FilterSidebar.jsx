import React, { useState } from "react";
import "../../styles/pages/search/FilterSidebar.scss";

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [minPrice, setMinPrice] = useState(filters?.priceRange?.[0] || 30000);
  const [maxPrice, setMaxPrice] = useState(filters?.priceRange?.[1] || 1000000);
  const [selectedRating, setSelectedRating] = useState(filters?.rating || []);
  const [freebies, setFreebies] = useState(filters?.freebies || []);
  const [amenities, setAmenities] = useState(filters?.amenities || []);
  const [showMoreAmenities, setShowMoreAmenities] = useState(false);

  const handlePriceChange = (type, value) => {
    const numValue = parseInt(value);
    if (type === "min") {
      setMinPrice(numValue);
      if (onFilterChange) {
        onFilterChange("priceRange", [numValue, maxPrice]);
      }
    } else {
      setMaxPrice(numValue);
      if (onFilterChange) {
        onFilterChange("priceRange", [minPrice, numValue]);
      }
    }
  };

  const handleRatingClick = (rating) => {
    const newRating = selectedRating.includes(rating)
      ? selectedRating.filter(r => r !== rating)
      : [...selectedRating, rating];
    setSelectedRating(newRating);
    if (onFilterChange) {
      onFilterChange("rating", newRating);
    }
  };

  const handleFreebieChange = (freebie) => {
    const newFreebies = freebies.includes(freebie)
      ? freebies.filter(f => f !== freebie)
      : [...freebies, freebie];
    setFreebies(newFreebies);
    if (onFilterChange) {
      onFilterChange("freebies", newFreebies);
    }
  };

  const handleAmenityChange = (amenity) => {
    const newAmenities = amenities.includes(amenity)
      ? amenities.filter(a => a !== amenity)
      : [...amenities, amenity];
    setAmenities(newAmenities);
    if (onFilterChange) {
      onFilterChange("amenities", newAmenities);
    }
  };

  return (
    <aside className="filter-sidebar">

      {/* Title */}
      <h2 className="filter-title">필터</h2>

      {/* ======================
          PRICE FILTER
      ====================== */}
      <div className="filter-section">
        <div className="filter-header">
          <span>가격</span>
          <button className="toggle-btn">⌃</button>
        </div>

        <div className="filter-body">

          {/* 가격 슬라이더 풀 구조 */}
          <div className="price-slider">

            {/* 트랙 */}
            <div className="price-slider-track"></div>

            {/* 최소값(min) */}
            <input
              type="range"
              className="min-range"
              min="30000"
              max="1000000"
              value={minPrice}
              onChange={(e) => handlePriceChange("min", e.target.value)}
            />

            {/* 최대값(max) */}
            <input
              type="range"
              className="max-range"
              min="30000"
              max="1000000"
              value={maxPrice}
              onChange={(e) => handlePriceChange("max", e.target.value)}
            />
          </div>

          <div className="price-values">
            <span>{minPrice.toLocaleString()}원</span>
            <span>{maxPrice.toLocaleString()}원</span>
          </div>

        </div>
      </div>

      <hr />

      {/* ======================
          RATING FILTER
      ====================== */}
      <div className="filter-section">
        <div className="filter-header">
          <span>평점</span>
          <button className="toggle-btn">⌃</button>
        </div>

        <div className="filter-body rating-buttons">
          {[0, 1, 2, 3, 4].map((rating) => (
            <button
              key={rating}
              className={selectedRating.includes(rating) ? "active" : ""}
              onClick={() => handleRatingClick(rating)}
            >
              {rating}+
            </button>
          ))}
        </div>
      </div>

      <hr />

      {/* ======================
          FREEBIES
      ====================== */}
      <div className="filter-section">
        <div className="filter-header">
          <span>무료 서비스</span>
          <button className="toggle-btn">⌃</button>
        </div>

        <div className="filter-body checkbox-list">
          <label>
            <input 
              type="checkbox" 
              checked={freebies.includes("조식포함")}
              onChange={() => handleFreebieChange("조식포함")}
            /> 
            조식포함
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={freebies.includes("무료주차")}
              onChange={() => handleFreebieChange("무료주차")}
            /> 
            무료주차
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={freebies.includes("와이파이")}
              onChange={() => handleFreebieChange("와이파이")}
            /> 
            와이파이
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={freebies.includes("공항셔틀버스")}
              onChange={() => handleFreebieChange("공항셔틀버스")}
            /> 
            공항셔틀버스
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={freebies.includes("무료취소")}
              onChange={() => handleFreebieChange("무료취소")}
            /> 
            무료취소
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={freebies.includes("셔틀버스")}
              onChange={() => handleFreebieChange("셔틀버스")}
            /> 
            셔틀버스
          </label>
        </div>
      </div>

      <hr />

      {/* ======================
          AMENITIES
      ====================== */}
      <div className="filter-section">
        <div className="filter-header">
          <span>편의시설</span>
          <button className="toggle-btn">⌃</button>
        </div>

        <div className="filter-body checkbox-list">
          {[
            { key: "와이파이", value: "와이파이" },
            { key: "주차장", value: "주차장" },
            { key: "레스토랑", value: "레스토랑" },
            { key: "수영장", value: "수영장" },
            { key: "피트니스", value: "피트니스" },
            { key: "스파", value: "스파" },
            { 
              key: "24시간 프론트 데스크", 
              value: amenities.includes("24시간 프론트 데스크") ? "24시간 프론트 데스크" : "24시간 프론트",
              check: amenities.includes("24시간 프론트 데스크") || amenities.includes("24시간 프론트")
            },
            { key: "라운지", value: "라운지" },
            { key: "비즈니스 센터", value: "비즈니스 센터" },
            { key: "온천", value: "온천" },
            { key: "골프장", value: "골프장" },
            { 
              key: "해변", 
              value: amenities.includes("해변") ? "해변" : "해변 접근",
              check: amenities.includes("해변") || amenities.includes("해변 접근")
            },
            { key: "키즈클럽", value: "키즈클럽" },
            { key: "스키장", value: "스키장" },
            { key: "사우나", value: "사우나" },
            { key: "카페", value: "카페" },
            { key: "에어컨", value: "에어컨" },
            { key: "TV", value: "TV" },
            { key: "냉난방", value: "냉난방" }
          ].slice(0, showMoreAmenities ? undefined : 5).map((item) => (
            <label key={item.key}>
              <input 
                type="checkbox" 
                checked={item.check !== undefined ? item.check : amenities.includes(item.value)}
                onChange={() => handleAmenityChange(item.value)}
              /> 
              {item.key}
            </label>
          ))}
          {!showMoreAmenities && (
            <button 
              className="show-more-btn"
              onClick={() => setShowMoreAmenities(true)}
            >
              더보기
            </button>
          )}
          {showMoreAmenities && (
            <button 
              className="show-more-btn"
              onClick={() => setShowMoreAmenities(false)}
            >
              접기
            </button>
          )}
        </div>
      </div>

    </aside>
  );
};

export default FilterSidebar;

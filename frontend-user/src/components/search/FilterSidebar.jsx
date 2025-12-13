import React, { useState } from "react";
import "../../styles/pages/search/FilterSidebar.scss";

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [minPrice, setMinPrice] = useState(filters?.priceRange?.[0] || 30000);
  const [maxPrice, setMaxPrice] = useState(filters?.priceRange?.[1] || 1000000);
  const [selectedRating, setSelectedRating] = useState(filters?.rating || []);
  const [freebies, setFreebies] = useState(filters?.freebies || []);
  const [amenities, setAmenities] = useState(filters?.amenities || []);

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
            <span>₩{minPrice.toLocaleString()}</span>
            <span>₩{maxPrice.toLocaleString()}</span>
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
              checked={freebies.includes("WIFI")}
              onChange={() => handleFreebieChange("WIFI")}
            /> 
            WIFI
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
          <label>
            <input 
              type="checkbox" 
              checked={amenities.includes("24시 프론트데스크")}
              onChange={() => handleAmenityChange("24시 프론트데스크")}
            /> 
            24시 프론트데스크
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={amenities.includes("에어컨")}
              onChange={() => handleAmenityChange("에어컨")}
            /> 
            에어컨
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={amenities.includes("피트니스")}
              onChange={() => handleAmenityChange("피트니스")}
            /> 
            피트니스
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={amenities.includes("수영장")}
              onChange={() => handleAmenityChange("수영장")}
            /> 
            수영장
          </label>
        </div>
      </div>

    </aside>
  );
};

export default FilterSidebar;

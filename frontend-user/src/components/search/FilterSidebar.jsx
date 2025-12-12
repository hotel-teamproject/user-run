import React from "react";
import "../../styles/pages/search/FilterSidebar.scss";

const FilterSidebar = () => {
  return (
    <aside className="filter-sidebar">

      {/* Title */}
      <h2 className="filter-title">Filters</h2>

      {/* ======================
          PRICE FILTER
      ====================== */}
      <div className="filter-section">
        <div className="filter-header">
          <span>Price</span>
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
              min="50"
              max="1200"
              defaultValue="200"
            />

            {/* 최대값(max) */}
            <input
              type="range"
              className="max-range"
              min="50"
              max="1200"
              defaultValue="900"
            />
          </div>

          <div className="price-values">
            <span>$50</span>
            <span>$1200</span>
          </div>

        </div>
      </div>

      <hr />

      {/* ======================
          RATING FILTER
      ====================== */}
      <div className="filter-section">
        <div className="filter-header">
          <span>Rating</span>
          <button className="toggle-btn">⌃</button>
        </div>

        <div className="filter-body rating-buttons">
          <button>0+</button>
          <button>1+</button>
          <button>2+</button>
          <button>3+</button>
          <button>4+</button>
        </div>
      </div>

      <hr />

      {/* ======================
          FREEBIES
      ====================== */}
      <div className="filter-section">
        <div className="filter-header">
          <span>Freebies</span>
          <button className="toggle-btn">⌃</button>
        </div>

        <div className="filter-body checkbox-list">
          <label><input type="checkbox" /> 조식포함</label>
          <label><input type="checkbox" /> 무료주차</label>
          <label><input type="checkbox" /> WIFI</label>
          <label><input type="checkbox" /> 공항셔틀버스</label>
          <label><input type="checkbox" /> 무료취소</label>
        </div>
      </div>

      <hr />

      {/* ======================
          AMENITIES
      ====================== */}
      <div className="filter-section">
        <div className="filter-header">
          <span>Amenities</span>
          <button className="toggle-btn">⌃</button>
        </div>

        <div className="filter-body checkbox-list">
          <label><input type="checkbox" /> 24시 프론트데스크</label>
          <label><input type="checkbox" /> 에어컨</label>
          <label><input type="checkbox" /> 피트니스</label>
          <label><input type="checkbox" /> 수영장</label>
        </div>
      </div>

    </aside>
  );
};

export default FilterSidebar;

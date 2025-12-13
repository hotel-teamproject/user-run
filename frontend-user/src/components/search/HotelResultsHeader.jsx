import React, { useState } from "react";
import "../../styles/components/search/HotelResultsHeader.scss";

const HotelResultsHeader = ({ total, showing, onSortChange }) => {
 const [sortBy, setSortBy] = useState("recommended");

 const handleSortChange = (e) => {
  const value = e.target.value;
  setSortBy(value);
  if (onSortChange) {
   onSortChange(value);
  }
 };

 return (
  <div className="hotel-results-header">
   <div className="results-info">
    <strong>{showing}</strong>개 표시 중 / 총{" "}
    <strong className="total">{total}개</strong>
   </div>
   <div className="sort-dropdown">
    <label>정렬</label>
    <select value={sortBy} onChange={handleSortChange}>
     <option value="recommended">추천순</option>
     <option value="price-low">가격: 낮은 순</option>
     <option value="price-high">가격: 높은 순</option>
     <option value="rating">평점순</option>
    </select>
   </div>
  </div>
 );
};

export default HotelResultsHeader;

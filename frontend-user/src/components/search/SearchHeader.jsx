import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/search/SearchHeader.scss";

const SearchHeader = ({ filters, onFilterChange }) => {
 return (
  <header className="search-header">
   <div className="search-header-inner">
    <div className="logo">
     <Link to="/">
      <span className="logo-icon">🏨</span> 숙소 찾기
     </Link>
    </div>

    <div className="search-filters">
     <div className="filter-group">
      <label>목적지 입력</label>
      <input
       type="text"
       placeholder="신라스테이 울산점, 서울"
       value={filters.destination}
       onChange={(e) => onFilterChange("destination", e.target.value)}
      />
     </div>

     <div className="filter-group">
      <label>체크인</label>
      <input
       type="date"
       value={filters.checkIn}
       onChange={(e) => onFilterChange("checkIn", e.target.value)}
      />
     </div>

     <div className="filter-group">
      <label>체크아웃</label>
      <input
       type="date"
       value={filters.checkOut}
       onChange={(e) => onFilterChange("checkOut", e.target.value)}
      />
     </div>

     <div className="filter-group">
      <label>객실 및 인원</label>
      <select
       value={`${filters.guests.rooms},${filters.guests.guests}`}
       onChange={(e) => {
        const [rooms, guests] = e.target.value.split(",").map(Number);
        onFilterChange("guests", { rooms, guests });
       }}
      >
       <option value="1,2">객실 1개, 인원 2명</option>
       <option value="1,3">객실 1개, 인원 3명</option>
       <option value="2,4">객실 2개, 인원 4명</option>
      </select>
     </div>

     <button className="search-button">🔍</button>
    </div>

    <div className="header-actions">
     <Link to="/wishlist" className="action-link">
      <span className="icon">❤️</span> 찜하기
     </Link>
     <div className="user-profile">
      <span className="icon">👤</span> Tomhoon
     </div>
    </div>
   </div>
  </header>
 );
};

export default SearchHeader;

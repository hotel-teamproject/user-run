import React, { useEffect, useState } from "react";
import "../../styles/components/search/SearchFilterWrap.scss";

const SearchFilterWrap = ({ filters, onFilterChange }) => {
 const [destination, setDestination] = useState(filters?.destination || "");
 const [checkIn, setCheckIn] = useState(filters?.checkIn || "");
 const [checkOut, setCheckOut] = useState(filters?.checkOut || "");
 const [rooms, setRooms] = useState(filters?.rooms || 1);
 const [guests, setGuests] = useState(filters?.guests || 2);

 // 상위 filters 값 변경 시 내부 상태 동기화
 useEffect(() => {
  setDestination(filters?.destination || "");
  setCheckIn(filters?.checkIn || "");
  setCheckOut(filters?.checkOut || "");
  setRooms(filters?.rooms || 1);
  setGuests(filters?.guests || 2);
 }, [filters]);

 const handleDestinationChange = (e) => {
  const value = e.target.value;
  setDestination(value);
  if (onFilterChange) {
   onFilterChange("destination", value);
  }
 };

 const handleCheckInChange = (e) => {
  const value = e.target.value;
  setCheckIn(value);
  if (onFilterChange) {
   onFilterChange("checkIn", value);
  }
 };

 const handleCheckOutChange = (e) => {
  const value = e.target.value;
  setCheckOut(value);
  if (onFilterChange) {
   onFilterChange("checkOut", value);
  }
 };

 const handleGuestsChange = (e) => {
  const value = e.target.value;
  const [roomCount, guestCount] = value.split(",").map(Number);
  setRooms(roomCount);
  setGuests(guestCount);
  if (onFilterChange) {
   onFilterChange("rooms", roomCount);
   onFilterChange("guests", guestCount);
  }
 };

 return (
    <div className="search-form inner">
     <h3>어디로 떠나시나요?</h3>
     <div className="form-container">
      <div className="form-group">
       <label>목적지 입력</label>
       <input
        type="text"
        placeholder="예) 서울"
        className="destination-input"
        maxLength={100}
        value={destination}
        onChange={handleDestinationChange}
       />
      </div>

      <div className="form-group">
       <label>체크인</label>
       <input 
        type="date" 
        className="date-input"
        value={checkIn}
        onChange={handleCheckInChange}
       />
      </div>

      <div className="form-group">
       <label>체크아웃</label>
       <input 
        type="date" 
        className="date-input"
        value={checkOut}
        onChange={handleCheckOutChange}
        min={checkIn}
       />
      </div>

      <div className="form-group">
       <label>객실 및 인원</label>
       <select 
        className="guests-select"
        value={`${rooms},${guests}`}
        onChange={handleGuestsChange}
       >
        <option value="1,1">객실 1개, 인원 1명</option>
        <option value="1,2">객실 1개, 인원 2명</option>
        <option value="1,3">객실 1개, 인원 3명</option>
        <option value="1,4">객실 1개, 인원 4명</option>
        <option value="2,4">객실 2개, 인원 4명</option>
        <option value="2,6">객실 2개, 인원 6명</option>
       </select>
      </div>
     </div>
    </div>
 );
};

export default SearchFilterWrap;

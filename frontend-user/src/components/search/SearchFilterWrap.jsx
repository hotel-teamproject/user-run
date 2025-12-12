import React from "react";
import "../../styles/components/search/SearchFilterWrap.scss";
const SearchFilterWrap = () => {
 return (
    <div className="search-form inner">
     <h3>Where are you staying?</h3>
     <div className="form-container">
      <div className="form-group">
       <label>Enter Destination</label>
       <input
        type="text"
        placeholder="예) 서울시 어머님댁 저희집"
        className="destination-input"
       />
      </div>

      <div className="form-group">
       <label>Check In</label>
       <input type="date" defaultValue="2024-01-22" className="date-input" />
      </div>

      <div className="form-group">
       <label>Check Out</label>
       <input type="date" defaultValue="2024-01-24" className="date-input" />
      </div>

      <div className="form-group">
       <label>Rooms & Guests</label>
       <select className="guests-select">
        <option>1 room, 2 guests</option>
        <option>1 room, 1 guest</option>
        <option>2 rooms, 4 guests</option>
       </select>
      </div>
     </div>
    </div>
 );
};

export default SearchFilterWrap;

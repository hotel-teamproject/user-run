import React, { useState } from "react";
import "../../styles/components/search/HotelResultsHeader.scss";

const HotelResultsHeader = ({ total, showing }) => {
 const [sortBy, setSortBy] = useState("recommended");

 return (
  <div className="hotel-results-header">
   <div className="results-info">
    Showing <strong>{showing}</strong> of{" "}
    <strong className="total">{total} places</strong>
   </div>
   <div className="sort-dropdown">
    <label>Sort by</label>
    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
     <option value="recommended">Recommended</option>
     <option value="price-low">Price: Low to High</option>
     <option value="price-high">Price: High to Low</option>
     <option value="rating">Rating</option>
    </select>
   </div>
  </div>
 );
};

export default HotelResultsHeader;

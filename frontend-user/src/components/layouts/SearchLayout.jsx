import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import SearchFilterWrap from "../search/SearchFilterWrap";
import FilterSidebar from "../search/FilterSidebar";
import FloatingNav from "../common/FloatingNav";
import "../../styles/layouts/SearchLayout.scss";

const SearchLayout = () => {
  const [filters, setFilters] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: { rooms: 1, guests: 2 },
    priceRange: [0, 1000],
    rating: [],
    freebies: [],
    amenities: [],
  });

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  return (
    <div className="search-layout">
      <Header />

      <FloatingNav />

      <div className="search-container">

        <SearchFilterWrap 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />

        <div className="search-content">

          {/* 좌측 필터 */}
          <div className="filter-sidebar">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>

          {/* 우측 결과 */}
          <main className="search-main">
            <Outlet context={{ filters }} />
          </main>

        </div>
      </div>
    </div>
  );
};

export default SearchLayout;

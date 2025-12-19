import React, { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import Header from "../common/Header";
import SearchFilterWrap from "../search/SearchFilterWrap";
import FilterSidebar from "../search/FilterSidebar";
import FloatingNav from "../common/FloatingNav";
import "../../styles/layouts/SearchLayout.scss";

const SearchLayout = () => {
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filters, setFilters] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    rooms: 1,
    guests: 2,
    priceRange: [30000, 1000000],
    rating: [],
    freebies: [],
    amenities: [],
  });

  // URL 쿼리(destination)로 초기 목적지 설정
  useEffect(() => {
    const destinationFromUrl = searchParams.get("destination") || "";
    if (destinationFromUrl) {
      setFilters((prev) => ({
        ...prev,
        destination: destinationFromUrl,
      }));
    }
  }, [searchParams]);

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

        {/* 검색 필터 토글 버튼 (모바일) */}
        <button 
          className="search-toggle-btn"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          aria-label="검색 필터 열기/닫기"
        >
          <span className="search-toggle-icon">🔍</span>
          <span className="search-toggle-text">검색 조건</span>
          <span className={`search-toggle-arrow ${isSearchOpen ? 'open' : ''}`}>▼</span>
        </button>

        {/* 검색 필터 래퍼 */}
        <div className={`search-filter-wrapper ${isSearchOpen ? 'open' : ''}`}>
          <SearchFilterWrap 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>

        <div className="search-content">

          {/* 필터 토글 버튼 (모바일) */}
          <button 
            className="filter-toggle-btn"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-label="필터 열기/닫기"
          >
            <span className="filter-toggle-icon">🔍</span>
            <span className="filter-toggle-text">필터</span>
            <span className={`filter-toggle-arrow ${isFilterOpen ? 'open' : ''}`}>▼</span>
          </button>

          {/* 좌측 필터 */}
          <div className={`filter-sidebar-wrapper ${isFilterOpen ? 'open' : ''}`}>
            <div className="filter-sidebar">
              <FilterSidebar 
                filters={filters} 
                onFilterChange={handleFilterChange} 
              />
            </div>
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

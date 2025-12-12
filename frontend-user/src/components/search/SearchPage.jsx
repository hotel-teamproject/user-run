import React, { useState, useEffect } from "react";
import HotelTypesTabs from "../../components/search/HotelTypesTabs";
import HotelResultsHeader from "../../components/search/HotelResultsHeader";
import HotelListCards from "../../components/search/HotelListCards";
import FilterSidebar from "../../components/search/FilterSidebar";

import "../../styles/pages/search/SearchPage.scss";
import { getHotels } from "../../api/hotelClient";

const SearchPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await getHotels();
        setHotels(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return <div className="search-page loading">Loading hotels...</div>;
  }

  if (error) {
    return <div className="search-page error">Error: {error}</div>;
  }

  return (
    <div className="search-page">

      {/* 검색 상단 탭 */}
      <HotelTypesTabs />

      <div className="search-content">
        {/* 🔹 Left: Filter Sidebar */}
        <FilterSidebar />

        {/* 🔹 Right: Hotel list */}
        <div className="hotel-results">
          <HotelResultsHeader total={hotels.length} showing={hotels.length} />
          <HotelListCards hotels={hotels} />
        </div>
      </div>

    </div>
  );
};

export default SearchPage;

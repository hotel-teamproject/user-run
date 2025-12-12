import React, { useState, useEffect } from "react";
import HotelTypesTabs from "../../components/search/HotelTypesTabs";
import HotelResultsHeader from "../../components/search/HotelResultsHeader";
import HotelListCards from "../../components/search/HotelListCards";
import "../../styles/components/search/SearchPage.scss";
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
        setHotels(data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
        setError("호텔 목록을 불러오는데 실패했습니다.");
        setHotels([]);
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
    return <div className="search-page error">{error}</div>;
  }

  return (
  <div className="search-page">

      {/* 🔥 검색폼(form-container) 밖에서 가장 먼저 배치 */}
      <div className="tabs-wrapper">
        <HotelTypesTabs />
      </div>

      {/* 호텔 리스트 섹션 */}
      <div className="search-content full-width">
        <div className="hotel-results">
          <HotelResultsHeader
            total={hotels.length}
            showing={hotels.length}
          />
          <HotelListCards hotels={hotels} />
        </div>
      </div>

  </div>
);

};

export default SearchPage;

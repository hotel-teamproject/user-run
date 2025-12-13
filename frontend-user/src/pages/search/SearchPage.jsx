import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import HotelTypesTabs from "../../components/search/HotelTypesTabs";
import HotelResultsHeader from "../../components/search/HotelResultsHeader";
import HotelListCards from "../../components/search/HotelListCards";
import "../../styles/components/search/SearchPage.scss";
import { getHotels } from "../../api/hotelClient";

const SearchPage = () => {
  const outletContext = useOutletContext();
  const layoutFilters = outletContext?.filters || {};
  
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  
  // 필터 상태 (SearchLayout에서 전달받음)
  const filters = useMemo(() => {
    const priceRange = layoutFilters.priceRange || [30000, 1000000];
    return {
      destination: layoutFilters.destination || "",
      checkIn: layoutFilters.checkIn || "",
      checkOut: layoutFilters.checkOut || "",
      rooms: layoutFilters.rooms || (typeof layoutFilters.guests === 'object' ? layoutFilters.guests.rooms : 1),
      guests: typeof layoutFilters.guests === 'object' ? layoutFilters.guests.guests : (layoutFilters.guests || 2),
      priceRange: Array.isArray(priceRange) ? priceRange : [30000, 1000000],
      rating: layoutFilters.rating || [],
      freebies: layoutFilters.freebies || [],
      amenities: layoutFilters.amenities || [],
    };
  }, [layoutFilters]);

  // 호텔 데이터 가져오기
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await getHotels();
        setAllHotels(data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
        setError("호텔 목록을 불러오는데 실패했습니다.");
        setAllHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);


  // 탭 변경 핸들러
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // 정렬 변경 핸들러
  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
  };

  // 필터링 및 정렬된 호텔 목록
  const filteredAndSortedHotels = useMemo(() => {
    let filtered = [...allHotels];

    // 타입 필터 (탭)
    if (activeTab === "hotels") {
      filtered = filtered.filter(hotel => hotel.name && hotel.name.includes("호텔"));
    } else if (activeTab === "motels") {
      filtered = filtered.filter(hotel => hotel.name && hotel.name.includes("모텔"));
    } else if (activeTab === "resorts") {
      filtered = filtered.filter(hotel => hotel.name && hotel.name.includes("리조트"));
    }

    // 목적지 필터
    if (filters.destination) {
      const searchTerm = filters.destination.toLowerCase();
      filtered = filtered.filter(hotel => 
        hotel.name?.toLowerCase().includes(searchTerm) ||
        hotel.city?.toLowerCase().includes(searchTerm) ||
        hotel.address?.toLowerCase().includes(searchTerm) ||
        hotel.location?.toLowerCase().includes(searchTerm)
      );
    }

    // 가격 필터
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      filtered = filtered.filter(hotel => {
        const price = hotel.basePrice || hotel.price || 0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // 평점 필터
    if (filters.rating && filters.rating.length > 0) {
      const minRating = Math.min(...filters.rating);
      filtered = filtered.filter(hotel => {
        const rating = hotel.rating || hotel.ratingAverage || 0;
        return rating >= minRating;
      });
    }

    // 무료 서비스 필터
    if (filters.freebies && filters.freebies.length > 0) {
      filtered = filtered.filter(hotel => {
        const amenities = hotel.amenities || [];
        return filters.freebies.some(freebie => {
          const freebieMap = {
            "조식포함": "조식",
            "무료주차": "주차장",
            "WIFI": "와이파이",
            "공항셔틀버스": "셔틀버스",
            "무료취소": "무료취소"
          };
          const searchTerm = freebieMap[freebie] || freebie;
          return amenities.some(amenity => 
            amenity.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      });
    }

    // 편의시설 필터
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(hotel => {
        const hotelAmenities = hotel.amenities || [];
        return filters.amenities.every(amenity => {
          const amenityMap = {
            "24시 프론트데스크": "24시간",
            "에어컨": "에어컨",
            "피트니스": "피트니스",
            "수영장": "수영장"
          };
          const searchTerm = amenityMap[amenity] || amenity;
          return hotelAmenities.some(hotelAmenity => 
            hotelAmenity.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      });
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.basePrice || a.price || 0) - (b.basePrice || b.price || 0);
        case "price-high":
          return (b.basePrice || b.price || 0) - (a.basePrice || a.price || 0);
        case "rating":
          return (b.rating || b.ratingAverage || 0) - (a.rating || a.ratingAverage || 0);
        case "recommended":
        default:
          // 추천순: 평점 높은 순, 리뷰 많은 순
          const ratingDiff = (b.rating || b.ratingAverage || 0) - (a.rating || a.ratingAverage || 0);
          if (ratingDiff !== 0) return ratingDiff;
          return (b.reviewCount || b.reviews || 0) - (a.reviewCount || a.reviews || 0);
      }
    });

    return sorted;
  }, [allHotels, activeTab, filters, sortBy]);

  if (loading) {
    return <div className="search-page loading">호텔 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="search-page error">{error}</div>;
  }

  return (
    <div className="search-page">
      {/* 탭 */}
      <div className="tabs-wrapper">
        <HotelTypesTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* 호텔 리스트 섹션 */}
      <div className="hotel-results">
        <HotelResultsHeader
          total={filteredAndSortedHotels.length}
          showing={filteredAndSortedHotels.length}
          onSortChange={handleSortChange}
        />
        <HotelListCards hotels={filteredAndSortedHotels} />
      </div>
    </div>
  );
};

export default SearchPage;

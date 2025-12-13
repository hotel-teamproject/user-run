import React, { useState, useEffect } from "react";
import { getHotels } from "../../api/hotelClient";
import "../../styles/components/search/HotelTypesTabs.scss";

const HotelTypesTabs = ({ activeTab = "all", onTabChange }) => {
 const [counts, setCounts] = useState({
  all: 0,
  hotels: 0,
  motels: 0,
  resorts: 0,
 });

 useEffect(() => {
  const fetchCounts = async () => {
   try {
    const allHotels = await getHotels();
    
    const hotelCount = allHotels.filter(hotel => 
     hotel.name && hotel.name.includes("호텔")
    ).length;
    
    const motelCount = allHotels.filter(hotel => 
     hotel.name && hotel.name.includes("모텔")
    ).length;
    
    const resortCount = allHotels.filter(hotel => 
     hotel.name && hotel.name.includes("리조트")
    ).length;

    setCounts({
     all: allHotels.length,
     hotels: hotelCount,
     motels: motelCount,
     resorts: resortCount,
    });
   } catch (error) {
    console.error("Failed to fetch hotel counts:", error);
   }
  };

  fetchCounts();
 }, []);

 const tabs = [
  { id: "all", label: "전체", count: counts.all },
  { id: "hotels", label: "호텔", count: counts.hotels },
  { id: "motels", label: "모텔", count: counts.motels },
  { id: "resorts", label: "리조트", count: counts.resorts },
 ];

 const handleTabClick = (tabId) => {
  if (onTabChange) {
   onTabChange(tabId);
  }
 };

 return (
  <div className="hotel-types-tabs">
   {tabs.map((tab) => (
    <button
     key={tab.id}
     className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
     onClick={() => handleTabClick(tab.id)}
    >
     <span className="tab-label">{tab.label}</span>
     <span className="tab-count">{tab.count}개</span>
    </button>
   ))}
  </div>
 );
};

export default HotelTypesTabs;

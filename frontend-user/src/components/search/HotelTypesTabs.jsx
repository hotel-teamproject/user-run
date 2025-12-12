import React, { useState } from "react";
import "../../styles/components/search/HotelTypesTabs.scss";

const HotelTypesTabs = () => {
 const [activeTab, setActiveTab] = useState("hotels");

 const tabs = [
  { id: "hotels", label: "Hotels", count: 257 },
  { id: "motels", label: "Motels", count: 51 },
  { id: "resorts", label: "Resorts", count: 72 },
 ];

 return (
  <div className="hotel-types-tabs">
   {tabs.map((tab) => (
    <button
     key={tab.id}
     className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
     onClick={() => setActiveTab(tab.id)}
    >
     <span className="tab-label">{tab.label}</span>
     <span className="tab-count">{tab.count} places</span>
    </button>
   ))}
  </div>
 );
};

export default HotelTypesTabs;

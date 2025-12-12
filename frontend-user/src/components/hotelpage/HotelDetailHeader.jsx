import React, { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaHeart, FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/components/hotelpage/HotelDetailHeader.scss";

const HotelDetailHeader = ({ hotel }) => {
 // console.log("HotelDetailHeader props:", hotel);

 const navigate = useNavigate();
 const [dateRange, setDateRange] = useState([null, null]);
 const [startDate, endDate] = dateRange;
 const [guests, setGuests] = useState(2);
 if (!hotel) {
  return <div className="hotel-detail-header loading">Loading...</div>;
 }

 const {
  name = "호텔명 없음",
  ratingAverage = 0,
  ratingCount = 0,
  city = "",
  address = "주소 정보 없음",
  location = "",
  basePrice = 0,
  images = [],
 } = hotel;

 // 별점을 별 아이콘으로 표시
 const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);

  for (let i = 0; i < 5; i++) {
   stars.push(
    <FaStar key={i} className={i < fullStars ? "star-filled" : "star-empty"} />
   );
  }
  return stars;
 };

 const handleFavorite = () => {
  console.log("Add to favorites");
 };

 const handleShare = () => {
  console.log("Share hotel");
 };

 const handleBookNow = () => {
  const params = new URLSearchParams();
  if (startDate) params.append("checkIn", startDate.toISOString());
  if (endDate) params.append("checkOut", endDate.toISOString());
  params.append("guests", guests);

  navigate(`/booking/${hotel._id || hotel.id}?${params.toString()}`);
 };

 return (
  <div className="hotel-detail-header">
   <div className="header-top">
    <div className="breadcrumb">
     <span>{city || "Location"}</span> &gt; <span>{location || "Area"}</span>{" "}
     &gt; <span>{name}</span>
    </div>
    <div className="header-actions">
     <button className="icon-btn" onClick={handleFavorite}>
      <FaHeart />
     </button>
     <button className="icon-btn" onClick={handleShare}>
      <FaShare />
     </button>
     <span className="user-name">Tomhoon</span>
    </div>
   </div>

   <div className="hotel-info">
    <div className="hotel-title-section">
     <h1 className="hotel-name">{name}</h1>
     <div className="rating-section">
      <div className="stars">{renderStars(ratingAverage)}</div>
      <span className="rating-text">{ratingAverage} Star Hotel</span>
     </div>
     <div className="location-section">
      <FaMapMarkerAlt className="location-icon" />
      <span className="address">{address}</span>
     </div>
     <div className="review-section">
      <span className="review-score">{ratingAverage}</span>
      <span className="review-text">Very Good</span>
      <span className="review-count">{ratingCount} reviews</span>
     </div>
    </div>
    <div className="price-section">
     <div className="price-wrapper">
      <span className="price">₩{((hotel.basePrice || hotel.price || 0)).toLocaleString()}</span>
      <span className="price-unit">/night</span>
     </div>
     <button className="btn-book-now" onClick={handleBookNow}>
      Book now
     </button>
    </div>
   </div>

   <div className="hotel-images">
    <div className="main-image">
     <img
      src={
       images[0] ||
       "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
      }
      alt={name}
     />
    </div>
    <div className="sub-images">
     {images.slice(1, 5).map((img, index) => (
      <div key={index} className="sub-image">
       <img src={img} alt={`${name} ${index + 2}`} />
       {index === 3 && images.length > 5 && (
        <div className="view-all-overlay">
         <span>View all photos</span>
        </div>
       )}
      </div>
     ))}
    </div>
   </div>
  </div>
 );
};

export default HotelDetailHeader;

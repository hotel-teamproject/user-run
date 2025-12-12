import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Amenities from "../../components/hotelpage/Amenities";
import AvailableRooms from "../../components/hotelpage/AvailableRooms";
import HotelDetailHeader from "../../components/hotelpage/HotelDetailHeader";
import HotelGallery from "../../components/hotelpage/HotelGallery";
import HotelMap from "../../components/hotelpage/HotelMap";
import HotelOverview from "../../components/hotelpage/HotelOverview";
import HotelReviews from "../../components/hotelpage/HotelReviews";
import "../../styles/pages/hotelpage/HotelDetailPage.scss";

import { getHotelDetail, getHotelRooms } from "../../api/hotelClient";
import { getReviews } from "../../api/reviewClient";

const HotelDetailPage = () => {
  const { hotelId } = useParams(); // URL에서 호텔 ID 추출
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchHotelData = async () => {
      if (!hotelId) {
        setError("호텔 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 병렬로 호텔 정보, 객실 목록, 리뷰 목록 가져오기
        const [hotelData, roomsData, reviewsData] = await Promise.all([
          getHotelDetail(hotelId),
          getHotelRooms(hotelId),
          getReviews(hotelId).catch(() => []) // 리뷰가 없어도 에러가 나지 않도록
        ]);

        setHotel(hotelData);
        setRooms(roomsData || []);
        setReviews(reviewsData || []);
      } catch (err) {
        console.error("Failed to load hotel data:", err);
        setError("호텔 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [hotelId]);

  if (loading) {
    return (
      <div className="hotel-detail-container inner loading">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="hotel-detail-container inner error">Error: {error}</div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-detail-container inner">
        호텔을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="hotel-detail-container inner">
      <HotelDetailHeader hotel={hotel} />
      <HotelGallery images={hotel.images} hotelName={hotel.name} />
      <HotelOverview
        description={hotel.description}
        rating={hotel.ratingAverage}
        reviewCount={hotel.ratingCount}
        tags={hotel.tags}
      />
      <Amenities amenities={hotel.amenities} />
      <AvailableRooms rooms={rooms} />
      <HotelMap address={hotel.address} location={hotel.location} />
      <HotelReviews
        hotelId={hotelId}
        rating={hotel.ratingAverage}
        reviewCount={hotel.ratingCount}
        reviews={reviews}
      />
    </div>
  );
};

export default HotelDetailPage;

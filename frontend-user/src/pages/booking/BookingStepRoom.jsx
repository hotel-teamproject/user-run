import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getHotelRooms, getHotelDetail } from "../../api/hotelClient";
import "../../styles/pages/booking/BookingStep.scss";

const BookingStepRoom = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const location = useLocation();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const qs = new URLSearchParams(location.search);
  const checkIn = qs.get("checkIn");
  const checkOut = qs.get("checkOut");
  const guests = qs.get("guests");

  useEffect(() => {
    const fetchData = async () => {
      if (!hotelId || !checkIn || !checkOut) {
        navigate(`/booking/${hotelId}`);
        return;
      }

      try {
        setLoading(true);
        const [hotelData, roomsData] = await Promise.all([
          getHotelDetail(hotelId),
          getHotelRooms(hotelId)
        ]);
        setHotel(hotelData);
        setRooms(roomsData || []);
      } catch (err) {
        console.error("Failed to load data:", err);
        alert("정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId, checkIn, checkOut, navigate]);

  const handleNext = () => {
    if (!selectedRoom) {
      alert("객실을 선택해주세요.");
      return;
    }

    const params = new URLSearchParams();
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
    params.set("guests", guests);
    params.set("roomId", selectedRoom._id || selectedRoom.id);
    params.set("roomPrice", (selectedRoom.price || 0).toString());
    params.set("roomName", selectedRoom.name || "");
    params.set("roomType", selectedRoom.type || "");

    navigate(`/booking/${hotelId}/extras?${params.toString()}`);
  };

  const handleBack = () => {
    navigate(`/booking/${hotelId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  if (loading) {
    return (
      <div className="booking-page inner">
        <div className="loading">정보를 불러오는 중...</div>
      </div>
    );
  }

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const nights = calculateNights();

  return (
    <div className="booking-page inner">
      <h2 className="booking-title">객실 선택</h2>

      <div className="booking-grid">
        <div className="booking-left">
          <div className="rooms-list">
            {rooms.length === 0 ? (
              <div className="empty-state">
                <p>예약 가능한 객실이 없습니다.</p>
              </div>
            ) : (
              rooms.map((room) => {
                // ID를 문자열로 변환하여 안전하게 비교
                const roomId = String(room._id || room.id || '');
                const selectedRoomId = selectedRoom ? String(selectedRoom._id || selectedRoom.id || '') : '';
                const isSelected = selectedRoomId && roomId === selectedRoomId;
                const totalPrice = room.price * nights;

                return (
                  <div
                    key={roomId || `room-${Math.random()}`}
                    className={`room-card ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      console.log("Room selected:", room);
                      setSelectedRoom(room);
                    }}
                  >
                    <div className="room-image">
                      <img
                        src={room.images?.[0] || "/images/hotel.jpg"}
                        alt={room.name}
                        onError={(e) => {
                          e.target.src = "/images/hotel.jpg";
                        }}
                      />
                    </div>
                    <div className="room-info">
                      <h3 className="room-name">{room.name}</h3>
                      <p className="room-type">{room.type}</p>
                      <div className="room-details">
                        <span>최대 {room.maxGuests}명</span>
                        <span>•</span>
                        <span>{room.size || "-"}㎡</span>
                      </div>
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="room-amenities">
                          {room.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="amenity-tag">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="room-price">
                      <div className="price-per-night">₩{room.price.toLocaleString()}/박</div>
                      <div className="price-total">
                        총 ₩{totalPrice.toLocaleString()} ({nights}박)
                      </div>
                      <button
                        className={`select-room-btn ${isSelected ? "selected" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Button clicked for room:", room);
                          setSelectedRoom(room);
                        }}
                      >
                        {isSelected ? "선택됨" : "선택"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="booking-buttons">
            <button className="btn-secondary" onClick={handleBack}>
              이전
            </button>
            <button className="booking-btn-primary" onClick={handleNext} disabled={!selectedRoom}>
              다음 단계
            </button>
          </div>
        </div>

        <aside className="booking-right">
          <div className="hotel-summary">
            <div className="hotel-header">
              <div className="hotel-image">
                <img
                  src={hotel?.images?.[0] || "/images/hotel.jpg"}
                  alt={hotel?.name}
                />
              </div>
              <div className="hotel-info">
                <h3>{hotel?.name}</h3>
                <p className="hotel-location">
                  {hotel?.city} • {hotel?.address}
                </p>
              </div>
            </div>

            <div className="booking-details">
              <div className="detail-row">
                <span>체크인</span>
                <span>{new Date(checkIn).toLocaleDateString("ko-KR")}</span>
              </div>
              <div className="detail-row">
                <span>체크아웃</span>
                <span>{new Date(checkOut).toLocaleDateString("ko-KR")}</span>
              </div>
              <div className="detail-row">
                <span>숙박</span>
                <span>{nights}박</span>
              </div>
              <div className="detail-row">
                <span>인원</span>
                <span>{guests}명</span>
              </div>
            </div>

            {selectedRoom && (
              <div className="selected-room-summary">
                <h4>선택한 객실</h4>
                <p>{selectedRoom.name}</p>
                <div className="room-price-summary">
                  <span>₩{selectedRoom.price.toLocaleString()} × {nights}박</span>
                  <span className="total">₩{(selectedRoom.price * nights).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingStepRoom;

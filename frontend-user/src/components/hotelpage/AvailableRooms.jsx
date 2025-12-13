import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/hotelpage/AvailableRooms.scss";

const AvailableRooms = ({ rooms = [], hotelId }) => {
  const navigate = useNavigate();
  // 침대 타입을 한글로 변환
  const getBedTypeKorean = (bedType) => {
    const bedTypeMap = {
      single: "싱글",
      double: "더블",
      queen: "퀸",
      king: "킹",
      twin: "트윈"
    };
    return bedTypeMap[bedType] || bedType;
  };

  if (!rooms || rooms.length === 0) {
    return (
      <div className="available-rooms">
        <h3>예약 가능한 객실</h3>
        <p>현재 예약 가능한 객실이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="available-rooms">
      <h3>예약 가능한 객실</h3>
      {rooms.map((room) => {
        const roomId = room.id || room._id;
        const roomPrice = room.price || 0;
        const roomImages = room.images || [];
        const bedType = room.bedType || "";
        const maxGuests = room.maxGuests || 0;
        
        return (
          <div key={roomId} className="room-card">
            <div className="left">
              <div className="img-wrap">
                <img src={roomImages[0] || "/images/hotel-placeholder.png"} alt={room.name || "객실"} />
              </div>
              <div className="room-info">
                <h3 className="room-name">{room.name || "객실"}</h3>
                <div className="room-details">
                  {bedType && (
                    <span className="room-detail-item">
                      침대: {getBedTypeKorean(bedType)}
                    </span>
                  )}
                  {maxGuests > 0 && (
                    <span className="room-detail-item">
                      최대 인원: {maxGuests}명
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="right">
              <p className="room-price">{roomPrice.toLocaleString()}원</p>
              <button 
                className="btn btn--primary"
                onClick={() => {
                  if (hotelId) {
                    navigate(`/booking/${hotelId}`);
                  } else {
                    alert("호텔 정보를 불러올 수 없습니다.");
                  }
                }}
              >
                예약하기
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AvailableRooms;

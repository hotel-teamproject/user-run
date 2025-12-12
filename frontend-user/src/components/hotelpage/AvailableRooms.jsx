import React from "react";
import "../../styles/components/hotelpage/AvailableRooms.scss";


const AvailableRooms = ({ rooms = [] }) => {
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
     
     return (
      <div key={roomId} className="room-card">
       <div className="left">
        <div className="img-wrap">
         <img src={roomImages[0] || "/images/hotel-placeholder.png"} alt={room.name || "Room"} />
        </div>
        <h3 className="room-name">{room.name || "객실"}</h3>
        <p className="room-type">{room.type || ""}</p>
       </div>
       <div className="right">
        <p className="room-price">{roomPrice.toLocaleString()}원</p>
        <button className="btn btn--primary">예약하기</button>
       </div>
      </div>
     );
   })}
  </div>
 );
};

export default AvailableRooms;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getHotelDetail } from "../../api/hotelClient";
import "../../styles/pages/booking/BookingStep.scss";

const BookingStepExtras = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const location = useLocation();
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({
    breakfast: false,
    pickup: false,
    lateCheckout: false,
    extraBed: false,
    premiumWifi: false,
  });
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(true);

  // 옵션별 가격 (실제로는 호텔/객실별로 다를 수 있음)
  const extraPrices = {
    breakfast: 20000, // 조식 1인당 가격
    pickup: 50000, // 픽업 서비스 (1회)
    lateCheckout: 30000, // 레이트 체크아웃
    extraBed: 50000, // 추가 베드 (1개)
    premiumWifi: 10000, // 프리미엄 와이파이 (숙박 기간당)
  };

  const qs = new URLSearchParams(location.search);
  const checkIn = qs.get("checkIn");
  const checkOut = qs.get("checkOut");
  const guests = qs.get("guests");
  const roomId = qs.get("roomId");
  const roomPriceFromUrl = parseFloat(qs.get("roomPrice") || "0");
  const roomNameFromUrl = qs.get("roomName") || "";
  const roomTypeFromUrl = qs.get("roomType") || "";

  useEffect(() => {
    const fetchData = async () => {
      if (!hotelId || !checkIn || !checkOut || !roomId) {
        navigate(`/booking/${hotelId}/room`);
        return;
      }

      try {
        setLoading(true);
        const hotelData = await getHotelDetail(hotelId);
        setHotel(hotelData);

        // URL에서 받은 가격 정보가 있으면 우선 사용, 없으면 API에서 가져온 데이터 사용
        let selectedRoom = null;
        if (hotelData.rooms && Array.isArray(hotelData.rooms)) {
          selectedRoom = hotelData.rooms.find(
            (r) => r._id === roomId || r.id === roomId
          );
        }

        // URL에서 받은 정보를 우선 사용하여 room 객체 구성
        if (roomPriceFromUrl > 0) {
          setRoom({
            _id: roomId,
            id: roomId,
            name: roomNameFromUrl || selectedRoom?.name || "선택한 객실",
            type: roomTypeFromUrl || selectedRoom?.type || "",
            price: roomPriceFromUrl,
            ...selectedRoom, // API에서 가져온 추가 정보도 병합
          });
        } else if (selectedRoom) {
          setRoom(selectedRoom);
        } else {
          // fallback: 기본 room 객체 생성
          setRoom({
            _id: roomId,
            id: roomId,
            name: roomNameFromUrl || "선택한 객실",
            type: roomTypeFromUrl || "",
            price: 0,
          });
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        alert("정보를 불러오는데 실패했습니다.");
        // 에러 발생 시에도 URL 파라미터로 받은 정보 사용
        if (roomPriceFromUrl > 0) {
          setRoom({
            _id: roomId,
            id: roomId,
            name: roomNameFromUrl || "선택한 객실",
            type: roomTypeFromUrl || "",
            price: roomPriceFromUrl,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId, checkIn, checkOut, roomId, roomPriceFromUrl, roomNameFromUrl, roomTypeFromUrl, navigate]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const nights = calculateNights();
  const guestsNum = parseInt(guests) || 2;

  // 선택된 옵션들의 총 가격 계산
  const calculateExtrasPrice = () => {
    let total = 0;
    if (selectedExtras.breakfast) {
      total += extraPrices.breakfast * guestsNum * nights;
    }
    if (selectedExtras.pickup) {
      total += extraPrices.pickup;
    }
    if (selectedExtras.lateCheckout) {
      total += extraPrices.lateCheckout;
    }
    if (selectedExtras.extraBed) {
      total += extraPrices.extraBed * nights;
    }
    if (selectedExtras.premiumWifi) {
      total += extraPrices.premiumWifi * nights;
    }
    return total;
  };

  const extrasPrice = calculateExtrasPrice();
  const basePrice = room?.price || 0;
  const subtotal = basePrice * nights;
  const totalPrice = subtotal + extrasPrice;

  const handleExtraToggle = (extraName) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [extraName]: !prev[extraName],
    }));
  };

  const handleNext = () => {
    const params = new URLSearchParams();
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
    params.set("guests", guests);
    params.set("roomId", roomId);
    params.set("roomPrice", (room?.price || roomPriceFromUrl || 0).toString());
    params.set("roomName", room?.name || roomNameFromUrl || "");
    params.set("roomType", room?.type || roomTypeFromUrl || "");
    params.set("extrasPrice", extrasPrice.toString());
    
    // 선택된 옵션들을 JSON으로 전달
    params.set("extras", JSON.stringify(selectedExtras));
    
    if (specialRequests) {
      params.set("specialRequests", specialRequests);
    }

    navigate(`/booking/${hotelId}/payment?${params.toString()}`);
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
    params.set("guests", guests);
    navigate(`/booking/${hotelId}/room?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="booking-page inner">
        <div className="loading">정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="booking-page inner">
      <h2 className="booking-title">예약 - 옵션 선택</h2>

      <div className="booking-grid">
        <div className="booking-left">
          <div className="extras-section">
            <h3>추가 옵션 선택</h3>
            <p className="section-description">원하시는 서비스를 선택해주세요</p>
            
            <div className="extras-list">
              {/* 조식 옵션 */}
              <div className={`extra-item ${selectedExtras.breakfast ? "selected" : ""}`}>
                <div className="extra-info">
                  <label className="extra-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedExtras.breakfast}
                      onChange={() => handleExtraToggle("breakfast")}
                    />
                    <span className="extra-name">조식 서비스</span>
                  </label>
                  <p className="extra-description">
                    뷔페 조식 제공 (1인당 ₩{extraPrices.breakfast.toLocaleString()} × {nights}박)
                  </p>
                </div>
                <div className="extra-price">
                  ₩{(extraPrices.breakfast * guestsNum * nights).toLocaleString()}
                </div>
              </div>

              {/* 픽업 서비스 */}
              <div className={`extra-item ${selectedExtras.pickup ? "selected" : ""}`}>
                <div className="extra-info">
                  <label className="extra-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedExtras.pickup}
                      onChange={() => handleExtraToggle("pickup")}
                    />
                    <span className="extra-name">공항/역 픽업 서비스</span>
                  </label>
                  <p className="extra-description">
                    공항 또는 역까지 픽업 서비스 제공
                  </p>
                </div>
                <div className="extra-price">
                  ₩{extraPrices.pickup.toLocaleString()}
                </div>
              </div>

              {/* 레이트 체크아웃 */}
              <div className={`extra-item ${selectedExtras.lateCheckout ? "selected" : ""}`}>
                <div className="extra-info">
                  <label className="extra-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedExtras.lateCheckout}
                      onChange={() => handleExtraToggle("lateCheckout")}
                    />
                    <span className="extra-name">레이트 체크아웃</span>
                  </label>
                  <p className="extra-description">
                    오후 2시까지 체크아웃 가능
                  </p>
                </div>
                <div className="extra-price">
                  ₩{extraPrices.lateCheckout.toLocaleString()}
                </div>
              </div>

              {/* 추가 베드 */}
              <div className={`extra-item ${selectedExtras.extraBed ? "selected" : ""}`}>
                <div className="extra-info">
                  <label className="extra-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedExtras.extraBed}
                      onChange={() => handleExtraToggle("extraBed")}
                    />
                    <span className="extra-name">추가 베드</span>
                  </label>
                  <p className="extra-description">
                    추가 침대 1개 제공 (숙박 기간당)
                  </p>
                </div>
                <div className="extra-price">
                  ₩{(extraPrices.extraBed * nights).toLocaleString()}
                </div>
              </div>

              {/* 프리미엄 와이파이 */}
              <div className={`extra-item ${selectedExtras.premiumWifi ? "selected" : ""}`}>
                <div className="extra-info">
                  <label className="extra-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedExtras.premiumWifi}
                      onChange={() => handleExtraToggle("premiumWifi")}
                    />
                    <span className="extra-name">프리미엄 와이파이</span>
                  </label>
                  <p className="extra-description">
                    고속 인터넷 제공 (숙박 기간당)
                  </p>
                </div>
                <div className="extra-price">
                  ₩{(extraPrices.premiumWifi * nights).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="extras-section">
            <h3>특별 요청사항</h3>
            <textarea
              className="special-requests"
              placeholder="호텔에 전달할 특별 요청사항을 입력해주세요 (선택사항)"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={4}
              maxLength={500}
            />
          </div>

          <div className="booking-buttons">
            <button className="btn-secondary" onClick={handleBack}>
              이전
            </button>
            <button className="btn-primary" onClick={handleNext}>
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

            {room && (
              <div className="price-summary">
                <div className="price-row">
                  <span>객실 요금</span>
                  <span>₩{subtotal.toLocaleString()}</span>
                </div>
                {extrasPrice > 0 && (
                  <div className="price-row extras">
                    <span>추가 옵션</span>
                    <span>+₩{extrasPrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span>총 금액</span>
                  <span>₩{totalPrice.toLocaleString()}</span>
                </div>
                <p className="price-note">쿠폰 할인은 결제 단계에서 적용됩니다</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingStepExtras;

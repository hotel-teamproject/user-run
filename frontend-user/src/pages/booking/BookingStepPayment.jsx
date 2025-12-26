import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getHotelDetail } from "../../api/hotelClient";
import { createReservation } from "../../api/reservationClient";
import { getUserCards } from "../../api/cardClient";
import { getUserCoupons, applyCoupon } from "../../api/couponClient";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/pages/booking/BookingStep.scss";

const BookingStepPayment = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const location = useLocation();
  const { isAuthed } = useContext(AuthContext);
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // 비회원 정보
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const qs = new URLSearchParams(location.search);
  const checkIn = qs.get("checkIn");
  const checkOut = qs.get("checkOut");
  const guests = qs.get("guests");
  const roomId = qs.get("roomId");
  const roomPriceFromUrl = parseFloat(qs.get("roomPrice") || "0");
  const roomNameFromUrl = qs.get("roomName") || "";
  const roomTypeFromUrl = qs.get("roomType") || "";
  const extrasPrice = parseFloat(qs.get("extrasPrice") || "0");
  const extrasJson = qs.get("extras") || "{}";
  const selectedExtras = JSON.parse(extrasJson);
  const specialRequests = qs.get("specialRequests") || "";

  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [useNewCard, setUseNewCard] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [showCoupons, setShowCoupons] = useState(false);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!hotelId || !checkIn || !checkOut || !roomId) {
        navigate(`/booking/${hotelId}/extras`);
        return;
      }

      try {
        setLoading(true);
        const hotelData = await getHotelDetail(hotelId);
        setHotel(hotelData);

        // URL에서 받은 가격 정보가 있으면 우선 사용
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

        // 사용 가능한 쿠폰 조회 (회원만)
        if (isAuthed) {
          try {
            const basePrice = roomPriceFromUrl > 0 ? roomPriceFromUrl : (selectedRoom?.price || 0);
            const nights = calculateNights();
            const totalAmount = (basePrice * nights) + extrasPrice;
            const availableCoupons = await getUserCoupons();
            setCoupons(availableCoupons.available || []);
          } catch (err) {
            console.error("쿠폰 목록 조회 실패:", err);
            setCoupons([]);
          }
        } else {
          setCoupons([]);
        }

        // 저장된 카드 목록 조회 (회원만)
        if (isAuthed) {
          try {
            const cards = await getUserCards();
            setSavedCards(cards || []);
            // 기본 카드가 있으면 자동 선택
            if (cards && cards.length > 0) {
              const defaultCard = cards.find(c => c.isDefault);
              if (defaultCard) {
                setSelectedCardId(defaultCard._id);
                setUseNewCard(false);
              } else {
                // 기본 카드가 없으면 첫 번째 카드 선택
                setSelectedCardId(cards[0]._id);
                setUseNewCard(false);
              }
            } else {
              // 저장된 카드가 없으면 새 카드 입력 모드
              setUseNewCard(true);
              setSelectedCardId(null);
            }
          } catch (err) {
            console.error("카드 목록 조회 실패:", err);
            // 카드 조회 실패 시 새 카드 입력으로 전환
            setUseNewCard(true);
            setSelectedCardId(null);
          }
        } else {
          // 비회원은 항상 새 카드 입력
          setSavedCards([]);
          setUseNewCard(true);
          setSelectedCardId(null);
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
  }, [hotelId, checkIn, checkOut, roomId, roomPriceFromUrl, roomNameFromUrl, roomTypeFromUrl, extrasPrice, navigate]);

  const nights = calculateNights();
  const basePrice = room?.price || roomPriceFromUrl || 0;
  const subtotal = basePrice * nights;
  const totalBeforeDiscount = subtotal + extrasPrice;
  const finalPrice = totalBeforeDiscount - discount;

  const handleCouponSelect = async (coupon) => {
    if (selectedCoupon && selectedCoupon._id === coupon._id) {
      setSelectedCoupon(null);
      setDiscount(0);
      return;
    }

    try {
      const result = await applyCoupon(coupon.code, totalBeforeDiscount);
      
      // 백엔드 응답: { coupon, discount, finalAmount }
      if (result && result.discount !== undefined) {
        setSelectedCoupon(coupon);
        setDiscount(result.discount);
      } else {
        alert("쿠폰 적용에 실패했습니다.");
      }
    } catch (err) {
      console.error("Failed to apply coupon:", err);
      const errorMessage = err.response?.data?.message || err.message || "쿠폰 적용에 실패했습니다.";
      alert(errorMessage);
    }
  };

  const handleKakaoPay = async () => {
    // 비회원인 경우 정보 확인
    if (!isAuthed) {
      if (!guestName || !guestEmail || !guestPhone) {
        alert("비회원 예약을 위해 이름, 이메일, 전화번호를 모두 입력해주세요.");
        return;
      }
      
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        alert("올바른 이메일 형식을 입력해주세요.");
        return;
      }
    }

    try {
      setProcessing(true);

      // 먼저 예약 생성 (결제 대기 상태)
      const reservationData = {
        hotelId,
        roomId,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guests: parseInt(guests),
        specialRequests,
        extras: selectedExtras,
        extrasPrice,
        couponCode: selectedCoupon?.code,
        discount,
        totalPrice: finalPrice,
        paymentMethod: "kakao",
      };

      // 비회원인 경우 비회원 정보 추가
      if (!isAuthed) {
        reservationData.guestName = guestName;
        reservationData.guestEmail = guestEmail;
        reservationData.guestPhone = guestPhone;
      }

      const response = await createReservation(reservationData);

      if (response.resultCode === "SUCCESS") {
        const reservationId = response.data._id;
        
        // PortOne을 사용한 카카오페이 결제
        if (window.PortOne) {
          const portone = window.PortOne();
          
          portone.requestPayment({
            storeId: import.meta.env.VITE_PORTONE_STORE_ID || "store-1234567890", // 환경 변수로 관리 권장
            channelKey: import.meta.env.VITE_PORTONE_CHANNEL_KEY || "channel-key-1234567890", // 환경 변수로 관리 권장
            paymentId: `kakao-${reservationId}-${Date.now()}`,
            orderName: `${hotel?.name || "호텔"} 예약`,
            totalAmount: finalPrice,
            currency: "KRW",
            customData: {
              reservationId,
              hotelId,
            },
            payMethod: "카카오페이",
            customer: {
              fullName: isAuthed ? (guestName || "회원") : guestName,
              email: isAuthed ? (guestEmail || "") : guestEmail,
              phoneNumber: isAuthed ? (guestPhone || "") : guestPhone,
            },
            noticeUrl: `${window.location.origin}/api/payments/kakao/notice`,
            confirmUrl: `${window.location.origin}/api/payments/kakao/confirm`,
          })
          .then((result) => {
            // 결제 성공
            if (result.status === "PAID") {
              navigate(`/booking/${hotelId}/complete?reservationId=${reservationId}&paymentId=${result.paymentId}`);
            } else {
              alert("결제가 완료되지 않았습니다.");
              setProcessing(false);
            }
          })
          .catch((error) => {
            console.error("카카오페이 결제 실패:", error);
            alert(error.message || "결제 처리 중 오류가 발생했습니다.");
            setProcessing(false);
          });
        } else {
          // PortOne SDK가 로드되지 않은 경우 시뮬레이션 모드
          alert("카카오페이 결제는 PortOne 연동이 필요합니다. 현재는 시뮬레이션 모드로 진행됩니다.");
          navigate(`/booking/${hotelId}/complete?reservationId=${reservationId}`);
        }
      } else {
        alert(response.message || "예약에 실패했습니다.");
        setProcessing(false);
      }
    } catch (err) {
      console.error("Failed to process kakao pay:", err);
      alert(err.response?.data?.message || "결제 처리 중 오류가 발생했습니다.");
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    // 카카오페이는 별도 처리
    if (paymentMethod === "kakao") {
      await handleKakaoPay();
      return;
    }

    // 비회원인 경우 정보 확인
    if (!isAuthed) {
      if (!guestName || !guestEmail || !guestPhone) {
        alert("비회원 예약을 위해 이름, 이메일, 전화번호를 모두 입력해주세요.");
        return;
      }
      
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        alert("올바른 이메일 형식을 입력해주세요.");
        return;
      }
    }
    
    // 간단한 유효성 검사
    if (paymentMethod === "card") {
      // 저장된 카드를 사용하지 않고 새 카드를 사용하는 경우
      if (useNewCard) {
        if (!cardNumber || !cardName || !cardExpiry || !cardCVC) {
          alert("카드 정보를 모두 입력해주세요.");
          return;
        }
      } else {
        // 저장된 카드를 사용하는 경우
        if (!selectedCardId) {
          alert("카드를 선택해주세요.");
          return;
        }
      }
    }

    try {
      setProcessing(true);

      // 예약 생성
      const reservationData = {
        hotelId,
        roomId,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guests: parseInt(guests),
        specialRequests,
        extras: selectedExtras,
        extrasPrice,
        couponCode: selectedCoupon?.code,
        discount,
        totalPrice: finalPrice,
        // 카드 정보 추가
        cardId: !useNewCard ? selectedCardId : null,
        cardInfo: useNewCard ? {
          cardNumber: cardNumber.replace(/\s/g, ''),
          expDate: cardExpiry,
          cvc: cardCVC,
          nameOnCard: cardName,
        } : null,
      };

      // 비회원인 경우 비회원 정보 추가
      if (!isAuthed) {
        reservationData.guestName = guestName;
        reservationData.guestEmail = guestEmail;
        reservationData.guestPhone = guestPhone;
      }

      const response = await createReservation(reservationData);

      if (response.resultCode === "SUCCESS") {
        const reservationId = response.data._id;
        navigate(`/booking/${hotelId}/complete?reservationId=${reservationId}`);
      } else {
        alert(response.message || "예약에 실패했습니다.");
      }
    } catch (err) {
      console.error("Failed to create reservation:", err);
      alert(err.response?.data?.message || "예약 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessing(false);
    }
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
    params.set("guests", guests);
    params.set("roomId", roomId);
    params.set("roomPrice", (room?.price || roomPriceFromUrl || 0).toString());
    params.set("roomName", room?.name || roomNameFromUrl || "");
    params.set("roomType", room?.type || roomTypeFromUrl || "");
    params.set("extrasPrice", extrasPrice.toString());
    params.set("extras", extrasJson);
    if (specialRequests) {
      params.set("specialRequests", specialRequests);
    }
    navigate(`/booking/${hotelId}/extras?${params.toString()}`);
  };

  return (
    <div className="booking-page inner">
      <h2 className="booking-title">결제하기</h2>

      <div className="booking-grid">
        <div className="booking-left">
          <div className="coupon-section">
            <h3>쿠폰 적용</h3>
            <div className="coupon-dropdown">
              <div
                className="coupon-dropdown-toggle"
                onClick={() => setShowCoupons(!showCoupons)}
              >
                <span className="coupon-dropdown-text">
                  {selectedCoupon
                    ? `${selectedCoupon.name} (${selectedCoupon.type === "percent" ? `${selectedCoupon.discount}% 할인` : `₩${selectedCoupon.discount.toLocaleString()} 할인`})`
                    : coupons.length > 0
                    ? "쿠폰을 선택하세요"
                    : "사용 가능한 쿠폰이 없습니다"}
                </span>
                <span className="coupon-dropdown-arrow">
                  {showCoupons ? "▲" : "▼"}
                </span>
              </div>
              {showCoupons && coupons.length > 0 && (
                <div className="coupon-dropdown-menu">
                  <div
                    className="coupon-dropdown-option"
                    onClick={() => {
                      setSelectedCoupon(null);
                      setDiscount(0);
                      setShowCoupons(false);
                    }}
                  >
                    쿠폰 미사용
                  </div>
                  {coupons.map((coupon) => {
                    const isSelected =
                      selectedCoupon && selectedCoupon._id === coupon._id;
                    const discountText =
                      coupon.type === "percent"
                        ? `${coupon.discount}% 할인`
                        : `₩${coupon.discount.toLocaleString()} 할인`;

                    return (
                      <div
                        key={coupon._id}
                        className={`coupon-dropdown-option ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          handleCouponSelect(coupon);
                          setShowCoupons(false);
                        }}
                      >
                        <div className="coupon-option-content">
                          <div className="coupon-option-info">
                            <span className="coupon-option-name">{coupon.name}</span>
                            <span className="coupon-option-code">코드: {coupon.code}</span>
                            {coupon.minAmount > 0 && (
                              <span className="coupon-option-min">
                                최소 주문: ₩{coupon.minAmount.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <span className="coupon-option-discount">{discountText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {selectedCoupon && discount > 0 && (
              <div className="applied-coupon-info">
                <span className="applied-coupon-text">
                  {selectedCoupon.name} 적용됨 (-₩{discount.toLocaleString()})
                </span>
                <button
                  className="btn-remove-coupon-small"
                  onClick={() => {
                    setSelectedCoupon(null);
                    setDiscount(0);
                  }}
                  title="쿠폰 삭제"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* 비회원 정보 입력 섹션 */}
          {!isAuthed && (
            <div className="guest-info-section">
              <h3>예약자 정보</h3>
              <div className="form-group">
                <label>이름</label>
                <input
                  type="text"
                  placeholder="홍길동"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>이메일</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>전화번호</label>
                <input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={guestPhone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 3 && value.length <= 7) {
                      value = value.substring(0, 3) + '-' + value.substring(3);
                    } else if (value.length > 7) {
                      value = value.substring(0, 3) + '-' + value.substring(3, 7) + '-' + value.substring(7, 11);
                    }
                    setGuestPhone(value);
                  }}
                  maxLength={13}
                  required
                />
              </div>
            </div>
          )}

          <div className="payment-section">
            <h3>결제 수단</h3>
            <div className="payment-methods">
              <label className="payment-method-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>신용/체크카드</span>
              </label>
              <label className="payment-method-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>계좌이체</span>
              </label>
              <label className="payment-method-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="kakao"
                  checked={paymentMethod === "kakao"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>카카오페이</span>
              </label>
            </div>

            {paymentMethod === "card" && (
              <>
                {/* 저장된 카드 선택 */}
                {savedCards.length > 0 && (
                  <div className="saved-cards-section">
                    <h4>저장된 카드</h4>
                    <div className="saved-cards-list">
                      {savedCards.map((card) => (
                        <div
                          key={card._id}
                          className={`saved-card-item ${selectedCardId === card._id && !useNewCard ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedCardId(card._id);
                            setUseNewCard(false);
                          }}
                        >
                          <input
                            type="radio"
                            name="savedCard"
                            checked={selectedCardId === card._id && !useNewCard}
                            onChange={() => {
                              setSelectedCardId(card._id);
                              setUseNewCard(false);
                            }}
                          />
                          <div className="saved-card-info">
                            <span className="saved-card-number">{card.maskedNumber}</span>
                            <span className="saved-card-exp">{card.expDate}</span>
                            {card.isDefault && (
                              <span className="saved-card-default">기본</span>
                            )}
                          </div>
                        </div>
                      ))}
                      <div
                        className={`saved-card-item new-card-option ${useNewCard ? "selected" : ""}`}
                        onClick={() => {
                          setUseNewCard(true);
                          setSelectedCardId(null);
                        }}
                      >
                        <input
                          type="radio"
                          name="savedCard"
                          checked={useNewCard}
                          onChange={() => {
                            setUseNewCard(true);
                            setSelectedCardId(null);
                          }}
                        />
                        <span>새 카드 입력</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 새 카드 입력 폼 (저장된 카드가 없거나 새 카드 선택 시) */}
                {(useNewCard || savedCards.length === 0) && (
                  <div className="card-form">
                <div className="form-group">
                  <label>카드 번호</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                      setCardNumber(value);
                    }}
                    maxLength={19}
                    pattern="[0-9\s]+"
                  />
                </div>
                <div className="form-group">
                  <label>카드 소유자명</label>
                  <input
                    type="text"
                    placeholder="홍길동"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    maxLength={50}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>만료일</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        setCardExpiry(value);
                      }}
                      maxLength={5}
                      pattern="(0[1-9]|1[0-2])\/\d{2}"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardCVC}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setCardCVC(value);
                      }}
                      maxLength={3}
                      pattern="[0-9]{3}"
                    />
                  </div>
                </div>
                  </div>
                )}
              </>
            )}

            {paymentMethod === "bank" && (
              <div className="bank-transfer-info">
                <h4>입금 계좌 정보</h4>
                <div className="bank-account-details">
                  <div className="bank-account-row">
                    <span className="bank-account-label">은행명</span>
                    <span className="bank-account-value">국민은행</span>
                  </div>
                  <div className="bank-account-row">
                    <span className="bank-account-label">계좌번호</span>
                    <span className="bank-account-value">123-456-789012</span>
                  </div>
                  <div className="bank-account-row">
                    <span className="bank-account-label">예금주</span>
                    <span className="bank-account-value">(주)스테이북</span>
                  </div>
                  <div className="bank-account-row">
                    <span className="bank-account-label">입금 금액</span>
                    <span className="bank-account-value amount">₩{finalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bank-transfer-notice">
                  <p className="notice-title">⚠️ 입금 안내</p>
                  <ul className="notice-list">
                    <li>입금 기한: 예약 완료 후 24시간 이내</li>
                    <li>입금자명은 예약자명과 동일하게 입금해주세요</li>
                    <li>입금 확인 후 예약이 확정됩니다</li>
                    <li>입금 기한 내 미입금 시 예약이 자동 취소됩니다</li>
                  </ul>
                </div>
              </div>
            )}

            {paymentMethod === "kakao" && (
              <div className="kakao-pay-section">
                <div className="kakao-pay-info">
                  <div className="kakao-pay-logo">
                    <h4>카카오페이로 결제하기</h4>
                  </div>
                  <div className="kakao-pay-amount">
                    <span className="amount-label">결제 금액</span>
                    <span className="amount-value">₩{finalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <div className="kakao-pay-notice">
                  <p className="notice-text">
                    💡 카카오페이는 간편하게 결제할 수 있는 서비스입니다.<br/>
                    결제하기 버튼을 클릭하면 카카오페이 결제창이 열립니다.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="booking-buttons">
            <button className="btn-secondary" onClick={handleBack} disabled={processing}>
              이전
            </button>
            <button
              className="booking-btn-primary"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? "처리 중..." : `₩${finalPrice.toLocaleString()} 결제하기`}
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
                <div className="price-row">
                  <span>소계</span>
                  <span>₩{totalBeforeDiscount.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="price-row discount">
                    <span>쿠폰 할인 ({selectedCoupon?.name})</span>
                    <span>-₩{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span>최종 결제 금액</span>
                  <span>₩{finalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingStepPayment;

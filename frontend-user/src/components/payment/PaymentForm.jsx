import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCard } from "../../api/cardClient";

const PaymentForm = () => {
 const [formData, setFormData] = useState({
  cardNumber: "",
  expiryDate: "",
  cvc: "",
  nameOnCard: "",
  country: "United States",
  saveCard: false,
 });
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);
 const navigate = useNavigate();

 const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;

  let processedValue = value;

  // 카드 번호 포맷팅 (xxxx-xxxx-xxxx-xxxx)
  if (name === "cardNumber") {
   processedValue = value
    .replace(/\D/g, "")
    .replace(/(\d{4})(?=\d)/g, "$1-")
    .slice(0, 19);
  }

  // 만료일 포맷팅 (MM/YY)
  if (name === "expiryDate") {
   processedValue = value
    .replace(/\D/g, "")
    .replace(/(\d{2})(?=\d)/, "$1/")
    .slice(0, 5);
  }

  // CVC 숫자만
  if (name === "cvc") {
   processedValue = value.replace(/\D/g, "").slice(0, 3);
  }

  setFormData((prev) => ({
   ...prev,
   [name]: type === "checkbox" ? checked : processedValue,
  }));

  // 입력 시 에러 메시지 초기화
  setError("");
 };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // 기본 검증
  if (
   !formData.cardNumber ||
   !formData.expiryDate ||
   !formData.cvc ||
   !formData.nameOnCard
  ) {
   setError("모든 필수 필드를 입력해주세요.");
   return;
  }

  // 카드 번호 검증 (16자리)
  const cleanCardNumber = formData.cardNumber.replace(/\D/g, "");
  if (cleanCardNumber.length !== 16) {
   setError("올바른 카드 번호를 입력해주세요.");
   return;
  }

  // CVC 검증 (3자리)
  if (formData.cvc.length !== 3) {
   setError("올바른 CVC를 입력해주세요.");
   return;
  }

  try {
   setLoading(true);
   setError("");

   // 카드 추가 API 호출
   await addCard({
    cardNumber: cleanCardNumber,
    expDate: formData.expiryDate,
    cvc: formData.cvc,
    nameOnCard: formData.nameOnCard,
    isDefault: formData.saveCard,
   });

   // 성공 후 이전 페이지로 이동
   navigate(-1);
  } catch (err) {
   console.error("카드 추가 실패:", err);
   setError(err.response?.data?.message || "카드 추가에 실패했습니다.");
  } finally {
   setLoading(false);
  }
 };

 const handleBack = () => {
  navigate(-1);
 };

 return (
  <div className="common-form">
   <div className="payment-header">
    <button type="button" className="back-button" onClick={handleBack}>
     ← 뒤로
    </button>
    <h1 className="payment-title">결제수단 추가</h1>
    <p className="payment-subtitle">결제수단을 추가하세요</p>
   </div>

   <form className="form-content" onSubmit={handleSubmit}>
    {error && <div className="error-message">{error}</div>}

    <div className="form-group">
     <label className="form-label">카드 번호</label>
     <input
      type="text"
      name="cardNumber"
      className="form-input"
      placeholder="**** **** **** ****"
      value={formData.cardNumber}
      onChange={handleInputChange}
      required
     />
    </div>

    <div className="form-row">
     <div className="form-group">
      <label className="form-label">만료일</label>
      <input
       type="text"
       name="expiryDate"
       className="form-input"
       placeholder="MM/YY"
       value={formData.expiryDate}
       onChange={handleInputChange}
       required
      />
     </div>
     <div className="form-group">
      <label className="form-label">CVC</label>
      <input
       type="text"
       name="cvc"
       className="form-input"
       placeholder="123"
       value={formData.cvc}
       onChange={handleInputChange}
       required
      />
     </div>
    </div>

    <div className="form-group">
     <label className="form-label">카드 소유자명</label>
     <input
      type="text"
      name="nameOnCard"
      className="form-input"
      placeholder="홍길동"
      value={formData.nameOnCard}
      onChange={handleInputChange}
      required
     />
    </div>

    <div className="form-group">
     <label className="form-label">국가 또는 지역</label>
     <select
      name="country"
      className="form-input form-select"
      value={formData.country}
      onChange={handleInputChange}
     >
      <option value="United States">United States</option>
      <option value="South Korea">South Korea</option>
      <option value="Japan">Japan</option>
      <option value="China">China</option>
      <option value="United Kingdom">United Kingdom</option>
      <option value="Germany">Germany</option>
      <option value="France">France</option>
     </select>
    </div>

    <div className="form-options">
     <label className="checkbox-wrapper">
      <input
       type="checkbox"
       name="saveCard"
       checked={formData.saveCard}
       onChange={handleInputChange}
      />
      <span className="checkbox-label">결제수단 저장 안전하게 저장</span>
     </label>
    </div>

    <button 
     type="submit" 
     className="btn btn--primary btn--block payment-button"
     disabled={loading}
    >
     {loading ? "추가 중..." : "결제수단 추가"}
    </button>

     <div className="security-info">
     <p className="security-text">
      계속 진행하시면, 호텔과 파트너사로부터 프로모션 및 특별 혜택에 대한 연락을 받을 수 있습니다.
     </p>
    </div>
   </form>
  </div>
 );
};

export default PaymentForm;

import React, { useState } from "react";
import "../../styles/pages/mypage/MyPaymentPage.scss";

const MyPaymentPage = () => {
  // TODO: 추후 백엔드 연동 시 API로 대체
  const [cards] = useState([
    {
      id: 1,
      maskedNumber: "**** **** **** 4321",
      validThru: "02/27",
      brand: "VISA",
      isDefault: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    cardNumber: "",
    expDate: "",
    cvc: "",
    nameOnCard: "",
    country: "",
    saveInfo: true,
  });

  const handleAddCard = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 실제 카드 저장 API 연동
    // 일단은 모달만 닫아주기
    setIsModalOpen(false);
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h2 className="payment-title">결제수단</h2>
      </div>

      <div className="cards-grid">
        {cards.map((card) => (
          <div key={card.id} className="card-item">
            {card.isDefault && (
              <span className="card-default-chip">기본 결제수단</span>
            )}

            <div className="card-number">{card.maskedNumber}</div>

            <div className="card-footer">
              <div className="card-valid">
                <span className="card-valid-label">Valid Thru</span>
                <span>{card.validThru}</span>
              </div>
              <div className="card-brand">{card.brand}</div>
            </div>
          </div>
        ))}

        <button type="button" className="add-card-tile" onClick={handleAddCard}>
          <div className="add-card-icon">+</div>
          <div className="add-card-text">Add a new card</div>
        </button>
      </div>

      {isModalOpen && (
        <div className="add-card-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="add-card-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="add-card-modal-close"
              onClick={handleCloseModal}
              aria-label="닫기"
            >
              ×
            </button>

            <h2 className="add-card-modal-title">카드추가</h2>

            <form className="add-card-form" onSubmit={handleSubmit}>
              <div className="add-card-form-row">
                <label className="add-card-label">
                  Card Number
                  <input
                    type="text"
                    name="cardNumber"
                    value={formValues.cardNumber}
                    onChange={handleChange}
                    placeholder="4321 4321 4321 4321"
                  />
                </label>
              </div>

              <div className="add-card-form-row add-card-form-row--two">
                <label className="add-card-label">
                  Exp. Date
                  <input
                    type="text"
                    name="expDate"
                    value={formValues.expDate}
                    onChange={handleChange}
                    placeholder="02/27"
                  />
                </label>
                <label className="add-card-label">
                  CVC
                  <input
                    type="text"
                    name="cvc"
                    value={formValues.cvc}
                    onChange={handleChange}
                    placeholder="123"
                  />
                </label>
              </div>

              <div className="add-card-form-row">
                <label className="add-card-label">
                  Name on Card
                  <input
                    type="text"
                    name="nameOnCard"
                    value={formValues.nameOnCard}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </label>
              </div>

              <div className="add-card-form-row">
                <label className="add-card-label">
                  Country or Region
                  <select
                    name="country"
                    value={formValues.country}
                    onChange={handleChange}
                  >
                    <option value="">Select country</option>
                    <option value="KR">Korea</option>
                    <option value="US">United States</option>
                    <option value="JP">Japan</option>
                    <option value="CN">China</option>
                  </select>
                </label>
              </div>

              <div className="add-card-form-row add-card-form-row--checkbox">
                <label className="add-card-checkbox-label">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    checked={formValues.saveInfo}
                    onChange={handleChange}
                  />
                  <span>정보 저장하기</span>
                </label>
              </div>

              <button type="submit" className="add-card-submit-btn">
                Add Card
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPaymentPage;

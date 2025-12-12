import React, { useState, useEffect } from "react";
import { getUserCards, addCard, deleteCard, setDefaultCard } from "../../api/cardClient";
import "../../styles/pages/mypage/MyPaymentPage.scss";

const MyPaymentPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formValues, setFormValues] = useState({
    cardNumber: "",
    expDate: "",
    cvc: "",
    nameOnCard: "",
    saveInfo: true,
  });

  // 카드 목록 조회
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const cardsData = await getUserCards();
        setCards(cardsData || []);
      } catch (err) {
        console.error("카드 목록 조회 실패:", err);
        setError("카드 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleAddCard = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormValues({
      cardNumber: "",
      expDate: "",
      cvc: "",
      nameOnCard: "",
      saveInfo: true,
    });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    
    // 카드 번호: 숫자만 입력, 4자리마다 공백 추가
    if (name === "cardNumber") {
      processedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      if (processedValue.length > 19) {
        processedValue = processedValue.substring(0, 19);
      }
    }
    // 만료일: MM/YY 형식으로 자동 포맷팅
    else if (name === "expDate") {
      let digits = value.replace(/\D/g, '');
      if (digits.length >= 2) {
        processedValue = digits.substring(0, 2) + '/' + digits.substring(2, 4);
      } else {
        processedValue = digits;
      }
      if (processedValue.length > 5) {
        processedValue = processedValue.substring(0, 5);
      }
    }
    // CVC: 숫자만 입력, 최대 3자리
    else if (name === "cvc") {
      processedValue = value.replace(/\D/g, '').substring(0, 3);
    }
    
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : processedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError("");

      // 카드 번호에서 공백 제거
      const cleanedCardNumber = formValues.cardNumber.replace(/\s/g, '');

      // 카드 추가 API 호출
      const newCard = await addCard({
        cardNumber: cleanedCardNumber,
        expDate: formValues.expDate,
        cvc: formValues.cvc,
        nameOnCard: formValues.nameOnCard,
        isDefault: formValues.saveInfo || cards.length === 0, // 첫 카드이거나 저장 체크 시 기본 카드로 설정
      });

      // 카드 목록 업데이트
      const updatedCards = await getUserCards();
      setCards(updatedCards || []);

      // 모달 닫기 및 폼 초기화
      handleCloseModal();
    } catch (err) {
      console.error("카드 추가 실패:", err);
      setError(err.response?.data?.message || "카드 추가에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("정말 이 카드를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteCard(cardId);
      const updatedCards = await getUserCards();
      setCards(updatedCards || []);
    } catch (err) {
      console.error("카드 삭제 실패:", err);
      alert(err.response?.data?.message || "카드 삭제에 실패했습니다.");
    }
  };

  const handleSetDefault = async (cardId) => {
    try {
      await setDefaultCard(cardId);
      const updatedCards = await getUserCards();
      setCards(updatedCards || []);
    } catch (err) {
      console.error("기본 카드 설정 실패:", err);
      alert(err.response?.data?.message || "기본 카드 설정에 실패했습니다.");
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h2 className="payment-title">결제수단</h2>
      </div>

      {loading ? (
        <div className="loading">카드를 불러오는 중...</div>
      ) : (
        <div className="cards-grid">
          {cards.map((card) => (
            <div key={card._id || card.id} className="card-item">
              {card.isDefault && (
                <span className="card-default-chip">기본 결제수단</span>
              )}

              <div className="card-number">{card.maskedNumber}</div>

              <div className="card-footer">
                <div className="card-valid">
                  <span className="card-valid-label">Valid Thru</span>
                  <span>{card.expDate || card.validThru}</span>
                </div>
                <div className="card-brand">{card.brand}</div>
              </div>

              <div className="card-actions">
                {!card.isDefault && (
                  <button
                    className="card-action-btn"
                    onClick={() => handleSetDefault(card._id || card.id)}
                  >
                    기본 설정
                  </button>
                )}
                <button
                  className="card-action-btn card-action-btn--delete"
                  onClick={() => handleDeleteCard(card._id || card.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="add-card-tile" onClick={handleAddCard}>
            <div className="add-card-icon">+</div>
            <div className="add-card-text">Add a new card</div>
          </button>
        </div>
      )}

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

            {error && <div className="error-message">{error}</div>}

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
                    maxLength={19}
                    pattern="[0-9\s]+"
                    required
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
                    maxLength={5}
                    pattern="(0[1-9]|1[0-2])\/\d{2}"
                    required
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
                    maxLength={3}
                    pattern="[0-9]{3}"
                    required
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
                    maxLength={50}
                    required
                  />
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

              <button 
                type="submit" 
                className="add-card-submit-btn"
                disabled={submitting}
              >
                {submitting ? "추가 중..." : "Add Card"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPaymentPage;

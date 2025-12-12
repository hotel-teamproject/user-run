import React, { useState } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FloatingNav from "../../components/common/FloatingNav";
import "../../styles/pages/support/SupportPage.scss";

const SupportPage = () => {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "예약을 취소하려면 어떻게 하나요?",
      answer:
        "마이페이지 > 예약 내역에서 원하는 예약을 선택 후 '예약 취소' 버튼을 클릭하면 됩니다. 취소 정책에 따라 환불액이 결정되며, 최대 7일 이내에 환불됩니다.",
    },
    {
      id: 2,
      question: "결제 후 영수증은 어디서 받을 수 있나요?",
      answer:
        "예약 완료 후 등록된 이메일로 자동으로 예약 확인 이메일이 발송됩니다. 마이페이지 > 예약 내역에서도 영수증을 조회하고 다운로드할 수 있습니다.",
    },
    {
      id: 3,
      question: "예약 날짜를 변경할 수 있나요?",
      answer:
        "예약 날짜 변경은 고객센터로 문의하시면 가능합니다. 변경 가능 여부는 해당 호텔의 정책과 예약 상태에 따라 다르며, 추가 비용이 발생할 수 있습니다.",
    },
    {
      id: 4,
      question: "회원 정보를 수정하려면?",
      answer:
        "마이페이지 > 내 정보에서 이름, 이메일, 전화번호 등의 정보를 수정할 수 있습니다. 변경 사항은 저장 버튼을 클릭하면 즉시 적용됩니다.",
    },
    {
      id: 5,
      question: "비밀번호를 잊어버렸어요.",
      answer:
        "로그인 페이지에서 '비밀번호 찾기' 버튼을 클릭하세요. 등록된 이메일로 비밀번호 재설정 링크가 발송되며, 링크를 통해 새 비밀번호를 설정할 수 있습니다.",
    },
    {
      id: 6,
      question: "찜한 호텔 목록은 어디서 볼 수 있나요?",
      answer:
        "마이페이지 > 찜하기에서 찜한 모든 호텔 목록을 확인할 수 있습니다. 여기서 찜을 취소하거나 바로 예약할 수 있습니다.",
    },
    {
      id: 7,
      question: "결제 수단은 어떤 것들이 있나요?",
      answer:
        "현재 신용카드(VISA, Mastercard), 체크카드, 계좌이체를 지원하고 있습니다. 더 다양한 결제 수단을 추가할 예정입니다.",
    },
    {
      id: 8,
      question: "호텔 후기를 남기는 방법은?",
      answer:
        "예약을 완료한 후 마이페이지 > 내 후기에서 호텔에 대한 평점과 후기를 작성할 수 있습니다. 사진도 함께 업로드할 수 있습니다.",
    },
  ];

  const toggleAccordion = (idx) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  return (
    <>
      <Header />

      <div className="support-page">
        {/* 헤더 섹션 */}
        <div className="support-header">
          <h1>고객센터</h1>
          <p>자주 찾는 질문과 답변을 통해 궁금한 점을 해결하세요</p>
        </div>

        {/* 메인 컨테이너 */}
        <div className="support-container inner">
          {/* FAQ 섹션 */}
          <section className="faq-section">
            <h2>자주 찾는 질문 (FAQ)</h2>

            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div
                  key={faq.id}
                  className={`faq-item ${expandedIdx === idx ? "active" : ""}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={expandedIdx === idx}
                  >
                    <span className="question-text">{faq.question}</span>
                    <span className="toggle-icon">+</span>
                  </button>

                  {expandedIdx === idx && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 추가 도움말 섹션 */}
          <section className="help-section">
            <h2>더 필요하신 도움이 있으신가요?</h2>

            <div className="help-cards">
              <div className="help-card">
                <div className="card-icon">💬</div>
                <h3>실시간 채팅</h3>
                <p>고객 상담원과 실시간으로 채팅하여 질문에 답변받으세요</p>
                <button className="help-btn">채팅 시작</button>
              </div>

              <div className="help-card">
                <div className="card-icon">📞</div>
                <h3>전화 문의</h3>
                <p>1588-0000 (09:00 ~ 18:00, 평일만 운영)</p>
                <button className="help-btn">전화하기</button>
              </div>

              <div className="help-card">
                <div className="card-icon">📧</div>
                <h3>이메일 문의</h3>
                <p>support@hotelhub.com으로 언제든 문의하세요</p>
                <button className="help-btn">이메일 보내기</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />

      <FloatingNav />
    </>
  );
};

export default SupportPage;

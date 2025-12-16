import React from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FloatingNav from "../../components/common/FloatingNav";
import "../../styles/pages/company/CompanyPage.scss";

const TermsPage = () => {
  return (
    <>
      <Header />

      <div className="company-page">
        <div className="company-header">
          <h1>이용약관</h1>
          <p>STAYBOOK 서비스 이용약관입니다.</p>
        </div>

        <div className="company-container inner">
          <section className="company-section">
            <h2>제1조 (목적)</h2>
            <div className="company-content">
              <p>
                본 약관은 (주)스테이북(이하 "회사")이 운영하는 STAYBOOK 호텔 예약 서비스 
                (이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 
                기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </div>
          </section>

          <section className="company-section">
            <h2>제2조 (정의)</h2>
            <div className="company-content">
              <ol>
                <li>"서비스"란 회사가 제공하는 호텔 예약 및 관련 서비스를 의미합니다.</li>
                <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.</li>
                <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.</li>
                <li>"비회원"이란 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 의미합니다.</li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제3조 (약관의 게시와 개정)</h2>
            <div className="company-content">
              <ol>
                <li>회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</li>
                <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
                <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.</li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제4조 (서비스의 제공 및 변경)</h2>
            <div className="company-content">
              <ol>
                <li>회사는 다음과 같은 서비스를 제공합니다:
                  <ul>
                    <li>호텔 정보 제공 및 검색 서비스</li>
                    <li>호텔 예약 서비스</li>
                    <li>결제 서비스</li>
                    <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스</li>
                  </ul>
                </li>
                <li>회사는 서비스의 내용을 변경할 수 있으며, 변경 시 사전에 공지합니다.</li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제5조 (예약 및 취소)</h2>
            <div className="company-content">
              <ol>
                <li>이용자는 서비스를 통해 호텔을 예약할 수 있습니다.</li>
                <li>예약 취소는 각 호텔의 취소 정책에 따릅니다.</li>
                <li>체크인 7일 전: 무료 취소</li>
                <li>체크인 3일 전: 50% 환불</li>
                <li>체크인 당일: 환불 불가</li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제6조 (회원의 의무)</h2>
            <div className="company-content">
              <ol>
                <li>회원은 다음 행위를 하여서는 안 됩니다:
                  <ul>
                    <li>신청 또는 변경 시 허위내용의 등록</li>
                    <li>타인의 정보 도용</li>
                    <li>회사가 게시한 정보의 변경</li>
                    <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                    <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                    <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제7조 (면책조항)</h2>
            <div className="company-content">
              <ol>
                <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
                <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
                <li>회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제8조 (준거법 및 관할법원)</h2>
            <div className="company-content">
              <ol>
                <li>회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다.</li>
                <li>회사와 이용자 간에 발생한 분쟁에 관한 소송은 민사소송법상의 관할법원에 제기합니다.</li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <p className="effective-date">본 약관은 2025년 1월 1일부터 시행됩니다.</p>
          </section>
        </div>
      </div>

      <Footer />
      <FloatingNav />
    </>
  );
};

export default TermsPage;


import React from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FloatingNav from "../../components/common/FloatingNav";
import "../../styles/pages/company/CompanyPage.scss";

const PrivacyPage = () => {
  return (
    <>
      <Header />

      <div className="company-page">
        <div className="company-header">
          <h1>개인정보처리방침</h1>
          <p>STAYBOOK은 고객의 개인정보를 소중히 다룹니다.</p>
        </div>

        <div className="company-container inner">
          <section className="company-section">
            <h2>제1조 (개인정보의 처리목적)</h2>
            <div className="company-content">
              <p>
                (주)스테이북(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 
                처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
                이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ol>
                <li>
                  <strong>회원 가입 및 관리</strong>
                  <p>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지 목적</p>
                </li>
                <li>
                  <strong>서비스 제공</strong>
                  <p>호텔 예약 서비스 제공, 콘텐츠 제공, 맞춤 서비스 제공, 본인인증</p>
                </li>
                <li>
                  <strong>결제 처리</strong>
                  <p>예약 결제, 환불 처리, 결제 내역 관리</p>
                </li>
                <li>
                  <strong>고객 지원</strong>
                  <p>고객 문의사항 응대, 불만 처리, 공지사항 전달</p>
                </li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제2조 (개인정보의 처리 및 보유기간)</h2>
            <div className="company-content">
              <ol>
                <li>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</li>
                <li>각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
                  <ul>
                    <li>회원 가입 및 관리: 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지)</li>
                    <li>예약 및 결제 정보: 5년 (전자상거래법)</li>
                    <li>고객 문의: 3년 (전자상거래법)</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제3조 (처리하는 개인정보의 항목)</h2>
            <div className="company-content">
              <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
              <ol>
                <li>
                  <strong>회원 가입 시</strong>
                  <ul>
                    <li>필수항목: 이름, 이메일, 비밀번호, 전화번호</li>
                    <li>선택항목: 프로필 사진</li>
                  </ul>
                </li>
                <li>
                  <strong>예약 시</strong>
                  <ul>
                    <li>필수항목: 예약자 이름, 연락처, 이메일, 체크인/체크아웃 날짜</li>
                  </ul>
                </li>
                <li>
                  <strong>결제 시</strong>
                  <ul>
                    <li>필수항목: 결제 정보(카드번호, 유효기간 등)</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제4조 (개인정보의 제3자 제공)</h2>
            <div className="company-content">
              <ol>
                <li>회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</li>
                <li>회사는 원활한 서비스 제공을 위해 예약 정보를 해당 호텔에 제공할 수 있습니다.</li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제5조 (개인정보처리의 위탁)</h2>
            <div className="company-content">
              <ol>
                <li>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
                  <ul>
                    <li>결제 처리: 결제 대행사 (결제 정보)</li>
                    <li>이메일 발송: 이메일 서비스 제공업체 (이메일 주소)</li>
                  </ul>
                </li>
                <li>회사는 위탁계약 체결 시 개인정보보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제6조 (정보주체의 권리·의무 및 행사방법)</h2>
            <div className="company-content">
              <ol>
                <li>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
                  <ul>
                    <li>개인정보 처리정지 요구권</li>
                    <li>개인정보 열람요구권</li>
                    <li>개인정보 정정·삭제요구권</li>
                    <li>개인정보 처리정지 요구권</li>
                  </ul>
                </li>
                <li>제1항에 따른 권리 행사는 회사에 대해 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제7조 (개인정보의 파기)</h2>
            <div className="company-content">
              <ol>
                <li>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</li>
                <li>개인정보 파기의 절차 및 방법은 다음과 같습니다:
                  <ul>
                    <li>파기절차: 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</li>
                    <li>파기방법: 회사는 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>제8조 (개인정보 보호책임자)</h2>
            <div className="company-content">
              <p>
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="contact-info">
                <p><strong>개인정보 보호책임자</strong></p>
                <p>성명: 홍길동</p>
                <p>직책: 대표이사</p>
                <p>연락처: 1588-0000, support@staybook.com</p>
              </div>
            </div>
          </section>

          <section className="company-section">
            <p className="effective-date">본 방침은 2025년 1월 1일부터 시행됩니다.</p>
          </section>
        </div>
      </div>

      <Footer />
      <FloatingNav />
    </>
  );
};

export default PrivacyPage;


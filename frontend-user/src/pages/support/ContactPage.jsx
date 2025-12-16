import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FloatingNav from "../../components/common/FloatingNav";
import { createInquiry } from "../../api/inquiryClient";
import { getCurrentUser } from "../../api/userClient";
import "../../styles/pages/support/SupportPage.scss";

const ContactPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    type: "etc", 
    title: "", 
    content: "",
    hotelId: ""
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        // 로그인하지 않은 경우 로그인 페이지로 이동
        navigate("/login?redirect=/support/contact");
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData.data || userData);
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
        navigate("/login?redirect=/support/contact");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (form.content.length < 10) {
      setError("문의 내용은 최소 10자 이상 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createInquiry({
        type: form.type,
        title: form.title,
        content: form.content,
        hotelId: form.hotelId || undefined,
        images: []
      });

      setSent(true);
      setForm({ type: "etc", title: "", content: "", hotelId: "" });
      
      // 3초 후 문의 내역 페이지로 이동하거나 폼 초기화
      setTimeout(() => {
        setSent(false);
      }, 3000);
    } catch (err) {
      console.error("문의 전송 실패:", err);
      setError(err.response?.data?.message || "문의 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // 로그인 체크 중
  }

  return (
    <>
      <Header />

      <div className="support-page">
        <div className="support-header">
          <h1>1:1 문의</h1>
          <p>문의 내용을 남겨주시면 빠르게 회신드리겠습니다.</p>
        </div>

        <div className="support-container inner">
          <section className="contact-section">
            <div className="contact-grid">
              <div className="contact-info">
                <h3>다른 문의 방법</h3>
                <p>전화: 1588-0000 (09:00 ~ 18:00)</p>
                <p>이메일: support@staybook.com</p>
                <p className="contact-note">
                  로그인 후 문의하시면 더 빠른 답변을 받으실 수 있습니다.
                </p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                
                {sent && (
                  <div className="success-message">
                    문의가 접수되었습니다. 빠른 시일 내에 회신드리겠습니다.
                  </div>
                )}

                <label>
                  문의 유형 *
                  <select 
                    name="type" 
                    value={form.type} 
                    onChange={handleChange}
                    required
                  >
                    <option value="hotel">호텔 관련</option>
                    <option value="reservation">예약 관련</option>
                    <option value="payment">결제 관련</option>
                    <option value="cancel">취소/환불</option>
                    <option value="refund">환불 문의</option>
                    <option value="etc">기타</option>
                  </select>
                </label>

                <label>
                  제목 *
                  <input 
                    name="title" 
                    value={form.title} 
                    onChange={handleChange} 
                    placeholder="문의 제목을 입력해주세요"
                    maxLength={100}
                    required 
                  />
                </label>

                <label>
                  문의 내용 *
                  <textarea 
                    name="content" 
                    value={form.content} 
                    onChange={handleChange} 
                    placeholder="문의 내용을 상세히 입력해주세요 (최소 10자 이상)"
                    rows={8} 
                    maxLength={2000}
                    required 
                  />
                  <span className="char-count">{form.content.length} / 2000</span>
                </label>

                <button 
                  type="submit" 
                  className="help-btn" 
                  disabled={loading || sent}
                >
                  {loading ? "전송 중..." : sent ? "전송 완료" : "문의하기"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>

      <Footer />
      <FloatingNav />
    </>
  );
};

export default ContactPage;

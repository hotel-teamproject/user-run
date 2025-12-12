import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FloatingNav from "../../components/common/FloatingNav";
import "../../styles/pages/support/SupportPage.scss";

const ContactPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제 API 연동 필요
    console.log("문의 전송", form);
    setSent(true);
  };

  return (
    <>
      <Header />

      <div className="support-page">
        <div className="support-subnav">
          <button className="support-back" onClick={() => navigate('/support')}>&larr; 뒤로가기</button>
        </div>

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
                <p>이메일: support@hotelhub.com</p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                  이름
                  <input name="name" value={form.name} onChange={handleChange} required />
                </label>

                <label>
                  이메일
                  <input name="email" type="email" value={form.email} onChange={handleChange} required />
                </label>

                <label>
                  문의 내용
                  <textarea name="message" value={form.message} onChange={handleChange} rows={6} required />
                </label>

                <button type="submit" className="help-btn">전송</button>

                {sent && <p className="notice">문의가 접수되었습니다. 회신을 기다려주세요.</p>}
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

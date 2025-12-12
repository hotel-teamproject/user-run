import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BusinessSignupForm = () => {
  const [formData, setFormData] = useState({
    businessNumber: "",
    businessName: "",
    ownerName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    agreeToTerms: false,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수 필드 체크
    const requiredFields = [
      "businessNumber",
      "businessName",
      "ownerName",
      "businessEmail",
      "businessPhone",
      "businessAddress",
    ];

    for (let key of requiredFields) {
      if (!formData[key]) {
        setError("모든 필수 정보를 입력해주세요.");
        return;
      }
    }

    if (!formData.agreeToTerms) {
      setError("약관에 동의해주세요.");
      return;
    }

    console.log("📦 Business Signup Data:", formData);

    navigate("/login");
  };

  return (
    <div className="common-form signup-form">
      <div className="form-header">
        <button 
          type="button" 
          className="back-button" 
          onClick={() => navigate("/login")}
        >
          ← Back to login
        </button>

        <h1 className="form-title">Business Sign Up</h1>
        <p className="form-subtitle">호텔 / 숙박업소 사업자 회원가입</p>
      </div>

      <form className="form-content" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        {/* 사업자 등록번호 */}
        <div className="form-group">
          <label className="form-label">사업자 등록번호</label>
          <input
            type="text"
            name="businessNumber"
            className="form-input"
            placeholder="예) 123-45-67890"
            value={formData.businessNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 사업체명 */}
        <div className="form-group">
          <label className="form-label">사업체명</label>
          <input
            type="text"
            name="businessName"
            className="form-input"
            placeholder="예) 서울 그랜드 호텔"
            value={formData.businessName}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 대표자 이름 */}
        <div className="form-group">
          <label className="form-label">대표자 이름</label>
          <input
            type="text"
            name="ownerName"
            className="form-input"
            placeholder="예) 홍길동"
            value={formData.ownerName}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 사업자 이메일 */}
        <div className="form-group">
          <label className="form-label">사업자 이메일</label>
          <input
            type="email"
            name="businessEmail"
            className="form-input"
            placeholder="hotel@example.com"
            value={formData.businessEmail}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 사업자 연락처 */}
        <div className="form-group">
          <label className="form-label">사업자 연락처</label>
          <input
            type="tel"
            name="businessPhone"
            className="form-input"
            placeholder="예) 02-1234-5678"
            value={formData.businessPhone}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 사업장 주소 */}
        <div className="form-group">
          <label className="form-label">사업장 주소</label>
          <input
            type="text"
            name="businessAddress"
            className="form-input"
            placeholder="예) 서울특별시 강남구 테헤란로 123"
            value={formData.businessAddress}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 약관 */}
        <div className="form-options">
          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
            />
            <span className="checkbox-label">약관에 동의</span>
          </label>
        </div>

        {/* 제출 */}
        <button type="submit" className="btn btn--primary btn--block">
          사업자 회원가입
        </button>
      </form>
    </div>
  );
};

export default BusinessSignupForm;

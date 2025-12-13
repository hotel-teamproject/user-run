import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { registerUser, applyBusiness } from "../../api/userClient";

const BusinessSignupForm = () => {
  const [formData, setFormData] = useState({
    businessNumber: "",
    businessName: "",
    ownerName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 필드 체크
    const requiredFields = [
      "businessNumber",
      "businessName",
      "ownerName",
      "businessEmail",
      "businessPhone",
      "businessAddress",
      "password",
      "confirmPassword",
    ];

    for (let key of requiredFields) {
      if (!formData[key]) {
        setError("모든 필수 정보를 입력해주세요.");
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 4) {
      setError("비밀번호는 최소 4자 이상이어야 합니다.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("약관에 동의해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1. 일반 회원가입 API 호출
      const userData = await registerUser({
        name: formData.ownerName,
        email: formData.businessEmail,
        password: formData.password,
        phone: formData.businessPhone || "",
      });

      if (userData && userData._id) {
        // 사용자 정보 저장
        const userInfo = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
        };

        login(userInfo);

        // 2. 사업자 신청 API 호출 (로그인 후에만 가능)
        try {
          await applyBusiness({
            businessName: formData.businessName,
            businessNumber: formData.businessNumber,
            bankAccount: "", // 은행 계좌는 나중에 추가할 수 있도록
          });

          // 사업자 회원가입 성공 후 마이페이지로 이동
          setTimeout(() => {
            window.location.href = "/mypage";
          }, 200);
        } catch (businessErr) {
          console.error("Business apply error:", businessErr);
          // 회원가입은 성공했지만 사업자 신청 실패
          setError("회원가입은 완료되었지만 사업자 신청에 실패했습니다. 마이페이지에서 다시 신청해주세요.");
          setTimeout(() => {
            window.location.href = "/mypage";
          }, 2000);
        }
      } else {
        setError("회원가입 응답이 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.message || 
                           err.message || 
                           "회원가입에 실패했습니다. 다시 시도해주세요.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
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
            maxLength={15}
            pattern="[0-9\-]+"
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
            maxLength={100}
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
            maxLength={50}
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
            maxLength={100}
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
            maxLength={20}
            pattern="[0-9\-]+"
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
            maxLength={200}
            required
          />
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <label className="form-label">비밀번호</label>
          <div className="password-input-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              className="form-input"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleInputChange}
              minLength={4}
              maxLength={128}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility("password")}
            >
              {passwordVisible ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="form-group">
          <label className="form-label">비밀번호 확인</label>
          <div className="password-input-wrapper">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              className="form-input"
              placeholder="••••••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              minLength={4}
              maxLength={128}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {confirmPasswordVisible ? "🙈" : "👁️"}
            </button>
          </div>
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
        <button 
          type="submit" 
          className="btn btn--primary btn--block"
          disabled={loading}
        >
          {loading ? "처리 중..." : "사업자 회원가입"}
        </button>
      </form>
    </div>
  );
};

export default BusinessSignupForm;

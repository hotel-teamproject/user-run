import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 🔥 추가

const SignupForm = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 추가

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"; // 🔥 추가

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 필수 검증
    if (
      !formData.nickname ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("모든 필수 필드를 입력해주세요.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("회원가입을 위해 약관에 동의해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🔥 백엔드 회원가입 API 호출
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        email: formData.email,
        password: formData.password,
        name: formData.nickname,
        phone_number: formData.phoneNumber || "",
      });

      if (response.status === 201) {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setLoading(false);
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
        <h1 className="form-title">Sign up</h1>
        <p className="form-subtitle">회원가입</p>
      </div>

      <form className="form-content" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        {/* 닉네임 */}
        <div className="form-group">
          <label className="form-label">닉네임 *</label>
          <input
            type="text"
            name="nickname"
            className="form-input"
            placeholder="john.doe"
            value={formData.nickname}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 이메일 + 전화번호 */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="john.doe@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              className="form-input"
              placeholder="010-1234-5678"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <label className="form-label">Password *</label>
          <div className="password-input-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              className="form-input"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleInputChange}
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
          <label className="form-label">Confirm Password *</label>
          <div className="password-input-wrapper">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              className="form-input"
              placeholder="••••••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                togglePasswordVisibility("confirmPassword")
              }
            >
              {confirmPasswordVisible ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* 약관 동의 */}
        <div className="form-options agree-options">
          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
            />
            <span className="checkbox-label">
              회원가입 약관 및 개인정보 처리방침에 동의합니다. *
            </span>
          </label>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="btn btn--primary btn--block"
          disabled={loading}
        >
          {loading ? "처리 중..." : "회원 가입"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;

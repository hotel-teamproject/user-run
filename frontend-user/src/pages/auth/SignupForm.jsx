import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
 const [passwordVisible, setPasswordVisible] = useState(false);
 const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
 const navigate = useNavigate();

 const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData((prev) => ({
   ...prev,
   [name]: type === "checkbox" ? checked : value,
  }));
  // 입력 시 에러 메시지 초기화
  setError("");
 };

 const handleSubmit = (e) => {
  e.preventDefault();

  // 기본 검증
  if (!formData.nickname || !formData.email || !formData.password) {
   setError("모든 필수 필드를 입력해주세요.");
   return;
  }

  if (formData.password !== formData.confirmPassword) {
   setError("비밀번호가 일치하지 않습니다.");
   return;
  }

  if (!formData.agreeToTerms) {
   setError("약관에 동의해주세요.");
   return;
  }

  // 회원가입 로직 구현 예정
  console.log("Signup data:", formData);

  // 임시로 로그인 페이지로 이동
  navigate("/login");
 };

 const handleSocialSignup = (provider) => {
  // 소셜 회원가입 로직 구현 예정
  console.log(`${provider} signup`);
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
    <h1 className="form-title">Sign up</h1>
    <p className="form-subtitle">회원가입</p>
   </div>

   <form className="form-content" onSubmit={handleSubmit}>
    {error && <div className="error-message">{error}</div>}

    <div className="form-row">
     <div className="form-group">
      <label className="form-label">닉네임</label>
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
    </div>

    <div className="form-row">
     <div className="form-group">
      <label className="form-label">Email</label>
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

    <div className="form-group">
     <label className="form-label">Password</label>
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

    <div className="form-group">
     <label className="form-label">Confirm Password</label>
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
       onClick={() => togglePasswordVisibility("confirmPassword")}
      >
       {confirmPasswordVisible ? "🙈" : "👁️"}
      </button>
     </div>
    </div>

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

    <button
     type="submit"
     onClick={() => navigate("/login")}
     className="btn btn--primary btn--block"
    >
    회원 가입
    </button>

    <button
     type="submit"
     onClick={() => navigate("/add-payment")}
     className="btn  btn--block btn--outline"
    >
     결제 수단 등록하기
    </button>

    <div className="divider">
     <span className="divider-text">회원가입</span>
    </div>

    <div className="social-login">
     <p className="social-signup-text">Or Sign up with</p>
     <div className="social-buttons">
      <button
       type="button"
       className="btn--social facebook"
       onClick={() => handleSocialSignup("facebook")}
      >
       <span className="social-icon">f</span>
      </button>
      <button
       type="button"
       className="btn--social google "
       onClick={() => handleSocialSignup("google")}
      >
       <span className="social-icon">G</span>
      </button>
      <button
       type="button"
       className="btn--social apple"
       onClick={() => handleSocialSignup("apple")}
      >
       <span className="social-icon">🍎</span>
      </button>
     </div>
    </div>
   </form>
  </div>
 );
};

export default SignupForm;

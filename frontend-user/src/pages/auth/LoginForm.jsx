import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../api/userClient";
// import "../../styles/components/auth/LoginForm.scss";

const LoginForm = () => {
 const [formData, setFormData] = useState({
  email: "",
  password: "",
  rememberMe: false,
 });
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);
 const { login, fetchUser, isAuthed } = useContext(AuthContext);
 const navigate = useNavigate();

 // 이미 로그인된 상태에서 로그인 페이지에 접근 시 리다이렉트
 useEffect(() => {
   if (isAuthed) {
     navigate("/", { replace: true });
   }
 }, [isAuthed, navigate]);

 const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData((prev) => ({
   ...prev,
   [name]: type === "checkbox" ? checked : value,
  }));
  // 입력 시 에러 메시지 초기화
  setError("");
 };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
   setLoading(true);
   setError("");

   // 실제 API로 로그인
   const response = await loginUser({
    email: formData.email,
    password: formData.password,
   });

   // 백엔드 응답 구조 확인
   console.log("Login response:", response);
   
   // loginUser는 response.data.data 또는 response.data를 반환
   const userData = response?._id ? response : (response?.data || null);
   
   if (userData && userData._id) {
    // userClient에서 이미 토큰을 저장하므로, 사용자 정보만 저장
    const userInfo = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      role: userData.role || "user",
    };
    
    console.log("User info to save:", userInfo);
    console.log("Access token saved:", !!localStorage.getItem("accessToken"));
    
    // 사용자 정보를 localStorage에 저장 (페이지 새로고침 후에도 유지)
    localStorage.setItem("user", JSON.stringify(userInfo));
    
    // 사용자 정보 저장
    login(userInfo);
    
    // 비밀번호 기억하기 옵션 처리
    if (formData.rememberMe) {
     // 추가 처리 필요시 여기에 구현
    }

    // 로그인 성공 후 즉시 메인 화면으로 이동
    console.log("Navigating to /");
    // window.location.href를 바로 사용하여 확실하게 이동
    // 페이지 새로고침 후 AuthContext의 useEffect가 실행되어 사용자 정보를 다시 가져옴
    window.location.href = "/";
   } else {
    console.error("Invalid response:", response);
    setError("로그인 응답이 올바르지 않습니다.");
   }
  } catch (err) {
   // 로그인 실패
   console.error("Login error:", err);
   const errorMessage = err.response?.data?.message || 
                        err.message || 
                        "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
   setError(errorMessage);
  } finally {
   setLoading(false);
  }
 };

 const handleSocialLogin = (provider) => {
  // 소셜 로그인 로직 구현 예정
  console.log(`${provider} login`);
 };

 return (
  <div className="common-form">
   <div className="form-header">
    <h1 className="form-title">Login</h1>
    <p className="form-subtitle">로그인하세요</p>
   </div>

   <form className="form-content" onSubmit={handleSubmit}>
    {error && <div className="error-message">{error}</div>}
    <div className="form-group">
     <label className="form-label">Email</label>
     <input
      type="email"
      name="email"
      className="form-input"
      placeholder="user@test.com"
      value={formData.email}
      onChange={handleInputChange}
      maxLength={100}
      required
     />
    </div>
    <div className="form-group">
     <label className="form-label">Password</label>
     <div className="password-input-wrapper">
      <input
       type="password"
       name="password"
       className="form-input"
       placeholder="1234"
       value={formData.password}
       onChange={handleInputChange}
       minLength={6}
       maxLength={128}
       required
      />
      <button type="button" className="password-toggle">
       👁️
      </button>
     </div>
    </div>
    <div className="form-options">
     <label className="checkbox-wrapper">
      <input
       type="checkbox"
       name="rememberMe"
       checked={formData.rememberMe}
       onChange={handleInputChange}
      />
      <span className="checkbox-label">비밀번호 기억하기</span>
     </label>
     <a href="#" className="forgot-password">
      Forgot Password?
     </a>
    </div>
    <button 
     type="submit" 
     className="btn btn--primary btn--block"
     disabled={loading}
    >
     {loading ? "로그인 중..." : "Login"}
    </button>{" "}
    <div className="divider">
     <span className="divider-text">회원가입하세요</span>
    </div>
    <button
     type="button"
     onClick={() => navigate("/signup")}
     className="btn btn--accent btn--block"
    >
     Sign Up
    </button>
    <div className="social-login">
     <p className="social-login-text">Or login with</p>
     <div className="social-buttons">
      <button
       type="button"
       className="btn--social facebook"
       onClick={() => handleSocialLogin("facebook")}
      >
       <span className="social-icon">f</span>
      </button>
      <button
       type="button"
       className="btn--social google"
       onClick={() => handleSocialLogin("google")}
      >
       <span className="social-icon">G</span>
      </button>
      <button
       type="button"
       className="btn--social apple"
       onClick={() => handleSocialLogin("apple")}
      >
       <span className="social-icon">🍎</span>
      </button>
     </div>
    </div>
   </form>
  </div>
 );
};

export default LoginForm;

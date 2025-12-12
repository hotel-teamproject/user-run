import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 🔹 추가
import { AuthContext } from "../../context/AuthContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 🔹 추가
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 환경변수에서 API 주소 불러오기 (없으면 localhost:3000)
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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

    setLoading(true);
    setError("");

    try {
      // 🔥 백엔드 로그인 API 호출
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true, // 쿠키 기반이면 유지, 아니면 빼도 됨
        }
      );

      if (response.status === 200) {
        const { user, token } = response.data;

        // 🔥 컨텍스트에 유저 저장
        login(user);

        // 🔥 토큰 저장 (백엔드에서 token 내려주면)
        if (token) {
          localStorage.setItem("accessToken", token);
        }

        // Remember me 체크 시 플래그 저장
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        navigate("/mypage");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "로그인 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login`);
  };

  return (
    <div className="common-form">
      <div className="form-header">
        {/* ⭐ 홈페이지로 돌아가기 버튼 */}
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <h1 className="form-title">Login</h1>
        <p className="form-subtitle">로그인하세요</p>
      </div>

      <form className="form-content" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="user@test.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Password */}
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
              required
            />
            <button type="button" className="password-toggle">
              👁️
            </button>
          </div>
        </div>

        {/* Remember */}
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

        {/* Login Button */}
        <button
          type="submit"
          className="btn btn--primary btn--block"
          disabled={loading}
        >
          {loading ? "로그인 중..." : "Login"}
        </button>

        {/* Divider */}
        <div className="divider">
          <span className="divider-text">회원가입 선택</span>
        </div>

        {/* Signup Buttons */}
        <div className="signup-dual-buttons">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="btn btn--accent"
          >
            일반 회원가입
          </button>

          <button
            type="button"
            onClick={() => navigate("/business-signup")}
            className="btn btn--outline"
          >
            비즈니스 회원가입
          </button>
        </div>

        {/* Social Login */}
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

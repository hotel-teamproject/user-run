import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../api/userClient";
import AuthImageWrap from "../../components/auth/AuthImageWrap";
import "../../styles/pages/auth/ResetPasswordPage.scss";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  // 이메일 입력 단계
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  // 비밀번호 재설정 단계
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 토큰이 있으면 비밀번호 재설정 단계로
  useEffect(() => {
    if (token) {
      setEmailSent(true);
    }
  }, [token]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      if (response.resultCode === "SUCCESS") {
        setEmailSent(true);
        // 개발 환경에서만 토큰 표시
        if (response.data?.resetToken) {
          console.log("비밀번호 재설정 토큰:", response.data.resetToken);
          console.log("비밀번호 재설정 URL:", response.data.resetUrl);
        }
      } else {
        setEmailError(response.message || "이메일 전송에 실패했습니다");
      }
    } catch (err) {
      setEmailError(
        err.response?.data?.message ||
          "이메일 전송 중 오류가 발생했습니다"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (password.length < 4) {
      setError("비밀번호는 최소 4자 이상이어야 합니다");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    if (!token) {
      setError("유효하지 않은 링크입니다");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({ token, password });
      if (response.resultCode === "SUCCESS") {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.message || "비밀번호 재설정에 실패했습니다");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "비밀번호 재설정 중 오류가 발생했습니다"
      );
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 재설정 완료 화면
  if (success) {
    return (
      <div className="auth-layout-page">
        <div className="auth-layout-container">
          <div className="auth-layout-content">
            <div className="auth-layout-form-section">
              <div className="reset-password-page">
                <div className="common-form">
                  <div className="form-header">
                    <button
                      type="button"
                      className="back-button"
                      onClick={() => navigate("/login")}
                    >
                      ← 로그인으로 돌아가기
                    </button>
                    <div className="success-screen">
                      <span className="success-icon">✓</span>
                      <h1 className="success-title">비밀번호 재설정 완료</h1>
                      <p className="success-message">
                        비밀번호가 성공적으로 변경되었습니다.
                        <br />
                        잠시 후 로그인 페이지로 이동합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="auth-layout-image-section">
              <AuthImageWrap />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 이메일 입력 단계
  if (!emailSent) {
    return (
      <div className="auth-layout-page">
        <div className="auth-layout-container">
          <div className="auth-layout-content">
            <div className="auth-layout-form-section">
              <div className="reset-password-page">
                <div className="common-form">
                  <div className="form-header">
                    <button
                      type="button"
                      className="back-button"
                      onClick={() => navigate("/login")}
                    >
                      ← 로그인으로 돌아가기
                    </button>
                    <h1 className="form-title">비밀번호 찾기</h1>
                    <p className="form-subtitle">
                      가입하신 이메일 주소를 입력해주세요.
                      <br />
                      비밀번호 재설정 링크를 전송해드립니다.
                    </p>
                  </div>

                  <form className="form-content" onSubmit={handleEmailSubmit}>
                    {emailError && <div className="error-message">{emailError}</div>}
                    <div className="form-group">
                      <label className="form-label">이메일</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="user@test.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn--primary btn--block"
                      disabled={loading}
                    >
                      {loading ? "전송 중..." : "비밀번호 재설정 링크 전송"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="auth-layout-image-section">
              <AuthImageWrap />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 이메일 전송 완료 안내 (토큰이 없는 경우)
  if (emailSent && !token) {
    return (
      <div className="auth-layout-page">
        <div className="auth-layout-container">
          <div className="auth-layout-content">
            <div className="auth-layout-form-section">
              <div className="reset-password-page">
                <div className="common-form">
                  <div className="form-header">
                    <button
                      type="button"
                      className="back-button"
                      onClick={() => navigate("/login")}
                    >
                      ← 로그인으로 돌아가기
                    </button>
                    <h1 className="form-title">이메일 전송 완료</h1>
                    <p className="form-subtitle">
                      비밀번호 재설정 링크를 전송했습니다.
                    </p>
                  </div>
                  <div className="form-content">
                    <div className="info-message">
                      <strong>{email}</strong>로 비밀번호 재설정 링크를 전송했습니다.
                      <br />
                      이메일을 확인하시고 링크를 클릭하여 비밀번호를 재설정해주세요.
                      <br />
                      <br />
                      이메일이 보이지 않는다면 스팸함을 확인해주세요.
                    </div>
                    <button
                      type="button"
                      className="btn btn--primary btn--block"
                      onClick={() => {
                        setEmailSent(false);
                        setEmail("");
                      }}
                    >
                      다시 전송하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="auth-layout-image-section">
              <AuthImageWrap />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 비밀번호 재설정 단계
  return (
    <div className="auth-layout-page">
      <div className="auth-layout-container">
        <div className="auth-layout-content">
          <div className="auth-layout-form-section">
            <div className="reset-password-page">
              <div className="common-form">
                <div className="form-header">
                  <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate("/login")}
                  >
                    ← 로그인으로 돌아가기
                  </button>
                  <h1 className="form-title">새 비밀번호 설정</h1>
                  <p className="form-subtitle">
                    새로운 비밀번호를 입력해주세요.
                  </p>
                </div>

                <form className="form-content" onSubmit={handlePasswordSubmit}>
                  {error && <div className="error-message">{error}</div>}
                  <div className="form-group">
                    <label className="form-label">새 비밀번호</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-input"
                        placeholder="최소 4자 이상"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={4}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">비밀번호 확인</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-input"
                        placeholder="비밀번호를 다시 입력해주세요"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={4}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn--primary btn--block"
                    disabled={loading}
                  >
                    {loading ? "처리 중..." : "비밀번호 변경"}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="auth-layout-image-section">
            <AuthImageWrap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

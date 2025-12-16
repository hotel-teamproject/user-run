import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser, socialLogin } from "../../api/userClient";
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

 // 카카오 SDK 초기화
 useEffect(() => {
   const initKakaoSDK = () => {
     if (window.Kakao) {
       if (!window.Kakao.isInitialized()) {
         const kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY || '';
         if (kakaoAppKey && kakaoAppKey !== 'YOUR_KAKAO_APP_KEY') {
           try {
             window.Kakao.init(kakaoAppKey);
             console.log('카카오 SDK 초기화 완료');
           } catch (err) {
             console.error('카카오 SDK 초기화 실패:', err);
           }
         } else {
           console.log('카카오 앱 키가 설정되지 않았습니다. 개발 모드로 작동합니다.');
         }
       }
     } else {
       // SDK가 아직 로드되지 않은 경우 재시도
       setTimeout(initKakaoSDK, 100);
     }
   };
   
   initKakaoSDK();
 }, []);

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
   const userData = await loginUser({
    email: formData.email,
    password: formData.password,
   });

   // 백엔드 응답 구조 확인
   console.log("Login response:", userData);
   
   // loginUser는 response.data.data를 반환하므로 이미 사용자 데이터 객체
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
    console.error("Invalid response:", userData);
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

 const handleSocialLogin = async (provider) => {
  try {
    setLoading(true);
    setError("");

    let socialData = null;

    // 카카오 로그인
    if (provider === "kakao") {
      // 카카오 SDK가 로드되어 있는지 확인
      if (window.Kakao && window.Kakao.Auth) {
        // SDK가 초기화되지 않았다면 초기화 시도
        if (!window.Kakao.isInitialized()) {
          const kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY || '';
          if (kakaoAppKey && kakaoAppKey !== 'YOUR_KAKAO_APP_KEY') {
            window.Kakao.init(kakaoAppKey);
          }
        }
        
        if (window.Kakao.isInitialized()) {
        try {
          // 카카오 로그인 실행 (Promise로 래핑)
          await new Promise((resolve, reject) => {
            window.Kakao.Auth.login({
              success: async (authObj) => {
                try {
                  // 사용자 정보 가져오기
                  window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: async (res) => {
                      const kakaoAccount = res.kakao_account;
                      socialData = {
                        provider: 'kakao',
                        socialId: res.id.toString(),
                        email: kakaoAccount?.email || `kakao_${res.id}@kakao.com`,
                        name: kakaoAccount?.profile?.nickname || `카카오사용자${res.id}`,
                        profileImage: kakaoAccount?.profile?.profile_image_url || ''
                      };
                      
                      // 백엔드로 소셜 로그인 요청
                      const userData = await socialLogin(socialData);
                      handleSocialLoginSuccess(userData);
                      resolve();
                    },
                    fail: (err) => {
                      console.error('카카오 사용자 정보 조회 실패:', err);
                      setError('카카오 로그인에 실패했습니다.');
                      setLoading(false);
                      reject(err);
                    }
                  });
                } catch (err) {
                  console.error('카카오 로그인 처리 오류:', err);
                  setError('카카오 로그인 처리 중 오류가 발생했습니다.');
                  setLoading(false);
                  reject(err);
                }
              },
              fail: (err) => {
                console.error('카카오 로그인 실패:', err);
                setError('카카오 로그인에 실패했습니다.');
                setLoading(false);
                reject(err);
              }
            });
          });
        } catch (err) {
          console.error('카카오 SDK 오류:', err);
          // 카카오 SDK 오류 시 개발용 시뮬레이션
          handleSocialLoginDemo('kakao');
        }
        } else {
          // SDK 초기화 실패 시 개발용 시뮬레이션
          handleSocialLoginDemo('kakao');
        }
      } else {
        // 카카오 SDK가 없는 경우 개발용 시뮬레이션
        handleSocialLoginDemo('kakao');
      }
    }
    // 구글 로그인
    else if (provider === "google") {
      // Google Sign-In SDK가 로드되어 있는지 확인
      if (window.google && window.google.accounts) {
        try {
          const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
          
          if (!googleClientId) {
            // 클라이언트 ID가 없으면 개발용 시뮬레이션
            handleSocialLoginDemo('google');
            return;
          }

          // 구글 로그인 팝업 표시
          window.google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'openid email profile',
            callback: async (response) => {
              try {
                // 토큰으로 사용자 정보 가져오기
                const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`);
                const userInfo = await userInfoResponse.json();
                
                socialData = {
                  provider: 'google',
                  socialId: userInfo.id,
                  email: userInfo.email,
                  name: userInfo.name,
                  profileImage: userInfo.picture || ''
                };
                
                const userData = await socialLogin(socialData);
                handleSocialLoginSuccess(userData);
              } catch (err) {
                console.error('구글 사용자 정보 조회 오류:', err);
                setError('구글 로그인 처리 중 오류가 발생했습니다.');
                setLoading(false);
              }
            }
          }).requestAccessToken();
        } catch (err) {
          console.error('구글 SDK 오류:', err);
          // 구글 SDK 오류 시 개발용 시뮬레이션
          handleSocialLoginDemo('google');
        }
      } else {
        // 구글 SDK가 없는 경우 개발용 시뮬레이션
        handleSocialLoginDemo('google');
      }
    }
    // 애플 로그인
    else if (provider === "apple") {
      // Apple Sign In SDK가 로드되어 있는지 확인
      if (window.AppleID && window.AppleID.auth) {
        try {
          window.AppleID.auth.init({
            clientId: import.meta.env.VITE_APPLE_CLIENT_ID || '',
            scope: 'name email',
            redirectURI: `${window.location.origin}/auth/apple/callback`,
            usePopup: true,
            state: 'apple-login-state'
          });

          window.AppleID.auth.signIn({
            success: async (response) => {
              try {
                // Apple ID 토큰에서 사용자 정보 추출
                const idToken = response.authorization.id_token;
                const payload = JSON.parse(atob(idToken.split('.')[1]));
                
                socialData = {
                  provider: 'apple',
                  socialId: payload.sub,
                  email: payload.email || `apple_${payload.sub}@privaterelay.appleid.com`,
                  name: response.user?.name?.firstName && response.user?.name?.lastName 
                    ? `${response.user.name.firstName} ${response.user.name.lastName}`
                    : `Apple User ${payload.sub.slice(0, 8)}`,
                  profileImage: ''
                };
                
                // 백엔드로 소셜 로그인 요청
                const userData = await socialLogin(socialData);
                handleSocialLoginSuccess(userData);
              } catch (err) {
                console.error('애플 로그인 처리 오류:', err);
                setError('애플 로그인 처리 중 오류가 발생했습니다.');
                setLoading(false);
              }
            },
            error: (err) => {
              console.error('애플 로그인 실패:', err);
              setError('애플 로그인에 실패했습니다.');
              setLoading(false);
            }
          });
        } catch (err) {
          console.error('애플 SDK 오류:', err);
          // 애플 SDK 오류 시 개발용 시뮬레이션
          handleSocialLoginDemo('apple');
        }
      } else {
        // 애플 SDK가 없는 경우 개발용 시뮬레이션
        handleSocialLoginDemo('apple');
      }
    }
  } catch (err) {
    console.error('소셜 로그인 오류:', err);
    setError(err.response?.data?.message || '소셜 로그인에 실패했습니다.');
    setLoading(false);
  }
 };

 // 개발용 소셜 로그인 시뮬레이션
 const handleSocialLoginDemo = async (provider) => {
  try {
    // 개발 환경에서 사용할 테스트 데이터
    const demoData = {
      kakao: {
        provider: 'kakao',
        socialId: `kakao_${Date.now()}`,
        email: `kakao_${Date.now()}@kakao.com`,
        name: '카카오 사용자',
        profileImage: ''
      },
      google: {
        provider: 'google',
        socialId: `google_${Date.now()}`,
        email: `google_${Date.now()}@gmail.com`,
        name: '구글 사용자',
        profileImage: ''
      },
      apple: {
        provider: 'apple',
        socialId: `apple_${Date.now()}`,
        email: `apple_${Date.now()}@privaterelay.appleid.com`,
        name: 'Apple 사용자',
        profileImage: ''
      }
    };

    const socialData = demoData[provider];
    if (!socialData) {
      setError('지원하지 않는 소셜 로그인입니다.');
      setLoading(false);
      return;
    }

    // 백엔드로 소셜 로그인 요청
    const userData = await socialLogin(socialData);
    handleSocialLoginSuccess(userData);
  } catch (err) {
    console.error('소셜 로그인 시뮬레이션 오류:', err);
    setError(err.response?.data?.message || '소셜 로그인에 실패했습니다.');
    setLoading(false);
  }
 };

 // 소셜 로그인 성공 처리
 const handleSocialLoginSuccess = (userData) => {
  if (userData && userData._id) {
    const userInfo = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      role: userData.role || "user",
    };
    
    localStorage.setItem("user", JSON.stringify(userInfo));
    login(userInfo);
    window.location.href = "/";
  } else {
    setError("소셜 로그인 응답이 올바르지 않습니다.");
    setLoading(false);
  }
 };

 return (
  <div className="common-form">
   <div className="form-header">
    <button
     type="button"
     className="back-button"
     onClick={() => navigate("/")}
    >
     ← 뒤로 가기
    </button>
    <h1 className="form-title">로그인</h1>
    <p className="form-subtitle">로그인하세요</p>
   </div>

   <form className="form-content" onSubmit={handleSubmit}>
    {error && <div className="error-message">{error}</div>}
    <div className="form-group">
     <label className="form-label">이메일</label>
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
     <label className="form-label">비밀번호</label>
     <div className="password-input-wrapper">
      <input
       type="password"
       name="password"
       className="form-input"
       placeholder="1234"
       value={formData.password}
       onChange={handleInputChange}
       minLength={4}
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
      비밀번호를 잊으셨나요?
     </a>
    </div>
    <button 
     type="submit" 
     className="btn btn--primary btn--block"
     disabled={loading}
    >
     {loading ? "로그인 중..." : "로그인"}
    </button>{" "}
    <div className="divider">
     <span className="divider-text">회원가입하세요</span>
    </div>
    <div className="regular-signup-section">
    <button
     type="button"
     onClick={() => navigate("/signup")}
      className="btn btn--regular btn--block"
     >
      <span className="user-icon">👤</span>
      <span>일반 회원가입</span>
     </button>
    </div>
    <div className="business-signup-section">
     <button
      type="button"
      onClick={() => navigate("/business-signup")}
      className="btn btn--business btn--block"
    >
      <span className="business-icon">🏢</span>
      <span>사업자 회원가입</span>
    </button>
    </div>
    <div className="social-login">
     <p className="social-login-text">또는 다음으로 로그인</p>
     <div className="social-buttons">
      <button
       type="button"
       className="btn--social kakao"
       onClick={() => handleSocialLogin("kakao")}
       disabled={loading}
       title="카카오 로그인"
      >
       <svg className="social-icon" viewBox="0 0 24 24" width="24" height="24">
         <path fill="#3C1E1E" d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3Z"/>
       </svg>
      </button>
      <button
       type="button"
       className="btn--social google"
       onClick={() => handleSocialLogin("google")}
       disabled={loading}
       title="구글 로그인"
      >
       <svg className="social-icon" viewBox="0 0 24 24" width="24" height="24">
         <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
         <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
         <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
         <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
       </svg>
      </button>
      <button
       type="button"
       className="btn--social apple"
       onClick={() => handleSocialLogin("apple")}
       disabled={loading}
       title="Apple 로그인"
      >
       <svg className="social-icon" viewBox="0 0 24 24" width="24" height="24" fill="#000">
         <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
       </svg>
      </button>
     </div>
    </div>
   </form>
  </div>
 );
};

export default LoginForm;

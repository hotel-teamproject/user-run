import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { registerUser, socialLogin } from "../../api/userClient";

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
 const [loading, setLoading] = useState(false);
 const [passwordVisible, setPasswordVisible] = useState(false);
 const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
 const navigate = useNavigate();
 const { login } = useContext(AuthContext);

 // 카카오 SDK 초기화
 useEffect(() => {
  const tryInitKakao = () => {
   if (window.Kakao && !window.Kakao.isInitialized()) {
    const kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY || '';
    if (kakaoAppKey && kakaoAppKey !== 'YOUR_KAKAO_APP_KEY') {
     try {
      window.Kakao.init(kakaoAppKey);
      console.log('카카오 SDK 초기화 완료');
     } catch (err) {
      console.error('카카오 SDK 초기화 실패:', err);
     }
    }
   }
  };
  tryInitKakao();
 }, []);

 // 카카오 SDK 동적 로더
 const loadKakaoSDK = () => {
  return new Promise((resolve, reject) => {
   if (window.Kakao) {
    resolve();
    return;
   }

   const existingScript = document.querySelector('script[src="https://developers.kakao.com/sdk/js/kakao.js"]');
   if (existingScript) {
    existingScript.addEventListener('load', () => resolve());
    existingScript.addEventListener('error', (err) => reject(err));
    return;
   }

   const script = document.createElement('script');
   script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
   script.async = true;
   script.onload = () => resolve();
   script.onerror = (err) => reject(err);
   document.head.appendChild(script);
  });
 };

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

  if (formData.password.length < 4) {
   setError("비밀번호는 최소 4자 이상이어야 합니다.");
   return;
  }

  try {
   setLoading(true);
   setError("");

   // 회원가입 API 호출
   const userData = await registerUser({
    name: formData.nickname,
    email: formData.email,
    password: formData.password,
    phone: formData.phoneNumber || ""
   });

   // 백엔드 응답 구조 확인 (registerUser는 이미 data를 반환)
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

    // 회원가입 성공 후 마이페이지로 이동
    setTimeout(() => {
     window.location.href = "/mypage";
    }, 200);
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

 const handleSocialSignup = async (provider) => {
  try {
   setLoading(true);
   setError("");

   let socialData = null;

   // 카카오 회원가입
   if (provider === "kakao") {
    try {
     await loadKakaoSDK();

     if (!window.Kakao) {
      setError('카카오 SDK를 불러오지 못했습니다. 인터넷 연결을 확인 후 다시 시도해주세요.');
      setLoading(false);
      return;
     }

     if (!window.Kakao.isInitialized()) {
      const kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY || '';
      if (kakaoAppKey && kakaoAppKey !== 'YOUR_KAKAO_APP_KEY') {
       window.Kakao.init(kakaoAppKey);
      } else {
       setError('카카오 앱 키가 올바르게 설정되지 않았습니다.');
       setLoading(false);
       return;
      }
     }

     // 카카오 개발자 콘솔에 등록된 리다이렉트 URI와 일치해야 함
     const redirectUri = `${window.location.origin}/oauth/kakao/callback`;
     
     await new Promise((resolve, reject) => {
      window.Kakao.Auth.login({
       redirectUri: redirectUri, // 명시적으로 리다이렉트 URI 설정
       success: async () => {
        try {
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

           const userData = await socialLogin(socialData);
           handleSocialSignupSuccess(userData);
           resolve();
          },
          fail: (err) => {
           console.error('카카오 사용자 정보 조회 실패:', err);
           setError('카카오 회원가입에 실패했습니다.');
           setLoading(false);
           reject(err);
          }
         });
        } catch (err) {
         console.error('카카오 회원가입 처리 오류:', err);
         setError('카카오 회원가입 처리 중 오류가 발생했습니다.');
         setLoading(false);
         reject(err);
        }
       },
       fail: (err) => {
        console.error('카카오 로그인 실패:', err);
        setError('카카오 회원가입에 실패했습니다.');
        setLoading(false);
        reject(err);
       }
      });
     });
    } catch (err) {
     console.error('카카오 SDK 로드 오류:', err);
     setError('카카오 회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
     setLoading(false);
     return;
    }
   }
   // 구글 회원가입
   else if (provider === "google") {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

    if (!googleClientId) {
     setError('구글 클라이언트 ID가 설정되지 않았습니다.');
     setLoading(false);
     return;
    }

    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
     try {
      // 현재 페이지의 origin을 리다이렉트 URI로 사용
      const redirectUri = window.location.origin;
      
      window.google.accounts.oauth2
       .initTokenClient({
        client_id: googleClientId,
        scope: 'openid email profile',
        redirect_uri: redirectUri, // 명시적으로 리다이렉트 URI 설정
        callback: async (response) => {
         try {
          const userInfoResponse = await fetch(
           `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`
          );
          const userInfo = await userInfoResponse.json();

          socialData = {
           provider: 'google',
           socialId: userInfo.id,
           email: userInfo.email,
           name: userInfo.name,
           profileImage: userInfo.picture || ''
          };

          const userData = await socialLogin(socialData);
          handleSocialSignupSuccess(userData);
         } catch (err) {
          console.error('구글 사용자 정보 조회 오류:', err);
          setError('구글 회원가입 처리 중 오류가 발생했습니다.');
          setLoading(false);
         }
        }
       })
       .requestAccessToken();
     } catch (err) {
      console.error('구글 SDK 오류:', err);
      setError('구글 회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setLoading(false);
     }
    } else {
     setError('구글 SDK를 불러오지 못했습니다. 인터넷 연결을 확인 후 다시 시도해주세요.');
     setLoading(false);
    }
   }
   // 페이스북 회원가입 (미구현 - 필요시 추가)
   else if (provider === "facebook") {
    setError('페이스북 회원가입은 현재 지원하지 않습니다.');
    setLoading(false);
   }
   // 애플 회원가입 (미구현 - 필요시 추가)
   else if (provider === "apple") {
    setError('애플 회원가입은 현재 지원하지 않습니다.');
    setLoading(false);
   }
  } catch (err) {
   console.error('소셜 회원가입 오류:', err);
   setError(err.response?.data?.message || '소셜 회원가입에 실패했습니다.');
   setLoading(false);
  }
 };

 // 소셜 회원가입 성공 처리
 const handleSocialSignupSuccess = (userData) => {
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

   // 회원가입 성공 후 마이페이지로 이동
   setTimeout(() => {
    window.location.href = "/mypage";
   }, 200);
  } else {
   setError("소셜 회원가입 응답이 올바르지 않습니다.");
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
       maxLength={50}
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
       maxLength={100}
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
       maxLength={20}
       pattern="[0-9\-]+"
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
     className="btn btn--primary btn--block"
     disabled={loading}
    >
     {loading ? "처리 중..." : "회원 가입"}
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

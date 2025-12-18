import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useAuthStore from "../../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthed } = useContext(AuthContext);
  const location = useLocation();
  const { setIntendedPath } = useAuthStore();
  
  // localStorage의 토큰도 확인 (상태 업데이트 전에도 인증 확인 가능)
  const token = localStorage.getItem("accessToken");
  const isAuthenticated = isAuthed || !!token;

  if (!isAuthenticated) {
    const target =
      location.pathname + location.search + location.hash;

    // 사용자가 원래 가려던 경로 저장 (새 탭/새로고침 유지 위해 sessionStorage도 사용)
    setIntendedPath(target);
    try {
      sessionStorage.setItem("intendedPath", target);
    } catch {
      // sessionStorage 사용 불가한 환경은 조용히 무시
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

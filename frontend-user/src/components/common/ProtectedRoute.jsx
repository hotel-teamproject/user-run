import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthed } = useContext(AuthContext);
  
  // localStorage의 토큰도 확인 (상태 업데이트 전에도 인증 확인 가능)
  const token = localStorage.getItem("accessToken");
  const isAuthenticated = isAuthed || !!token;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/userClient";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthed = !!user;

  // 로그인
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 로그아웃
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // 현재 사용자 정보 가져오기
  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      // 백엔드 응답 구조에 맞게 데이터 추출
      const userInfo = userData.data || userData;
      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // 토큰이 유효하지 않으면 삭제
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 시 사용자 정보 확인
  useEffect(() => {
    const saved = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (token) {
      // 토큰이 있으면 서버에서 사용자 정보 가져오기
      fetchUser();
    } else if (saved) {
      // 토큰이 없지만 저장된 사용자 정보가 있으면 삭제
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch {
        localStorage.removeItem("user");
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, isAuthed, login, logout, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

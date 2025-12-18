import { create } from "zustand";

// 인증 관련 전역 상태 (Zustand)
// - user, isAuthed: AuthContext와 함께 사용 (점진적 마이그레이션 가능)
// - intendedPath: 토큰 만료/보호 라우트 진입 시 사용자가 가고 싶었던 경로 저장

const useAuthStore = create((set) => ({
  user: null,
  isAuthed: false,
  intendedPath: null,

  setUser: (user) => set({ user, isAuthed: !!user }),
  clearUser: () => set({ user: null, isAuthed: false }),

  setIntendedPath: (path) => set({ intendedPath: path }),
  clearIntendedPath: () => set({ intendedPath: null }),
}));

export default useAuthStore;



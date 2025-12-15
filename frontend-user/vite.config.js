import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',                 // ✅ 추가 (배포에서 assets 경로 안정화)
  plugins: [react()],
  css: {
    devSourcemap: true       // ✅ 오타 수정: devsource → devSourcemap
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // ✅ 로컬 dev에선 보통 이게 안전함
        changeOrigin: true,
        secure: false
      }
    }
  }
})
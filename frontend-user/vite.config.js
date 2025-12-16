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
        // NOTE: Vite dev-server proxy only (개발용). docker-compose 안에서 실행하면 backend 서비스명으로 접근해야 함.
        target: 'http://backend:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
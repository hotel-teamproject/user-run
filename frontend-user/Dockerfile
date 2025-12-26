# Multi-stage build: 빌드 단계
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Nginx 서빙 단계
FROM nginx:1.25-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose ports
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]

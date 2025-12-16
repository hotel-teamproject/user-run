#!/bin/bash

# 서버 배포 스크립트
# 사용법: ./deploy.sh

set -e

echo "🚀 배포를 시작합니다..."

# 1. 프론트엔드 빌드
echo "📦 프론트엔드 빌드 중..."
cd frontend-user
if [ ! -d "node_modules" ]; then
  echo "npm 패키지 설치 중..."
  npm install
fi
npm run build
cd ..

# 2. Docker 이미지 빌드
echo "🐳 Docker 이미지 빌드 중..."
docker compose -f docker-compose.yml build

# 3. 기존 컨테이너 중지 및 제거
echo "🛑 기존 컨테이너 중지 중..."
docker compose -f docker-compose.yml down

# 4. 새 컨테이너 시작
echo "▶️  새 컨테이너 시작 중..."
docker compose -f docker-compose.yml up -d

# 5. 컨테이너 상태 확인
echo "📊 컨테이너 상태 확인 중..."
sleep 5
docker compose -f docker-compose.yml ps

echo "✅ 배포가 완료되었습니다!"
echo ""
echo "다음 명령어로 로그를 확인할 수 있습니다:"
echo "  docker compose -f docker-compose.yml logs -f"
echo ""
echo "초기 데이터를 설정하려면:"
echo "  docker compose -f docker-compose.yml exec backend npm run seed"


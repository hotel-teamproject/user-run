#!/bin/bash

# 배포 스크립트
# 사용법: ./deploy.sh

set -e  # 에러 발생 시 중단

echo "🚀 배포 시작..."

# 1. 최신 코드 가져오기 (Git 사용 시)
if [ -d ".git" ]; then
    echo "📥 Git에서 최신 코드 가져오기..."
    git pull origin main || git pull origin master
fi

# 2. 프론트엔드 빌드
echo "🔨 프론트엔드 빌드 중..."
cd frontend-user
npm install
npm run build
cd ..

# 3. Docker 이미지 재빌드 및 재시작
echo "🐳 Docker 컨테이너 재빌드 및 재시작..."
docker-compose build --no-cache frontend
docker-compose up -d

# 4. 백엔드 재시작 (코드 변경 반영)
echo "🔄 백엔드 재시작..."
docker-compose restart backend

echo "✅ 배포 완료!"
echo ""
echo "📊 컨테이너 상태 확인:"
docker-compose ps

echo ""
echo "📝 로그 확인:"
echo "  프론트엔드: docker-compose logs -f frontend"
echo "  백엔드: docker-compose logs -f backend"

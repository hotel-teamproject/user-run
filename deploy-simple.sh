#!/bin/bash

# 간단한 배포 스크립트 (빌드 없이 재시작만)
# 코드를 다운로드한 후 이 스크립트만 실행하면 됩니다

set -e

echo "🔄 서비스 재시작 중..."

# 백엔드는 volumes로 마운트되어 있어 재시작만 하면 반영됨
docker-compose restart backend

# 프론트엔드는 빌드가 필요하므로 경고 메시지
echo ""
echo "⚠️  프론트엔드 코드가 변경되었다면 다음 명령어를 실행하세요:"
echo "   cd frontend-user && npm run build && cd .."
echo "   docker-compose build frontend && docker-compose up -d frontend"
echo ""
echo "✅ 백엔드 재시작 완료!"


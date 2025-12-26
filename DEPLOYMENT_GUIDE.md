# 배포 가이드

## 현재 구조

### ✅ 백엔드
- **volumes로 소스 코드 마운트**: `./backend-user:/app`
- **코드 변경 후**: 컨테이너 재시작만 하면 자동 반영됨
- Node.js가 파일 변경을 감지하여 자동으로 재시작

### ⚠️ 프론트엔드
- **빌드된 정적 파일 사용**: `dist/` 폴더를 Nginx로 서빙
- **코드 변경 후**: 빌드 + Docker 이미지 재빌드 필요

---

## 배포 방법

### 방법 1: 자동 배포 스크립트 사용 (추천)

```bash
# 전체 배포 (빌드 포함)
./deploy.sh
```

이 스크립트는 다음을 자동으로 수행합니다:
1. Git에서 최신 코드 가져오기 (선택)
2. 프론트엔드 빌드 (`npm run build`)
3. Docker 이미지 재빌드
4. 컨테이너 재시작

### 방법 2: 수동 배포

#### 백엔드만 변경된 경우
```bash
# 재시작만 하면 됨
docker-compose restart backend
```

#### 프론트엔드만 변경된 경우
```bash
# 1. 빌드
cd frontend-user
npm install
npm run build
cd ..

# 2. Docker 이미지 재빌드 및 재시작
docker-compose build frontend
docker-compose up -d frontend
```

#### 전체 재배포
```bash
# 1. 프론트엔드 빌드
cd frontend-user
npm install
npm run build
cd ..

# 2. Docker 이미지 재빌드
docker-compose build

# 3. 컨테이너 재시작
docker-compose up -d
```

---

## 간단한 배포 (백엔드만)

백엔드 코드만 변경된 경우:

```bash
./deploy-simple.sh
```

또는:

```bash
docker-compose restart backend
```

---

## Git을 사용하는 경우

### 서버에서 코드 업데이트
```bash
# 1. 최신 코드 가져오기
git pull origin main  # 또는 master

# 2. 자동 배포
./deploy.sh
```

### 로컬에서 개발 후 배포
```bash
# 1. 코드 커밋 및 푸시
git add .
git commit -m "변경사항"
git push origin main

# 2. 서버에서
ssh user@server
cd /path/to/project
git pull
./deploy.sh
```

---

## 주의사항

### 프론트엔드 빌드가 필요한 경우
- React 컴포넌트 변경
- 스타일(SCSS) 변경
- 환경변수 변경 (`VITE_*`)
- 라우팅 변경
- 새로운 패키지 추가

### 프론트엔드 빌드가 불필요한 경우
- 백엔드 코드만 변경
- `.env` 파일만 변경 (백엔드 환경변수)
- Nginx 설정 변경 (`nginx.conf`)

### Nginx 설정 변경 시
```bash
# nginx.conf 변경 후
docker-compose build frontend
docker-compose up -d frontend

# 또는 컨테이너 내부에서 직접 수정 (임시)
docker exec -it frontend-user sh
# nginx.conf 수정 후
nginx -s reload
```

---

## 문제 해결

### 빌드 실패
```bash
# 캐시 없이 재빌드
docker-compose build --no-cache frontend
```

### 컨테이너가 시작되지 않음
```bash
# 로그 확인
docker-compose logs frontend
docker-compose logs backend

# 컨테이너 상태 확인
docker-compose ps
```

### 포트 충돌
```bash
# 기존 컨테이너 중지
docker-compose down

# 재시작
docker-compose up -d
```

---

## 빠른 참조

```bash
# 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f [service-name]

# 컨테이너 재시작
docker-compose restart [service-name]

# 전체 재시작
docker-compose restart

# 중지
docker-compose down

# 시작
docker-compose up -d
```


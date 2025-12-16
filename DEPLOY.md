# 서버 도커 배포 가이드

## 1. 사전 준비

### 서버에 필요한 것들
- Docker 및 Docker Compose 설치
- Git 설치 (선택사항)

### 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# MongoDB
MONGODB_URI=mongodb+srv://your-connection-string

# JWT
JWT_SECRET=your-production-secret-key-change-this
JWT_REFRESH_SECRET=your-production-refresh-secret-key-change-this
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Frontend
VITE_API_URL=http://your-server-ip-or-domain:3000
FRONT_ORIGIN=http://your-server-ip-or-domain

# Backend
NODE_ENV=production
PORT=3000
```

## 2. 배포 방법

### 방법 1: Git을 통한 배포 (권장)

```bash
# 서버에서 프로젝트 클론
git clone <your-repo-url>
cd user-run-3

# 환경 변수 파일 생성
cp env.example .env
# .env 파일을 편집하여 실제 값 입력

# 프론트엔드 빌드 (로컬 또는 CI/CD에서)
cd frontend-user
npm install
npm run build
cd ..

# Docker 이미지 빌드 및 실행
docker compose -f docker-compose.yml up -d --build
```

### 방법 2: 이미지 빌드 후 서버로 전송

#### 로컬에서:
```bash
# 1. 프론트엔드 빌드
cd frontend-user
npm install
npm run build
cd ..

# 2. Docker 이미지 빌드
docker compose -f docker-compose.yml build

# 3. 이미지 저장
docker save backend-user:latest | gzip > backend-image.tar.gz
docker save frontend-user:latest | gzip > frontend-image.tar.gz

# 4. 서버로 전송 (scp 사용)
scp backend-image.tar.gz frontend-image.tar.gz docker-compose.yml .env user@your-server:/path/to/deploy/
```

#### 서버에서:
```bash
# 1. 이미지 로드
docker load < backend-image.tar.gz
docker load < frontend-image.tar.gz

# 2. 컨테이너 실행
docker compose -f docker-compose.yml up -d
```

### 방법 3: Docker Registry 사용 (프로덕션 권장)

#### 로컬에서:
```bash
# 1. 프론트엔드 빌드
cd frontend-user
npm install
npm run build
cd ..

# 2. 이미지 빌드 및 태그
docker compose -f docker-compose.yml build
docker tag backend-user:latest your-registry/backend-user:latest
docker tag frontend-user:latest your-registry/frontend-user:latest

# 3. 레지스트리에 푸시
docker push your-registry/backend-user:latest
docker push your-registry/frontend-user:latest
```

#### 서버에서:
```bash
# 1. 레지스트리에서 이미지 pull
docker pull your-registry/backend-user:latest
docker pull your-registry/frontend-user:latest

# 2. docker-compose.yml 수정하여 이미지 사용
# 또는 docker-compose.yml에 이미지 경로 설정 후 실행
docker compose -f docker-compose.yml up -d
```

## 3. 서버에서 실행

```bash
# 컨테이너 시작
docker compose -f docker-compose.yml up -d

# 로그 확인
docker compose -f docker-compose.yml logs -f

# 컨테이너 상태 확인
docker compose -f docker-compose.yml ps

# 컨테이너 중지
docker compose -f docker-compose.yml down

# 컨테이너 중지 및 볼륨 삭제
docker compose -f docker-compose.yml down -v
```

## 4. 초기 데이터 설정

```bash
# 백엔드 컨테이너에 접속하여 초기 데이터 생성
docker compose -f docker-compose.yml exec backend npm run seed
```

## 5. 업데이트 배포

```bash
# 코드 변경 후 재배포
git pull  # 또는 새 코드 업로드
cd frontend-user && npm run build && cd ..
docker compose -f docker-compose.yml up -d --build
```

## 6. 포트 설정

- 프론트엔드: 80번 포트 (HTTP)
- 백엔드: 3000번 포트 (내부 통신)
- MongoDB: 27017번 포트 (내부 통신)

프로덕션에서는 Nginx 리버스 프록시를 사용하여 HTTPS를 설정하는 것을 권장합니다.

## 7. 문제 해결

### 컨테이너가 시작되지 않는 경우
```bash
# 로그 확인
docker compose -f docker-compose.yml logs

# 컨테이너 재시작
docker compose -f docker-compose.yml restart
```

### 데이터베이스 연결 오류
- `.env` 파일의 `MONGODB_URI` 확인
- MongoDB Atlas인 경우 IP 화이트리스트에 서버 IP 추가

### 프론트엔드가 백엔드에 연결되지 않는 경우
- `VITE_API_URL` 환경 변수 확인
- nginx.conf의 프록시 설정 확인
- 백엔드 컨테이너 이름이 `backend`인지 확인


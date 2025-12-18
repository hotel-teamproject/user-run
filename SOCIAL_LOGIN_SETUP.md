# 카카오톡 & 구글 로그인 실제 구현 가이드

## 📋 목차
1. [카카오 로그인 설정](#1-카카오-로그인-설정)
2. [구글 로그인 설정](#2-구글-로그인-설정)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [테스트 및 배포](#4-테스트-및-배포)

---

## 1. 카카오 로그인 설정

### 1.1 카카오 개발자 콘솔 접속
1. [카카오 개발자 콘솔](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인

### 1.2 애플리케이션 등록
1. **내 애플리케이션** → **애플리케이션 추가하기** 클릭
2. 앱 이름 입력 (예: "호텔 예약 시스템")
3. **저장** 클릭

### 1.3 플랫폼 설정
1. **앱 설정** → **플랫폼** 메뉴로 이동
2. **Web 플랫폼 등록** 클릭
3. 사이트 도메인 등록:
   - 개발 환경: `http://localhost:5173`
   - 프로덕션: `https://your-domain.com`
   - 예: `http://localhost:5173`, `https://w-hotel.store`

### 1.4 카카오 로그인 활성화
1. **제품 설정** → **카카오 로그인** 메뉴로 이동
2. **활성화 설정** → **ON**으로 변경
3. **Redirect URI 등록**:
   - 개발: `http://localhost:5173`
   - 프로덕션: `https://your-domain.com`
   - 예: `http://localhost:5173`, `https://w-hotel.store`

### 1.5 동의 항목 설정
1. **제품 설정** → **카카오 로그인** → **동의항목** 메뉴로 이동
2. 필수 동의 항목:
   - **닉네임** (필수)
   - **프로필 사진** (선택)
   - **카카오계정(이메일)** (선택, 이메일 필요시)

### 1.6 REST API 키 확인
1. **앱 설정** → **앱 키** 메뉴로 이동
2. **REST API 키** 복사 (JavaScript 키가 아님!)
   - 예: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### 1.7 보안 설정 (프로덕션)
1. **앱 설정** → **보안** 메뉴로 이동
2. **Client Secret** 생성 (프로덕션에서 사용)
3. **활성화 상태**: 개발용은 OFF, 프로덕션은 ON

---

## 2. 구글 로그인 설정

### 2.1 Google Cloud Console 접속
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Google 계정으로 로그인

### 2.2 프로젝트 생성
1. 상단 프로젝트 선택 → **새 프로젝트** 클릭
2. 프로젝트 이름 입력 (예: "Hotel Booking System")
3. **만들기** 클릭
4. 프로젝트 선택

### 2.3 OAuth 동의 화면 설정
1. **API 및 서비스** → **OAuth 동의 화면** 메뉴로 이동
2. **외부** 선택 → **만들기** 클릭
3. 앱 정보 입력:
   - **앱 이름**: 호텔 예약 시스템
   - **사용자 지원 이메일**: your-email@example.com
   - **앱 로고**: (선택사항)
   - **앱 도메인**: your-domain.com
   - **개발자 연락처 정보**: your-email@example.com
4. **저장 후 계속** 클릭

### 2.4 범위(Scopes) 설정
1. **범위** 탭에서:
   - `openid` (자동 추가됨)
   - `email`
   - `profile`
2. **저장 후 계속** 클릭

### 2.5 테스트 사용자 추가 (개발 단계)
1. **테스트 사용자** 탭으로 이동
2. **+ ADD USERS** 클릭
3. 테스트할 Google 계정 이메일 추가
4. **저장 후 계속** 클릭

### 2.6 OAuth 2.0 클라이언트 ID 생성
1. **API 및 서비스** → **사용자 인증 정보** 메뉴로 이동
2. **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID** 선택
3. **애플리케이션 유형**: **웹 애플리케이션** 선택
4. **이름**: "Hotel Booking Web Client" 입력
5. **승인된 자바스크립트 원본**:
   - 개발: `http://localhost:5173`
   - 프로덕션: `https://your-domain.com`
6. **승인된 리디렉션 URI**:
   - 개발: `http://localhost:5173`
   - 프로덕션: `https://your-domain.com`
7. **만들기** 클릭
8. **클라이언트 ID** 복사 (예: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

---

## 3. 환경 변수 설정

### 3.1 프론트엔드 환경 변수

프로젝트 루트에 `.env` 파일 생성 (또는 기존 파일 수정):

```env
# 카카오 로그인
VITE_KAKAO_APP_KEY=your-kakao-rest-api-key-here

# 구글 로그인
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

# 애플 로그인 (선택사항)
VITE_APPLE_CLIENT_ID=your-apple-client-id-here
```

**예시:**
```env
VITE_KAKAO_APP_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### 3.2 환경 변수 파일 위치
- 개발: 프로젝트 루트의 `.env` 파일
- 프로덕션: 서버의 `.env` 파일 또는 환경 변수로 설정

### 3.3 Vite 환경 변수 주의사항
- Vite는 `VITE_` 접두사가 있는 변수만 클라이언트에 노출됩니다
- 환경 변수 변경 후 개발 서버 재시작 필요

---

## 4. 테스트 및 배포

### 4.1 로컬 테스트

1. **환경 변수 설정 확인**
   ```bash
   # .env 파일 확인
   cat .env | grep VITE
   ```

2. **개발 서버 재시작**
   ```bash
   cd frontend-user
   npm run dev
   ```

3. **로그인 페이지 접속**
   - `http://localhost:5173/login` 접속
   - 카카오/구글 로그인 버튼 클릭
   - OAuth 인증 플로우 확인

### 4.2 프로덕션 배포

1. **카카오 개발자 콘솔**
   - 프로덕션 도메인을 플랫폼에 등록
   - Redirect URI에 프로덕션 URL 추가
   - 보안 설정 확인

2. **Google Cloud Console**
   - 승인된 자바스크립트 원본에 프로덕션 도메인 추가
   - 승인된 리디렉션 URI에 프로덕션 URL 추가
   - OAuth 동의 화면에서 **프로덕션**으로 전환 (필요시)

3. **서버 환경 변수 설정**
   ```bash
   # 서버의 .env 파일에 추가
   VITE_KAKAO_APP_KEY=your-production-kakao-key
   VITE_GOOGLE_CLIENT_ID=your-production-google-id
   ```

4. **프론트엔드 빌드 및 배포**
   ```bash
   cd frontend-user
   npm run build
   # 빌드된 dist 폴더를 서버에 배포
   ```

### 4.3 문제 해결

#### 카카오 로그인이 작동하지 않는 경우
- [ ] REST API 키가 올바른지 확인 (JavaScript 키가 아님!)
- [ ] 플랫폼에 도메인이 등록되어 있는지 확인
- [ ] Redirect URI가 정확히 일치하는지 확인
- [ ] 카카오 로그인이 활성화되어 있는지 확인
- [ ] 브라우저 콘솔에서 에러 메시지 확인

#### 구글 로그인이 작동하지 않는 경우
- [ ] 클라이언트 ID가 올바른지 확인
- [ ] 승인된 자바스크립트 원본에 도메인이 등록되어 있는지 확인
- [ ] 승인된 리디렉션 URI가 정확히 일치하는지 확인
- [ ] 테스트 사용자로 등록되어 있는지 확인 (개발 단계)
- [ ] OAuth 동의 화면이 완료되었는지 확인
- [ ] 브라우저 콘솔에서 에러 메시지 확인

#### 일반적인 문제
- **CORS 오류**: 도메인이 승인된 목록에 있는지 확인
- **리디렉션 오류**: Redirect URI가 정확히 일치해야 함 (http/https, 포트, 경로)
- **환경 변수 미적용**: 개발 서버 재시작 필요

---

## 5. 보안 고려사항

### 5.1 카카오
- REST API 키는 클라이언트에 노출되어도 안전하지만, 도메인 제한 설정 권장
- 프로덕션에서는 Client Secret 사용 고려

### 5.2 구글
- 클라이언트 ID는 클라이언트에 노출되어도 안전함
- 민감한 작업에는 서버 사이드 OAuth 플로우 사용 권장

### 5.3 일반
- 환경 변수는 Git에 커밋하지 않도록 `.gitignore`에 추가
- 프로덕션과 개발 환경의 키를 분리하여 사용

---

## 6. 추가 리소스

- [카카오 로그인 공식 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [구글 OAuth 2.0 공식 문서](https://developers.google.com/identity/protocols/oauth2)
- [카카오 개발자 콘솔](https://developers.kakao.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## 7. 체크리스트

### 카카오 로그인
- [ ] 카카오 개발자 콘솔에서 앱 생성
- [ ] Web 플랫폼 등록 및 도메인 추가
- [ ] 카카오 로그인 활성화
- [ ] Redirect URI 등록
- [ ] 동의 항목 설정
- [ ] REST API 키 복사
- [ ] 환경 변수에 REST API 키 설정

### 구글 로그인
- [ ] Google Cloud Console에서 프로젝트 생성
- [ ] OAuth 동의 화면 설정
- [ ] OAuth 2.0 클라이언트 ID 생성
- [ ] 승인된 자바스크립트 원본 등록
- [ ] 승인된 리디렉션 URI 등록
- [ ] 테스트 사용자 추가 (개발 단계)
- [ ] 환경 변수에 클라이언트 ID 설정

### 공통
- [ ] `.env` 파일에 환경 변수 설정
- [ ] 개발 서버 재시작
- [ ] 로그인 테스트
- [ ] 프로덕션 도메인 설정
- [ ] 프로덕션 배포 및 테스트


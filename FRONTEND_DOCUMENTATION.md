# 프런트엔드 기능 정리 문서

## 개요
이 문서는 호텔 예약 웹 애플리케이션의 프런트엔드 주요 기능과 구현 내용을 정리한 문서입니다.

---

## 1. 검색 페이지 (SearchPage)

### 프로젝트 실적(자료)
**파일 위치:** `frontend-user/src/pages/search/SearchPage.jsx`  
**레이아웃:** `frontend-user/src/components/layouts/SearchLayout.jsx`

### 내용 설명
- **기능:** 사용자가 지역, 날짜, 인원 수로 호텔을 실시간으로 검색할 수 있는 필터 인터페이스를 제공합니다.
- **표시 정보:** 
  - 호텔 목록을 카드 형태로 표시
  - 각 호텔의 썸네일 이미지, 등급, 평점, 리뷰 수, 시작 가격 정보 노출
  - 검색 결과 총 개수 및 현재 페이지 표시
- **정렬/필터링:** 
  - 정렬 옵션: 추천순, 가격 낮은순, 가격 높은순, 평점순
  - 필터 옵션: 가격 범위, 평점, 무료 서비스(조식포함, 무료주차, 와이파이 등), 편의시설
  - 호텔 타입 탭: 전체, 호텔, 모텔, 리조트
- **페이지네이션:** 한 페이지당 5개 호텔 표시, 페이지 번호 및 이전/다음 버튼 제공
- **기술적 특징:**
  - `useMemo`를 활용한 필터링 및 정렬 최적화
  - 실시간 필터 변경 시 자동으로 첫 페이지로 리셋
  - 필터 상태는 `SearchLayout`의 `OutletContext`를 통해 전달받음

---

## 2. 검색 결과 카드 (HotelListCards)

### 프로젝트 실적(자료)
**파일 위치:** `frontend-user/src/components/search/HotelListCards.jsx`

### 내용 설명
- **표시 정보:** 
  - 각 호텔에 대한 썸네일 이미지, 호텔명, 위치, 등급(별점), 평점, 리뷰 수, 시작 가격을 간략하게 표시
  - 이미지 개수 표시 (예: "사진 5장")
  - 편의시설 개수 표시
- **상호작용:** 
  - 카드 클릭 시 해당 호텔의 상세 페이지(`/hotels/:hotelId`)로 이동
  - 위시리스트 버튼: 로그인한 사용자는 하트 아이콘으로 위시리스트 추가/제거 가능
  - 상세보기 버튼: 호텔 상세 페이지로 이동
- **기술적 특징:**
  - 로그인 상태에 따른 위시리스트 기능 활성화/비활성화
  - 각 호텔의 위시리스트 상태를 개별적으로 관리
  - 이미지 로드 실패 시 플레이스홀더 이미지로 대체

---

## 3. 호텔 상세 페이지 (HotelDetailPage)

### 프로젝트 실적(자료)
**파일 위치:** `frontend-user/src/pages/hotel/HotelDetailPage.jsx`  
**주요 컴포넌트:**
- `HotelDetailHeader.jsx` - 호텔 헤더 정보
- `HotelGallery.jsx` - 호텔 이미지 갤러리
- `HotelOverview.jsx` - 호텔 개요 정보
- `Amenities.jsx` - 편의시설 목록
- `AvailableRooms.jsx` - 예약 가능한 객실 목록
- `HotelMap.jsx` - 호텔 위치 지도
- `HotelReviews.jsx` - 리뷰 섹션

### 내용 설명
- **표시 정보:** 
  - 호텔 갤러리(이미지 슬라이더): 여러 장의 호텔 이미지를 갤러리 형태로 표시
  - 상세 호텔 정보: 호텔명, 위치, 설명, 평점, 리뷰 수, 태그
  - 편의시설 목록: 호텔이 제공하는 편의시설을 아이콘과 함께 표시
  - 룸타입별 오퍼(제안): 각 룸타입의 가격, 침대 타입, 최대 인원 수, 예약하기 버튼
  - 호텔 위치 지도: Google Maps를 통한 호텔 위치 표시
  - 리뷰 섹션: 호텔에 대한 리뷰 목록 및 평균 평점
- **동적 업데이트:** 
  - 상세 페이지 내에서 기간 또는 인원 필터를 수정하면, 이에 맞춰 오퍼 정보가 재조회되어 업데이트됨
  - 예약하기 버튼 클릭 시 `/booking/:hotelId`로 이동하여 예약 프로세스 시작
- **기술적 특징:**
  - 병렬 API 호출로 호텔 정보, 객실 목록, 리뷰 목록을 동시에 로드
  - URL 파라미터(`hotelId`)를 통해 호텔 정보 조회
  - 로딩 상태 및 에러 처리 구현

---

## 4. 상세/리뷰 영역 (HotelReviews)

### 프로젝트 실적(자료)
**파일 위치:** `frontend-user/src/components/hotelpage/HotelReviews.jsx`  
**리뷰 작성 모달:** `frontend-user/src/components/hotelpage/ReviewWriteModal.jsx`

### 내용 설명
- **리뷰 작성 조건:** 
  - 로그인한 사용자만 리뷰 작성 가능
  - 사용자가 이미 리뷰를 작성한 경우 "내 리뷰 수정" 버튼 표시
- **리뷰 기능:** 
  - 호텔별 평균 평점 자동 재계산 및 표시
  - 리뷰 작성 시 5점 만점 별점 선택 및 최소 10자 이상의 리뷰 내용 입력
  - 리뷰 수정: 본인이 작성한 리뷰만 수정 가능
  - 리뷰 삭제: 본인이 작성한 리뷰만 삭제 가능 (확인 다이얼로그 포함)
  - 리뷰 목록 표시: 작성자 프로필 이미지(또는 아바타), 이름, 평점, 작성일, 리뷰 내용
- **기술적 특징:**
  - 리뷰 작성/수정은 모달 형태로 구현
  - 별점 호버 효과 제공
  - 리뷰 작성 후 자동으로 리뷰 목록 새로고침
  - 사용자별 아바타 색상 자동 생성 (프로필 이미지가 없는 경우)

---

## 5. 상세/카카오맵 (HotelMap)

### 프로젝트 실적(자료)
**파일 위치:** `frontend-user/src/components/hotelpage/HotelMap.jsx`

### 내용 설명
- **지도 통합:** 
  - Google Maps Embed API를 활용하여 호텔의 위치를 지도 위에 마커로 표시
  - 호텔 주소를 기반으로 지도에 표시
  - "Google Maps에서 보기" 링크 제공하여 새 탭에서 상세 지도 확인 가능
- **표시 정보:** 
  - 호텔 주소 정보 표시
  - 지도 iframe을 통한 위치 시각화
- **기술적 특징:**
  - Google Maps API 키 사용 (현재 하드코딩되어 있음 - 환경 변수로 변경 권장)
  - 주소가 없는 경우 기본값으로 "서울시청" 사용
  - 반응형 디자인으로 모바일에서도 최적화

---

## 6. 마이페이지/예약내역 (MyBookingsPage)

### 프로젝트 실적(자료)
**파일 위치:** `frontend-user/src/pages/mypage/MyBookingsPage.jsx`  
**레이아웃:** `frontend-user/src/components/layouts/MyPageLayout.jsx`

### 내용 설명
- **기능:** 
  - 사용자 개인의 예약 리스트를 조회
  - 예약 상태별 필터링: 예정된 예약, 지난 예약, 취소된 예약
- **표시 정보:** 
  - 각 예약 카드에 표시되는 정보:
    - 호텔 이미지 및 호텔명
    - 호텔 위치 (도시, 주소)
    - 예약 상태 배지 (대기 중, 확정, 취소됨, 완료 등)
    - 체크인/체크아웃 날짜 및 시간
    - 객실 정보 (객실명/타입)
    - 인원 수
    - 숙박 일수 (N박 N+1일)
    - 총 결제 금액
  - 상세보기 버튼: 예약 상세 페이지로 이동
- **기술적 특징:**
  - 로그인한 사용자의 예약만 조회
  - 날짜 기반 필터링 (체크아웃 날짜 기준)
  - 예약이 없는 경우 안내 메시지 표시
  - 로딩 상태 및 에러 처리 구현

---

## 7. 마이페이지/예약 취소 (MyBookingDetailPage)

### 프로젝트 실적(자료)
**파일 위치:** `frontend-user/src/pages/mypage/MyBookingDetailPage.jsx`

### 내용 설명
- **기능:** 
  - 예약 상세 정보 조회
  - 예약 취소 기능 제공
  - 환불 가능/불가 여부를 정책에 따라 체크
- **표시 정보:** 
  - 예약 상태 배지 및 예약 번호
  - 호텔 정보: 호텔 이미지, 호텔명, 주소, 편의시설
  - 예약 정보: 객실, 체크인/체크아웃 날짜 및 시간, 숙박 일수, 인원, 특별 요청사항
  - 결제 정보: 객실 요금, 할인 금액, 총 결제 금액, 결제 수단, 결제 상태, 예약 일시
- **예약 취소 프로세스:** 
  1. 예약 취소 버튼 클릭 (취소 가능한 예약만 버튼 표시)
  2. 취소 모달에서 취소 사유 입력 (선택사항)
  3. 확인 다이얼로그를 통한 최종 확인
  4. 백엔드 API 호출을 통한 예약 취소 처리
  5. 취소 성공 시 예약 정보 자동 새로고침
- **취소 가능 조건:** 
  - 예약 상태가 "confirmed" 또는 "pending"인 경우
  - 체크인 날짜가 아직 지나지 않은 경우
- **기술적 특징:**
  - 취소 모달을 통한 사용자 친화적인 취소 프로세스
  - 취소 사유 입력 (선택사항)
  - 취소 중 상태 표시 (로딩 상태)
  - 취소 후 예약 정보 자동 업데이트
  - 백엔드 연동: 예약 취소 시 재고 복구 및 환불 트리거 (백엔드에서 처리)

---

## 8. 필터 사이드바 (FilterSidebar)

### 프로젝트 실적(자료)
**파일 위치:** `frontend-user/src/components/search/FilterSidebar.jsx`

### 내용 설명
- **가격 필터:** 
  - 슬라이더를 통한 최소/최대 가격 설정
  - 범위: 30,000원 ~ 1,000,000원
  - 실시간 가격 범위 표시
- **평점 필터:** 
  - 버튼 형태의 평점 선택: 전체, 매우 나쁨, 나쁨, 보통, 좋음, 매우 좋음, 최고
  - 단일 선택 방식 (같은 평점 재클릭 시 전체로 리셋)
- **무료 서비스 필터:** 
  - 체크박스 형태의 다중 선택
  - 옵션: 조식포함, 무료주차, 와이파이, 공항셔틀버스, 무료취소, 셔틀버스
- **편의시설 필터:** 
  - 체크박스 형태의 다중 선택
  - 기본 5개 표시, "더보기" 버튼으로 전체 표시
  - 옵션: 와이파이, 주차장, 레스토랑, 수영장, 피트니스, 스파, 24시간 프론트 데스크, 라운지, 비즈니스 센터, 온천, 골프장, 해변, 키즈클럽, 스키장, 사우나, 카페, 에어컨, TV, 냉난방 등
- **기술적 특징:**
  - 필터 변경 시 즉시 상위 컴포넌트에 전달 (`onFilterChange` 콜백)
  - 필터 섹션 접기/펼치기 기능 (UI만 구현, 실제 동작은 미구현)

---

## 9. 예약 가능한 객실 (AvailableRooms)

### 프로젝트 실적(자료)
**파일 위치:** `frontend-user/src/components/hotelpage/AvailableRooms.jsx`

### 내용 설명
- **표시 정보:** 
  - 각 객실의 이미지, 객실명
  - 침대 타입 (싱글, 더블, 퀸, 킹, 트윈)
  - 최대 인원 수
  - 객실 가격 (1박 기준)
- **상호작용:** 
  - "예약하기" 버튼 클릭 시 예약 프로세스 시작 (`/booking/:hotelId`)
  - 호텔 ID를 쿼리 파라미터로 전달
- **기술적 특징:**
  - 객실이 없는 경우 안내 메시지 표시
  - 침대 타입을 한글로 변환하여 표시
  - 객실 이미지가 없는 경우 플레이스홀더 이미지 사용

---

## 기술 스택 및 아키텍처

### 주요 기술
- **프레임워크:** React 18+
- **라우팅:** React Router v6
- **상태 관리:** Context API (AuthContext)
- **HTTP 클라이언트:** Axios
- **스타일링:** SCSS
- **아이콘:** React Icons (FaStar, FaEdit, FaTrash 등)

### 주요 디렉토리 구조
```
frontend-user/src/
├── api/              # API 클라이언트 (axios 기반)
├── components/       # 재사용 가능한 컴포넌트
│   ├── auth/        # 인증 관련 컴포넌트
│   ├── common/      # 공통 컴포넌트 (Header, Footer 등)
│   ├── hotelpage/   # 호텔 상세 페이지 컴포넌트
│   ├── search/      # 검색 관련 컴포넌트
│   ├── mypage/      # 마이페이지 컴포넌트
│   └── layouts/     # 레이아웃 컴포넌트
├── pages/           # 페이지 컴포넌트
│   ├── auth/        # 인증 페이지
│   ├── hotel/       # 호텔 상세 페이지
│   ├── search/      # 검색 페이지
│   ├── mypage/      # 마이페이지
│   └── booking/     # 예약 프로세스 페이지
├── context/         # Context API (인증 상태 등)
├── store/           # 상태 관리 (Zustand 등)
├── styles/          # SCSS 스타일 파일
└── util/            # 유틸리티 함수
```

### API 통신
- 모든 API 호출은 `api/` 디렉토리의 클라이언트 파일을 통해 처리
- Axios 인스턴스를 통한 통합 설정 (`api/axiosConfig.js`)
- 인증 토큰 자동 주입 및 에러 처리

---

## 주요 기능 흐름

### 1. 호텔 검색 → 상세 페이지 → 예약
1. 사용자가 검색 페이지에서 필터 설정
2. 호텔 목록 조회 및 표시
3. 호텔 카드 클릭 → 호텔 상세 페이지 이동
4. 객실 선택 및 예약하기 버튼 클릭
5. 예약 프로세스 시작 (`/booking/:hotelId`)

### 2. 예약 내역 조회 → 예약 취소
1. 마이페이지 → 예약내역 메뉴 선택
2. 예약 목록 조회 (필터링 가능)
3. 예약 상세보기 버튼 클릭
4. 예약 상세 페이지에서 취소 가능 여부 확인
5. 예약 취소 버튼 클릭 → 취소 사유 입력 → 취소 완료

### 3. 리뷰 작성
1. 호텔 상세 페이지에서 리뷰 섹션 확인
2. 리뷰 작성 버튼 클릭 (로그인 필요)
3. 모달에서 별점 선택 및 리뷰 내용 입력
4. 리뷰 작성 완료 → 리뷰 목록 자동 새로고침

---

## 개선 사항 및 권장 사항

1. **Google Maps API 키:** 현재 하드코딩되어 있음. 환경 변수로 관리 권장
2. **에러 처리:** 일부 컴포넌트에서 에러 처리가 부족할 수 있음. 전역 에러 핸들러 추가 권장
3. **로딩 상태:** 일부 API 호출에서 로딩 상태 표시가 부족할 수 있음
4. **반응형 디자인:** 모바일 환경에서의 최적화 추가 검토 필요
5. **접근성:** ARIA 레이블 및 키보드 네비게이션 개선 권장
6. **성능 최적화:** 이미지 lazy loading, 코드 스플리팅 등 성능 최적화 고려

---

## 참고 파일 목록

### 주요 페이지
- `frontend-user/src/pages/search/SearchPage.jsx`
- `frontend-user/src/pages/hotel/HotelDetailPage.jsx`
- `frontend-user/src/pages/mypage/MyBookingsPage.jsx`
- `frontend-user/src/pages/mypage/MyBookingDetailPage.jsx`

### 주요 컴포넌트
- `frontend-user/src/components/search/HotelListCards.jsx`
- `frontend-user/src/components/search/FilterSidebar.jsx`
- `frontend-user/src/components/hotelpage/AvailableRooms.jsx`
- `frontend-user/src/components/hotelpage/HotelReviews.jsx`
- `frontend-user/src/components/hotelpage/ReviewWriteModal.jsx`
- `frontend-user/src/components/hotelpage/HotelMap.jsx`

### API 클라이언트
- `frontend-user/src/api/hotelClient.js`
- `frontend-user/src/api/reservationClient.js`
- `frontend-user/src/api/reviewClient.js`
- `frontend-user/src/api/wishlistClient.js`


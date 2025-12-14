import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// 모델 import
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import Card from '../models/Card.js';
import Wishlist from '../models/Wishlist.js';
import Payment from '../models/Payment.js';
import connectDB from '../config/db.js';

dotenv.config();

// 초기 데이터 생성
const initData = async () => {
  try {
    console.log('🚀 데이터베이스 연결 중...');
    await connectDB();

    // 기존 데이터 삭제
    console.log('🗑️  기존 데이터 삭제 중...');
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Room.deleteMany({});
    await Reservation.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});
    await Card.deleteMany({});
    await Wishlist.deleteMany({});
    await Payment.deleteMany({});

    // 1. 사용자 생성
    console.log('👤 사용자 생성 중...');
    const hashedPassword = await bcrypt.hash('1234', 10);

    // 일반 사용자 1명만 남기고 추가로 8명 생성 (총 9명)
    const users = await User.insertMany([
      {
        name: '일반사용자',
        email: 'user@gmail.com',
        password: hashedPassword,
        phone: '010-1234-5678',
        role: 'user',
        socialProvider: 'local'
      },
      {
        name: '김민수',
        email: 'kim@gmail.com',
        password: hashedPassword,
        phone: '010-1111-2222',
        role: 'user',
        socialProvider: 'local'
      },
      {
        name: '이지은',
        email: 'lee@gmail.com',
        password: hashedPassword,
        phone: '010-2222-3333',
        role: 'user',
        socialProvider: 'local'
      },
      {
        name: '박준호',
        email: 'park@gmail.com',
        password: hashedPassword,
        phone: '010-3333-4444',
        role: 'user',
        socialProvider: 'local'
      },
      {
        name: '최수진',
        email: 'choi@gmail.com',
        password: hashedPassword,
        phone: '010-4444-5555',
        role: 'user',
        socialProvider: 'local'
      },
      {
        name: '정태영',
        email: 'jung@gmail.com',
        password: hashedPassword,
        phone: '010-5555-6666',
        role: 'user',
        socialProvider: 'local'
      },
      {
        name: '한소희',
        email: 'han@gmail.com',
        password: hashedPassword,
        phone: '010-6666-7777',
        role: 'user',
        socialProvider: 'local'
      },
      {
        name: '윤도현',
        email: 'yoon@gmail.com',
        password: hashedPassword,
        phone: '010-7777-8888',
        role: 'user',
        socialProvider: 'local'
      },
      {
        name: '강미영',
        email: 'kang@gmail.com',
        password: hashedPassword,
        phone: '010-8888-9999',
        role: 'user',
        socialProvider: 'local'
      }
    ]);

    const normalUser = users[0];
    const ownerUser = users[0]; // 사업자 계정은 일반사용자로 설정

    console.log(`✅ ${users.length}명의 사용자 생성 완료`);

    // 2. 호텔 생성
    console.log('🏨 호텔 생성 중...');
    const hotelsData = [
      // 호텔 5개
      {
        name: '서울 그랜드 호텔',
        description: '서울 강남 중심가에 위치한 럭셔리 호텔입니다. 최고급 시설과 서비스로 고객님께 잊을 수 없는 경험을 제공합니다.',
        address: '서울특별시 강남구 테헤란로 123',
        city: '서울',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
          'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        amenities: ['와이파이', '주차장', '레스토랑', '수영장', '피트니스', '스파', '24시간 프론트 데스크', '라운지', '비즈니스 센터'],
        tags: ['럭셔리', '비즈니스', '커플', '도심'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '부산 비즈니스 호텔',
        description: '부산 해운대 중심가에 위치한 비즈니스 호텔입니다. 출장과 관광에 최적화된 편리한 시설을 갖추고 있습니다.',
        address: '부산광역시 해운대구 해운대해변로 456',
        city: '부산',
        images: [
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
          'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'
        ],
        amenities: ['와이파이', '주차장', '레스토랑', '비즈니스 센터', '피트니스', '24시간 프론트 데스크'],
        tags: ['비즈니스', '도심', '편리', '출장'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '제주 프리미엄 호텔',
        description: '제주 한라산을 조망할 수 있는 프리미엄 호텔입니다. 제주도의 자연을 만끽할 수 있는 특별한 숙박 경험을 제공합니다.',
        address: '제주특별자치도 제주시 연동 789',
        city: '제주',
        images: [
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
          'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        amenities: ['와이파이', '주차장', '레스토랑', '온천', '스파', '피트니스', '24시간 프론트 데스크'],
        tags: ['프리미엄', '자연', '온천', '커플'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '인천 공항 스카이 호텔',
        description: '인천국제공항에서 가장 가까운 비즈니스 호텔입니다. 조용하고 편리한 시설로 출장객에게 최적의 숙박을 제공합니다.',
        address: '인천광역시 중구 공항로 272',
        city: '인천',
        images: [
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
          'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'
        ],
        amenities: ['와이파이', '주차장', '레스토랑', '24시간 프론트', '셔틀버스', '비즈니스 센터'],
        tags: ['공항', '비즈니스', '편리', '출장'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '서울 명동 센트럴 호텔',
        description: '서울 명동 중심가에 위치한 편리한 호텔입니다. 쇼핑과 관광에 최적의 위치를 자랑합니다.',
        address: '서울특별시 중구 명동길 100',
        city: '서울',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
          'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'
        ],
        amenities: ['와이파이', '주차장', '레스토랑', '24시간 프론트 데스크', '라운지'],
        tags: ['도심', '쇼핑', '관광', '편리'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      // 모텔 4개
      {
        name: '부산 해운대 모텔',
        description: '부산 해운대 해변 근처에 위치한 깔끔한 모텔입니다. 해변까지 도보 5분 거리의 편리한 위치입니다.',
        address: '부산광역시 해운대구 해운대해변로 300',
        city: '부산',
        images: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
          'https://images.unsplash.com/photo-1595576508892-0b6b3b0b0e0b?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        amenities: ['와이파이', '주차장', '냉난방', 'TV', '에어컨', '욕실용품', '해변 접근'],
        tags: ['해변', '커플', '가성비', '편리'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '제주 시티 모텔',
        description: '제주시 중심가에 위치한 깔끔하고 편리한 모텔입니다. 렌터카 여행에 최적화된 위치입니다.',
        address: '제주특별자치도 제주시 노형동 456',
        city: '제주',
        images: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
          'https://images.unsplash.com/photo-1595576508892-0b6b3b0b0e0b?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        amenities: ['와이파이', '주차장', '냉난방', 'TV', '에어컨', '욕실용품', '렌터카 주차'],
        tags: ['가성비', '편리', '렌터카', '도심'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '인천 송도 모텔',
        description: '인천 송도국제도시에 위치한 모던한 모텔입니다. 깔끔한 인테리어와 편리한 시설을 갖추고 있습니다.',
        address: '인천광역시 연수구 송도과학로 123',
        city: '인천',
        images: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
          'https://images.unsplash.com/photo-1595576508892-0b6b3b0b0e0b?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'
        ],
        amenities: ['와이파이', '주차장', '냉난방', 'TV', '에어컨', '욕실용품'],
        tags: ['가성비', '모던', '편리', '커플'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '대구 중앙 모텔',
        description: '대구 중앙역 근처에 위치한 편리한 모텔입니다. 대구 관광과 쇼핑에 최적의 위치입니다.',
        address: '대구광역시 중구 중앙대로 400',
        city: '대구',
        images: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
          'https://images.unsplash.com/photo-1595576508892-0b6b3b0b0e0b?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'
        ],
        amenities: ['와이파이', '주차장', '냉난방', 'TV', '에어컨', '욕실용품'],
        tags: ['가성비', '편리', '관광', '도심'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      // 리조트 5개
      {
        name: '제주 해비치 리조트',
        description: '제주 서귀포 해안가에 위치한 프리미엄 리조트입니다. 골프장과 해변을 동시에 즐길 수 있는 최고의 휴양지입니다.',
        address: '제주특별자치도 서귀포시 중문관광로 72',
        city: '제주',
        images: [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
          'https://images.unsplash.com/photo-1551524164-6cf77f5e7e8d?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        amenities: ['와이파이', '주차장', '레스토랑', '골프장', '해변', '스파', '피트니스', '키즈클럽'],
        tags: ['리조트', '골프', '해변', '가족'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '강원도 스키 리조트',
        description: '강원도 평창에 위치한 스키장 인근 리조트입니다. 겨울 스포츠와 여름 휴양을 동시에 즐길 수 있습니다.',
        address: '강원도 평창군 대화면 올림픽로 555',
        city: '평창',
        images: [
          'https://images.unsplash.com/photo-1551524164-6cf77f5e7e8d?w=800',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        amenities: ['와이파이', '주차장', '레스토랑', '스키장', '곤돌라', '스파', '피트니스', '사우나'],
        tags: ['스키', '리조트', '액티비티', '겨울'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '부산 해변 리조트',
        description: '부산 해운대 해변 바로 앞에 위치한 리조트 호텔입니다. 바다 전망을 감상하며 휴식을 취하실 수 있습니다.',
        address: '부산광역시 해운대구 해운대해변로 456',
        city: '부산',
        images: [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
          'https://images.unsplash.com/photo-1595576508892-0b6b3b0b0e0b?w=800'
        ],
        amenities: ['와이파이', '주차장', '레스토랑', '수영장', '해변 접근', '비치 체어', '피트니스', '스파'],
        tags: ['리조트', '해변', '휴양', '가족'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '속초 해수욕장 리조트',
        description: '속초 대포항 앞바다를 내려다보는 해안가 리조트입니다. 신선한 해산물과 아름다운 일출을 감상할 수 있습니다.',
        address: '강원도 속초시 해안로 123',
        city: '속초',
        images: [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
          'https://images.unsplash.com/photo-1551524164-6cf77f5e7e8d?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        amenities: ['와이파이', '주차장', '레스토랑', '해수욕장', '피트니스', '사우나', '해산물 식당', '수영장'],
        tags: ['해안', '일출', '해산물', '가족'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '여수 오동도 바다뷰 리조트',
        description: '여수 오동도를 전망하는 프리미엄 리조트입니다. 바다와 섬이 어우러진 아름다운 풍경을 즐기실 수 있습니다.',
        address: '전라남도 여수시 오동도로 222',
        city: '여수',
        images: [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
          'https://images.unsplash.com/photo-1551524164-6cf77f5e7e8d?w=800',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        amenities: ['와이파이', '주차장', '레스토랑', '해변 접근', '피트니스', '스파', '카페', '수영장'],
        tags: ['바다뷰', '프리미엄', '로맨틱', '커플'],
        rating: 0,
        reviewCount: 0,
        owner: ownerUser._id,
        status: 'active'
      }
    ];

    // 프론트엔드 호환을 위한 필드 추가
    const hotelsDataWithFrontendFields = hotelsData.map(hotel => {
      // rating 기반으로 stars 계산 (4.5 이상 = 5성, 3.5 이상 = 4성, 2.5 이상 = 3성, 1.5 이상 = 2성, 그 외 = 1성)
      const calculateStars = (rating) => {
        if (rating >= 4.5) return 5;
        if (rating >= 3.5) return 4;
        if (rating >= 2.5) return 3;
        if (rating >= 1.5) return 2;
        return 1;
      };

      return {
        ...hotel,
        location: hotel.address, // location 필드 추가
        image: hotel.images && hotel.images.length > 0 ? hotel.images[0] : null, // image 필드 추가
        imageCount: hotel.images ? hotel.images.length : 0, // imageCount 필드 추가
        stars: calculateStars(hotel.rating || 4.0) // stars 필드 추가 (rating 기반)
      };
    });

    const hotels = await Hotel.insertMany(hotelsDataWithFrontendFields);
    console.log(`✅ ${hotels.length}개의 호텔 생성 완료`);

    // 3. 객실 생성
    console.log('🛏️  객실 생성 중...');
    const rooms = [];
    
    // 도시별 기본 가격 설정
    const getBasePrice = (city) => {
      const priceMap = {
        '서울': { standard: 150000, deluxe: 250000, suite: 400000, premium: 600000 },
        '제주': { standard: 200000, deluxe: 300000, suite: 500000, premium: 700000 },
        '부산': { standard: 120000, deluxe: 200000, suite: 350000, premium: 500000 },
        '인천': { standard: 100000, deluxe: 180000, suite: 300000, premium: 450000 },
        '속초': { standard: 110000, deluxe: 190000, suite: 320000, premium: 480000 },
        '여수': { standard: 130000, deluxe: 220000, suite: 380000, premium: 550000 },
        '대구': { standard: 80000, deluxe: 140000, suite: 240000, premium: 380000 },
        '평창': { standard: 130000, deluxe: 210000, suite: 360000, premium: 520000 }
      };
      return priceMap[city] || { standard: 100000, deluxe: 180000, suite: 300000, premium: 450000 };
    };

    for (const hotel of hotels) {
      const prices = getBasePrice(hotel.city);
      
      // 호텔 타입에 따라 객실 수 조정 (호텔/리조트는 3개, 모텔은 2개)
      const isMotel = hotel.name.includes('모텔');
      const hotelRooms = isMotel ? [
        {
          hotel: hotel._id,
          name: '스탠다드 룸',
          description: '편안하고 깔끔한 기본 객실입니다. 모든 기본 시설을 갖추고 있습니다.',
          type: 'standard',
          price: prices.standard,
          maxGuests: 2,
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
          amenities: ['TV', '에어컨', '미니바', '욕실', '무료 와이파이'],
          size: 25,
          bedType: 'double',
          totalRooms: 10,
          status: 'available'
        },
        {
          hotel: hotel._id,
          name: '디럭스 룸',
          description: '더 넓은 공간과 추가 편의 시설을 갖춘 디럭스 객실입니다.',
          type: 'deluxe',
          price: prices.deluxe,
          maxGuests: 3,
          images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
          amenities: ['TV', '에어컨', '미니바', '욕실', '발코니', '소파', '무료 와이파이'],
          size: 35,
          bedType: 'queen',
          totalRooms: 8,
          status: 'available'
        }
      ] : [
        {
          hotel: hotel._id,
          name: '스탠다드 룸',
          description: '편안하고 깔끔한 기본 객실입니다. 모든 기본 시설을 갖추고 있습니다.',
          type: 'standard',
          price: prices.standard,
          maxGuests: 2,
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
          amenities: ['TV', '에어컨', '미니바', '욕실', '무료 와이파이'],
          size: 25,
          bedType: 'double',
          totalRooms: 10,
          status: 'available'
        },
        {
          hotel: hotel._id,
          name: '디럭스 룸',
          description: '더 넓은 공간과 추가 편의 시설을 갖춘 디럭스 객실입니다.',
          type: 'deluxe',
          price: prices.deluxe,
          maxGuests: 3,
          images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
          amenities: ['TV', '에어컨', '미니바', '욕실', '발코니', '소파', '무료 와이파이'],
          size: 35,
          bedType: 'queen',
          totalRooms: 8,
          status: 'available'
        },
        {
          hotel: hotel._id,
          name: '스위트 룸',
          description: '최고급 시설과 넓은 공간을 자랑하는 스위트 객실입니다.',
          type: 'suite',
          price: prices.suite,
          maxGuests: 4,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
          amenities: ['TV', '에어컨', '미니바', '욕실', '발코니', '거실', '스파', '무료 와이파이'],
          size: 60,
          bedType: 'king',
          totalRooms: 5,
          status: 'available'
        }
      ];
      
      const createdRooms = await Room.insertMany(hotelRooms);
      rooms.push(...createdRooms);
    }

    console.log(`✅ ${rooms.length}개의 객실 생성 완료`);

    // 호텔별 basePrice 업데이트 (가장 저렴한 객실 가격)
    console.log('💰 호텔 basePrice 업데이트 중...');
    for (const hotel of hotels) {
      const hotelRooms = rooms.filter(r => r.hotel.toString() === hotel._id.toString());
      if (hotelRooms.length > 0) {
        const minPrice = Math.min(...hotelRooms.map(r => r.price));
        await Hotel.findByIdAndUpdate(hotel._id, {
          basePrice: minPrice
        });
      }
    }
    console.log('✅ 호텔 basePrice 업데이트 완료');

    // 4. 예약 생성 (각 사용자가 여러 호텔에 예약 - 과거/현재/미래)
    console.log('📅 예약 생성 중...');
    const today = new Date();
    const reservations = [];
    
    // 각 사용자별로 예약 생성
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      // 각 사용자가 3-4개의 호텔에 예약
      const hotelIndices = [];
      for (let j = 0; j < 3 + (i % 2); j++) {
        const hotelIndex = (i * 3 + j) % hotels.length;
        if (!hotelIndices.includes(hotelIndex)) {
          hotelIndices.push(hotelIndex);
        }
      }
      
      for (let k = 0; k < hotelIndices.length; k++) {
        const hotelIndex = hotelIndices[k];
        const hotel = hotels[hotelIndex];
        const hotelRooms = rooms.filter(r => r.hotel.toString() === hotel._id.toString());
        if (hotelRooms.length === 0) continue;
        
        const room = hotelRooms[Math.floor(Math.random() * hotelRooms.length)];
        const nights = 1 + Math.floor(Math.random() * 3); // 1-3박
        
        let checkIn, checkOut, status, paymentStatus;
        
        // 첫 번째 예약은 과거(완료), 나머지는 현재/미래
        if (k === 0) {
          // 과거 예약 (리뷰 작성 가능)
          checkIn = new Date(today);
          checkIn.setDate(today.getDate() - (30 + Math.floor(Math.random() * 60))); // 30-90일 전
          checkOut = new Date(checkIn);
          checkOut.setDate(checkIn.getDate() + nights);
          status = 'completed';
          paymentStatus = 'paid';
        } else if (k === 1) {
          // 현재 예약 (확정)
          checkIn = new Date(today);
          checkIn.setDate(today.getDate() + Math.floor(Math.random() * 7)); // 0-7일 후
          checkOut = new Date(checkIn);
          checkOut.setDate(checkIn.getDate() + nights);
          status = 'confirmed';
          paymentStatus = 'paid';
        } else {
          // 미래 예약
          checkIn = new Date(today);
          checkIn.setDate(today.getDate() + (14 + Math.floor(Math.random() * 30))); // 14-44일 후
          checkOut = new Date(checkIn);
          checkOut.setDate(checkIn.getDate() + nights);
          status = Math.random() < 0.8 ? 'confirmed' : 'pending';
          paymentStatus = status === 'confirmed' ? 'paid' : 'pending';
        }
        
        const reservation = {
          user: user._id,
          hotel: hotel._id,
          room: room._id,
          checkIn: checkIn,
          checkOut: checkOut,
          guests: 1 + Math.floor(Math.random() * 3), // 1-3명
          totalPrice: room.price * nights,
          status: status,
          paymentStatus: paymentStatus
        };
        
        reservations.push(reservation);
      }
    }
    
    const createdReservations = await Reservation.insertMany(reservations);
    console.log(`✅ ${createdReservations.length}개의 예약 생성 완료`);

    // 5. 리뷰 생성 (완료된 예약에 대해 모두 리뷰 작성 + 각 호텔에 추가 리뷰 생성)
    console.log('⭐ 리뷰 생성 중...');
    const reviews = [];
    const reviewComments = [
      '정말 훌륭한 호텔이었습니다! 깔끔한 객실과 친절한 서비스까지 모든 것이 완벽했습니다. 다시 방문하고 싶어요!',
      '위치가 좋고 시설도 깔끔합니다. 가격 대비 만족스러운 숙박이었습니다.',
      '객실이 넓고 깨끗했어요. 조식도 맛있고 직원분들도 친절하셨습니다. 추천합니다!',
      '가성비가 좋은 호텔입니다. 시설은 조금 오래되었지만 깔끔하게 관리되고 있어요.',
      '전망이 정말 좋았습니다! 특히 야경이 아름다워서 기억에 남네요. 다음에도 여기 올게요.',
      '체크인부터 체크아웃까지 모든 과정이 매끄러웠습니다. 특히 프론트 직원분이 정말 친절하셨어요.',
      '객실 내부가 넓고 깔끔했어요. 침대도 편안하고 조용해서 잘 쉬었습니다.',
      '주변 맛집이 많아서 좋았어요. 호텔 위치도 중심가라서 이동하기 편했습니다.',
      '가족 여행으로 왔는데 아이들도 좋아했어요. 특히 수영장이 깨끗하고 넓었습니다.',
      '비즈니스 출장으로 이용했는데 와이파이 속도도 빠르고 조용해서 업무하기 좋았습니다.',
      '객실 청소가 정말 깔끔했어요. 욕실도 넓고 샤워 시설도 좋았습니다.',
      '조식 뷔페가 다양하고 맛있었어요. 특히 한식 코너가 인상적이었습니다.',
      '주차장이 넓어서 좋았어요. 차량 접근도 편리하고 보안도 잘 되어있습니다.',
      '객실에서 보는 전망이 정말 멋졌어요. 사진으로 남기고 싶을 정도로 아름다웠습니다.',
      '가격 대비 시설이 훌륭합니다. 다음에도 여기서 예약할 예정이에요.',
      '해변과 가까워서 아침 산책하기 좋았어요. 바다 전망도 정말 멋졌습니다.',
      '리조트 시설이 정말 훌륭했어요. 골프장도 가까워서 편리했습니다.',
      '온천 시설이 있어서 피로가 확 풀렸어요. 특히 야외 온천이 인상적이었습니다.',
      '스키장과 바로 연결되어 있어서 정말 편리했어요. 겨울에 다시 오고 싶습니다.',
      '바다뷰 객실이 정말 아름다웠어요. 일출을 보면서 아침을 맞이할 수 있어서 특별했습니다.',
      '레스토랑 음식이 정말 맛있었어요. 특히 해산물 요리가 인상적이었습니다.',
      '키즈클럽이 있어서 아이들이 즐겁게 놀 수 있었어요. 가족 여행에 최적입니다.',
      '피트니스 센터 시설이 좋아서 운동하기 편했어요. 수영장도 넓고 깨끗했습니다.',
      '스파 시설이 훌륭해서 힐링하기 좋았어요. 마사지도 전문적이었습니다.',
      '공항과 가까워서 출장에 정말 편리했어요. 셔틀버스도 정시에 운행됩니다.',
      '명동과 가까워서 쇼핑하기 좋았어요. 지하철역도 바로 앞에 있어서 이동이 편했습니다.',
      '모텔치고는 시설이 깔끔하고 좋았어요. 가격 대비 만족스러웠습니다.',
      '렌터카 주차가 편리해서 제주 여행에 최적이었어요. 위치도 중심가라서 좋았습니다.',
      '해변까지 도보로 5분 거리라서 정말 편리했어요. 해수욕하기 좋습니다.',
      '조용하고 깔끔한 분위기였어요. 커플 여행에 딱 좋은 숙소입니다.'
    ];
    
    // 완료된 예약에 대해 모두 리뷰 생성
    for (let i = 0; i < createdReservations.length; i++) {
      const reservation = createdReservations[i];
      // 완료된 예약(status가 'completed')에 대해서만 리뷰 작성
      if (reservation.status === 'completed') {
        const rating = 3 + Math.floor(Math.random() * 3); // 3-5점
        const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
        
        reviews.push({
          user: reservation.user,
          hotel: reservation.hotel,
          reservation: reservation._id,
          rating: rating,
          comment: comment
        });
      }
    }
    
    // 각 호텔에 추가 리뷰 생성 (각 숙소마다 4~6개 리뷰)
    for (const hotel of hotels) {
      const existingReviews = reviews.filter(r => r.hotel.toString() === hotel._id.toString());
      const targetReviewCount = 4 + Math.floor(Math.random() * 3); // 4-6개 리뷰
      const additionalReviews = targetReviewCount - existingReviews.length;
      
      if (additionalReviews > 0) {
        for (let i = 0; i < additionalReviews; i++) {
          const randomUser = users[Math.floor(Math.random() * users.length)];
          const rating = 3 + Math.floor(Math.random() * 3); // 3-5점
          const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
          
          // reservation이 null인 경우 unique index 충돌을 피하기 위해 고유한 ObjectId 생성
          const fakeReservationId = new mongoose.Types.ObjectId();
          
          reviews.push({
            user: randomUser._id,
            hotel: hotel._id,
            reservation: fakeReservationId, // 고유한 ID로 중복 방지
            rating: rating,
            comment: comment
          });
        }
      }
    }
    
    const createdReviews = await Review.insertMany(reviews);
    console.log(`✅ ${createdReviews.length}개의 리뷰 생성 완료`);

    // 6. 쿠폰 생성
    console.log('🎫 쿠폰 생성 중...');
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const next3Months = new Date(today);
    next3Months.setMonth(today.getMonth() + 3);

    const coupons = await Coupon.insertMany([
      {
        code: 'WELCOME10',
        name: '신규 회원 환영 쿠폰',
        description: '첫 예약 시 10% 할인',
        type: 'percent',
        discount: 10,
        minAmount: 50000,
        maxDiscount: 20000,
        validFrom: today,
        validUntil: next3Months,
        usageLimit: 1,
        usedCount: 0,
        isPublic: true,
        target: 'first'
      },
      {
        code: 'SAVE5000',
        name: '5,000원 할인 쿠폰',
        description: '5만원 이상 결제 시 사용 가능',
        type: 'amount',
        discount: 5000,
        minAmount: 50000,
        validFrom: today,
        validUntil: nextMonth,
        usageLimit: 10,
        usedCount: 0,
        isPublic: true,
        target: 'all'
      },
      {
        code: 'WEEKEND15',
        name: '주말 특가 15% 할인',
        description: '주말 예약 시 15% 할인 (최대 3만원)',
        type: 'percent',
        discount: 15,
        minAmount: 100000,
        maxDiscount: 30000,
        validFrom: today,
        validUntil: next3Months,
        isPublic: true,
        target: 'all'
      },
      {
        code: 'SUMMER20',
        name: '여름휴가 20% 할인',
        description: '여름 시즌 특별 할인 쿠폰',
        type: 'percent',
        discount: 20,
        minAmount: 200000,
        maxDiscount: 50000,
        validFrom: today,
        validUntil: next3Months,
        usageLimit: 5,
        usedCount: 0,
        isPublic: true,
        target: 'all'
      },
      {
        code: 'STAYBOOK50000',
        name: '스테이북 5만원 할인',
        description: '30만원 이상 결제 시 사용 가능',
        type: 'amount',
        discount: 50000,
        minAmount: 300000,
        validFrom: today,
        validUntil: next3Months,
        usageLimit: 3,
        usedCount: 0,
        isPublic: true,
        target: 'member'
      }
    ]);

    // 각 사용자에게 신규 회원 쿠폰 지급
    const userCoupons = [];
    for (const user of users) {
      const welcomeCoupon = await Coupon.create({
        code: `WELCOME${user._id.toString().slice(-6).toUpperCase()}`,
        name: '신규 회원 환영 쿠폰',
        description: '첫 예약 시 10% 할인 (최대 2만원)',
        type: 'percent',
        discount: 10,
        minAmount: 50000,
        maxDiscount: 20000,
        validFrom: today,
        validUntil: next3Months,
        usageLimit: 1,
        usedCount: 0,
        isPublic: false,
        userId: user._id,
        target: 'first'
      });
      userCoupons.push(welcomeCoupon);
    }

    coupons.push(...userCoupons);
    console.log(`✅ ${coupons.length}개의 쿠폰 생성 완료 (각 사용자에게 신규 회원 쿠폰 지급)`);

    // 7. 카드 생성 (각 사용자별 저장된 카드)
    console.log('💳 카드 생성 중...');
    const cards = [];
    const cardBrands = ['VISA', 'MASTERCARD', 'AMEX', 'JCB'];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const cardCount = 1 + (i % 2); // 1-2개 카드
      
      for (let j = 0; j < cardCount; j++) {
        const last4 = String(1000 + (i * 10 + j)).slice(-4);
        const cardNumber = `1234-5678-9012-${last4}`;
        const maskedNumber = `****-****-****-${last4}`;
        const expMonth = String(12 + (j % 12)).padStart(2, '0');
        const expYear = String(25 + j);
        const expDate = `${expMonth}/${expYear}`;
        
        cards.push({
          user: user._id,
          cardNumber: cardNumber,
          maskedNumber: maskedNumber,
          expDate: expDate,
          cvc: String(100 + (i * 10 + j)).slice(-3),
          nameOnCard: user.name,
          brand: cardBrands[i % cardBrands.length],
          isDefault: j === 0 // 첫 번째 카드가 기본 카드
        });
      }
    }
    
    const createdCards = await Card.insertMany(cards);
    console.log(`✅ ${createdCards.length}개의 카드 생성 완료`);

    // 8. 위시리스트 생성 (각 사용자별 찜한 호텔)
    console.log('❤️  위시리스트 생성 중...');
    const wishlists = [];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const wishlistCount = 2 + Math.floor(Math.random() * 4); // 2-5개 호텔
      const hotelIndices = new Set();
      
      while (hotelIndices.size < wishlistCount) {
        const hotelIndex = Math.floor(Math.random() * hotels.length);
        hotelIndices.add(hotelIndex);
      }
      
      for (const hotelIndex of hotelIndices) {
        wishlists.push({
          userId: user._id,
          hotelId: hotels[hotelIndex]._id
        });
      }
    }
    
    const createdWishlists = await Wishlist.insertMany(wishlists);
    console.log(`✅ ${createdWishlists.length}개의 위시리스트 생성 완료`);

    // 9. 결제 정보 생성 (결제 완료된 예약에 대해)
    console.log('💵 결제 정보 생성 중...');
    const payments = [];
    
    for (const reservation of createdReservations) {
      if (reservation.paymentStatus === 'paid') {
        const orderId = `ORDER-${reservation._id.toString().slice(-8).toUpperCase()}`;
        payments.push({
          user: reservation.user,
          reservation: reservation._id,
          amount: reservation.totalPrice,
          method: ['card', 'toss', 'transfer'][Math.floor(Math.random() * 3)],
          status: 'completed',
          orderId: orderId,
          approvedAt: reservation.checkIn < today ? reservation.checkIn : new Date(reservation.checkIn.getTime() - 7 * 24 * 60 * 60 * 1000) // 체크인 7일 전 결제
        });
      }
    }
    
    const createdPayments = await Payment.insertMany(payments);
    console.log(`✅ ${createdPayments.length}개의 결제 정보 생성 완료`);

    // 호텔 평점 업데이트 (리뷰 기반)
    console.log('📊 호텔 평점 업데이트 중...');
    for (const hotel of hotels) {
      const hotelReviews = createdReviews.filter(r => r.hotel.toString() === hotel._id.toString());
      if (hotelReviews.length > 0) {
        const avgRating = hotelReviews.reduce((sum, r) => sum + r.rating, 0) / hotelReviews.length;
        await Hotel.findByIdAndUpdate(hotel._id, {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: hotelReviews.length
        });
        console.log(`   - ${hotel.name}: 평점 ${Math.round(avgRating * 10) / 10}, 리뷰 ${hotelReviews.length}개`);
      } else {
        // 리뷰가 없는 호텔은 기본값 유지
        await Hotel.findByIdAndUpdate(hotel._id, {
          rating: 0,
          reviewCount: 0
        });
      }
    }
    console.log('✅ 호텔 평점 업데이트 완료');

    console.log('\n✨ 초기 데이터 생성이 완료되었습니다!');
    console.log('\n📊 생성된 데이터 요약:');
    console.log(`   - 사용자: ${users.length}명`);
    console.log(`   - 호텔: ${hotels.length}개`);
    console.log(`   - 객실: ${rooms.length}개`);
    console.log(`   - 예약: ${createdReservations.length}개`);
    console.log(`   - 리뷰: ${createdReviews.length}개`);
    console.log(`   - 쿠폰: ${coupons.length}개`);
    console.log(`   - 카드: ${createdCards.length}개`);
    console.log(`   - 위시리스트: ${createdWishlists.length}개`);
    console.log(`   - 결제: ${createdPayments.length}개`);
    console.log('\n🔑 테스트 계정 (모두 비밀번호: 1234):');
    users.forEach((user, index) => {
      console.log(`   ${user.name}: ${user.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ 초기 데이터 생성 중 오류 발생:', error);
    process.exit(1);
  }
};

// 스크립트 실행
initData();


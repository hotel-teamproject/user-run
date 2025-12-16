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
import Notice from '../models/Notice.js';
import connectDB from '../config/db.js';

dotenv.config({ path: '../.env' });

await mongoose.connect(process.env.MONGODB_URI);

// 초기 데이터 생성
const initData = async () => {
  try {
    console.log('🚀 데이터베이스 연결 중...');

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
    await Notice.deleteMany({});

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
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/61/6e/29/grand-hilton-seoul.jpg?w=1800&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/9a/31/7c/photo0jpg.jpg?w=2000&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/2e/d4/6b/photo2jpg.jpg?w=2000&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/89/7c/3d/photo9jpg.jpg?w=2000&h=-1&s=1'
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
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/aa/8f/2b/caption.jpg?w=1400&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/aa/97/1b/caption.jpg?w=1400&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/aa/90/07/caption.jpg?w=1400&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/daodao/photo-s/09/13/7b/0e/caption.jpg?w=600&h=-1&s=1'
          
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
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/55/fd/79/maison-glad-jeju1.jpg?w=1100&h=600&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/90/34/4e/infinity-pool.jpg?w=1100&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/06/c8/80/camping-zone.jpg?w=2000&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/37/04/56/bistro-jawal-outdoor.jpg?w=1100&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/40/df/10/infinity-pool-the-patio.jpg?w=1100&h=-1&s=1'
          
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
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/6a/90/4c/caption.jpg?w=1400&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/73/69/42/sky-lobby.jpg?w=2000&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/8d/f7/d8/caption.jpg?w=1100&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/8d/f7/ac/caption.jpg?w=1100&h=-1&s=1'
          
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
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/a1/26/5a/exterior.jpg?w=1400&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/7d/14/e8/caption.jpg?w=1000&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/7d/1a/2f/cocktail-hour-at-westin.jpg?w=1400&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/e1/f1/54/caption.jpg?w=2000&h=-1&s=1'
          
        ],
        amenities: ['와이파이', '주차장', '레스토랑', '수영장', '24시간 프론트 데스크', '라운지'],
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
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/43/27/cb/caption.jpg?w=700&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/43/27/d0/caption.jpg?w=1000&h=-1&s=1',
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/43/27/c9/caption.jpg?w=1000&h=-1&s=1'
          
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
          'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/a0/fb/82/caption.jpg?w=1200&h=700&s=1',
        
          
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
          'https://q-xx.bstatic.com/xdata/images/hotel/max600/737676874.jpg?k=0d14b59f507aeda13cd8c36d83bb2bc9645e3052ed5ea6e3d0e392f7af77b645&o=',
         
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
          'https://cdn.ppss.kr/news/photo/202301/260207_78643_0641.jpg',
          
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
          'https://q-xx.bstatic.com/xdata/images/xphoto/608x352/48361359.webp?k=35ec553b3cc2486ca479d56d71d3829b8eb51d9b5c7e15faf1dbb7e13dead9eb&o=',
          
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
          'https://images.unsplash.com/photo-1620841260954-65ceaa8dbee7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

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
          'https://image.withstatic.com/441/144/58/1cf909be885c46a498d15c51ef827402.png?width=2400&height=1324&format=webp'
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
          'https://www.lotteresort.com/static/upload/images/20250813/eec6a587-8ac6-4652-9e35-a5a61e8aec95.webp'
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
          'https://yaimg.yanolja.com/v5/2022/09/14/20/640/63224014d8ddc6.46750899.jpg'
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
      // 호텔 타입에 따라 stars 설정
      let stars;
      if (hotel.name.includes('모텔')) {
        // 모텔: 1~3성급 랜덤
        stars = 1 + Math.floor(Math.random() * 3); // 1, 2, 3
      } else if (hotel.name.includes('리조트')) {
        // 리조트: 3~4성급 랜덤
        stars = 3 + Math.floor(Math.random() * 2); // 3, 4
      } else {
        // 호텔: 4~5성급 (기존 유지)
        stars = 4 + Math.floor(Math.random() * 2); // 4, 5
      }

      return {
        ...hotel,
        location: hotel.address, // location 필드 추가
        image: hotel.images && hotel.images.length > 0 ? hotel.images[0] : null, // 호텔 자체 대표 이미지
        imageCount: hotel.images ? hotel.images.length : 0, // imageCount 필드 추가
        stars: stars // stars 필드 추가 (타입 기반)
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
      // 5점 (매우 좋음)
      '정말 훌륭한 호텔이었습니다! 깔끔한 객실과 친절한 서비스까지 모든 것이 완벽했습니다. 다시 방문하고 싶어요!',
      '객실이 넓고 깨끗했어요. 조식도 맛있고 직원분들도 친절하셨습니다. 추천합니다!',
      '전망이 정말 좋았습니다! 특히 야경이 아름다워서 기억에 남네요. 다음에도 여기 올게요.',
      '체크인부터 체크아웃까지 모든 과정이 매끄러웠습니다. 특히 프론트 직원분이 정말 친절하셨어요.',
      '해변과 가까워서 아침 산책하기 좋았어요. 바다 전망도 정말 멋졌습니다.',
      '리조트 시설이 정말 훌륭했어요. 골프장도 가까워서 편리했습니다.',
      '바다뷰 객실이 정말 아름다웠어요. 일출을 보면서 아침을 맞이할 수 있어서 특별했습니다.',
      '키즈클럽이 있어서 아이들이 즐겁게 놀 수 있었어요. 가족 여행에 최적입니다.',
      // 4점 (좋음)
      '위치가 좋고 시설도 깔끔합니다. 가격 대비 만족스러운 숙박이었습니다.',
      '객실 내부가 넓고 깔끔했어요. 침대도 편안하고 조용해서 잘 쉬었습니다.',
      '주변 맛집이 많아서 좋았어요. 호텔 위치도 중심가라서 이동하기 편했습니다.',
      '객실 청소가 정말 깔끔했어요. 욕실도 넓고 샤워 시설도 좋았습니다.',
      '조식 뷔페가 다양하고 맛있었어요. 특히 한식 코너가 인상적이었습니다.',
      '주차장이 넓어서 좋았어요. 차량 접근도 편리하고 보안도 잘 되어있습니다.',
      '가격 대비 시설이 훌륭합니다. 다음에도 여기서 예약할 예정이에요.',
      '모텔치고는 시설이 깔끔하고 좋았어요. 가격 대비 만족스러웠습니다.',
      // 3점 (보통)
      '가성비가 좋은 호텔입니다. 시설은 조금 오래되었지만 깔끔하게 관리되고 있어요.',
      '시설은 나쁘지 않았지만 특별히 인상적인 부분은 없었어요. 보통 수준입니다.',
      '위치는 좋은데 객실이 생각보다 작았어요. 그래도 깔끔해서 나쁘지 않았습니다.',
      '직원은 친절하셨지만 시설이 조금 아쉬웠어요. 가격 대비는 괜찮은 편입니다.',
      '조식은 괜찮았지만 다양성은 부족했어요. 전반적으로 보통 수준입니다.',
      '객실은 깔끔했지만 소음이 조금 있었어요. 그래도 잠은 잘 잤습니다.',
      '주차는 편리했지만 주차장이 좁았어요. 전반적으로 무난했습니다.',
      '가격 대비 시설은 괜찮지만 서비스는 보통 수준이었어요.',
      // 2점 (나쁨)
      '시설이 생각보다 오래되어서 아쉬웠어요. 청소도 완벽하지 않았습니다.',
      '객실이 작고 시설이 부족했어요. 가격 대비 만족스럽지 않았습니다.',
      '직원 서비스가 아쉬웠어요. 체크인도 오래 걸리고 친절하지 않았습니다.',
      '소음이 심해서 잠을 제대로 못 잤어요. 방음 시설이 부족한 것 같습니다.',
      '조식이 다양하지 않고 맛도 그저 그랬어요. 기대했던 것보다 못했습니다.',
      '주차장이 좁고 접근이 불편했어요. 위치는 좋지만 시설이 아쉽습니다.',
      '객실 청소가 제대로 안 되어 있었어요. 먼지도 보이고 깔끔하지 않았습니다.',
      '와이파이 속도가 느려서 불편했어요. 업무하기 어려웠습니다.',
      // 1점 (매우 나쁨)
      '시설이 너무 오래되어서 불편했어요. 청소도 제대로 안 되어 있었습니다.',
      '객실에서 냄새가 나서 숙박하기 불편했어요. 환기도 잘 안 되었습니다.',
      '직원이 불친절하고 서비스가 매우 아쉬웠어요. 다시는 오지 않을 것 같습니다.',
      '소음이 너무 심해서 잠을 전혀 못 잤어요. 방음 시설이 전혀 없었습니다.',
      '조식이 매우 부실했어요. 선택지도 적고 맛도 좋지 않았습니다.',
      '주차가 매우 불편했어요. 주차장도 좁고 접근도 어려웠습니다.',
      '객실이 매우 더러웠어요. 청소가 전혀 안 되어 있었습니다.',
      '와이파이가 거의 작동하지 않았어요. 인터넷 사용이 불가능했습니다.'
    ];
    
    // 평점별 댓글 인덱스 분류
    const getCommentByRating = (rating) => {
      // 평점에 맞는 댓글 범위 선택
      let startIdx, endIdx;
      if (rating === 5) {
        startIdx = 0;
        endIdx = 7; // 0-7: 매우 좋음
      } else if (rating === 4) {
        startIdx = 8;
        endIdx = 15; // 8-15: 좋음
      } else if (rating === 3) {
        startIdx = 16;
        endIdx = 23; // 16-23: 보통
      } else if (rating === 2) {
        startIdx = 24;
        endIdx = 31; // 24-31: 나쁨
      } else {
        startIdx = 32;
        endIdx = reviewComments.length - 1; // 32-: 매우 나쁨
      }
      const randomIdx = startIdx + Math.floor(Math.random() * (endIdx - startIdx + 1));
      return reviewComments[randomIdx];
    };

    // 완료된 예약에 대해 모두 리뷰 생성
    for (let i = 0; i < createdReservations.length; i++) {
      const reservation = createdReservations[i];
      // 완료된 예약(status가 'completed')에 대해서만 리뷰 작성
      if (reservation.status === 'completed') {
        // 1-5점 전체 범위에서 생성 (나쁨, 보통도 포함)
        const rating = 1 + Math.floor(Math.random() * 5); // 1-5점
        const comment = getCommentByRating(rating);
        
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
    // 일부 모텔/리조트는 낮은 평점을 가지도록 설정
    const getTargetAverageRating = (hotel, index) => {
      const isMotel = hotel.name.includes('모텔');
      const isResort = hotel.name.includes('리조트');
      
      // 모텔은 모두 나쁨 평균 설정
      if (isMotel) {
        return 2.0 + Math.random() * 0.5; // 2.0-2.5 (나쁨)
      } else if (isResort) {
        // 리조트 중 일부는 보통(2.5-3.0) 평균
        if (index % 4 === 0) {
          return 2.5 + Math.random() * 0.5; // 2.5-3.0 (보통)
        }
        // 나머지는 높은 평점 유지
        return 3.5 + Math.random() * 1.5; // 3.5-5.0
      }
      // 호텔은 높은 평점 유지
      return 4.0 + Math.random() * 1.0; // 4.0-5.0
    };

    // 목표 평균에 맞는 평점 생성 함수
    const generateRatingForTarget = (targetAverage) => {
      // 목표 평균에 가까운 평점을 생성하기 위한 가중치
      if (targetAverage <= 2.5) {
        // 나쁨: 1-2점 위주, 가끔 3점
        const rand = Math.random();
        if (rand < 0.5) return 1;
        if (rand < 0.8) return 2;
        return 3;
      } else if (targetAverage <= 3.0) {
        // 보통: 2-3점 위주, 가끔 1점 또는 4점
        const rand = Math.random();
        if (rand < 0.2) return 1;
        if (rand < 0.5) return 2;
        if (rand < 0.8) return 3;
        return 4;
      } else if (targetAverage <= 3.5) {
        // 좋음: 3-4점 위주
        const rand = Math.random();
        if (rand < 0.3) return 3;
        if (rand < 0.8) return 4;
        return 5;
      } else {
        // 매우 좋음: 4-5점 위주
        const rand = Math.random();
        if (rand < 0.2) return 3;
        if (rand < 0.6) return 4;
        return 5;
      }
    };

    for (let idx = 0; idx < hotels.length; idx++) {
      const hotel = hotels[idx];
      const existingReviews = reviews.filter(r => r.hotel.toString() === hotel._id.toString());
      const targetReviewCount = 4 + Math.floor(Math.random() * 3); // 4-6개 리뷰
      const additionalReviews = targetReviewCount - existingReviews.length;
      
      if (additionalReviews > 0) {
        // 목표 평균 평점 설정
        const targetAverage = getTargetAverageRating(hotel, idx);
        
        // 기존 리뷰의 평균 계산
        const existingAvg = existingReviews.length > 0
          ? existingReviews.reduce((sum, r) => sum + r.rating, 0) / existingReviews.length
          : 0;
        
        // 목표 평균에 맞추기 위해 필요한 총 평점
        const totalNeededRating = targetAverage * targetReviewCount;
        const existingTotalRating = existingReviews.reduce((sum, r) => sum + r.rating, 0);
        const neededTotalRating = totalNeededRating - existingTotalRating;
        
        // 추가 리뷰들의 평균 평점
        const avgForAdditional = additionalReviews > 0 
          ? neededTotalRating / additionalReviews 
          : targetAverage;
        
        for (let i = 0; i < additionalReviews; i++) {
          const randomUser = users[Math.floor(Math.random() * users.length)];
          // 목표 평균에 맞는 평점 생성
          const rating = generateRatingForTarget(avgForAdditional);
          const comment = getCommentByRating(rating);
          
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

    // 10. 공지사항 생성
    console.log('📢 공지사항 생성 중...');
    const notices = [
      {
        title: 'STAYBOOK 서비스 오픈 안내',
        content: `안녕하세요, STAYBOOK입니다.

저희 서비스를 이용해 주셔서 감사합니다.

STAYBOOK은 최고의 호텔 예약 경험을 제공하기 위해 노력하고 있습니다.
다양한 호텔과 특별한 혜택을 만나보세요.

감사합니다.`,
        type: 'notice',
        isPinned: true,
        isActive: true,
        target: 'all'
      },
      {
        title: '신규 가입 회원 10% 할인 쿠폰 이벤트',
        content: `신규 회원가입 시 10% 할인 쿠폰을 드립니다!

🎉 이벤트 기간: 2025년 1월 1일 ~ 2025년 12월 31일
🎁 혜택: 신규 가입 회원 10% 할인 쿠폰 지급
💰 사용 조건: 최소 50,000원 이상 예약 시 사용 가능

많은 관심과 참여 부탁드립니다.`,
        type: 'event',
        isPinned: true,
        isActive: true,
        target: 'all'
      },
      {
        title: '시스템 점검 안내 (2025년 1월 15일)',
        content: `안내드립니다.

2025년 1월 15일(수) 오전 2시 ~ 오전 4시 동안 시스템 점검이 진행됩니다.

점검 시간 동안 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.

점검 시간: 2025년 1월 15일(수) 02:00 ~ 04:00
영향 범위: 전체 서비스 일시 중단

불편을 드려 죄송합니다.`,
        type: 'maintenance',
        isPinned: false,
        isActive: true,
        target: 'all'
      },
      {
        title: '앱 업데이트 안내 - 새로운 기능 추가',
        content: `STAYBOOK 앱이 업데이트되었습니다!

새로운 기능:
✨ 찜하기 기능 개선
✨ 예약 내역 상세 보기
✨ 리뷰 작성 기능 추가
✨ 쿠폰 사용 내역 확인

더 편리한 서비스 이용을 위해 업데이트해 주세요.`,
        type: 'update',
        isPinned: false,
        isActive: true,
        target: 'all'
      },
      {
        title: '예약 취소 정책 안내',
        content: `예약 취소 정책에 대해 안내드립니다.

- 체크인 7일 전: 무료 취소
- 체크인 3일 전: 50% 환불
- 체크인 당일: 환불 불가

자세한 내용은 고객센터로 문의해 주세요.`,
        type: 'notice',
        isPinned: false,
        isActive: true,
        target: 'all'
      },
      {
        title: '리뷰 작성 시 포인트 적립 이벤트',
        content: `리뷰를 작성하시면 포인트를 적립해 드립니다!

📝 리뷰 작성: 500포인트
📷 사진 첨부: 추가 300포인트
⭐ 상세 리뷰: 추가 200포인트

최대 1,000포인트까지 적립 가능합니다!`,
        type: 'event',
        isPinned: false,
        isActive: true,
        target: 'user'
      }
    ];

    const createdNotices = await Notice.insertMany(notices);
    console.log(`✅ ${createdNotices.length}개의 공지사항 생성 완료`);

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
    console.log(`   - 공지사항: ${createdNotices.length}개`);
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


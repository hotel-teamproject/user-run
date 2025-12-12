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

    // 1. 사용자 생성
    console.log('👤 사용자 생성 중...');
    const hashedPassword = await bcrypt.hash('1234', 10);

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
        name: '홍길동',
        email: 'hong@gmail.com',
        password: hashedPassword,
        phone: '010-2345-6789',
        role: 'user',
        socialProvider: 'local'
      },
      {
        name: '김사업자',
        email: 'owner@gmail.com',
        password: hashedPassword,
        phone: '010-3456-7890',
        role: 'owner',
        socialProvider: 'local',
        businessInfo: {
          businessName: '김호텔그룹',
          businessNumber: '123-45-67890',
          bankAccount: '123-456-789',
          status: 'approved',
          appliedAt: new Date('2024-01-01'),
          approvedAt: new Date('2024-01-02')
        }
      },
      {
        name: '이관리자',
        email: 'admin@gmail.com',
        password: hashedPassword,
        phone: '010-4567-8901',
        role: 'admin',
        socialProvider: 'local'
      }
    ]);

    const normalUser = users[0];
    const normalUser2 = users[1];
    const ownerUser = users[2];

    console.log(`✅ ${users.length}명의 사용자 생성 완료`);

    // 2. 호텔 생성
    console.log('🏨 호텔 생성 중...');
    const hotelsData = [
      {
        name: '서울 그랜드 호텔',
        description: '서울 강남 중심가에 위치한 럭셔리 호텔입니다. 최고급 시설과 서비스로 고객님께 잊을 수 없는 경험을 제공합니다.',
        address: '서울특별시 강남구 테헤란로 123',
        city: '서울',
        images: ['/images/hotel1.jpg', '/images/hotel-2.jpg', '/images/hotel-3.png', '/images/hotel.jpg'],
        amenities: ['와이파이', '주차장', '레스토랑', '수영장', '피트니스', '스파', '24시간 프론트 데스크', '라운지', '비즈니스 센터'],
        tags: ['럭셔리', '비즈니스', '커플', '도심'],
        rating: 4.8,
        reviewCount: 328,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '부산 해변 리조트',
        description: '부산 해운대 해변 바로 앞에 위치한 리조트 호텔입니다. 바다 전망을 감상하며 휴식을 취하실 수 있습니다.',
        address: '부산광역시 해운대구 해운대해변로 456',
        city: '부산',
        images: ['/images/hotel.jpg', '/images/hotel1.jpg', '/images/hotel-2.jpg'],
        amenities: ['와이파이', '주차장', '레스토랑', '수영장', '해변 접근', '비치 체어', '피트니스', '스파'],
        tags: ['리조트', '해변', '휴양', '가족'],
        rating: 4.7,
        reviewCount: 245,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '제주 한라산 뷰 호텔',
        description: '제주 한라산을 조망할 수 있는 프리미엄 호텔입니다. 제주도의 자연을 만끽할 수 있는 특별한 숙박 경험을 제공합니다.',
        address: '제주특별자치도 제주시 연동 789',
        city: '제주',
        images: ['/images/hotel-2.jpg', '/images/hotel-3.png', '/images/hotel1.jpg', '/images/hotel.jpg'],
        amenities: ['와이파이', '주차장', '레스토랑', '온천', '골프장', '렌터카', '스파', '피트니스'],
        tags: ['프리미엄', '자연', '골프', '온천'],
        rating: 4.9,
        reviewCount: 412,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '경주 히스토리 호텔',
        description: '경주 고속버스터미널 인근에 위치한 편리한 호텔입니다. 경주 관광 명소에 쉽게 접근할 수 있습니다.',
        address: '경상북도 경주시 원화로 321',
        city: '경주',
        images: ['/images/hotel1.jpg', '/images/hotel.jpg'],
        amenities: ['와이파이', '주차장', '레스토랑', '투어 데스크', '라운지', '세탁실'],
        tags: ['관광', '가성비', '편리', '역사'],
        rating: 4.5,
        reviewCount: 189,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '강원도 스키 리조트',
        description: '강원도 평창에 위치한 스키장 인근 리조트입니다. 겨울 스포츠와 여름 휴양을 동시에 즐길 수 있습니다.',
        address: '강원도 평창군 대화면 올림픽로 555',
        city: '평창',
        images: ['/images/hotel.jpg', '/images/hotel-2.jpg', '/images/hotel1.jpg'],
        amenities: ['와이파이', '주차장', '레스토랑', '스키장', '곤돌라', '스파', '피트니스', '사우나'],
        tags: ['스키', '리조트', '액티비티', '겨울'],
        rating: 4.6,
        reviewCount: 312,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '전주 한옥마을 게스트하우스',
        description: '전주 한옥마을 중심가에 위치한 전통 한옥 스타일의 게스트하우스입니다. 한국의 전통 문화를 체험할 수 있습니다.',
        address: '전라북도 전주시 완산구 기린대로 654',
        city: '전주',
        images: ['/images/hotel-3.png', '/images/hotel1.jpg'],
        amenities: ['와이파이', '전통 체험', '조식 제공', '한복 대여', '공용 주방'],
        tags: ['한옥', '전통', '문화체험', '가성비'],
        rating: 4.4,
        reviewCount: 156,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '인천 공항 스카이 호텔',
        description: '인천국제공항에서 가장 가까운 비즈니스 호텔입니다. 조용하고 편리한 시설로 출장객에게 최적의 숙박을 제공합니다.',
        address: '인천광역시 중구 공항로 272',
        city: '인천',
        images: ['/images/hotel.jpg', '/images/hotel1.jpg'],
        amenities: ['와이파이', '주차장', '레스토랑', '24시간 프론트', '셔틀버스', '비즈니스 센터'],
        tags: ['공항', '비즈니스', '편리', '출장'],
        rating: 4.3,
        reviewCount: 234,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '속초 해수욕장 호텔',
        description: '속초 대포항 앞바다를 내려다보는 해안가 호텔입니다. 신선한 해산물과 아름다운 일출을 감상할 수 있습니다.',
        address: '강원도 속초시 해안로 123',
        city: '속초',
        images: ['/images/hotel-2.jpg', '/images/hotel.jpg', '/images/hotel1.jpg'],
        amenities: ['와이파이', '주차장', '레스토랑', '해수욕장', '피트니스', '사우나', '해산물 식당'],
        tags: ['해안', '일출', '해산물', '가족'],
        rating: 4.5,
        reviewCount: 278,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '여수 오동도 바다뷰 호텔',
        description: '여수 오동도를 전망하는 프리미엄 호텔입니다. 바다와 섬이 어우러진 아름다운 풍경을 즐기실 수 있습니다.',
        address: '전라남도 여수시 오동도로 222',
        city: '여수',
        images: ['/images/hotel1.jpg', '/images/hotel-2.jpg', '/images/hotel-3.png'],
        amenities: ['와이파이', '주차장', '레스토랑', '해변 접근', '피트니스', '스파', '카페'],
        tags: ['바다뷰', '프리미엄', '로맨틱', '커플'],
        rating: 4.7,
        reviewCount: 345,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '남산 타워 뷰 호텔',
        description: '서울 남산타워가 보이는 도심 호텔입니다. 서울의 아름다운 야경을 감상하며 특별한 하룻밤을 보내실 수 있습니다.',
        address: '서울특별시 중구 남산타워길 100',
        city: '서울',
        images: ['/images/hotel-2.jpg', '/images/hotel1.jpg', '/images/hotel.jpg'],
        amenities: ['와이파이', '주차장', '레스토랑', '루프탑 바', '피트니스', '비즈니스 센터'],
        tags: ['도심', '야경', '로맨틱', '비즈니스'],
        rating: 4.6,
        reviewCount: 421,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '제주 해비치 리조트',
        description: '제주 서귀포 해안가에 위치한 프리미엄 리조트입니다. 골프장과 해변을 동시에 즐길 수 있는 최고의 휴양지입니다.',
        address: '제주특별자치도 서귀포시 중문관광로 72',
        city: '제주',
        images: ['/images/hotel.jpg', '/images/hotel-2.jpg', '/images/hotel-3.png', '/images/hotel1.jpg'],
        amenities: ['와이파이', '주차장', '레스토랑', '골프장', '해변', '스파', '피트니스', '키즈클럽'],
        tags: ['리조트', '골프', '해변', '가족'],
        rating: 4.8,
        reviewCount: 567,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '부산 광안리 오션뷰 호텔',
        description: '부산 광안리 해수욕장과 광안대교를 조망하는 최고의 위치의 호텔입니다. 광안리의 활기찬 분위기를 즐기실 수 있습니다.',
        address: '부산광역시 수영구 광안해변로 199',
        city: '부산',
        images: ['/images/hotel1.jpg', '/images/hotel-2.jpg', '/images/hotel.jpg'],
        amenities: ['와이파이', '주차장', '레스토랑', '해수욕장', '피트니스', '스파', '루프탑'],
        tags: ['해변', '야경', '커플', '가족'],
        rating: 4.6,
        reviewCount: 389,
        owner: ownerUser._id,
        status: 'active'
      },
      {
        name: '강릉 안목해변 호텔',
        description: '강릉 커피거리와 안목해변에 인접한 감성 호텔입니다. 커피향 가득한 여행을 즐기실 수 있습니다.',
        address: '강원도 강릉시 창해로14번길 20',
        city: '강릉',
        images: ['/images/hotel-3.png', '/images/hotel1.jpg', '/images/hotel-2.jpg'],
        amenities: ['와이파이', '주차장', '카페', '해변 접근', '투어 데스크'],
        tags: ['감성', '커피', '해변', '가성비'],
        rating: 4.4,
        reviewCount: 198,
        owner: ownerUser._id,
        status: 'active'
      }
    ];

    const hotels = await Hotel.insertMany(hotelsData);
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
        '강릉': { standard: 90000, deluxe: 150000, suite: 250000, premium: 400000 },
        '경주': { standard: 80000, deluxe: 140000, suite: 240000, premium: 380000 },
        '평창': { standard: 130000, deluxe: 210000, suite: 360000, premium: 520000 },
        '전주': { standard: 70000, deluxe: 120000, suite: 200000, premium: 320000 }
      };
      return priceMap[city] || { standard: 100000, deluxe: 180000, suite: 300000, premium: 450000 };
    };

    for (const hotel of hotels) {
      const prices = getBasePrice(hotel.city);
      
      const hotelRooms = [
        {
          hotel: hotel._id,
          name: '스탠다드 룸',
          description: '편안하고 깔끔한 기본 객실입니다. 모든 기본 시설을 갖추고 있습니다.',
          type: 'standard',
          price: prices.standard,
          maxGuests: 2,
          images: ['/images/hotel1.jpg'],
          amenities: ['TV', '에어컨', '미니바', '욕실', '무료 와이파이'],
          size: 25,
          bedType: 'double',
          totalRooms: 15,
          status: 'available'
        },
        {
          hotel: hotel._id,
          name: '디럭스 룸',
          description: '더 넓은 공간과 추가 편의 시설을 갖춘 디럭스 객실입니다.',
          type: 'deluxe',
          price: prices.deluxe,
          maxGuests: 3,
          images: ['/images/hotel-2.jpg'],
          amenities: ['TV', '에어컨', '미니바', '욕실', '발코니', '소파', '무료 와이파이'],
          size: 35,
          bedType: 'queen',
          totalRooms: 12,
          status: 'available'
        },
        {
          hotel: hotel._id,
          name: '스위트 룸',
          description: '최고급 시설과 넓은 공간을 자랑하는 스위트 객실입니다.',
          type: 'suite',
          price: prices.suite,
          maxGuests: 4,
          images: ['/images/hotel-3.png'],
          amenities: ['TV', '에어컨', '미니바', '욕실', '발코니', '거실', '스파', '무료 와이파이'],
          size: 60,
          bedType: 'king',
          totalRooms: 8,
          status: 'available'
        },
        {
          hotel: hotel._id,
          name: '프리미엄 스위트',
          description: '최상의 럭셔리와 프라이버시를 제공하는 프리미엄 스위트룸입니다.',
          type: 'premium',
          price: prices.premium,
          maxGuests: 6,
          images: ['/images/hotel.jpg'],
          amenities: ['TV', '에어컨', '미니바', '욕실', '발코니', '거실', '스파', '주방', '무료 와이파이', '버틀러 서비스'],
          size: 90,
          bedType: 'king',
          totalRooms: 4,
          status: 'available'
        }
      ];
      
      const createdRooms = await Room.insertMany(hotelRooms);
      rooms.push(...createdRooms);
    }

    console.log(`✅ ${rooms.length}개의 객실 생성 완료`);

    // 4. 예약 생성
    console.log('📅 예약 생성 중...');
    const today = new Date();
    const checkIn1 = new Date(today);
    checkIn1.setDate(today.getDate() + 7);
    const checkOut1 = new Date(checkIn1);
    checkOut1.setDate(checkIn1.getDate() + 2);

    const checkIn2 = new Date(today);
    checkIn2.setDate(today.getDate() + 14);
    const checkOut2 = new Date(checkIn2);
    checkOut2.setDate(checkIn2.getDate() + 3);

    const checkIn3 = new Date(today);
    checkIn3.setDate(today.getDate() - 5);
    const checkOut3 = new Date(checkIn3);
    checkOut3.setDate(checkIn3.getDate() + 2);

    const reservations = await Reservation.insertMany([
      {
        user: normalUser._id,
        hotel: hotels[0]._id,
        room: rooms[0]._id,
        checkIn: checkIn1,
        checkOut: checkOut1,
        guests: 2,
        totalPrice: rooms[0].price * 2,
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: '조용한 방 부탁드립니다'
      },
      {
        user: normalUser._id,
        hotel: hotels[1]._id,
        room: rooms[4]._id,
        checkIn: checkIn2,
        checkOut: checkOut2,
        guests: 3,
        totalPrice: rooms[4].price * 3,
        status: 'confirmed',
        paymentStatus: 'paid'
      },
      {
        user: normalUser2._id,
        hotel: hotels[2]._id,
        room: rooms[6]._id,
        checkIn: checkIn3,
        checkOut: checkOut3,
        guests: 2,
        totalPrice: rooms[6].price * 2,
        status: 'completed',
        paymentStatus: 'paid'
      },
      {
        user: normalUser2._id,
        hotel: hotels[0]._id,
        room: rooms[1]._id,
        checkIn: checkIn1,
        checkOut: checkOut1,
        guests: 2,
        totalPrice: rooms[1].price * 2,
        status: 'pending',
        paymentStatus: 'pending'
      }
    ]);

    console.log(`✅ ${reservations.length}개의 예약 생성 완료`);

    // 5. 리뷰 생성
    console.log('⭐ 리뷰 생성 중...');
    const reviews = await Review.insertMany([
      {
        user: normalUser2._id,
        hotel: hotels[2]._id,
        reservation: reservations[2]._id,
        rating: 5,
        comment: '정말 훌륭한 호텔이었습니다! 제주도의 아름다운 전망과 깔끔한 객실, 친절한 서비스까지 모든 것이 완벽했습니다. 다시 방문하고 싶어요!'
      },
      {
        user: normalUser2._id,
        hotel: hotels[0]._id,
        reservation: reservations[3]._id,
        rating: 4,
        comment: '위치가 좋고 시설도 깔끔합니다. 다만 조금 시끄러웠지만 전체적으로 만족스러운 숙박이었습니다.'
      }
    ]);

    console.log(`✅ ${reviews.length}개의 리뷰 생성 완료`);

    // 6. 쿠폰 생성
    console.log('🎫 쿠폰 생성 중...');
    const today = new Date();
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

    // 사용자별 쿠폰 할당
    const userCoupon = await Coupon.create({
      code: `USER${normalUser._id.toString().slice(-6).toUpperCase()}`,
      name: '개인 전용 쿠폰',
      description: '10,000원 할인 쿠폰',
      type: 'amount',
      discount: 10000,
      minAmount: 50000,
      validFrom: today,
      validUntil: nextMonth,
      usageLimit: 1,
      usedCount: 0,
      isPublic: false,
      userId: normalUser._id,
      target: 'member'
    });

    coupons.push(userCoupon);
    console.log(`✅ ${coupons.length}개의 쿠폰 생성 완료`);

    // 호텔 평점 업데이트 (리뷰 기반)
    console.log('📊 호텔 평점 업데이트 중...');
    for (const hotel of hotels) {
      const hotelReviews = reviews.filter(r => r.hotel.toString() === hotel._id.toString());
      if (hotelReviews.length > 0) {
        const avgRating = hotelReviews.reduce((sum, r) => sum + r.rating, 0) / hotelReviews.length;
        await Hotel.findByIdAndUpdate(hotel._id, {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: hotelReviews.length
        });
      }
    }

    console.log('\n✨ 초기 데이터 생성이 완료되었습니다!');
    console.log('\n📊 생성된 데이터 요약:');
    console.log(`   - 사용자: ${users.length}명`);
    console.log(`   - 호텔: ${hotels.length}개`);
    console.log(`   - 객실: ${rooms.length}개`);
    console.log(`   - 예약: ${reservations.length}개`);
    console.log(`   - 리뷰: ${reviews.length}개`);
    console.log(`   - 쿠폰: ${coupons.length}개`);
    console.log('\n🔑 테스트 계정:');
    console.log('   일반 사용자: user@gmail.com / 1234');
    console.log('   홍길동: hong@gmail.com / 1234');
    console.log('   사업자: owner@gmail.com / 1234');
    console.log('   관리자: admin@gmail.com / 1234');

    process.exit(0);
  } catch (error) {
    console.error('❌ 초기 데이터 생성 중 오류 발생:', error);
    process.exit(1);
  }
};

// 스크립트 실행
initData();


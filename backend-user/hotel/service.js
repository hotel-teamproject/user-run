const Hotel = require('./model');
const mongoose = require('mongoose');

// 서비스 클래스
class HotelService {
  // 호텔 목록 조회 (검색 + 필터링)
  static async getHotels(options = {}) {
    try {
      const {
        city,
        checkin,
        checkout,
        guests,
        minPrice,
        maxPrice,
        stars,
        page = 1,
        limit = 10,
        sort = 'rating',
        keyword
      } = options;

      const query = { isActive: true };
      
      // 도시 필터
      if (city) {
        query['location.city'] = { $regex: city, $options: 'i' };
      }
      
      // 키워드 검색
      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { 'location.city': { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { tags: { $in: [new RegExp(keyword, 'i')] } }
        ];
      }

      // 가격 필터 (최저 객실 가격 기준)
      if (minPrice || maxPrice) {
        query['rooms.price'] = {};
        if (minPrice) query['rooms.price'].$gte = parseInt(minPrice);
        if (maxPrice) query['rooms.price'].$lte = parseInt(maxPrice);
      }

      // 등급 필터
      if (stars) {
        query.stars = parseInt(stars);
      }

      // 정렬
      const sortOptions = {};
      switch (sort) {
        case 'price':
          sortOptions['rooms.0.price'] = 1;
          break;
        case 'rating':
          sortOptions['reviewStats.average'] = -1;
          break;
        case 'popular':
          sortOptions['meta.bookings'] = -1;
          break;
        default:
          sortOptions.featured = -1;
          sortOptions['reviewStats.average'] = -1;
      }

      // 페이징
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // 호텔 목록 조회
      const hotels = await Hotel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-reviews') // 리뷰는 별도 API로
        .lean();

      // 총 개수
      const total = await Hotel.countDocuments(query);

      return {
        success: true,
        hotels,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
          hasNext: skip + hotels.length < total
        }
      };
    } catch (error) {
      console.error('HotelService.getHotels error:', error);
      throw new Error(`호텔 목록 조회 실패: ${error.message}`);
    }
  }

  // 호텔 상세 조회 (ID 또는 slug)
  static async getHotelById(hotelId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        // slug로 조회
        const hotel = await Hotel.findOne({ slug: hotelId })
          .populate('reviews.userId', 'name profileImage')
          .lean();
        
        if (!hotel) {
          throw new Error('호텔을 찾을 수 없습니다.');
        }
        return { success: true, hotel };
      }

      // ObjectId로 조회
      const hotel = await Hotel.findById(hotelId)
        .populate('reviews.userId', 'name profileImage')
        .lean();

      if (!hotel) {
        throw new Error('호텔을 찾을 수 없습니다.');
      }

      // 조회수 증가
      await Hotel.findByIdAndUpdate(hotelId, { 
        $inc: { 'meta.views': 1 } 
      });

      return { success: true, hotel };
    } catch (error) {
      console.error('HotelService.getHotelById error:', error);
      throw new Error(`호텔 상세 조회 실패: ${error.message}`);
    }
  }

  // 호텔 검색
  static async searchHotels(searchQuery, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const query = {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { 'location.city': { $regex: searchQuery, $options: 'i' } },
          { 'location.address': { $regex: searchQuery, $options: 'i' } },
          { tags: { $in: [new RegExp(searchQuery, 'i')] } }
        ],
        isActive: true
      };

      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const hotels = await Hotel.find(query)
        .sort({ 'reviewStats.average': -1, featured: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Hotel.countDocuments(query);

      return {
        success: true,
        hotels,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      };
    } catch (error) {
      console.error('HotelService.searchHotels error:', error);
      throw new Error(`호텔 검색 실패: ${error.message}`);
    }
  }

  // 추천 호텔
  static async getRecommendedHotels(city = null, limit = 5) {
    try {
      const query = { 
        isActive: true, 
        featured: true 
      };

      if (city) {
        query['location.city'] = { $regex: city, $options: 'i' };
      }

      const hotels = await Hotel.find(query)
        .sort({ 'reviewStats.average': -1, 'meta.bookings': -1 })
        .limit(parseInt(limit))
        .lean();

      return { success: true, hotels };
    } catch (error) {
      console.error('HotelService.getRecommendedHotels error:', error);
      throw new Error('추천 호텔 조회 실패');
    }
  }

  // 도시별 호텔 통계
  static async getHotelsByCity() {
    try {
      const stats = await Hotel.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$location.city',
            count: { $sum: 1 },
            avgRating: { $avg: '$reviewStats.average' },
            avgPrice: { $avg: { $min: '$rooms.price' } }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      return { success: true, cities: stats };
    } catch (error) {
      console.error('HotelService.getHotelsByCity error:', error);
      throw new Error('도시별 통계 조회 실패');
    }
  }

  // 객실 가용성 확인
  static async checkRoomAvailability(hotelId, roomType, checkin, checkout) {
    try {
      const hotel = await Hotel.findById(hotelId).lean();
      if (!hotel) throw new Error('호텔을 찾을 수 없습니다.');

      const room = hotel.rooms.find(r => r.roomType === roomType);
      if (!room) throw new Error('선택한 객실 타입이 없습니다.');

      // 간단한 가용성 체크 로직 (실제로는 예약 테이블과 연동)
      const days = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
      const availableRooms = room.maxAvailable || 0;

      return {
        success: true,
        available: availableRooms > 0,
        availableRooms,
        totalPrice: room.price * days,
        room
      };
    } catch (error) {
      console.error('HotelService.checkRoomAvailability error:', error);
      throw new Error(`가용성 확인 실패: ${error.message}`);
    }
  }
}

module.exports = HotelService;

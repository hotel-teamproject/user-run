import Hotel from '../models/Hotel.js';
import Reservation from '../models/Reservation.js';
import Room from '../models/Room.js';

// 호텔 목록 조회
export const getHotels = async (req, res) => {
  try {
    const { city, tags, minPrice, maxPrice, sort = '-rating' } = req.query;

    // 필터 조건 생성
    let filter = { status: 'active' };

    if (city) {
      filter.city = city;
    }

    if (tags) {
      const tagArray = tags.split(',');
      filter.tags = { $in: tagArray };
    }

    // 호텔 조회
    const hotels = await Hotel.find(filter)
      .sort(sort)
      .populate('owner', 'name email');

    // 각 호텔의 가장 저렴한 객실 가격 계산
    const hotelsWithPrice = await Promise.all(hotels.map(async (hotel) => {
      const hotelObj = hotel.toObject();
      
      // 해당 호텔의 가장 저렴한 객실 가격 찾기
      const cheapestRoom = await Room.findOne({ hotel: hotel._id, status: 'available' })
        .sort({ price: 1 })
        .select('price');
      
      // 호텔 객체에 가격 및 이미지 정보 추가
      hotelObj.basePrice = cheapestRoom?.price || 0;
      hotelObj.image = hotelObj.images?.[0] || '/images/hotel-placeholder.png';
      hotelObj.imageCount = hotelObj.images?.length || 0;
      hotelObj.location = hotelObj.address || hotelObj.city || '';
      
      return hotelObj;
    }));

    res.json({
      resultCode: 'SUCCESS',
      message: '호텔 목록 조회 성공',
      data: hotelsWithPrice
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 호텔 상세 정보 조회
export const getHotelDetail = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId)
      .populate('owner', 'name email');

    if (!hotel) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '호텔을 찾을 수 없습니다',
        data: null
      });
    }

    res.json({
      resultCode: 'SUCCESS',
      message: '호텔 상세 조회 성공',
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 호텔의 객실 목록 조회
export const getHotelRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      hotel: req.params.hotelId,
      status: 'available'
    }).populate('hotel', 'name city');

    res.json({
      resultCode: 'SUCCESS',
      message: '객실 목록 조회 성공',
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 예약 가능한 객실 조회 (날짜 기반)
export const getAvailableRooms = async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut, guests } = req.query;

    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '호텔 ID, 체크인/체크아웃 날짜를 입력해주세요',
        data: null
      });
    }

    // 해당 호텔의 모든 객실 조회
    const allRooms = await Room.find({
      hotel: hotelId,
      status: 'available',
      ...(guests && { maxGuests: { $gte: parseInt(guests) } })
    }).populate('hotel', 'name city');

    // 해당 기간에 예약된 객실 조회
    const reservations = await Reservation.find({
      hotel: hotelId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkIn: { $lte: new Date(checkOut) },
          checkOut: { $gte: new Date(checkIn) }
        }
      ]
    });

    // 예약된 객실 ID 추출
    const reservedRoomIds = reservations.map(r => r.room.toString());

    // 예약 가능한 객실만 필터링
    const availableRooms = allRooms.map(room => {
      const reservedCount = reservedRoomIds.filter(id => id === room._id.toString()).length;
      const availableCount = room.totalRooms - reservedCount;

      return {
        ...room.toObject(),
        availableCount,
        isAvailable: availableCount > 0
      };
    }).filter(room => room.isAvailable);

    res.json({
      resultCode: 'SUCCESS',
      message: '예약 가능한 객실 조회 성공',
      data: availableRooms
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};
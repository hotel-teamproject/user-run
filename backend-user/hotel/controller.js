const HotelService = require('./service');
const mongoose = require('mongoose');

// 호텔 목록 조회
const getHotels = async (req, res) => {
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
    } = req.query;

    const result = await HotelService.getHotels({
      city,
      checkin,
      checkout,
      guests,
      minPrice,
      maxPrice,
      stars,
      page,
      limit,
      sort,
      keyword
    });

    return res.status(200).json({
      success: true,
      message: '호텔 목록 조회 성공',
      data: result
    });
  } catch (error) {
    console.error('getHotels error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '호텔 목록 조회 실패'
    });
  }
};

// 호텔 상세 조회
const getHotel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: '호텔 ID가 필요합니다.'
      });
    }

    const result = await HotelService.getHotelById(id);

    return res.status(200).json({
      success: true,
      message: '호텔 상세 조회 성공',
      data: result.hotel
    });
  } catch (error) {
    console.error('getHotel error:', error);
    return res.status(404).json({
      success: false,
      message: error.message || '호텔을 찾을 수 없습니다.'
    });
  }
};

// 호텔 검색
const searchHotels = async (req, res) => {
  try {
    const { q: searchQuery, page = 1, limit = 20 } = req.query;

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: '검색어를 입력해주세요.'
      });
    }

    const result = await HotelService.searchHotels(searchQuery, {
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      message: '호텔 검색 성공',
      data: result
    });
  } catch (error) {
    console.error('searchHotels error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '호텔 검색 실패'
    });
  }
};

// 추천 호텔
const getRecommendedHotels = async (req, res) => {
  try {
    const { city, limit = 5 } = req.query;

    const result = await HotelService.getRecommendedHotels(city, limit);

    return res.status(200).json({
      success: true,
      message: '추천 호텔 조회 성공',
      data: result.hotels
    });
  } catch (error) {
    console.error('getRecommendedHotels error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '추천 호텔 조회 실패'
    });
  }
};

// 도시별 호텔 통계
const getHotelsByCity = async (req, res) => {
  try {
    const result = await HotelService.getHotelsByCity();

    return res.status(200).json({
      success: true,
      message: '도시별 호텔 통계 조회 성공',
      data: result.cities
    });
  } catch (error) {
    console.error('getHotelsByCity error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '통계 조회 실패'
    });
  }
};

// 객실 가용성 확인
const checkRoomAvailability = async (req, res) => {
  try {
    const { hotelId, roomType, checkin, checkout } = req.query;

    if (!hotelId || !roomType || !checkin || !checkout) {
      return res.status(400).json({
        success: false,
        message: '호텔ID, 객실타입, 체크인/체크아웃 날짜가 필요합니다.'
      });
    }

    const result = await HotelService.checkRoomAvailability(
      hotelId,
      roomType,
      checkin,
      checkout
    );

    return res.status(200).json({
      success: true,
      message: '객실 가용성 확인 성공',
      data: result
    });
  } catch (error) {
    console.error('checkRoomAvailability error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || '가용성 확인 실패'
    });
  }
};

// 호텔 생성 (관리자용)
const createHotel = async (req, res) => {
  try {
    // 인증 미들웨어에서 관리자 권한 확인 후 실행
    const hotelData = req.body;

    const hotel = new Hotel(hotelData);
    await hotel.save();

    return res.status(201).json({
      success: true,
      message: '호텔이 성공적으로 등록되었습니다.',
      data: hotel
    });
  } catch (error) {
    console.error('createHotel error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || '호텔 등록 실패'
    });
  }
};

// 호텔 수정 (관리자용)
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const hotel = await Hotel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: '호텔을 찾을 수 없습니다.'
      });
    }

    return res.status(200).json({
      success: true,
      message: '호텔 정보가 업데이트되었습니다.',
      data: hotel
    });
  } catch (error) {
    console.error('updateHotel error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || '호텔 수정 실패'
    });
  }
};

// 호텔 삭제 (관리자용)
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findByIdAndDelete(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: '호텔을 찾을 수 없습니다.'
      });
    }

    return res.status(200).json({
      success: true,
      message: '호텔이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('deleteHotel error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '호텔 삭제 실패'
    });
  }
};

module.exports = {
  getHotels,
  getHotel,
  searchHotels,
  getRecommendedHotels,
  getHotelsByCity,
  checkRoomAvailability,
  createHotel,
  updateHotel,
  deleteHotel
};

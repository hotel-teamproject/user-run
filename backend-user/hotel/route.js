const express = require('express');
const router = express.Router();
const {
  getHotels,
  getHotel,
  searchHotels,
  getRecommendedHotels,
  getHotelsByCity,
  checkRoomAvailability,
  createHotel,
  updateHotel,
  deleteHotel
} = require('./controller');

// 인증/권한 미들웨어 (user 미들웨어에서 가져옴)
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '인증이 필요합니다.'
    });
  }
  next();
};

// 관리자 권한 미들웨어
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '관리자 권한이 필요합니다.'
    });
  }
  next();
};

// ===== 공개 API (인증 불필요) =====

// 호텔 목록 조회
router.get('/', getHotels);

// 호텔 상세 조회 (ID 또는 slug)
router.get('/:id', getHotel);

// 호텔 검색
router.get('/search', searchHotels);

// 추천 호텔
router.get('/recommended', getRecommendedHotels);

// 도시별 호텔 통계
router.get('/stats/cities', getHotelsByCity);

// 객실 가용성 확인
router.get('/availability', checkRoomAvailability);

// ===== 인증 필요 API =====

// 호텔 생성 (관리자)
router.post('/', requireAuth, requireAdmin, createHotel);

// 호텔 수정 (관리자)
router.put('/:id', requireAuth, requireAdmin, updateHotel);

// 호텔 삭제 (관리자)
router.delete('/:id', requireAuth, requireAdmin, deleteHotel);

// ===== 추가 유틸 API =====

// 인기 호텔 (조회수 기준)
router.get('/popular', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const hotels = await require('./controller').HotelService.getHotels({
      sort: 'popular',
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      message: '인기 호텔 조회 성공',
      data: hotels
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || '인기 호텔 조회 실패'
    });
  }
});

// 최저가 호텔
router.get('/cheapest', async (req, res) => {
  try {
    const { city, page = 1, limit = 10 } = req.query;
    
    const result = await require('./service').getHotels({
      city,
      sort: 'price',
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      message: '최저가 호텔 조회 성공',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || '최저가 호텔 조회 실패'
    });
  }
});

// 태그별 호텔
router.get('/tags/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await require('./service').getHotels({
      keyword: tag,
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      message: `${tag} 태그 호텔 조회 성공`,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || '태그 호텔 조회 실패'
    });
  }
});

module.exports = router;

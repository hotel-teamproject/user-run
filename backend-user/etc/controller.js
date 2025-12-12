const EtcService = require('./service');
const mongoose = require('mongoose');

// ===== 리뷰 =====
const createReview = async (req, res) => {
  try {
    const reviewData = {
      hotelId: req.body.hotelId,
      userId: req.user._id,
      reservationId: req.body.reservationId,
      rating: parseInt(req.body.rating),
      title: req.body.title,
      content: req.body.content,
      images: req.body.images || []
    };

    const result = await EtcService.createReview(reviewData);

    return res.status(201).json({
      success: true,
      message: '리뷰가 등록되었습니다.',
      data: result.review
    });
  } catch (error) {
    console.error('createReview error:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getHotelReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    const result = await EtcService.getHotelReviews(hotelId, {
      page,
      limit,
      rating
    });

    return res.status(200).json({
      success: true,
      message: '호텔 리뷰 조회 성공',
      data: result
    });
  } catch (error) {
    console.error('getHotelReviews error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== 위시리스트 =====
const toggleWishlist = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 호텔 ID입니다.'
      });
    }

    const result = await EtcService.toggleWishlist(userId, hotelId);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: { action: result.action }
    });
  } catch (error) {
    console.error('toggleWishlist error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await EtcService.getUserWishlist(userId);

    return res.status(200).json({
      success: true,
      message: '위시리스트 조회 성공',
      data: result.wishlist
    });
  } catch (error) {
    console.error('getUserWishlist error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== 쿠폰 =====
const getAvailableCoupons = async (req, res) => {
  try {
    const { minAmount = 0 } = req.query;
    const userId = req.user?._id || null;

    const result = await EtcService.getAvailableCoupons(userId, parseInt(minAmount));

    return res.status(200).json({
      success: true,
      message: '사용 가능 쿠폰 조회 성공',
      data: result.coupons
    });
  } catch (error) {
    console.error('getAvailableCoupons error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const { amount } = req.query;
    const userId = req.user?._id;

    const result = await EtcService.applyCoupon(code, userId, parseInt(amount));

    return res.status(200).json({
      success: true,
      message: '쿠폰 적용 성공',
      data: result
    });
  } catch (error) {
    console.error('applyCoupon error:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ===== 포인트 =====
const getUserPointHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const result = await EtcService.getUserPointHistory(userId, { page, limit });

    return res.status(200).json({
      success: true,
      message: '포인트 내역 조회 성공',
      data: result
    });
  } catch (error) {
    console.error('getUserPointHistory error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== 문의 =====
const createInquiry = async (req, res) => {
  try {
    const inquiryData = {
      userId: req.user._id,
      hotelId: req.body.hotelId,
      type: req.body.type,
      title: req.body.title,
      content: req.body.content,
      images: req.body.images || []
    };

    const result = await EtcService.createInquiry(inquiryData);

    return res.status(201).json({
      success: true,
      message: '문의가 등록되었습니다.',
      data: result.inquiry
    });
  } catch (error) {
    console.error('createInquiry error:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getUserInquiries = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const result = await EtcService.getUserInquiries(userId, { page, limit, status });

    return res.status(200).json({
      success: true,
      message: '문의 내역 조회 성공',
      data: result.inquiries
    });
  } catch (error) {
    console.error('getUserInquiries error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== FAQ =====
const getFAQs = async (req, res) => {
  try {
    const { category } = req.query;
    const result = await EtcService.getFAQs(category);

    return res.status(200).json({
      success: true,
      message: 'FAQ 조회 성공',
      data: result.faqs
    });
  } catch (error) {
    console.error('getFAQs error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== 공지사항 =====
const getNotices = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const result = await EtcService.getNotices({ page, limit, type });

    return res.status(200).json({
      success: true,
      message: '공지사항 조회 성공',
      data: result
    });
  } catch (error) {
    console.error('getNotices error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EtcService.getNoticeById(id);

    return res.status(200).json({
      success: true,
      message: '공지사항 조회 성공',
      data: result.notice
    });
  } catch (error) {
    console.error('getNoticeById error:', error);
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  // 리뷰
  createReview,
  getHotelReviews,
  // 위시리스트
  toggleWishlist,
  getUserWishlist,
  // 쿠폰
  getAvailableCoupons,
  applyCoupon,
  // 포인트
  getUserPointHistory,
  // 문의
  createInquiry,
  getUserInquiries,
  // FAQ
  getFAQs,
  // 공지사항
  getNotices,
  getNoticeById
};
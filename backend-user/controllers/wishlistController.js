import mongoose from 'mongoose';
import Wishlist from '../models/Wishlist.js';
import Hotel from '../models/Hotel.js';

// 위시리스트 토글 (추가/삭제)
export const toggleWishlist = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '유효하지 않은 호텔 ID입니다',
        data: null
      });
    }

    // 호텔 존재 확인
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '호텔을 찾을 수 없습니다',
        data: null
      });
    }

    // 기존 위시리스트 확인
    const existing = await Wishlist.findOne({ userId, hotelId });

    if (existing) {
      // 위시리스트에서 제거
      await Wishlist.findByIdAndDelete(existing._id);
      return res.json({
        resultCode: 'SUCCESS',
        message: '위시리스트에서 삭제되었습니다',
        data: { action: 'removed' }
      });
    } else {
      // 위시리스트에 추가
      const wishlist = await Wishlist.create({ userId, hotelId });
      return res.json({
        resultCode: 'SUCCESS',
        message: '위시리스트에 추가되었습니다',
        data: { action: 'added', wishlist }
      });
    }
  } catch (error) {
    console.error('toggleWishlist error:', error);
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 사용자 위시리스트 조회
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlistItems = await Wishlist.find({ userId })
      .populate('hotelId')
      .sort({ createdAt: -1 });

    // 호텔 정보 포함하여 반환
    const wishlist = wishlistItems.map(item => ({
      _id: item._id,
      hotel: item.hotelId,
      createdAt: item.createdAt
    }));

    res.json({
      resultCode: 'SUCCESS',
      message: '위시리스트 조회 성공',
      data: wishlist
    });
  } catch (error) {
    console.error('getUserWishlist error:', error);
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 호텔이 위시리스트에 있는지 확인
export const checkWishlist = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ userId, hotelId });

    res.json({
      resultCode: 'SUCCESS',
      message: '위시리스트 확인 성공',
      data: { isWishlisted: !!wishlist }
    });
  } catch (error) {
    console.error('checkWishlist error:', error);
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};


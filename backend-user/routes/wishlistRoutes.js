import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  toggleWishlist,
  getUserWishlist,
  checkWishlist
} from '../controllers/wishlistController.js';

const router = express.Router();

// 모든 위시리스트 라우트는 인증 필요
router.use(protect);

// 위시리스트 토글 (추가/삭제)
router.post('/:hotelId', toggleWishlist);

// 사용자 위시리스트 조회
router.get('/', getUserWishlist);

// 호텔이 위시리스트에 있는지 확인
router.get('/check/:hotelId', checkWishlist);

export default router;


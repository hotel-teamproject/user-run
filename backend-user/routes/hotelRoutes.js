import express from 'express';
import {
    getAvailableRooms,
    getHotelDetail,
    getHotelRooms,
    getHotels
} from '../controllers/hotelController.js';

const router = express.Router();

// Public routes
router.get('/', getHotels);
router.get('/rooms', getAvailableRooms); // 예약 가능한 객실 조회
router.get('/:hotelId', getHotelDetail);
router.get('/:hotelId/rooms', getHotelRooms);

export default router;
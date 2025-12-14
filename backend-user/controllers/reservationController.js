import Reservation from '../models/Reservation.js';
import Room from '../models/Room.js';
import Coupon from '../models/Coupon.js';

// 예약 생성
export const createReservation = async (req, res) => {
  try {
    const { 
      hotelId, 
      roomId, 
      checkIn, 
      checkOut, 
      guests, 
      specialRequests,
      totalPrice,  // 프론트엔드에서 계산된 최종 금액 (쿠폰 할인 포함)
      discount,    // 쿠폰 할인 금액
      extrasPrice, // 추가 옵션 가격
      couponCode   // 사용된 쿠폰 코드
    } = req.body;

    if (!hotelId || !roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '모든 필수 정보를 입력해주세요',
        data: null
      });
    }

    // 객실 정보 조회
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '객실을 찾을 수 없습니다',
        data: null
      });
    }

    // 최대 인원 확인
    if (guests > room.maxGuests) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: `최대 ${room.maxGuests}명까지 예약 가능합니다`,
        data: null
      });
    }

    // 예약 가능 여부 확인 (같은 날짜에 중복 예약 방지)
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const overlappingReservations = await Reservation.countDocuments({
      room: roomId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate }
        }
      ]
    });

    if (overlappingReservations >= room.totalRooms) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '해당 날짜에 예약 가능한 객실이 없습니다',
        data: null
      });
    }

    // 총 가격 계산 (프론트엔드에서 전달된 totalPrice 사용, 없으면 기본 계산)
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const finalTotalPrice = totalPrice || (nights * room.price);

    // 쿠폰 사용 처리
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        // 쿠폰 사용 횟수 증가
        coupon.usedCount = (coupon.usedCount || 0) + 1;
        await coupon.save();
      }
    }

    // 예약 생성 (결제 완료로 간주하여 바로 confirmed 상태로 생성)
    const reservation = await Reservation.create({
      user: req.user._id,
      hotel: hotelId,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice: finalTotalPrice,
      discount: discount || 0,
      extrasPrice: extrasPrice || 0,
      couponCode: couponCode || null,
      specialRequests,
      status: 'confirmed',
      paymentStatus: 'paid'
    });

    // 생성된 예약 정보 조회 (populate)
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('hotel', 'name address city')
      .populate('room', 'name type price');

    res.status(201).json({
      resultCode: 'SUCCESS',
      message: '예약이 생성되었습니다',
      data: populatedReservation
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 내 예약 목록 조회
export const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .sort('-createdAt')
      .populate('hotel', 'name address city images')
      .populate('room', 'name type price');

    res.json({
      resultCode: 'SUCCESS',
      message: '예약 목록 조회 성공',
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 예약 상세 조회
export const getReservationDetail = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId)
      .populate('hotel', 'name address city images amenities')
      .populate('room', 'name type price images amenities')
      .populate('payment');

    if (!reservation) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '예약을 찾을 수 없습니다',
        data: null
      });
    }

    // 본인의 예약만 조회 가능
    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        resultCode: 'FAIL',
        message: '접근 권한이 없습니다',
        data: null
      });
    }

    res.json({
      resultCode: 'SUCCESS',
      message: '예약 상세 조회 성공',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 예약 취소
export const cancelReservation = async (req, res) => {
  try {
    const { cancelReason } = req.body;

    const reservation = await Reservation.findById(req.params.reservationId);

    if (!reservation) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '예약을 찾을 수 없습니다',
        data: null
      });
    }

    // 본인의 예약만 취소 가능
    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        resultCode: 'FAIL',
        message: '본인의 예약만 취소할 수 있습니다',
        data: null
      });
    }

    // 이미 취소된 예약인지 확인
    if (reservation.status === 'cancelled') {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '이미 취소된 예약입니다',
        data: null
      });
    }

    // 체크인 날짜가 지났는지 확인
    if (new Date(reservation.checkIn) < new Date()) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '체크인 날짜가 지난 예약은 취소할 수 없습니다',
        data: null
      });
    }

    // 예약 취소
    reservation.status = 'cancelled';
    reservation.cancelReason = cancelReason || '사용자 요청';
    reservation.cancelledAt = new Date();
    await reservation.save();

    res.json({
      resultCode: 'SUCCESS',
      message: '예약이 취소되었습니다',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};
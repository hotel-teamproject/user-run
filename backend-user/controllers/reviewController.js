import Hotel from '../models/Hotel.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';

// 리뷰 작성
export const createReview = async (req, res) => {
  try {
    const { hotelId, reservationId, rating, comment, images } = req.body;

    // 필수 필드 확인 (reservationId는 선택적)
    if (!hotelId || !rating || !comment) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '호텔 ID, 평점, 리뷰 내용을 입력해주세요',
        data: null
      });
    }

    // reservationId가 제공된 경우에만 예약 확인
    if (reservationId) {
      const reservation = await Reservation.findById(reservationId);

      if (!reservation) {
        return res.status(404).json({
          resultCode: 'FAIL',
          message: '예약을 찾을 수 없습니다',
          data: null
        });
      }

      // 본인의 예약인지 확인
      if (reservation.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          resultCode: 'FAIL',
          message: '본인의 예약에만 리뷰를 작성할 수 있습니다',
          data: null
        });
      }

      // 체크아웃이 완료되었는지 확인
      if (new Date(reservation.checkOut) > new Date()) {
        return res.status(400).json({
          resultCode: 'FAIL',
          message: '체크아웃 이후에 리뷰를 작성할 수 있습니다',
          data: null
        });
      }

      // 이미 리뷰를 작성했는지 확인
      const existingReview = await Review.findOne({ reservation: reservationId });
      if (existingReview) {
        return res.status(400).json({
          resultCode: 'FAIL',
          message: '이미 리뷰를 작성한 예약입니다',
          data: null
        });
      }
    } else {
      // reservationId가 없는 경우, 같은 사용자가 같은 호텔에 이미 리뷰를 작성했는지 확인
      const existingReview = await Review.findOne({ 
        user: req.user._id, 
        hotel: hotelId,
        reservation: null // reservationId가 없는 리뷰만 확인
      });
      
      if (existingReview) {
        return res.status(400).json({
          resultCode: 'FAIL',
          message: '이미 이 호텔에 리뷰를 작성하셨습니다. 리뷰는 하나만 작성할 수 있습니다.',
          data: null
        });
      }
    }

    // 리뷰 생성 (reservationId는 선택적)
    const review = await Review.create({
      user: req.user._id,
      hotel: hotelId,
      reservation: reservationId || null,
      rating,
      comment,
      images: images || []
    });

    // 호텔 평점 업데이트
    await updateHotelRating(hotelId);

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('hotel', 'name');

    res.status(201).json({
      resultCode: 'SUCCESS',
      message: '리뷰가 작성되었습니다',
      data: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 리뷰 수정
export const updateReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;

    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '리뷰를 찾을 수 없습니다',
        data: null
      });
    }

    // 본인의 리뷰만 수정 가능
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        resultCode: 'FAIL',
        message: '본인의 리뷰만 수정할 수 있습니다',
        data: null
      });
    }

    // 리뷰 수정
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.images = images || review.images;
    await review.save();

    // 호텔 평점 업데이트
    await updateHotelRating(review.hotel);

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('hotel', 'name');

    res.json({
      resultCode: 'SUCCESS',
      message: '리뷰가 수정되었습니다',
      data: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 리뷰 삭제
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '리뷰를 찾을 수 없습니다',
        data: null
      });
    }

    // 본인의 리뷰만 삭제 가능
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        resultCode: 'FAIL',
        message: '본인의 리뷰만 삭제할 수 있습니다',
        data: null
      });
    }

    const hotelId = review.hotel;
    await review.deleteOne();

    // 호텔 평점 업데이트
    await updateHotelRating(hotelId);

    res.json({
      resultCode: 'SUCCESS',
      message: '리뷰가 삭제되었습니다',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 호텔 리뷰 목록 조회
export const getHotelReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { sort = '-createdAt', limit = 10, page = 1 } = req.query;

    const reviews = await Review.find({ hotel: hotelId })
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('user', 'name');

    const total = await Review.countDocuments({ hotel: hotelId });

    res.json({
      resultCode: 'SUCCESS',
      message: '리뷰 목록 조회 성공',
      data: {
        reviews,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 호텔 평점 업데이트 헬퍼 함수
const updateHotelRating = async (hotelId) => {
  try {
    const reviews = await Review.find({ hotel: hotelId });

    if (reviews.length === 0) {
      await Hotel.findByIdAndUpdate(hotelId, {
        rating: 0,
        reviewCount: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Hotel.findByIdAndUpdate(hotelId, {
      rating: Math.round(averageRating * 10) / 10, // 소수점 첫째자리까지
      reviewCount: reviews.length
    });
  } catch (error) {
    console.error('호텔 평점 업데이트 실패:', error);
  }
};
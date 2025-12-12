const {
    Review,
    Wishlist,
    Coupon,
    PointTransaction,
    Inquiry,
    FAQ,
    Notice
  } = require('./model');
  const mongoose = require('mongoose');
  
  class EtcService {
    // ===== 리뷰 =====
    static async createReview(reviewData) {
      try {
        const review = new Review(reviewData);
        await review.save();
        
        // 호텔 리뷰 통계 업데이트 (호텔 서비스에서 처리)
        return { success: true, review };
      } catch (error) {
        throw new Error(`리뷰 작성 실패: ${error.message}`);
      }
    }
  
    static async getHotelReviews(hotelId, options = {}) {
      try {
        const { page = 1, limit = 10, rating } = options;
        const query = { hotelId };
        
        if (rating) query.rating = rating;
  
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const reviews = await Review.find(query)
          .populate('userId', 'name profileImage')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean();
  
        const total = await Review.countDocuments(query);
  
        return {
          success: true,
          reviews,
          pagination: { page: parseInt(page), limit: parseInt(limit), total }
        };
      } catch (error) {
        throw new Error('리뷰 조회 실패');
      }
    }
  
    // ===== 위시리스트 =====
    static async toggleWishlist(userId, hotelId) {
      try {
        const existing = await Wishlist.findOne({ userId, hotelId });
        
        if (existing) {
          await Wishlist.findByIdAndDelete(existing._id);
          return { success: true, action: 'removed', message: '위시리스트에서 삭제되었습니다.' };
        } else {
          const wishlist = new Wishlist({ userId, hotelId });
          await wishlist.save();
          return { success: true, action: 'added', message: '위시리스트에 추가되었습니다.' };
        }
      } catch (error) {
        throw new Error('위시리스트 처리 실패');
      }
    }
  
    static async getUserWishlist(userId) {
      try {
        const wishlist = await Wishlist.find({ userId })
          .populate('hotelId', 'name thumbnail stars location')
          .sort({ createdAt: -1 })
          .lean();
        
        return { success: true, wishlist };
      } catch (error) {
        throw new Error('위시리스트 조회 실패');
      }
    }
  
    // ===== 쿠폰 =====
    static async getAvailableCoupons(userId, minAmount = 0) {
      try {
        const now = new Date();
        const coupons = await Coupon.find({
          validFrom: { $lte: now },
          validUntil: { $gte: now },
          $or: [
            { isPublic: true },
            { code: { $exists: true } } // 사용자별 비공개 쿠폰
          ],
          minAmount: { $lte: minAmount },
          usedCount: { $lt: { $ifNull: ['$usageLimit', 999999] } }
        }).sort({ priority: -1 }).lean();
  
        return { success: true, coupons };
      } catch (error) {
        throw new Error('쿠폰 조회 실패');
      }
    }
  
    static async applyCoupon(code, userId, amount) {
      try {
        const coupon = await Coupon.findOne({ code, validUntil: { $gte: new Date() } });
        if (!coupon) throw new Error('유효하지 않은 쿠폰입니다.');
  
        const discount = coupon.type === 'percent' 
          ? Math.min((amount * coupon.discount / 100), coupon.maxDiscount || Infinity)
          : coupon.discount;
  
        return { success: true, coupon, discount };
      } catch (error) {
        throw new Error(error.message);
      }
    }
  
    // ===== 포인트 =====
    static async addPointTransaction(userId, type, amount, description, refId) {
      try {
        // 현재 포인트 잔고 조회 (User 모델에서 처리 가정)
        const currentBalance = 10000; // 실제로는 User.findById(userId)
  
        const transaction = new PointTransaction({
          userId,
          type,
          amount,
          description,
          refId,
          balanceAfter: currentBalance + (type === 'earn' ? amount : -amount)
        });
  
        await transaction.save();
        return { success: true, transaction };
      } catch (error) {
        throw new Error('포인트 거래 처리 실패');
      }
    }
  
    static async getUserPointHistory(userId, options = {}) {
      try {
        const { page = 1, limit = 20 } = options;
        const skip = (parseInt(page) - 1) * parseInt(limit);
  
        const history = await PointTransaction.find({ userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean();
  
        const total = await PointTransaction.countDocuments({ userId });
  
        return {
          success: true,
          history,
          pagination: { page: parseInt(page), limit: parseInt(limit), total }
        };
      } catch (error) {
        throw new Error('포인트 내역 조회 실패');
      }
    }
  
    // ===== 문의 =====
    static async createInquiry(inquiryData) {
      try {
        const inquiry = new Inquiry(inquiryData);
        await inquiry.save();
        return { success: true, inquiry };
      } catch (error) {
        throw new Error('문의 등록 실패');
      }
    }
  
    static async getUserInquiries(userId, options = {}) {
      try {
        const { page = 1, limit = 10, status } = options;
        const query = { userId };
        if (status) query.status = status;
  
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const inquiries = await Inquiry.find(query)
          .populate('hotelId', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean();
  
        return { success: true, inquiries };
      } catch (error) {
        throw new Error('문의 내역 조회 실패');
      }
    }
  
    // ===== FAQ =====
    static async getFAQs(category = null) {
      try {
        const query = { isActive: true };
        if (category) query.category = category;
  
        const faqs = await FAQ.find(query)
          .sort({ priority: -1, createdAt: -1 })
          .lean();
  
        return { success: true, faqs };
      } catch (error) {
        throw new Error('FAQ 조회 실패');
      }
    }
  
    // ===== 공지사항 =====
    static async getNotices(options = {}) {
      try {
        const { page = 1, limit = 10, type } = options;
        const query = { isActive: true };
        if (type) query.type = type;
  
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const notices = await Notice.find(query)
          .sort({ isPinned: -1, createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean();
  
        const total = await Notice.countDocuments(query);
  
        return {
          success: true,
          notices,
          pagination: { page: parseInt(page), limit: parseInt(limit), total }
        };
      } catch (error) {
        throw new Error('공지사항 조회 실패');
      }
    }
  
    static async getNoticeById(id) {
      try {
        const notice = await Notice.findById(id).lean();
        if (!notice || !notice.isActive) {
          throw new Error('공지사항을 찾을 수 없습니다.');
        }
        return { success: true, notice };
      } catch (error) {
        throw new Error('공지사항 조회 실패');
      }
    }
  }
  
  module.exports = EtcService;
import Coupon from '../models/Coupon.js';

// 사용 가능한 쿠폰 목록 조회
export const getAvailableCoupons = async (req, res) => {
  try {
    const { minAmount = 0 } = req.query;
    const userId = req.user?._id;
    const now = new Date();

    // 사용 가능한 쿠폰 조회
    const coupons = await Coupon.find({
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { isPublic: true },
        { userId: userId }
      ],
      minAmount: { $lte: parseInt(minAmount) || 0 },
      $and: [
        {
          $or: [
            { usageLimit: { $exists: false } },
            { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
          ]
        }
      ]
    }).sort({ validUntil: 1 });

    res.json({
      resultCode: 'SUCCESS',
      message: '사용 가능한 쿠폰 조회 성공',
      data: coupons
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 사용자 보유 쿠폰 목록 조회 (사용 가능 + 만료)
export const getUserCoupons = async (req, res) => {
  try {
    const userId = req.user?._id;
    const now = new Date();

    // 사용자에게 할당된 쿠폰과 공개 쿠폰 모두 조회
    const coupons = await Coupon.find({
      $or: [
        { userId: userId },
        { isPublic: true }
      ]
    }).sort({ validUntil: -1 });

    // 사용 가능/만료 구분
    const available = coupons.filter(coupon => {
      const isInDate = coupon.validFrom <= now && coupon.validUntil >= now;
      const hasUsage = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;
      return isInDate && hasUsage;
    });

    const expired = coupons.filter(coupon => {
      const isExpired = coupon.validUntil < now || 
                       (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit);
      return isExpired;
    });

    res.json({
      resultCode: 'SUCCESS',
      message: '쿠폰 목록 조회 성공',
      data: {
        available,
        expired,
        all: coupons
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

// 쿠폰 적용
export const applyCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const userId = req.user?._id;
    const now = new Date();

    if (!code || !amount) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '쿠폰 코드와 금액을 입력해주세요',
        data: null
      });
    }

    // 쿠폰 조회
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      $or: [
        { isPublic: true },
        { userId: userId }
      ],
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    });

    if (!coupon) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '유효하지 않은 쿠폰입니다',
        data: null
      });
    }

    // 사용 횟수 제한 체크
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '쿠폰 사용 횟수가 초과되었습니다',
        data: null
      });
    }

    // 최소 주문 금액 체크
    if (amount < coupon.minAmount) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: `최소 주문 금액 ${coupon.minAmount.toLocaleString()}원 이상이어야 합니다`,
        data: null
      });
    }

    // 할인 금액 계산
    let discount = 0;
    if (coupon.type === 'percent') {
      discount = Math.floor(amount * coupon.discount / 100);
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discount;
    }

    res.json({
      resultCode: 'SUCCESS',
      message: '쿠폰 적용 성공',
      data: {
        coupon,
        discount,
        finalAmount: amount - discount
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


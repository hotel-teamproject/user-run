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

    // 사용 가능/만료/사용됨 구분
    const used = coupons.filter(coupon => {
      // 사용 횟수 제한이 있고, 사용 횟수가 제한에 도달한 경우
      const isUsed = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
      // 또는 개인 쿠폰이고 사용 횟수가 1 이상인 경우
      const isPersonalUsed = coupon.userId && coupon.userId.toString() === userId.toString() && coupon.usedCount > 0;
      return isUsed || isPersonalUsed;
    });

    const available = coupons.filter(coupon => {
      const isInDate = coupon.validFrom <= now && coupon.validUntil >= now;
      const hasUsage = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;
      const isUsed = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
      const isPersonalUsed = coupon.userId && coupon.userId.toString() === userId.toString() && coupon.usedCount > 0;
      // 사용 가능: 유효기간 내이고, 사용 가능하며, 사용되지 않은 경우
      return isInDate && hasUsage && !isUsed && !isPersonalUsed;
    });

    const expired = coupons.filter(coupon => {
      const isExpired = coupon.validUntil < now;
      const isUsed = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
      const isPersonalUsed = coupon.userId && coupon.userId.toString() === userId.toString() && coupon.usedCount > 0;
      // 만료되었지만 사용되지 않은 경우만 만료됨으로 분류
      return isExpired && !isUsed && !isPersonalUsed;
    });

    res.json({
      resultCode: 'SUCCESS',
      message: '쿠폰 목록 조회 성공',
      data: {
        available,
        used,
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

// 쿠폰 코드로 쿠폰 추가
export const addCouponByCode = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user?._id;
    const now = new Date();

    if (!code) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '쿠폰 코드를 입력해주세요',
        data: null
      });
    }

    // 쿠폰 조회
    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      $or: [
        { isPublic: true },
        { userId: userId }
      ]
    });

    if (!coupon) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '유효하지 않은 쿠폰 코드입니다',
        data: null
      });
    }

    // 이미 만료된 쿠폰인지 확인
    if (coupon.validUntil < now) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '만료된 쿠폰입니다',
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

    // 개인 쿠폰인 경우 userId 업데이트 (아직 할당되지 않은 경우)
    if (!coupon.userId && !coupon.isPublic) {
      coupon.userId = userId;
      await coupon.save();
    }

    res.json({
      resultCode: 'SUCCESS',
      message: '쿠폰이 추가되었습니다',
      data: coupon
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


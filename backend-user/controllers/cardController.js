import Card from '../models/Card.js';

// 카드 번호 마스킹 함수
const maskCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return cardNumber;
  const last4 = cleaned.slice(-4);
  return `**** **** **** ${last4}`;
};

// 카드 브랜드 감지 함수
const detectCardBrand = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.startsWith('4')) return 'VISA';
  if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'MASTERCARD';
  if (cleaned.startsWith('3')) return 'AMEX';
  if (cleaned.startsWith('35')) return 'JCB';
  return 'VISA'; // 기본값
};

// 사용자 카드 목록 조회
export const getUserCards = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const cards = await Card.find({ user: userId })
      .select('-cvc') // CVC는 제외
      .sort({ isDefault: -1, createdAt: -1 });

    res.json({
      resultCode: 'SUCCESS',
      message: '카드 목록 조회 성공',
      data: cards
    });
  } catch (error) {
    console.error('getUserCards error:', error);
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 카드 추가
export const addCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cardNumber, expDate, cvc, nameOnCard, isDefault } = req.body;

    // 필수 필드 검증
    if (!cardNumber || !expDate || !cvc || !nameOnCard) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '모든 필드를 입력해주세요',
        data: null
      });
    }

    // 카드 번호 검증 (숫자만, 13-19자리)
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleanedCardNumber)) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '유효한 카드 번호를 입력해주세요',
        data: null
      });
    }

    // 만료일 검증 (MM/YY 형식)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expDate)) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '유효한 만료일을 입력해주세요 (MM/YY 형식)',
        data: null
      });
    }

    // CVC 검증 (3-4자리 숫자)
    if (!/^\d{3,4}$/.test(cvc)) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '유효한 CVC를 입력해주세요',
        data: null
      });
    }

    // 기본 카드로 설정하는 경우, 기존 기본 카드 해제
    if (isDefault) {
      await Card.updateMany(
        { user: userId, isDefault: true },
        { isDefault: false }
      );
    }

    // 카드 브랜드 감지
    const brand = detectCardBrand(cardNumber);
    const maskedNumber = maskCardNumber(cardNumber);

    // 새 카드 생성
    const newCard = await Card.create({
      user: userId,
      cardNumber: cleanedCardNumber,
      maskedNumber,
      expDate,
      cvc,
      nameOnCard,
      brand,
      isDefault: isDefault || false
    });

    // CVC 제외하고 반환
    const cardResponse = await Card.findById(newCard._id).select('-cvc');

    res.status(201).json({
      resultCode: 'SUCCESS',
      message: '카드가 추가되었습니다',
      data: cardResponse
    });
  } catch (error) {
    console.error('addCard error:', error);
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 카드 삭제
export const deleteCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;

    const card = await Card.findOne({ _id: cardId, user: userId });

    if (!card) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '카드를 찾을 수 없습니다',
        data: null
      });
    }

    await Card.findByIdAndDelete(cardId);

    res.json({
      resultCode: 'SUCCESS',
      message: '카드가 삭제되었습니다',
      data: null
    });
  } catch (error) {
    console.error('deleteCard error:', error);
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 기본 카드 설정
export const setDefaultCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;

    const card = await Card.findOne({ _id: cardId, user: userId });

    if (!card) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '카드를 찾을 수 없습니다',
        data: null
      });
    }

    // 기존 기본 카드 해제
    await Card.updateMany(
      { user: userId, isDefault: true },
      { isDefault: false }
    );

    // 새 기본 카드 설정
    card.isDefault = true;
    await card.save();

    res.json({
      resultCode: 'SUCCESS',
      message: '기본 카드가 설정되었습니다',
      data: card
    });
  } catch (error) {
    console.error('setDefaultCard error:', error);
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};


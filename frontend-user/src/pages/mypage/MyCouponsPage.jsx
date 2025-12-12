import React, { useState, useEffect } from 'react';
import { getUserCoupons } from '../../api/couponClient';
import '../../styles/pages/mypage/MyCouponsPage.scss';

const MyCouponsPage = () => {
  const [coupons, setCoupons] = useState({ available: [], expired: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'expired'

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getUserCoupons();
      setCoupons({
        available: data.available || [],
        expired: data.expired || []
      });
    } catch (error) {
      console.error('쿠폰 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDiscount = (coupon) => {
    if (coupon.type === 'percent') {
      return `${coupon.discount}%`;
    } else {
      return `₩${coupon.discount.toLocaleString()}`;
    }
  };

  const renderCouponCard = (coupon, isExpired = false) => {
    return (
      <div key={coupon._id} className={`coupon-card ${isExpired ? 'expired' : ''}`}>
        <div className="coupon-left">
          <div className="coupon-discount">
            <span className="discount-amount">{formatDiscount(coupon)}</span>
            <span className="discount-label">할인</span>
          </div>
        </div>
        <div className="coupon-right">
          <div className="coupon-header">
            <h3 className="coupon-name">{coupon.name}</h3>
            {coupon.code && (
              <span className="coupon-code">{coupon.code}</span>
            )}
          </div>
          {coupon.description && (
            <p className="coupon-description">{coupon.description}</p>
          )}
          <div className="coupon-info">
            {coupon.minAmount > 0 && (
              <div className="info-item">
                <span className="info-label">최소 주문:</span>
                <span className="info-value">₩{coupon.minAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="info-item">
              <span className="info-label">유효기간:</span>
              <span className="info-value">
                {formatDate(coupon.validUntil)}
              </span>
            </div>
            {coupon.usageLimit && (
              <div className="info-item">
                <span className="info-label">사용 가능:</span>
                <span className="info-value">
                  {coupon.usageLimit - coupon.usedCount}회 남음
                </span>
              </div>
            )}
          </div>
        </div>
        {isExpired && (
          <div className="coupon-expired-badge">만료</div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="my-coupons-page">
        <div className="loading">쿠폰을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="my-coupons-page">
      <div className="page-header">
        <h1 className="page-title">내 쿠폰</h1>
        <p className="page-subtitle">보유하신 쿠폰을 확인하실 수 있습니다</p>
      </div>

      <div className="coupon-tabs">
        <button
          className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          사용 가능 ({coupons.available.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'expired' ? 'active' : ''}`}
          onClick={() => setActiveTab('expired')}
        >
          만료됨 ({coupons.expired.length})
        </button>
      </div>

      <div className="coupon-list">
        {activeTab === 'available' ? (
          coupons.available.length > 0 ? (
            coupons.available.map(coupon => renderCouponCard(coupon, false))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎫</div>
              <p className="empty-text">사용 가능한 쿠폰이 없습니다</p>
            </div>
          )
        ) : (
          coupons.expired.length > 0 ? (
            coupons.expired.map(coupon => renderCouponCard(coupon, true))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p className="empty-text">만료된 쿠폰이 없습니다</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyCouponsPage;

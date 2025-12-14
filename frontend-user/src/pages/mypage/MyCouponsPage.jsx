import React, { useState, useEffect } from 'react';
import { getUserCoupons, addCouponByCode } from '../../api/couponClient';
import '../../styles/pages/mypage/MyCouponsPage.scss';

const MyCouponsPage = () => {
  const [coupons, setCoupons] = useState({ available: [], used: [], expired: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available'); // 'available', 'used', or 'expired'
  const [couponCode, setCouponCode] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getUserCoupons();
      setCoupons({
        available: data.available || [],
        used: data.used || [],
        expired: data.expired || []
      });
    } catch (error) {
      console.error('쿠폰 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      alert('쿠폰 코드를 입력해주세요.');
      return;
    }

    try {
      setIsAdding(true);
      await addCouponByCode(couponCode.trim());
      alert('쿠폰이 추가되었습니다!');
      setCouponCode('');
      setShowAddForm(false);
      await fetchCoupons(); // 쿠폰 목록 새로고침
    } catch (error) {
      alert(error.message || '쿠폰 추가에 실패했습니다.');
    } finally {
      setIsAdding(false);
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

  const renderCouponCard = (coupon, status = 'available') => {
    const isExpired = status === 'expired';
    const isUsed = status === 'used';
    
    return (
      <div key={coupon._id} className={`coupon-card ${isExpired ? 'expired' : ''} ${isUsed ? 'used' : ''}`}>
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
            {coupon.usageLimit && !isUsed && (
              <div className="info-item">
                <span className="info-label">사용 가능:</span>
                <span className="info-value">
                  {coupon.usageLimit - (coupon.usedCount || 0)}회 남음
                </span>
              </div>
            )}
            {isUsed && (
              <div className="info-item">
                <span className="info-label">사용 횟수:</span>
                <span className="info-value">
                  {coupon.usedCount || 0}회 사용됨
                </span>
              </div>
            )}
          </div>
        </div>
        {isExpired && (
          <div className="coupon-expired-badge">만료</div>
        )}
        {isUsed && (
          <div className="coupon-used-badge">사용됨</div>
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

      <div className="coupon-actions">
        <div className="coupon-tabs">
          <button
            className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            사용 가능 ({coupons.available.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'used' ? 'active' : ''}`}
            onClick={() => setActiveTab('used')}
          >
            사용됨 ({coupons.used.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'expired' ? 'active' : ''}`}
            onClick={() => setActiveTab('expired')}
          >
            만료됨 ({coupons.expired.length})
          </button>
        </div>
        
        <button
          className="btn-add-coupon"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '취소' : '+ 쿠폰 코드 입력'}
        </button>
      </div>

      {showAddForm && (
        <div className="coupon-add-form">
          <form onSubmit={handleAddCoupon}>
            <div className="form-group">
              <label htmlFor="coupon-code">쿠폰 코드</label>
              <div className="input-group">
                <input
                  id="coupon-code"
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="쿠폰 코드를 입력하세요"
                  className="coupon-code-input"
                  disabled={isAdding}
                />
                <button
                  type="submit"
                  className="btn-submit-coupon"
                  disabled={isAdding || !couponCode.trim()}
                >
                  {isAdding ? '추가 중...' : '추가'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="coupon-list">
        {activeTab === 'available' ? (
          coupons.available.length > 0 ? (
            coupons.available.map(coupon => renderCouponCard(coupon, 'available'))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎫</div>
              <p className="empty-text">사용 가능한 쿠폰이 없습니다</p>
            </div>
          )
        ) : activeTab === 'used' ? (
          coupons.used.length > 0 ? (
            coupons.used.map(coupon => renderCouponCard(coupon, 'used'))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <p className="empty-text">사용된 쿠폰이 없습니다</p>
            </div>
          )
        ) : (
          coupons.expired.length > 0 ? (
            coupons.expired.map(coupon => renderCouponCard(coupon, 'expired'))
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

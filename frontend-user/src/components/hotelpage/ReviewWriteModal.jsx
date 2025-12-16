import React, { useState, useEffect } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { createReview, updateReview } from "../../api/reviewClient";
import "../../styles/components/hotelpage/ReviewWriteModal.scss";

const ReviewWriteModal = ({ isOpen, onClose, hotelId, onReviewSubmitted, editReview = null }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (editReview && isOpen) {
      setRating(editReview.rating || 0);
      setComment(editReview.comment || editReview.content || "");
    } else if (isOpen) {
      // 새 리뷰 작성 모드일 때 초기화
      setRating(0);
      setComment("");
      setError("");
    }
  }, [editReview, isOpen]);

  if (!isOpen) return null;

  const getRatingLabel = (rating) => {
    const labels = {
      1: "매우 불만족",
      2: "불만족",
      3: "보통",
      4: "만족",
      5: "매우 만족"
    };
    return labels[rating] || "";
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("평점을 선택해주세요.");
      return;
    }

    if (!comment.trim() || comment.trim().length < 10) {
      setError("리뷰 내용을 최소 10자 이상 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editReview) {
        // 수정 모드
        await updateReview(editReview.id || editReview._id, {
          rating,
          comment: comment.trim(),
        });
      } else {
        // 작성 모드
        await createReview({
          hotelId,
          rating,
          comment: comment.trim(),
          reservationId: null,
        });
      }

      setRating(0);
      setComment("");
      setError("");
      onClose();
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error(editReview ? "리뷰 수정 실패:" : "리뷰 작성 실패:", err);
      setError(
        err.response?.data?.message || 
        (editReview 
          ? "리뷰 수정에 실패했습니다." 
          : "리뷰 작성에 실패했습니다.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="review-write-modal" onClick={handleBackdropClick}>
      <div className="modal-backdrop" />
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{editReview ? "리뷰 수정" : "리뷰 작성"}</h2>
          <button className="close-btn" onClick={onClose} aria-label="닫기">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-section rating-section">
            <label className="form-label">
              <span className="label-text">평점을 선택해주세요</span>
              <span className="label-required">*</span>
            </label>
            <div className="star-rating-wrapper">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`star-btn ${value <= (hoverRating || rating) ? "filled" : "empty"}`}
                    onClick={() => handleStarClick(value)}
                    onMouseEnter={() => handleStarHover(value)}
                    onMouseLeave={handleStarLeave}
                    aria-label={`${value}점`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <div className="rating-info">
                  <span className="rating-value">{rating}</span>
                  <span className="rating-separator">/</span>
                  <span className="rating-max">5</span>
                  <span className="rating-label">{getRatingLabel(rating)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-section content-section">
            <label htmlFor="comment" className="form-label">
              <span className="label-text">리뷰 내용</span>
              <span className="label-required">*</span>
            </label>
            <div className="textarea-wrapper">
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="호텔 이용 경험을 자세히 작성해주세요.&#10;&#10;• 객실 상태는 어떤가요?&#10;• 직원 서비스는 만족스러우셨나요?&#10;• 위치와 접근성은 어떤가요?&#10;• 전반적인 만족도는 어떠셨나요?"
                rows={10}
                maxLength={1000}
                className="review-textarea"
              />
              <div className="char-count">
                <span className={comment.length > 900 ? "warning" : ""}>
                  {comment.length}
                </span>
                <span> / 1000자</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  {editReview ? "수정 중..." : "작성 중..."}
                </>
              ) : (
                editReview ? "리뷰 수정하기" : "리뷰 작성하기"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewWriteModal;

import React, { useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/components/hotelpage/HotelGalleryModal.scss';

const HotelGalleryModal = ({ images = [], currentIndex = 0, isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = React.useState(currentIndex);

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex]);

  if (!isOpen || !images || images.length === 0) return null;

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="gallery-modal" onClick={handleBackdropClick}>
      <div className="modal-backdrop" />
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        {images.length > 1 && (
          <>
            <button className="nav-btn left" onClick={handlePrevious}>
              <FaChevronLeft />
            </button>
            <button className="nav-btn right" onClick={handleNext}>
              <FaChevronRight />
            </button>
          </>
        )}

        <img
          src={images[activeIndex]}
          alt={`Gallery image ${activeIndex + 1}`}
          className="modal-image"
        />
        
        {images.length > 1 && (
          <div className="image-counter">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelGalleryModal;
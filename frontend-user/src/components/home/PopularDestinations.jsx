import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/components/home/PopularDestinations.scss";
import DestinationCard from "./DestinationCard";
import { getHotels } from "../../api/hotelClient";

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        // 인기 호텔들을 가져와서 목적지 카드로 표시
        const hotels = await getHotels({ limit: 8 });
        // 호텔 데이터를 목적지 카드 형식으로 변환
        const formattedDestinations = hotels.map((hotel) => ({
          id: hotel._id || hotel.id,
          name: hotel.city || hotel.address?.city || hotel.name,
          country: hotel.address?.country || "한국",
          image: hotel.images?.[0] || hotel.image || "/images/hotel.jpg",
          price: hotel.price || hotel.rooms?.[0]?.price || 0,
          rating: hotel.rating || hotel.ratingAverage || 0,
        }));
        setDestinations(formattedDestinations);
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
        // 에러 발생 시 빈 배열 사용
        setDestinations([]);
      }
    };

    fetchDestinations();
  }, []);
    return (
        <section className="popular-destinations-container">
            <div className="popular-destinations-inner">
                <div className="popular-destinations-header">
                    <div className="text-box">
                        <h2>여행에 빠지다</h2>
                        <p>특가상품으로 진행하는 여행을 예약해보세요</p>
                    </div>

                    <button className="btn-see-all">전체보기</button>
                </div>

                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={4}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 15 },
                        640: { slidesPerView: 2, spaceBetween: 15 },
                        1024: { slidesPerView: 3, spaceBetween: 20 },
                        1280: { slidesPerView: 4, spaceBetween: 20 },
                    }}
                    className="destinations-swiper"
                >
                    {destinations.length > 0 ? (
                        destinations.map((destination) => (
                            <SwiperSlide key={destination.id}>
                                <DestinationCard destination={destination} />
                            </SwiperSlide>
                        ))
                    ) : (
                        <div>데이터를 불러오는 중...</div>
                    )}
                </Swiper>
            </div>
        </section>
    );
};

export default PopularDestinations;

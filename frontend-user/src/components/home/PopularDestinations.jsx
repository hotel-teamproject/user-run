import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/components/home/PopularDestinations.scss";
import DestinationCard from "./DestinationCard";
import { getHotels } from "../../api/hotelClient";

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState([]);

  // 도시별 대표 이미지 (지역 카드 전용, 호텔 이미지와 분리)
  const cityImageMap = {
    "서울": "https://images.unsplash.com/photo-1570191913384-7b4ff11716e7?w=800",
    "부산": "https://images.unsplash.com/photo-1626092706366-28ba77f382c8?w=800",
    "제주": "https://images.unsplash.com/photo-1581398644564-c46e97d9418a?w=800",
    "인천": "https://plus.unsplash.com/premium_photo-1661962711053-f73d8cb0f76f?w=800",
    "대구": "https://images.unsplash.com/photo-1646649806526-c448b87f8238?w=800",
    "속초": "https://images.unsplash.com/photo-1692074881533-4f95e464c110?w=800",
    "여수": "https://images.unsplash.com/photo-1651375562199-65caae096ace?w=800",
    "평창": "https://images.unsplash.com/photo-1503427073713-8e991db6befe?w=800",
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        // 인기 호텔들을 가져와서 목적지 카드로 표시
        const hotels = await getHotels();

        // 도시(지역)별로 하나씩만 카드 생성하도록 그룹핑
        const cityMap = new Map();
        for (const hotel of hotels) {
          const city = hotel.city || hotel.address?.city || hotel.name;
          if (!city || cityMap.has(city)) continue; // 이미 추가된 도시는 스킵
          cityMap.set(city, hotel);
        }

        // 최대 8개 지역까지만 노출
        const uniqueCityHotels = Array.from(cityMap.values()).slice(0, 8);

        // 호텔 데이터를 목적지 카드 형식으로 변환 (지역 대표 이미지 사용)
        const formattedDestinations = uniqueCityHotels.map((hotel) => {
          const city = hotel.city || hotel.address?.city || hotel.name;
          const image =
            cityImageMap[city] ||
            hotel.images?.[0] ||
            hotel.image ||
            "/images/hotel.jpg";

          return {
            id: hotel._id || hotel.id,
            name: city,
            country: hotel.address?.country || "한국",
            image,
            price: hotel.price || hotel.rooms?.[0]?.price || 0,
            rating: hotel.rating || hotel.ratingAverage || 0,
          };
        });
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
                        <h2>지역 별 숙소</h2>
                        <p>지역마다 인기 있는 숙소를 한눈에 비교해 보세요</p>
                    </div>

                    <button className="btn-see-all">전체보기</button>
                </div>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={4}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
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

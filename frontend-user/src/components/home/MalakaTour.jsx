import React from "react";
import "../../styles/components/home/MalakaTour.scss";

const MalakaTour = () => {
  return (
    <div className="malaka-tour">
      <div className="tour-header">
        <h3 className="tour-title">말라카 투어</h3>
        <div className="price-tag">
          <span>From</span>
          <strong>$700</strong>
        </div>
      </div>

      <p className="tour-desc">
        오래된 시간의 숨결이 머무는 도시, 말라카(Melaka). <br />
        말레이시아와 닿는 독서 같은 이 도시를 잇는 동서 문명과 만나는 관문이자,
        세계문화유산으로 지정된 매혹적인 여행지입니다. <br />
        화려한 해변도, 그 깊은 매력이 빠지고, 먹거운 식아연한 안식과 쉼을
        마음에 선물하는 곳. <br />
        이제 저희 여행사가 준비한 특별한 말라카 투어 상품과 함께 그 여정을
        시작해 보세요.
      </p>

      <button className="book-btn">Book Flight</button>
    </div>
  );
};

export default MalakaTour;

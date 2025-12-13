import React from 'react'
import '../../styles/components/home/HeroSearchWrap.scss'

const HeroSearchWrap = () => {
    return (
        <div className='hero-search-container'>

            <div className="search-form">
                <h3>어디에 머무시나요?</h3>
                <div className="form-container">
                    <div className="form-group">
                        <label>목적지 입력</label>
                        <input
                            type="text"
                            placeholder="예) 서울"
                            className="destination-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>체크인</label>
                        <input type="date" defaultValue="2024-01-22" className="date-input" />
                    </div>

                    <div className="form-group">
                        <label>체크아웃</label>
                        <input type="date" defaultValue="2024-01-24" className="date-input" />
                    </div>

                    <div className="form-group">
                        <label>객실 및 인원</label>
                        <select className="guests-select">
                            <option>객실 1개, 인원 2명</option>
                            <option>객실 1개, 인원 1명</option>
                            <option>객실 2개, 인원 4명</option>
                        </select>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HeroSearchWrap;

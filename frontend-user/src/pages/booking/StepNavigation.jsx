import "../../styles/pages/booking/StepNavigation.scss";

const StepNavigation = () => {
  const steps = [
    "날짜 선택",
    "객실 선택",
    "옵션 선택",
    "결제",
    "완료"
  ];

  return (
    <div className="step-nav">
      {steps.map((label, idx) => (
        <div className="step-item" key={idx}>
          <div className="step-number">{idx + 1}</div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default StepNavigation;

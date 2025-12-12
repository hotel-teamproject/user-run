import { useLocation } from "react-router-dom";
import "../../styles/pages/booking/StepNavigation.scss";

const StepNavigation = () => {
  const location = useLocation();
  const path = location.pathname;

  const steps = [
    { label: "날짜 선택", path: "dates" },
    { label: "객실 선택", path: "room" },
    { label: "옵션 선택", path: "extras" },
    { label: "결제", path: "payment" },
    { label: "완료", path: "complete" },
  ];

  const getCurrentStep = () => {
    if (path.includes("/complete")) return 4;
    if (path.includes("/payment")) return 3;
    if (path.includes("/extras")) return 2;
    if (path.includes("/room")) return 1;
    return 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="step-nav">
      {steps.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;

        return (
          <div
            className={`step-item ${isActive ? "active" : ""} ${
              isCompleted ? "completed" : ""
            }`}
            key={idx}
          >
            <div className="step-number">
              {isCompleted ? "✓" : idx + 1}
            </div>
            <span>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StepNavigation;

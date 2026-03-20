interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="h-1 bg-[#E2DED6] rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-[#0F6E56] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-between relative">
        {labels.map((label, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                transition-all duration-300
                ${isCompleted ? 'bg-[#0F6E56] text-white shadow-md' : ''}
                ${isCurrent ? 'bg-[#0F6E56] text-white ring-4 ring-[#0F6E56]/20 shadow-md' : ''}
                ${!isCompleted && !isCurrent ? 'bg-[#E2DED6] text-[#6B6A65]' : ''}
              `}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step}
              </div>
              <span className={`text-xs text-center leading-tight hidden sm:block
                ${isCurrent ? 'text-[#0F6E56] font-semibold' : 'text-[#6B6A65]'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

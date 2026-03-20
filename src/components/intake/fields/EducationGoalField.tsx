interface EducationGoalFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const GOALS = [
  { id: 'community_college', label: "Community College", sub: "2-year degree or certificate" },
  { id: 'university', label: "University", sub: "4-year bachelor's degree" },
  { id: 'trade_school', label: "Trade / Vocational School", sub: "Specific skills and certification" },
  { id: 'online', label: "Online College", sub: "Flexible remote learning" },
  { id: 'undecided', label: "Not sure yet", sub: "Still exploring options" },
];

export function EducationGoalField({ value, onChange }: EducationGoalFieldProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1C1C1A] mb-2"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          What's your education goal?
        </h2>
        <p className="text-[#6B6A65] text-sm">
          There's no wrong answer — this helps us match you to the right programs.
        </p>
      </div>

      <div className="space-y-3">
        {GOALS.map(goal => (
          <button
            key={goal.id}
            type="button"
            onClick={() => onChange(goal.id)}
            className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 min-h-[64px]
              ${value === goal.id
                ? 'border-[#0F6E56] bg-[#0F6E56]/5 shadow-sm'
                : 'border-[#E2DED6] bg-white hover:border-[#0F6E56]/40 hover:bg-[#0F6E56]/[0.02]'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all
                ${value === goal.id ? 'border-[#0F6E56] bg-[#0F6E56]' : 'border-[#E2DED6]'}`}>
                {value === goal.id && (
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-[#1C1C1A] text-sm">{goal.label}</p>
                <p className="text-[#6B6A65] text-xs">{goal.sub}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

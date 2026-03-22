interface EducationGoalFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const GOALS = [
  { id: 'community_college', label: "Community College", sub: "2-year / certificate" },
  { id: 'university', label: "University", sub: "4-year bachelor's" },
  { id: 'trade_school', label: "Trade / Vocational", sub: "Skills & certification" },
  { id: 'online', label: "Online College", sub: "Flexible learning" },
  { id: 'undecided', label: "Not sure yet", sub: "Still exploring" },
];

export function EducationGoalField({ value, onChange }: EducationGoalFieldProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#1C1C1A] mb-1"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          What's your education goal?
        </h2>
        <p className="text-[#6B6A65] text-sm">
          There's no wrong answer — tap to select and continue automatically.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GOALS.slice(0, 4).map(goal => (
          <button
            key={goal.id}
            type="button"
            onClick={() => onChange(goal.id)}
            className={`text-left px-4 py-4 rounded-xl border-2 transition-all duration-150 min-h-[76px]
              ${value === goal.id
                ? 'border-[#0F6E56] bg-[#0F6E56]/5 shadow-sm'
                : 'border-[#E2DED6] bg-white hover:border-[#0F6E56]/40 hover:bg-[#0F6E56]/[0.02]'
              }`}
          >
            <div className={`w-3 h-3 rounded-full border-2 mb-2 transition-all flex-shrink-0
              ${value === goal.id ? 'border-[#0F6E56] bg-[#0F6E56]' : 'border-[#E2DED6]'}`}
            />
            <p className="font-semibold text-[#1C1C1A] text-sm leading-tight">{goal.label}</p>
            <p className="text-[#6B6A65] text-xs mt-0.5">{goal.sub}</p>
          </button>
        ))}

        {/* Undecided — full width */}
        <button
          type="button"
          onClick={() => onChange(GOALS[4].id)}
          className={`col-span-2 text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150
            ${value === GOALS[4].id
              ? 'border-[#0F6E56] bg-[#0F6E56]/5 shadow-sm'
              : 'border-[#E2DED6] bg-white hover:border-[#0F6E56]/40'
            }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all
              ${value === GOALS[4].id ? 'border-[#0F6E56] bg-[#0F6E56]' : 'border-[#E2DED6]'}`}
            />
            <div>
              <p className="font-semibold text-[#1C1C1A] text-sm">{GOALS[4].label}</p>
              <p className="text-[#6B6A65] text-xs">{GOALS[4].sub}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

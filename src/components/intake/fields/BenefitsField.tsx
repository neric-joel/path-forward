interface BenefitsFieldProps {
  selected: string[];
  onChange: (benefits: string[]) => void;
}

const BENEFITS = [
  {
    id: 'fafsa_complete',
    label: 'Completed FAFSA',
    amount: '$7,395/yr Pell Grant',
  },
  {
    id: 'etv_applied',
    label: 'Applied for Arizona ETV',
    amount: 'Up to $5,000/yr',
  },
  {
    id: 'tuition_waiver_applied',
    label: 'Applied for AZ Tuition Waiver',
    amount: 'Full remaining tuition',
  },
  {
    id: 'ahcccs_enrolled',
    label: 'Enrolled in AHCCCS',
    amount: 'Health insurance',
  },
  {
    id: 'none_applied',
    label: "Haven't applied for anything yet",
    amount: null,
  },
];

export function BenefitsField({ selected, onChange }: BenefitsFieldProps) {
  const toggle = (id: string) => {
    if (id === 'none_applied') {
      onChange(selected.includes(id) ? [] : ['none_applied']);
      return;
    }
    const withoutNone = selected.filter(s => s !== 'none_applied');
    onChange(
      withoutNone.includes(id)
        ? withoutNone.filter(s => s !== id)
        : [...withoutNone, id]
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#1C1C1A] mb-1"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          Which benefits have you applied for?
        </h2>
        <p className="text-[#6B6A65] text-sm">
          Shows us what's in motion and what's still available to you.
        </p>
      </div>

      <div className="space-y-2">
        {BENEFITS.map(benefit => {
          const checked = selected.includes(benefit.id);
          const isNone = benefit.id === 'none_applied';
          return (
            <button
              key={benefit.id}
              type="button"
              onClick={() => toggle(benefit.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150
                ${checked
                  ? 'border-[#0F6E56] bg-[#0F6E56]/5'
                  : isNone
                  ? 'border-[#E2DED6] bg-[#F5F3EE] hover:border-[#0F6E56]/30'
                  : 'border-[#E2DED6] bg-white hover:border-[#0F6E56]/40'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all
                  ${checked ? 'bg-[#0F6E56] border-[#0F6E56]' : 'border-[#E2DED6] bg-white'}`}>
                  {checked && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <p className={`font-semibold text-sm ${isNone ? 'text-[#6B6A65]' : 'text-[#1C1C1A]'}`}>
                    {benefit.label}
                  </p>
                  {benefit.amount && (
                    <span className="text-[11px] font-semibold text-[#3B6D11] bg-green-50 px-2 py-0.5 rounded-full border border-green-200 flex-shrink-0">
                      {benefit.amount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

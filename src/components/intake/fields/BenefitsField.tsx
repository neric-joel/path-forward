interface BenefitsFieldProps {
  selected: string[];
  onChange: (benefits: string[]) => void;
}

const BENEFITS = [
  {
    id: 'fafsa_complete',
    label: 'Completed FAFSA',
    sub: 'Free Application for Federal Student Aid — studentaid.gov',
    amount: 'Unlocks Pell Grant ($7,395/yr)',
  },
  {
    id: 'etv_applied',
    label: 'Applied for Arizona ETV',
    sub: 'Education and Training Voucher — fseducation.fostersuccess.org',
    amount: 'Up to $5,000/yr',
  },
  {
    id: 'tuition_waiver_applied',
    label: 'Applied for AZ Tuition Waiver',
    sub: 'Foster Youth Award — requires FAFSA + enrollment',
    amount: 'Full remaining tuition',
  },
  {
    id: 'ahcccs_enrolled',
    label: 'Enrolled in AHCCCS (Arizona Medicaid)',
    sub: 'Free health coverage until age 26 for former foster youth',
    amount: 'Health insurance',
  },
  {
    id: 'none_applied',
    label: "Haven't applied for anything yet",
    sub: "That's okay — we'll show you where to start",
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1C1C1A] mb-2"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          Which benefits have you already applied for?
        </h2>
        <p className="text-[#6B6A65] text-sm">
          This shows us what's already in motion and what's still available to you.
        </p>
      </div>

      <div className="space-y-3">
        {BENEFITS.map(benefit => {
          const checked = selected.includes(benefit.id);
          return (
            <button
              key={benefit.id}
              type="button"
              onClick={() => toggle(benefit.id)}
              className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 min-h-[64px]
                ${checked
                  ? 'border-[#0F6E56] bg-[#0F6E56]/5'
                  : 'border-[#E2DED6] bg-white hover:border-[#0F6E56]/40'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center
                  transition-all duration-150
                  ${checked ? 'bg-[#0F6E56] border-[#0F6E56]' : 'border-[#E2DED6] bg-white'}`}>
                  {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-semibold text-[#1C1C1A] text-sm">{benefit.label}</p>
                    {benefit.amount && (
                      <span className="text-xs font-semibold text-[#3B6D11] bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        {benefit.amount}
                      </span>
                    )}
                  </div>
                  <p className="text-[#6B6A65] text-xs mt-0.5">{benefit.sub}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

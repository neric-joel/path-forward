import type { IntakeFormData } from '../../../lib/types';

interface TimelineFieldProps {
  value: IntakeFormData['timeline'] | '';
  onChange: (value: IntakeFormData['timeline']) => void;
}

const OPTIONS: Array<{
  id: IntakeFormData['timeline'];
  label: string;
  sub: string;
  urgency: 'high' | 'medium' | 'low';
}> = [
  {
    id: 'still_in_care',
    label: 'Still in foster care',
    sub: "I'm currently in the system",
    urgency: 'high',
  },
  {
    id: 'just_aged_out',
    label: 'Just aged out (0–3 months)',
    sub: "I recently left care",
    urgency: 'high',
  },
  {
    id: '3_12_months',
    label: '3–12 months ago',
    sub: "It's been a few months",
    urgency: 'medium',
  },
  {
    id: 'over_a_year',
    label: 'Over a year ago',
    sub: "I've been out of care for a while",
    urgency: 'low',
  },
];

const URGENCY_LABELS = {
  high: { label: 'Best timing', color: 'text-[#3B6D11] bg-green-50 border-green-200' },
  medium: { label: 'Good window', color: 'text-[#BA7517] bg-amber-50 border-amber-200' },
  low: { label: 'Act now', color: 'text-[#D85A30] bg-orange-50 border-orange-200' },
};

export function TimelineField({ value, onChange }: TimelineFieldProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1C1C1A] mb-2"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          Where are you in the process?
        </h2>
        <p className="text-[#6B6A65] text-sm">
          This affects which deadlines you can still hit and which programs are most urgent.
        </p>
      </div>

      <div className="space-y-3">
        {OPTIONS.map(opt => {
          const urgency = URGENCY_LABELS[opt.urgency];
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 min-h-[64px]
                ${value === opt.id
                  ? 'border-[#0F6E56] bg-[#0F6E56]/5 shadow-sm'
                  : 'border-[#E2DED6] bg-white hover:border-[#0F6E56]/40'
                }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all
                    ${value === opt.id ? 'border-[#0F6E56] bg-[#0F6E56]' : 'border-[#E2DED6]'}`}>
                    {value === opt.id && (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1C1C1A] text-sm">{opt.label}</p>
                    <p className="text-[#6B6A65] text-xs">{opt.sub}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${urgency.color}`}>
                  {urgency.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

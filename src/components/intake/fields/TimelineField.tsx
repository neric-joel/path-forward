import type { IntakeFormData } from '../../../lib/types';

interface TimelineFieldProps {
  timeline: IntakeFormData['timeline'] | '';
  plannedStart: IntakeFormData['planned_start'] | '';
  onTimelineChange: (value: IntakeFormData['timeline']) => void;
  onPlannedStartChange: (value: IntakeFormData['planned_start']) => void;
}

const TIMELINE_OPTIONS: Array<{
  id: IntakeFormData['timeline'];
  label: string;
  urgency: 'high' | 'medium' | 'low';
}> = [
  { id: 'still_in_care',  label: 'Still in foster care',      urgency: 'high' },
  { id: 'just_aged_out',  label: 'Just aged out (0–3 mo)',    urgency: 'high' },
  { id: '3_12_months',    label: '3–12 months ago',           urgency: 'medium' },
  { id: 'over_a_year',    label: 'Over a year ago',           urgency: 'low' },
];

const URGENCY_DOT: Record<string, string> = {
  high:   'bg-[#3B6D11]',
  medium: 'bg-[#BA7517]',
  low:    'bg-[#D85A30]',
};

const START_OPTIONS: Array<{
  id: IntakeFormData['planned_start'];
  label: string;
  detail: string;
}> = [
  { id: 'summer_2026',  label: 'Summer 2026',  detail: '~2 mo away' },
  { id: 'fall_2026',    label: 'Fall 2026',    detail: '~5 mo away' },
  { id: 'spring_2027',  label: 'Spring 2027',  detail: '~10 mo away' },
  { id: 'fall_2027',    label: 'Fall 2027',    detail: '~17 mo away' },
  { id: 'not_sure',     label: "Not sure yet", detail: 'AI picks best' },
];

export function TimelineField({
  timeline,
  plannedStart,
  onTimelineChange,
  onPlannedStartChange,
}: TimelineFieldProps) {
  return (
    <div className="space-y-6">

      {/* Where are you in the process? */}
      <div>
        <h2 className="text-xl font-bold text-[#1C1C1A] mb-1"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          Where are you in the process?
        </h2>
        <p className="text-[#6B6A65] text-sm mb-4">
          This affects which deadlines you can still hit.
        </p>
        <div className="flex flex-wrap gap-2">
          {TIMELINE_OPTIONS.map(opt => {
            const selected = timeline === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onTimelineChange(opt.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all
                  ${selected
                    ? 'border-[#0F6E56] bg-[#0F6E56]/10 text-[#0F6E56]'
                    : 'border-[#E2DED6] bg-white text-[#1C1C1A] hover:border-[#0F6E56]/40'
                  }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${URGENCY_DOT[opt.urgency]}`} aria-hidden="true" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* When are you planning to start? */}
      <div>
        <h2 className="text-xl font-bold text-[#1C1C1A] mb-1"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          When are you planning to start?
        </h2>
        <p className="text-[#6B6A65] text-sm mb-4">
          This helps us calculate your deadlines and build your timeline.
        </p>
        <div className="flex flex-wrap gap-2">
          {START_OPTIONS.map(opt => {
            const selected = plannedStart === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onPlannedStartChange(opt.id)}
                className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all text-left
                  ${selected
                    ? 'border-[#0F6E56] bg-[#0F6E56]/10 text-[#0F6E56]'
                    : 'border-[#E2DED6] bg-white text-[#1C1C1A] hover:border-[#0F6E56]/40'
                  }`}
              >
                <span className="block leading-tight">{opt.label}</span>
                <span className="block text-xs opacity-70 font-normal">{opt.detail}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

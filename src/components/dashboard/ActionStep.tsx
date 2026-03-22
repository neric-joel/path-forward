import type { ActionStep as ActionStepType } from '../../lib/types';
import type { ScoreDelta } from '../../lib/types';
import { ConfidenceBadge } from '../shared/ConfidenceBadge';
import { SourceCitation } from '../shared/SourceCitation';

interface ActionStepProps {
  step: ActionStepType;
  completed: boolean;
  unlocked: boolean;
  delta?: ScoreDelta;
  onToggle: (stepNumber: number) => void;
}

export function ActionStep({ step, completed, unlocked, delta, onToggle }: ActionStepProps) {
  const isUrgent = step.days_until_deadline !== null && step.days_until_deadline <= 14;
  const docsNeeded = step.documents_needed.filter(d => d.status === 'need');
  const docsHave = step.documents_needed.filter(d => d.status === 'have');

  return (
    <div className={`rounded-2xl border-2 px-6 py-5 space-y-4 transition-all duration-300
      ${completed
        ? 'border-[#0F6E56]/30 bg-[#0F6E56]/5'
        : unlocked
          ? 'border-[#E2DED6] bg-white shadow-sm'
          : 'border-[#E2DED6] bg-[#FAFAF7] opacity-70'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => unlocked && onToggle(step.step_number)}
          disabled={!unlocked}
          className={`flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center
            transition-all duration-200 mt-0.5
            ${completed
              ? 'bg-[#0F6E56] border-[#0F6E56] shadow-md'
              : unlocked
                ? 'border-[#E2DED6] hover:border-[#0F6E56] bg-white cursor-pointer'
                : 'border-[#E2DED6] bg-white cursor-not-allowed'
            }`}
          aria-label={completed ? `Mark step ${step.step_number} incomplete` : `Mark step ${step.step_number} complete`}
        >
          {completed ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="text-[13px] font-bold text-[#5C6B63]">{step.step_number}</span>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className={`font-bold text-lg leading-snug
              ${completed ? 'text-[#0F6E56] line-through decoration-[#0F6E56]/40' : 'text-[#1A2A22]'}`}>
              {step.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
              <ConfidenceBadge level={step.confidence} reason={step.verify_with} />
              {isUrgent && !completed && (
                <span className="text-[13px] font-bold text-white bg-[#D85A30] px-2.5 py-0.5 rounded-full">
                  Urgent
                </span>
              )}
            </div>
          </div>
          <p className="text-[13px] text-[#5C6B63] mt-1 leading-relaxed">{step.why_this_is_next}</p>
        </div>
      </div>

      {/* Score delta preview */}
      {delta && !completed && unlocked && (
        <div className="bg-[#0F6E56]/5 border border-[#0F6E56]/20 rounded-xl px-4 py-3">
          <p className="text-[13px] font-bold text-[#0F6E56] mb-1.5">Complete this step to unlock:</p>
          <div className="flex flex-wrap gap-3">
            {delta.overall > 0 && (
              <span className="text-[13px] text-[#1A2A22]">
                <span className="font-bold text-[#0F6E56]">+{delta.overall}</span> overall score
              </span>
            )}
            {delta.financial_aid > 0 && (
              <span className="text-[13px] text-[#1A2A22]">
                <span className="font-bold text-[#3B6D11]">+{delta.financial_aid}</span> financial aid
              </span>
            )}
            {delta.application > 0 && (
              <span className="text-[13px] text-[#1A2A22]">
                <span className="font-bold text-[#BA7517]">+{delta.application}</span> applications
              </span>
            )}
            {delta.unlocks.length > 0 && (
              <span className="text-[13px] text-[#5C6B63]">
                → Unlocks step{delta.unlocks.length > 1 ? 's' : ''} {delta.unlocks.join(', ')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Deadline */}
      {step.deadline && (
        <div className={`flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-xl
          ${isUrgent ? 'bg-[#D85A30]/10 text-[#D85A30]' : 'bg-[#E2DED6]/60 text-[#5C6B63]'}`}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {step.deadline}
          {step.days_until_deadline !== null && (
            <span className="ml-auto font-bold">{step.days_until_deadline} days away</span>
          )}
        </div>
      )}

      {/* What to do */}
      {!completed && unlocked && (
        <div className="space-y-4">
          <div>
            <p className="text-[13px] font-bold text-[#1A2A22] uppercase tracking-wide mb-1.5">What to do</p>
            <p className="text-[15px] text-[#1A2A22] leading-relaxed">{step.specific_action}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[13px] font-semibold text-[#5C6B63] uppercase tracking-wide mb-1">Where to go</p>
              <p className="text-[15px] text-[#1A2A22]">{step.where_to_go}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#5C6B63] uppercase tracking-wide mb-1">What to bring</p>
              <p className="text-[15px] text-[#1A2A22]">{step.what_to_bring}</p>
            </div>
          </div>

          {/* Documents */}
          {step.documents_needed.length > 0 && (
            <div>
              <p className="text-[13px] font-bold text-[#1A2A22] uppercase tracking-wide mb-2">Documents needed</p>
              <div className="space-y-2">
                {docsHave.map(doc => (
                  <div key={doc.name} className="flex items-center gap-2 text-[13px] text-[#3B6D11]">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold">{doc.name}</span>
                    <span className="text-[#3B6D11]/70">— you have this</span>
                  </div>
                ))}
                {docsNeeded.map(doc => (
                  <div key={doc.name} className="text-[13px]">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 text-[#D85A30] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <span className="font-semibold text-[#1A2A22]">{doc.name}</span>
                        {doc.how_to_get && (
                          <span className="text-[#5C6B63] ml-1">— {doc.how_to_get}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SourceCitation url={step.source_url} verifyWith={step.verify_with} />
        </div>
      )}

      {/* Completed state */}
      {completed && (
        <div className="flex items-center gap-2 text-[13px] text-[#0F6E56] font-semibold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Marked complete — your scores have been updated
        </div>
      )}

      {/* Not yet unlocked hint */}
      {!unlocked && !completed && step.step_number > 1 && (
        <div className="text-[13px] text-[#5C6B63] bg-[#F5F2EC] rounded-xl px-4 py-3">
          Complete earlier steps to unlock this one
        </div>
      )}
    </div>
  );
}

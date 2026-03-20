import type { MatchedProgram } from '../../lib/types';
import { ConfidenceBadge } from '../shared/ConfidenceBadge';
import { SourceCitation } from '../shared/SourceCitation';

interface AidCardProps {
  program: MatchedProgram;
}

export function AidCard({ program }: AidCardProps) {
  const isUrgent = program.days_until_deadline !== null && program.days_until_deadline <= 30;

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-5 space-y-4 transition-all
      ${isUrgent ? 'border-[#D85A30]/40' : 'border-[#E2DED6]'}`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1">
          <h3 className="font-semibold text-[#1C1C1A] text-base leading-snug">{program.name}</h3>
          <p className="text-[#0F6E56] text-lg font-bold mt-1">{program.max_amount}</p>
        </div>
        <ConfidenceBadge level={program.confidence} reason={program.confidence_reason} />
      </div>

      {/* Coverage */}
      <p className="text-[#6B6A65] text-sm leading-relaxed">{program.what_it_covers}</p>

      {/* Confidence reason */}
      <div className="bg-[#F5F3EE] rounded-lg px-3 py-2">
        <p className="text-xs text-[#1C1C1A]">
          <span className="font-medium">Why you qualify: </span>
          {program.confidence_reason}
        </p>
      </div>

      {/* Deadline */}
      {program.deadline && (
        <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg
          ${isUrgent ? 'bg-[#D85A30]/10 text-[#D85A30]' : 'bg-[#E2DED6]/60 text-[#6B6A65]'}`}>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Deadline: {program.deadline}
          {program.days_until_deadline !== null && (
            <span className="ml-auto">{program.days_until_deadline} days</span>
          )}
        </div>
      )}

      {/* Next action */}
      <div className="border-t border-[#E2DED6] pt-3 space-y-2">
        <p className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wide">Next Action</p>
        <p className="text-sm text-[#1C1C1A]">{program.next_action}</p>
        <SourceCitation url={program.source_url} verifyWith={program.verify_with} />
      </div>
    </div>
  );
}

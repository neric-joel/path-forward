import { useEffect, useRef, useState } from 'react';
import type { IntakeFormData, OverviewResult, MatchedProgramSummary } from '../../lib/types';
import { fetchOverview } from '../../lib/claude';
import { ReadinessSnapshot } from './ReadinessSnapshot';
import { ConfidenceBadge } from '../shared/ConfidenceBadge';

interface OverviewTabProps {
  intakeData: IntakeFormData;
  result: OverviewResult | null;
  onLoaded: (r: OverviewResult) => void;
}

function ProgramSummaryCard({ program }: { program: MatchedProgramSummary }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2DED6] px-4 py-4 flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-[15px] font-semibold text-[#1A2A22]">{program.name}</span>
          <ConfidenceBadge level={program.confidence} />
        </div>
        <p className="text-[13px] text-[#5C6B63] mb-2">{program.confidence_reason}</p>
        <p className="text-[13px] text-[#0F6E56] font-semibold">{program.next_action}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="text-sm font-bold text-[#1C1C1A]">{program.max_amount}</span>
      </div>
    </div>
  );
}

export function OverviewTab({ intakeData, result, onLoaded }: OverviewTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const hasFired = useRef(false);

  // Auto-fire on mount if no result yet
  useEffect(() => {
    if (result !== null || hasFired.current) return;
    hasFired.current = true;

    setIsLoading(true);
    fetchOverview(intakeData)
      .then(r => { onLoaded(r); })
      .finally(() => { setIsLoading(false); });
  }, [intakeData, result, onLoaded]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-5 space-y-4">
        {/* Row 1: key insight + readiness card side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#E2DED6] animate-pulse rounded-2xl h-48" />
          <div className="bg-[#E2DED6] animate-pulse rounded-2xl h-48" />
        </div>
        {/* Row 2: three program card skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-24 bg-[#E2DED6] animate-pulse rounded-xl" />
          ))}
        </div>
        <p className="text-center text-[13px] text-[#5C6B63]">
          Analyzing your situation — usually takes 10–20 seconds…
        </p>
      </div>
    );
  }

  if (!result) return null;

  const scores = {
    overall: result.readiness.overall,
    academic: result.readiness.academic.score,
    financial_aid: result.readiness.financial_aid.score,
    application: result.readiness.application.score,
    timeline: result.readiness.timeline.score,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-5 space-y-4">
      {/* Key Insight */}
      <div className="bg-[#BA7517] text-white rounded-2xl px-6 py-5 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
          Your Key Insight
        </p>
        <p className="text-base font-semibold leading-relaxed">{result.key_insight}</p>
      </div>

      {/* Readiness Scores */}
      <ReadinessSnapshot readiness={result.readiness} scores={scores} />

      {/* Funding Summary */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-2xl font-semibold text-[#1A2A22]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Funding You May Qualify For
          </h2>
          <span className="text-[13px] text-[#5C6B63] bg-[#F5F2EC] px-2 py-1 rounded-full">
            {result.matched_programs.length} programs
          </span>
        </div>
        <div className="space-y-3">
          {result.matched_programs.map(p => (
            <ProgramSummaryCard key={p.id} program={p} />
          ))}
        </div>
        <p className="mt-3 text-[13px] text-[#5C6B63] text-center">
          Go to the <strong>Funding</strong> tab for full details, deadlines, and exactly what to do first.
        </p>
      </div>
    </div>
  );
}

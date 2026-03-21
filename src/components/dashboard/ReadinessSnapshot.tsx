import type { ReadinessScore } from '../../lib/types';
import type { ScoreState } from '../../lib/score-engine';
import { ScoreRing } from './ScoreRing';
import { ScoreBar } from './ScoreBar';

interface ReadinessSnapshotProps {
  readiness: ReadinessScore;
  scores: ScoreState;
  originalScores?: ScoreState;
}

const RING_COLORS = {
  academic: '#0F6E56',
  financial_aid: '#3B6D11',
  application: '#BA7517',
  timeline: '#D85A30',
};

export function ReadinessSnapshot({ readiness, scores, originalScores }: ReadinessSnapshotProps) {
  return (
    <section className="bg-white rounded-2xl border border-[#E2DED6] p-6 shadow-sm space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1C1C1A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Your Readiness Snapshot
        </h2>
        <p className="text-[#6B6A65] text-[15px] mt-1 leading-relaxed">{readiness.overall_summary}</p>
      </div>

      {/* Overall ring + category rings */}
      <div className="flex flex-wrap items-center justify-around gap-4">
        <div className="flex flex-col items-center gap-2">
          <ScoreRing
            score={scores.overall}
            label="Overall"
            color="#1C1C1A"
            size={112}
            strokeWidth={10}
          />
          {originalScores && scores.overall > originalScores.overall && (
            <span className="text-xs font-semibold text-[#3B6D11] bg-green-50 px-2 py-0.5 rounded-full">
              +{scores.overall - originalScores.overall} points
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <ScoreRing score={scores.academic} label="Academic" color={RING_COLORS.academic} />
          <ScoreRing score={scores.financial_aid} label="Financial Aid" color={RING_COLORS.financial_aid} />
          <ScoreRing score={scores.application} label="Applications" color={RING_COLORS.application} />
          <ScoreRing score={scores.timeline} label="Timeline" color={RING_COLORS.timeline} />
        </div>
      </div>

      {/* Score bars with summaries */}
      <div className="space-y-4 pt-2 border-t border-[#E2DED6]">
        <ScoreBar
          label="Academic Readiness"
          score={scores.academic}
          summary={readiness.academic.summary}
          previousScore={originalScores?.academic}
        />
        <ScoreBar
          label="Financial Aid Eligibility"
          score={scores.financial_aid}
          summary={readiness.financial_aid.summary}
          previousScore={originalScores?.financial_aid}
        />
        <ScoreBar
          label="Application Completeness"
          score={scores.application}
          summary={readiness.application.summary}
          previousScore={originalScores?.application}
        />
        <ScoreBar
          label="Timeline Feasibility"
          score={scores.timeline}
          summary={readiness.timeline.summary}
          previousScore={originalScores?.timeline}
        />
      </div>
    </section>
  );
}

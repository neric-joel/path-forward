import type { AssessmentResult } from '../../lib/types';
import type { ScoreState } from '../../lib/score-engine';
import { getUnlockedSteps } from '../../lib/score-engine';
import { ActionStep } from './ActionStep';

interface ActionPlanProps {
  result: AssessmentResult;
  completedSteps: Set<number>;
  scores: ScoreState;
  onToggleStep: (stepNumber: number) => void;
}

export function ActionPlan({ result, completedSteps, scores, onToggleStep }: ActionPlanProps) {
  const unlockedByCompletion = getUnlockedSteps(completedSteps, result);

  // Step 1 is always available; others are unlocked either by default or by completing prerequisites
  const isUnlocked = (stepNumber: number): boolean => {
    if (stepNumber === 1) return true;
    if (unlockedByCompletion.has(stepNumber)) return true;
    // Steps with no unlocks dependencies are available by default
    const hasPrerequisite = Object.values(result.score_deltas).some(
      delta => delta.unlocks.includes(stepNumber)
    );
    return !hasPrerequisite;
  };

  const completedCount = completedSteps.size;
  const totalSteps = result.action_plan.length;

  return (
    <section className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1C1C1A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Your Action Plan
          </h2>
          <span className="text-sm font-semibold text-[#0F6E56] bg-[#0F6E56]/10 px-3 py-1 rounded-full">
            {completedCount}/{totalSteps} done
          </span>
        </div>
        <p className="text-[#6B6A65] text-sm mt-1">
          Steps are sequenced so each one builds on the last. Check them off as you go — your score updates instantly.
        </p>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-[#E2DED6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0F6E56] rounded-full transition-all duration-500"
            style={{ width: `${totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Key insight callout */}
      <div className="bg-[#0F6E56]/5 border border-[#0F6E56]/20 rounded-xl px-4 py-4">
        <p className="text-sm text-[#1C1C1A] leading-relaxed">
          <span className="font-semibold text-[#0F6E56]">Key insight: </span>
          {result.key_insight}
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {result.action_plan.map(step => (
          <div key={step.step_number} className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
            <ActionStep
              step={step}
              completed={completedSteps.has(step.step_number)}
              unlocked={isUnlocked(step.step_number)}
              delta={result.score_deltas[step.step_number]}
              onToggle={onToggleStep}
            />
          </div>
        ))}
      </div>

      {/* All done state */}
      {completedCount === totalSteps && totalSteps > 0 && (
        <div className="bg-[#3B6D11] text-white rounded-xl px-5 py-4 text-center space-y-2">
          <p className="text-lg font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
            You've completed every step!
          </p>
          <p className="text-sm text-white/80">
            Download your plan as a PDF to share with a caseworker or school advisor.
          </p>
        </div>
      )}

      {/* Score note */}
      {scores && (
        <p className="text-xs text-center text-[#6B6A65]">
          Current overall score: <span className="font-bold text-[#0F6E56]">{scores.overall}/100</span>
        </p>
      )}
    </section>
  );
}

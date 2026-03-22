import { useState, useEffect, useRef } from 'react';
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

const SCORE_BARS: Array<{ key: keyof ScoreState; label: string; color: string }> = [
  { key: 'overall',      label: 'Overall',      color: '#0F6E56' },
  { key: 'financial_aid', label: 'Financial Aid', color: '#3B6D11' },
  { key: 'application',  label: 'Applications',  color: '#BA7517' },
  { key: 'timeline',     label: 'Timeline',      color: '#5C6B63' },
];

export function ActionPlan({ result, completedSteps, scores, onToggleStep }: ActionPlanProps) {
  // Animated display scores — count up/down smoothly via rAF
  const [displayScores, setDisplayScores] = useState<ScoreState>(scores);
  const prevScoresRef = useRef<ScoreState>(scores);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = { ...prevScoresRef.current };
    const end = scores;
    const duration = 400;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayScores({
        overall:      Math.round(start.overall      + (end.overall      - start.overall)      * ease),
        academic:     Math.round(start.academic     + (end.academic     - start.academic)     * ease),
        financial_aid: Math.round(start.financial_aid + (end.financial_aid - start.financial_aid) * ease),
        application:  Math.round(start.application  + (end.application  - start.application)  * ease),
        timeline:     Math.round(start.timeline     + (end.timeline     - start.timeline)     * ease),
      });
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevScoresRef.current = end;
      }
    };

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [scores.overall, scores.academic, scores.financial_aid, scores.application, scores.timeline]); // eslint-disable-line react-hooks/exhaustive-deps

  const unlockedByCompletion = getUnlockedSteps(completedSteps, result);

  const isUnlocked = (stepNumber: number): boolean => {
    if (stepNumber === 1) return true;
    if (unlockedByCompletion.has(stepNumber)) return true;
    const hasPrerequisite = Object.values(result.score_deltas).some(
      delta => delta.unlocks.includes(stepNumber)
    );
    return !hasPrerequisite;
  };

  // Build step number → title map for unlock messaging
  const stepTitles = Object.fromEntries(result.action_plan.map(s => [s.step_number, s.title]));

  const completedCount = completedSteps.size;
  const totalSteps = result.action_plan.length;

  return (
    <section className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1C1C1A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Your Action Plan
          </h2>
          <span className="text-sm font-semibold text-[#0F6E56] bg-[#0F6E56]/10 px-3 py-1 rounded-full">
            {completedCount}/{totalSteps} done
          </span>
        </div>
        <p className="text-[#6B6A65] text-[15px] mt-1">
          Steps are sequenced so each one builds on the last. Check them off as you go — your score updates instantly.
        </p>

        {/* Steps progress bar */}
        <div className="mt-3 h-1.5 bg-[#E2DED6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0F6E56] rounded-full transition-all duration-500"
            style={{ width: `${totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0}%` }}
          />
        </div>

        {/* Score bars — update live as steps are checked */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SCORE_BARS.map(({ key, label, color }) => (
            <div key={key}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5C6B63]">{label}</span>
                <span className="text-[13px] font-bold tabular-nums" style={{ color }}>{displayScores[key]}</span>
              </div>
              <div className="h-1.5 bg-[#E2DED6] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${displayScores[key]}%`,
                    background: color,
                    transition: 'width 600ms ease-out',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key insight callout */}
      {result.key_insight && (
        <div className="bg-[#0F6E56]/5 border border-[#0F6E56]/20 rounded-xl px-4 py-4">
          <p className="text-sm text-[#1C1C1A] leading-relaxed">
            <span className="font-semibold text-[#0F6E56]">Key insight: </span>
            {result.key_insight}
          </p>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3">
        {result.action_plan.map(step => {
          const delta = result.score_deltas[step.step_number];
          const unlockedTitles = delta?.unlocks
            .map(n => stepTitles[n])
            .filter(Boolean) ?? [];

          return (
            <div key={step.step_number} className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
              <ActionStep
                step={step}
                completed={completedSteps.has(step.step_number)}
                unlocked={isUnlocked(step.step_number)}
                delta={delta}
                unlockedTitles={unlockedTitles}
                onToggle={onToggleStep}
              />
            </div>
          );
        })}
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
    </section>
  );
}

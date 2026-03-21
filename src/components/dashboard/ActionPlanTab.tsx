import { useState, useCallback } from 'react';
import type { IntakeFormData, ActionPlanResult, OverviewResult } from '../../lib/types';
import { fetchActionPlan } from '../../lib/claude';
import { ActionPlan } from './ActionPlan';
import { SectionIntro } from './SectionIntro';
import { applyAllCompletedDeltas } from '../../lib/score-engine';

interface ActionPlanTabProps {
  intakeData: IntakeFormData;
  result: ActionPlanResult | null;
  overviewResult: OverviewResult | null;
  onLoaded: (r: ActionPlanResult) => void;
}

export function ActionPlanTab({ intakeData, result, overviewResult, onLoaded }: ActionPlanTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleGenerate = () => {
    setIsLoading(true);
    setIsError(false);
    fetchActionPlan(intakeData)
      .then(r => { onLoaded(r); })
      .catch(() => { setIsError(true); })
      .finally(() => { setIsLoading(false); });
  };

  const handleToggleStep = useCallback((stepNumber: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
      }
      return next;
    });
  }, []);

  if (!result) {
    return (
      <SectionIntro
        icon="📋"
        title="Your Action Plan"
        description="Get a step-by-step plan — what to do first, what documents you need, who to contact, and how each step improves your readiness score."
        ctaLabel="Build My Action Plan →"
        note="Uses AI to sequence your next steps based on dependencies and deadlines."
        isLoading={isLoading}
        isError={isError}
        onGenerate={handleGenerate}
      />
    );
  }

  // Build a synthetic result shape that ActionPlan expects.
  // It needs readiness from overviewResult + action_plan + score_deltas from this result.
  const baseReadiness = overviewResult?.readiness ?? {
    overall: 50,
    academic: { score: 50, summary: '' },
    financial_aid: { score: 50, summary: '' },
    application: { score: 50, summary: '' },
    timeline: { score: 50, summary: '' },
    overall_summary: '',
  };

  const syntheticResult = {
    readiness: baseReadiness,
    action_plan: result.action_plan,
    score_deltas: result.score_deltas,
    // Unused by ActionPlan but required by type
    matched_programs: [],
    school_matches: [],
    other_options_note: '',
    semester_roadmap: { recommended_start: '', total_semesters_to_degree: 0, based_on_school: '', phases: [] },
    key_insight: '',
  };

  const currentScores = applyAllCompletedDeltas(completedSteps, syntheticResult);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ActionPlan
        result={syntheticResult}
        completedSteps={completedSteps}
        scores={currentScores}
        onToggleStep={handleToggleStep}
      />
    </div>
  );
}

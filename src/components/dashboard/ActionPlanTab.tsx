import { useState, useCallback, useEffect } from 'react';
import type { IntakeFormData, ActionPlanResult, OverviewResult, ActionPlanContext } from '../../lib/types';
import { fetchActionPlan } from '../../lib/claude';
import { ActionPlan } from './ActionPlan';
import { TabLoader } from '../shared/TabLoader';
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

  const handleGenerate = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    const context: ActionPlanContext = {};
    fetchActionPlan(intakeData, context)
      .then(r => { onLoaded(r); })
      .catch(() => { setIsError(true); })
      .finally(() => { setIsLoading(false); });
  }, [intakeData, onLoaded]);

  // Auto-generate on first mount when no cached result
  useEffect(() => {
    if (!result && !isLoading) {
      handleGenerate();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  if (isLoading) return <TabLoader message="Building your action plan..." />;

  if (isError) {
    return (
      <div style={{ maxWidth: 480, margin: '40px auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#D85A30', marginBottom: 12 }}>
          Something went wrong generating your action plan.
        </p>
        <button
          onClick={handleGenerate}
          style={{
            background: '#0F6E56', color: '#fff', border: 'none',
            borderRadius: 10, padding: '12px 24px', fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Try Again →
        </button>
      </div>
    );
  }

  if (!result) return <TabLoader message="Building your action plan..." />;

  // Build a synthetic result shape that ActionPlan expects.
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
    matched_programs: [],
    school_matches: [],
    other_options_note: '',
    semester_roadmap: { recommended_start: '', total_semesters_to_degree: 0, based_on_school: '', phases: [] },
    key_insight: '',
  };

  const currentScores = applyAllCompletedDeltas(completedSteps, syntheticResult);

  return (
    <div className="max-w-6xl mx-auto px-6 py-5">
      <ActionPlan
        result={syntheticResult}
        completedSteps={completedSteps}
        scores={currentScores}
        onToggleStep={handleToggleStep}
      />
    </div>
  );
}

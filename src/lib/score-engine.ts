import type { AssessmentResult, ReadinessScore } from './types';

export interface ScoreState {
  overall: number;
  academic: number;
  financial_aid: number;
  application: number;
  timeline: number;
}

export function getInitialScores(result: AssessmentResult): ScoreState {
  return {
    overall: result.readiness.overall,
    academic: result.readiness.academic.score,
    financial_aid: result.readiness.financial_aid.score,
    application: result.readiness.application.score,
    timeline: result.readiness.timeline.score,
  };
}

export function applyDelta(
  current: ScoreState,
  stepNumber: number,
  result: AssessmentResult
): ScoreState {
  const delta = result.score_deltas[stepNumber];
  if (!delta) return current;

  return {
    overall: Math.min(100, current.overall + delta.overall),
    academic: Math.min(100, current.academic + delta.academic),
    financial_aid: Math.min(100, current.financial_aid + delta.financial_aid),
    application: Math.min(100, current.application + delta.application),
    timeline: Math.min(100, current.timeline + delta.timeline),
  };
}

export function applyAllCompletedDeltas(
  completedSteps: Set<number>,
  result: AssessmentResult
): ScoreState {
  let scores = getInitialScores(result);

  const sorted = Array.from(completedSteps).sort((a, b) => a - b);
  for (const step of sorted) {
    scores = applyDelta(scores, step, result);
  }

  return scores;
}

export function getUnlockedSteps(
  completedSteps: Set<number>,
  result: AssessmentResult
): Set<number> {
  const unlocked = new Set<number>();

  for (const stepNum of completedSteps) {
    const delta = result.score_deltas[stepNum];
    if (delta?.unlocks) {
      delta.unlocks.forEach(n => unlocked.add(n));
    }
  }

  return unlocked;
}

export function buildReadinessFromScores(
  scores: ScoreState,
  original: ReadinessScore
): ReadinessScore {
  return {
    ...original,
    overall: scores.overall,
    academic: { ...original.academic, score: scores.academic },
    financial_aid: { ...original.financial_aid, score: scores.financial_aid },
    application: { ...original.application, score: scores.application },
    timeline: { ...original.timeline, score: scores.timeline },
  };
}

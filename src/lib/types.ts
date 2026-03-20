export interface IntakeFormData {
  age: number;
  state: string;
  educationGoal: string;
  timeline: 'still_in_care' | 'just_aged_out' | '3_12_months' | 'over_a_year';
  documents: string[];
  benefitsApplied: string[];
}

export interface ReadinessScore {
  overall: number;
  academic: { score: number; summary: string };
  financial_aid: { score: number; summary: string };
  application: { score: number; summary: string };
  timeline: { score: number; summary: string };
  overall_summary: string;
}

export interface MatchedProgram {
  id: string;
  name: string;
  what_it_covers: string;
  max_amount: string;
  confidence: 'eligible' | 'likely_eligible' | 'verify';
  confidence_reason: string;
  deadline: string | null;
  days_until_deadline: number | null;
  next_action: string;
  source_url: string;
  verify_with: string;
}

export interface ActionStep {
  step_number: number;
  title: string;
  why_this_is_next: string;
  deadline: string | null;
  days_until_deadline: number | null;
  documents_needed: Array<{ name: string; status: 'have' | 'need'; how_to_get: string }>;
  specific_action: string;
  where_to_go: string;
  what_to_bring: string;
  confidence: 'certain' | 'high' | 'verify';
  verify_with: string;
  source_url: string;
}

export interface ScoreDelta {
  academic: number;
  financial_aid: number;
  application: number;
  timeline: number;
  overall: number;
  unlocks: number[];
}

export interface AssessmentResult {
  readiness: ReadinessScore;
  matched_programs: MatchedProgram[];
  action_plan: ActionStep[];
  score_deltas: Record<number, ScoreDelta>;
  key_insight: string;
}

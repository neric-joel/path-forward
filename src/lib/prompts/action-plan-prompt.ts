import arizonaData from '../knowledge-base/arizona.json';
import {
  PERSONA,
  CORE_PRINCIPLES,
  SAFEGUARD_1,
  SAFEGUARD_5,
  SAFEGUARD_7_8,
  LANGUAGE_RULES,
  SCORING_RULES,
} from './prompt-base';

/**
 * Tab 4 — Action Plan prompt.
 * Returns: sequenced action steps + score_deltas.
 * Medium response (~2000–2500 tokens). On-demand only.
 */
export function buildActionPlanPrompt(): string {
  return `${PERSONA}

${CORE_PRINCIPLES}

═══════════════════════════════════════════════════════════
ETHICAL SAFEGUARDS (these override all other rules)
═══════════════════════════════════════════════════════════

${SAFEGUARD_1}

${SAFEGUARD_5}

${SAFEGUARD_7_8}

═══════════════════════════════════════════════════════════
ARIZONA PROGRAM DATABASE
═══════════════════════════════════════════════════════════

${JSON.stringify(arizonaData, null, 2)}

Today's date: ${new Date().toISOString().split('T')[0]}

${SCORING_RULES}

═══════════════════════════════════════════════════════════
ACTION PLAN DEPENDENCY RULES
═══════════════════════════════════════════════════════════

1. Documents that unlock other steps go FIRST (State ID, SSN, birth cert)
2. FAFSA before Tuition Waiver (Tuition Waiver requires FAFSA)
3. Proof of foster care before ETV application
4. Enrollment confirmation before ETV disbursement
5. Earlier deadlines first
6. Free and quick steps first
7. Steps that unlock other steps are marked in unlocks[]

═══════════════════════════════════════════════════════════
SCORE DELTAS RULES
═══════════════════════════════════════════════════════════

For each action step, calculate the exact score increase if the user completes that step.
- Deltas must be integers and non-negative
- unlocks[] lists step_number integers that become actionable after this step
- score_deltas keys must be integers matching step_number (1, 2, 3...)
- overall delta should roughly equal weighted sum of component deltas

═══════════════════════════════════════════════════════════
OUTPUT JSON SCHEMA — return this exact structure
═══════════════════════════════════════════════════════════

{
  "action_plan": [
    {
      "step_number": <integer starting at 1>,
      "title": <short imperative title, max 6 words>,
      "why_this_is_next": <1 sentence explaining dependency or urgency>,
      "deadline": <string or null>,
      "days_until_deadline": <integer or null>,
      "urgency_note": <string or null — REQUIRED if days_until_deadline <= 14>,
      "documents_needed": [
        { "name": <string>, "status": <"have" | "need">, "how_to_get": <string if "need"> }
      ],
      "specific_action": <concrete first step of what to do>,
      "where_to_go": <URL or physical location>,
      "what_to_bring": <comma-separated list>,
      "estimated_time": <string, e.g., "45 minutes">,
      "confidence": <"certain" | "high" | "verify">,
      "verify_with": <specific contact: name, office, phone, or URL>,
      "source_url": <string>
    }
  ],
  "score_deltas": {
    1: { "academic": <int>, "financial_aid": <int>, "application": <int>, "timeline": <int>, "overall": <int>, "unlocks": [<step_numbers>] },
    2: { "academic": <int>, "financial_aid": <int>, "application": <int>, "timeline": <int>, "overall": <int>, "unlocks": [<step_numbers>] }
  }
}

CRITICAL: score_deltas keys must be integers in the JSON (1, 2, 3) — not strings.
All step_numbers must be sequential integers starting at 1.

${LANGUAGE_RULES}`;
}

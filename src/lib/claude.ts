import type { IntakeFormData, AssessmentResult } from './types';
import { SYSTEM_PROMPT } from './prompt';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 8000;
const MAX_RETRIES = 2;

// ─── Demo Fallback ──────────────────────────────────────────────────────────
// Used when the API key is missing or the API fails — keeps the demo alive.
const DEMO_FALLBACK: AssessmentResult = {
  readiness: {
    overall: 52,
    academic: {
      score: 60,
      summary: "You have a clear education goal and likely have your diploma or GED — that's the foundation. Getting your transcripts together is the next piece."
    },
    financial_aid: {
      score: 40,
      summary: "Three major funding sources are available to you. The Pell Grant and ETV alone can cover most of your first year. You haven't applied yet — that's the gap."
    },
    application: {
      score: 35,
      summary: "Some key documents are still needed. Proof of foster care and your FAFSA are the two that unlock everything else."
    },
    timeline: {
      score: 75,
      summary: "You just aged out — you're in the best window to act. The ETV deadline is July 31, 2026. Filing FAFSA now keeps every door open."
    },
    overall_summary: "You're more than halfway there. The funding exists — three programs total over $12,000/year. The work now is paperwork, not eligibility."
  },
  matched_programs: [
    {
      id: 'federal_pell',
      name: 'Federal Pell Grant',
      what_it_covers: 'Tuition, fees, room and board, books, supplies, transportation',
      max_amount: '$7,395/year',
      confidence: 'eligible',
      confidence_reason: 'Foster youth automatically qualify as independent students — no parental income required.',
      deadline: 'January 1, 2027 (recommended)',
      days_until_deadline: 287,
      next_action: 'Complete FAFSA at studentaid.gov — takes about 30 minutes. Use ASU school code 001081.',
      source_url: 'https://studentaid.gov/h/apply-for-aid/fafsa',
      verify_with: 'ASU Financial Aid Office: 480-965-3355'
    },
    {
      id: 'az_etv',
      name: 'Arizona Education and Training Voucher (ETV)',
      what_it_covers: 'Tuition, housing, books, student loan repayments, qualified living expenses',
      max_amount: '$5,000/year (up to 10 semesters)',
      confidence: 'eligible',
      confidence_reason: 'You were in foster care after age 16 and are under 26. You meet the core eligibility requirements.',
      deadline: 'July 31, 2026',
      days_until_deadline: 133,
      next_action: 'Apply at Foster Success Education Services portal. First-come, first-served — apply now.',
      source_url: 'https://fseducation.fostersuccess.org/arizona-etv/',
      verify_with: 'Foster Success: contact via fseducation.fostersuccess.org'
    },
    {
      id: 'az_tuition_waiver',
      name: 'Arizona Tuition Waiver (Foster Youth Award)',
      what_it_covers: 'Remaining tuition and mandatory fees after all other grants applied',
      max_amount: 'Full remaining tuition',
      confidence: 'likely_eligible',
      confidence_reason: 'Requires FAFSA completion and enrollment at an AZ public college. Complete FAFSA first to confirm.',
      deadline: 'Rolling — apply after FAFSA is processed',
      days_until_deadline: null,
      next_action: 'Complete FAFSA first. Then apply through Foster Success. This covers whatever Pell + ETV don\'t.',
      source_url: 'https://www.azleg.gov/ars/15/01809-01.htm',
      verify_with: 'Foster Success Education Services'
    }
  ],
  action_plan: [
    {
      step_number: 1,
      title: 'Complete FAFSA',
      why_this_is_next: 'The Pell Grant ($7,395/yr) and the Tuition Waiver both require FAFSA. Without it, those doors are closed.',
      deadline: 'January 1, 2027 recommended',
      days_until_deadline: 287,
      documents_needed: [
        { name: 'Social Security Number', status: 'need', how_to_get: 'If lost, get a free replacement at ssa.gov/myaccount' },
        { name: 'State ID or Driver\'s License', status: 'need', how_to_get: 'Arizona MVD at azmvdnow.gov — bring birth cert + SSN + AZ address proof' }
      ],
      specific_action: 'Go to studentaid.gov, create an FSA ID, then complete the FAFSA form. Answer YES to the foster care question.',
      where_to_go: 'studentaid.gov/h/apply-for-aid/fafsa',
      what_to_bring: 'Your SSN, State ID, and any income information (if any)',
      confidence: 'certain',
      verify_with: 'ASU Financial Aid: 480-965-3355 or aid.asu.edu',
      source_url: 'https://studentaid.gov/h/apply-for-aid/fafsa'
    },
    {
      step_number: 2,
      title: 'Apply for Arizona ETV',
      why_this_is_next: 'The ETV deadline is July 31, 2026 — 133 days away. It\'s first-come, first-served. Apply as soon as you gather your documents.',
      deadline: 'July 31, 2026',
      days_until_deadline: 133,
      documents_needed: [
        { name: 'Proof of Foster Care', status: 'need', how_to_get: 'Contact DCS, your former caseworker, or court records. The ETV portal may help verify.' },
        { name: 'School Transcripts', status: 'need', how_to_get: 'Contact your last high school. Gaps from school changes are expected — not a barrier.' }
      ],
      specific_action: 'Apply at fseducation.fostersuccess.org/arizona-etv/. Have your transcripts and proof of foster care ready.',
      where_to_go: 'fseducation.fostersuccess.org/arizona-etv/',
      what_to_bring: 'Proof of foster care (DCS letter or court document), school transcripts, SSN',
      confidence: 'high',
      verify_with: 'Foster Success Education Services',
      source_url: 'https://fseducation.fostersuccess.org/arizona-etv/'
    },
    {
      step_number: 3,
      title: 'Get Proof of Foster Care',
      why_this_is_next: 'This document unlocks both the ETV and the Tuition Waiver. It\'s often the hardest to get — start now.',
      deadline: null,
      days_until_deadline: null,
      documents_needed: [
        { name: 'DCS Letter or Court Records', status: 'need', how_to_get: 'Call DCS at 1-888-SOS-CHILD or contact your former caseworker. Court records available at Superior Court.' }
      ],
      specific_action: 'Call DCS (Arizona Department of Child Safety) and request a letter verifying your foster care history. Reference ARS 15-1809.01.',
      where_to_go: 'DCS: 1-888-767-2445 | Superior Court Records',
      what_to_bring: 'Your full name, date of birth, and any case numbers you have',
      confidence: 'high',
      verify_with: 'Arizona DCS: 1-888-767-2445',
      source_url: 'https://www.azleg.gov/ars/15/01809-01.htm'
    },
    {
      step_number: 4,
      title: 'Connect with ASU Foster Youth Programs',
      why_this_is_next: 'ASU has a dedicated office (UCENT 240) that helps with exactly this. They can verify your eligibility and coordinate all three funding sources.',
      deadline: null,
      days_until_deadline: null,
      documents_needed: [],
      specific_action: 'Visit fosteryouth.asu.edu or walk into UCENT 240 on the Tempe campus. Tell them you just aged out and want to apply for the tuition waiver.',
      where_to_go: 'fosteryouth.asu.edu | UCENT 240, ASU Tempe Campus',
      what_to_bring: 'Any documents you already have — they can help you figure out what\'s missing',
      confidence: 'certain',
      verify_with: 'ASU Foster Youth Programs office: fosteryouth.asu.edu',
      source_url: 'https://fosteryouth.asu.edu/'
    }
  ],
  score_deltas: {
    1: { academic: 0, financial_aid: 20, application: 15, timeline: 5, overall: 12, unlocks: [3] },
    2: { academic: 0, financial_aid: 20, application: 20, timeline: 0, overall: 14, unlocks: [] },
    3: { academic: 0, financial_aid: 0, application: 25, timeline: 0, overall: 8, unlocks: [2] },
    4: { academic: 10, financial_aid: 5, application: 5, timeline: 5, overall: 7, unlocks: [] }
  },
  key_insight: "You qualify for up to $12,395 in grant funding this year — money that doesn't need to be repaid. The Pell Grant and ETV together cover most of a community college year. The Tuition Waiver covers what's left. FAFSA is the first move."
};

// ─── Core API Call ──────────────────────────────────────────────────────────

async function fetchWithRetry(
  intakeData: IntakeFormData,
  attempt: number = 0
): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: JSON.stringify(intakeData) }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Claude API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    return data.content[0].text as string;
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(intakeData, attempt + 1);
    }
    throw error;
  }
}

function parseClaudeResponse(raw: string): AssessmentResult {
  // Strip accidental markdown fences
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(cleaned) as AssessmentResult;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function callClaudeAPI(
  intakeData: IntakeFormData
): Promise<AssessmentResult> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!apiKey || apiKey === 'your_key_here' || apiKey.trim() === '') {
    console.warn('[Vazhi] No API key set — using demo fallback.');
    return DEMO_FALLBACK;
  }

  try {
    const rawText = await fetchWithRetry(intakeData);
    const result = parseClaudeResponse(rawText);
    return result;
  } catch (error) {
    console.error('[Vazhi] Claude API failed — using demo fallback:', error);
    return DEMO_FALLBACK;
  }
}

export { DEMO_FALLBACK };

import type {
  IntakeFormData,
  OverviewResult,
  FinancialAidResult,
  SchoolMatchResult,
  ActionPlanResult,
  RoadmapResult,
} from './types';
import { buildOverviewPrompt } from './prompts/overview-prompt';
import { buildFinancialPrompt } from './prompts/financial-prompt';
import { buildSchoolsPrompt } from './prompts/schools-prompt';
import { buildActionPlanPrompt } from './prompts/action-plan-prompt';
import { buildRoadmapPrompt } from './prompts/roadmap-prompt';
import {
  DEMO_RESULT,
  DEMO_OVERVIEW,
  DEMO_FINANCIAL,
  DEMO_SCHOOLS,
  DEMO_ACTION_PLAN,
  DEMO_ROADMAP,
} from './demo-data';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const FETCH_TIMEOUT_MS = 45_000; // per-section calls are small — 45s is plenty

// ─── Core Fetch ──────────────────────────────────────────────────────────────

async function callAPI(
  systemPrompt: string,
  intakeData: IntakeFormData,
  maxTokens: number
): Promise<string> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: JSON.stringify(intakeData) }],
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn(`[Vazhi] API HTTP ${response.status}:`, errorBody.slice(0, 200));
      throw new Error(`Claude API error ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text as string;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function parseJSON<T>(raw: string, section: string): T {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  if (!cleaned.endsWith('}')) {
    console.warn(`[Vazhi] ${section}: response may be truncated. Last 80 chars:`, cleaned.slice(-80));
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error(`[Vazhi] ${section}: JSON.parse failed.`, err);
    console.error(`[Vazhi] ${section}: First 300 chars:`, cleaned.slice(0, 300));
    throw err;
  }
}

function hasApiKey(): boolean {
  const key = import.meta.env.VITE_CLAUDE_API_KEY;
  return Boolean(key && key !== 'your_key_here' && key.trim() !== '');
}

// ─── Public Section Functions ────────────────────────────────────────────────

/** Tab 1 — auto-fires on intake submit. Returns scores + slim programs + key_insight. */
export async function fetchOverview(intakeData: IntakeFormData): Promise<OverviewResult> {
  if (!hasApiKey()) {
    console.warn('[Vazhi] No API key — overview demo fallback.');
    return DEMO_OVERVIEW;
  }
  try {
    const raw = await callAPI(buildOverviewPrompt(), intakeData, 2500);
    const result = parseJSON<OverviewResult>(raw, 'Overview');
    console.log('[Vazhi] Overview succeeded.');
    return result;
  } catch (err) {
    console.error('[Vazhi] Overview failed — demo fallback:', err);
    return DEMO_OVERVIEW;
  }
}

/** Tab 2 — on-demand. Returns full matched_programs with all fields. */
export async function fetchFinancialAid(intakeData: IntakeFormData): Promise<FinancialAidResult> {
  if (!hasApiKey()) {
    console.warn('[Vazhi] No API key — financial demo fallback.');
    return DEMO_FINANCIAL;
  }
  try {
    const raw = await callAPI(buildFinancialPrompt(), intakeData, 2000);
    const result = parseJSON<FinancialAidResult>(raw, 'FinancialAid');
    console.log('[Vazhi] FinancialAid succeeded.');
    return result;
  } catch (err) {
    console.error('[Vazhi] FinancialAid failed — demo fallback:', err);
    return DEMO_FINANCIAL;
  }
}

/** Tab 3 — on-demand. Returns top 3 school matches with cost breakdowns. */
export async function fetchSchoolMatches(intakeData: IntakeFormData): Promise<SchoolMatchResult> {
  if (!hasApiKey()) {
    console.warn('[Vazhi] No API key — schools demo fallback.');
    return DEMO_SCHOOLS;
  }
  try {
    const raw = await callAPI(buildSchoolsPrompt(), intakeData, 4000);
    const result = parseJSON<SchoolMatchResult>(raw, 'Schools');
    console.log('[Vazhi] Schools succeeded.');
    return result;
  } catch (err) {
    console.error('[Vazhi] Schools failed — demo fallback:', err);
    return DEMO_SCHOOLS;
  }
}

/** Tab 4 — on-demand. Returns sequenced action plan + score deltas. */
export async function fetchActionPlan(intakeData: IntakeFormData): Promise<ActionPlanResult> {
  if (!hasApiKey()) {
    console.warn('[Vazhi] No API key — action plan demo fallback.');
    return DEMO_ACTION_PLAN;
  }
  try {
    const raw = await callAPI(buildActionPlanPrompt(), intakeData, 3000);
    const result = parseJSON<ActionPlanResult>(raw, 'ActionPlan');
    console.log('[Vazhi] ActionPlan succeeded.');
    return result;
  } catch (err) {
    console.error('[Vazhi] ActionPlan failed — demo fallback:', err);
    return DEMO_ACTION_PLAN;
  }
}

/** Tab 5 — on-demand. Requires topSchoolId from schoolResult. */
export async function fetchRoadmap(
  intakeData: IntakeFormData,
  topSchoolId: string
): Promise<RoadmapResult> {
  if (!hasApiKey()) {
    console.warn('[Vazhi] No API key — roadmap demo fallback.');
    return DEMO_ROADMAP;
  }
  try {
    const raw = await callAPI(buildRoadmapPrompt(topSchoolId), intakeData, 3000);
    const result = parseJSON<RoadmapResult>(raw, 'Roadmap');
    console.log('[Vazhi] Roadmap succeeded.');
    return result;
  } catch (err) {
    console.error('[Vazhi] Roadmap failed — demo fallback:', err);
    return DEMO_ROADMAP;
  }
}

// ─── Legacy export (used by pdf-export.ts) ───────────────────────────────────
export { DEMO_RESULT };

import type { IntakeFormData, AssessmentResult } from './types';
import { SYSTEM_PROMPT } from './prompt';
import { DEMO_RESULT } from './demo-data';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 12000; // V2 schema (school_matches + semester_roadmap + action_plan) needs headroom
const MAX_RETRIES = 1;    // 1 retry — users shouldn't wait 6s+ on a dead key
const FETCH_TIMEOUT_MS = 30_000;

// ─── Core API Call ──────────────────────────────────────────────────────────

async function fetchWithRetry(
  intakeData: IntakeFormData,
  attempt: number = 0
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      signal: controller.signal,
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

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn(`[Vazhi] API HTTP ${response.status}:`, errorBody.slice(0, 200));
      throw new Error(`Claude API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    return data.content[0].text as string;
  } catch (error) {
    clearTimeout(timeoutId);
    if (attempt < MAX_RETRIES) {
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(`[Vazhi] Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(intakeData, attempt + 1);
    }
    throw error;
  }
}

function parseClaudeResponse(raw: string): AssessmentResult {
  console.log('[Vazhi] Raw response length:', raw.length, '| Last char:', raw.at(-1));

  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  if (!cleaned.endsWith('}')) {
    console.warn('[Vazhi] Response may be truncated — does not end with }. Last 100 chars:', cleaned.slice(-100));
  }

  try {
    return JSON.parse(cleaned) as AssessmentResult;
  } catch (parseError) {
    console.error('[Vazhi] JSON.parse failed:', parseError);
    console.error('[Vazhi] First 500 chars of response:', cleaned.slice(0, 500));
    console.error('[Vazhi] Last 200 chars of response:', cleaned.slice(-200));
    throw parseError;
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function callClaudeAPI(
  intakeData: IntakeFormData
): Promise<AssessmentResult> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!apiKey || apiKey === 'your_key_here' || apiKey.trim() === '') {
    console.warn('[Vazhi] No API key set — using demo fallback.');
    return DEMO_RESULT;
  }

  try {
    const rawText = await fetchWithRetry(intakeData);
    const result = parseClaudeResponse(rawText);
    console.log('[Vazhi] API call succeeded.');
    return result;
  } catch (error) {
    console.error('[Vazhi] Claude API failed — using demo fallback:', error);
    return DEMO_RESULT;
  }
}

export { DEMO_RESULT };

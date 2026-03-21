/**
 * Vercel serverless function — Claude API proxy.
 *
 * Keeps CLAUDE_API_KEY server-side so it is never exposed in the client bundle.
 * Accepts the fully-built system prompt from the client (prompt builders run
 * in Vite and embed the AZ knowledge base at build/runtime).
 *
 * POST /api/assess
 * Body: { systemPrompt: string; intakeData: unknown; maxTokens: number }
 */

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

const ALLOWED_MAX_TOKENS = new Set([2000, 2500, 3000, 4000]);

export default async function handler(
  req: { method: string; body: Record<string, unknown> },
  res: {
    status: (code: number) => {
      json: (data: unknown) => void;
      end: () => void;
    };
  },
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { systemPrompt, intakeData, maxTokens } = req.body;

  // Validate required fields
  if (typeof systemPrompt !== 'string' || !systemPrompt) {
    return res.status(400).json({ error: 'systemPrompt required' });
  }
  if (typeof maxTokens !== 'number' || !ALLOWED_MAX_TOKENS.has(maxTokens)) {
    return res.status(400).json({ error: 'maxTokens must be 2000, 2500, 3000, or 4000' });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'CLAUDE_API_KEY not configured on server' });
  }

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: JSON.stringify(intakeData) }],
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      console.error('[Vazhi proxy] Anthropic error', upstream.status, JSON.stringify(data).slice(0, 200));
      return res.status(upstream.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('[Vazhi proxy] fetch failed:', err);
    return res.status(500).json({ error: 'Upstream request failed' });
  }
}

# Vazhi — AI College Readiness Tool for Foster Youth
> வழி (vazhi) = "path" in Tamil

---

## Active Skills

All skills are in `.claude/skills/` — Claude Code uses them automatically:

| Skill | When to Use |
|-------|-------------|
| `frontend-design` | Any UI component, page, layout, or styling work |
| `code-reviewer` | After completing ANY file — never skip this |
| `react-best-practices` | Every React component — hooks, state, performance |
| `senior-frontend` | Component architecture, TypeScript patterns, Vite config |
| `senior-architect` | System design decisions, component wiring, state architecture |
| `api-integration-specialist` | `claude.ts` API wrapper, error handling, retry logic |
| `senior-prompt-engineer` | Writing and refining the system prompt in `prompt.ts` |
| `clean-code` | Refactoring, naming, function extraction |
| `ui-design-system` | Design tokens, visual consistency across components |
| `ui-ux-pro-max` | Color palette, accessibility, animations, spacing |
| `webapp-testing` | Testing intake form, dashboard, score updates with Playwright |
| `pdf-processing-pro` | PDF export generation with tables, formatting, validation |
| `git-commit-helper` | Generate commit messages when pushing to GitHub |
| `brainstorming` | Before building any new feature — explore intent first |
| `workflow-automation` | Build scripts if needed |
| `senior-backend` | NOT needed — no backend in this project, skip |
| `senior-devops` | Vercel deploy config only |

**Hard rules:**
- Always run `code-reviewer` + `react-best-practices` on every component before presenting
- Always use `brainstorming` before adding any new feature
- Use `senior-architect` before wiring the dashboard score delta system
- Use `senior-prompt-engineer` exclusively when writing `prompt.ts`

---

## Landing Page Visual Direction

**Hero background:** Winding dirt path through misty green hills — symbolizes "vazhi" (the path forward).
For development, use this CSS gradient as a placeholder:
```css
background: linear-gradient(to bottom, #1a2e1a, #0F6E56);
```

**Style reference:** Cinematic full-bleed hero, dark overlay on background, large serif headline,
floating nav pill, single amber CTA button — like the "Where Creativity Meets AI" reference.

**Font pairing:**
- Hero headline: `"Playfair Display"` (Google Fonts — cinematic, editorial)
- Body / UI: `"DM Sans"` (clean, readable)
- Sub-headings: `"DM Serif Display"`

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet">
```

**Landing page content:**
- Nav: Logo "Vazhi வழி" left | "How It Works" + "Get Started" right (pill nav, floating)
- Hero headline: `"வழி"` (small, teal, above) → `"Your Path to College Starts Here"` (large, Playfair Display, white)
- Subtext: `"Foster youth in Arizona — discover your funding, build your plan, find your way."`
- CTA: `"Get My Plan →"` (warm amber #BA7517, large button)
- Scroll hint: `"(Scroll to explore)"` at bottom
- Footer: `"Your data stays in your browser. Nothing is stored or shared."`

---

## 1. Architecture Overview

```
User → Intake Form (5 fields)
         ↓
     Claude API (system prompt + AZ knowledge base)
         ↓
     Structured JSON Response
         ↓
     ┌─────────────┬──────────────┬────────────────┐
     │ Readiness   │ Financial    │ Sequenced      │
     │ Snapshot    │ Aid Matches  │ Action Plan    │
     │ (4 scores)  │ (with sources)│ (with deltas) │
     └─────────────┴──────────────┴────────────────┘
         ↓                              ↓
     Interactive Dashboard          PDF Export
         ↓
     Step Completion → Instant Score Updates (pre-calculated deltas)
```

**Stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- AI: Claude API (claude-sonnet-4-20250514) — client-side calls, NO backend
- Deploy: Vercel
- PDF: jspdf (use `pdf-processing-pro` skill)
- NO database, NO auth, NO backend server

---

## 2. Project Structure

```
vazhi/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── intake/
│   │   │   ├── IntakeForm.tsx          # Main 5-field form
│   │   │   ├── StepIndicator.tsx       # Progress bar
│   │   │   ├── fields/
│   │   │   │   ├── AgeStateField.tsx
│   │   │   │   ├── EducationGoalField.tsx
│   │   │   │   ├── TimelineField.tsx
│   │   │   │   ├── DocumentsField.tsx
│   │   │   │   └── BenefitsField.tsx
│   │   │   └── IntakeReview.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardView.tsx
│   │   │   ├── ReadinessSnapshot.tsx
│   │   │   ├── ScoreRing.tsx
│   │   │   ├── ScoreBar.tsx
│   │   │   ├── FinancialAidCards.tsx
│   │   │   ├── AidCard.tsx
│   │   │   ├── ActionPlan.tsx
│   │   │   └── ActionStep.tsx
│   │   └── shared/
│   │       ├── LoadingSkeleton.tsx
│   │       ├── ConfidenceBadge.tsx
│   │       └── SourceCitation.tsx
│   ├── lib/
│   │   ├── claude.ts                   # Claude API wrapper
│   │   ├── prompt.ts                   # System prompt + schema
│   │   ├── score-engine.ts             # Client-side delta application
│   │   ├── pdf-export.ts               # PDF generation
│   │   ├── types.ts                    # TypeScript interfaces
│   │   └── knowledge-base/
│   │       └── arizona.json
│   ├── pages/
│   │   ├── Home.tsx                    # Landing page (cinematic hero)
│   │   ├── Intake.tsx
│   │   └── Dashboard.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env                                # VITE_CLAUDE_API_KEY
├── tailwind.config.ts
└── vite.config.ts
```

---

## 3. Design System

**Aesthetic: Warm, trustworthy, grounded — NOT clinical, NOT startup-flashy**

```
Primary:    #0F6E56  (deep teal)
Accent:     #BA7517  (warm amber — CTA buttons)
Success:    #3B6D11  (forest green)
Warning:    #D85A30  (coral)
Danger:     #A32D2D  (muted red)
Background: #FAFAF7  (warm off-white)
Surface:    #F5F3EE  (soft cream cards)
Text:       #1C1C1A  (near-black)
Secondary:  #6B6A65
```

**UI Rules:**
- NO dark mode — library computers and phones
- Min 44px touch targets — mobile first
- Plain language — no jargon without tooltip
- Skeleton loading, not spinners
- Scores animate up on first render

---

## 4. Arizona Knowledge Base (arizona.json)

```json
{
  "state": "Arizona",
  "last_updated": "2026-03-19",
  "programs": [
    {
      "id": "az_tuition_waiver",
      "name": "Arizona Tuition Waiver (Foster Youth Award)",
      "type": "tuition_waiver",
      "what_it_covers": "Remaining tuition and mandatory fees after all other grants/scholarships applied",
      "max_amount": "Full remaining tuition",
      "eligibility": {
        "foster_care_age": 14, "max_age": 23, "first_disbursement_before": 23,
        "assets_under": 10000, "requires_fafsa": true, "requires_enrollment": true,
        "institution_type": "Arizona public college or university",
        "citizenship_required": true, "volunteer_hours": 30,
        "min_gpa_renewal": "satisfactory academic progress"
      },
      "application": {
        "portal": "Foster Success Education Services",
        "url": "https://fseducation.fostersuccess.org/arizona-etv/",
        "deadline": "Rolling — apply as soon as eligible",
        "fafsa_deadline": "January 1 recommended, March 1 latest"
      },
      "source": { "statute": "ARS 15-1809.01", "url": "https://www.azleg.gov/ars/15/01809-01.htm" },
      "notes": "Applied AFTER all other grants/scholarships. ETV is the only grant NOT counted against it."
    },
    {
      "id": "az_etv",
      "name": "Arizona Education and Training Voucher (ETV)",
      "type": "grant",
      "what_it_covers": "Tuition, housing, books, student loan repayments, qualified living expenses",
      "max_amount_per_year": 5000, "max_amount_per_semester": 2500, "max_semesters": 10,
      "eligibility": {
        "foster_care_age": 16, "enroll_before_age": 21, "support_until_age": 26,
        "assets_under": 10000, "requires_enrollment": true, "min_gpa": 2.0, "requires_transcript": true
      },
      "application": {
        "portal": "Foster Success Education Services",
        "url": "https://fseducation.fostersuccess.org/arizona-etv/",
        "deadline_2025_2026": "July 31, 2026", "rolling": true
      },
      "source": { "url": "https://fseducation.fostersuccess.org/arizona-etv/" },
      "notes": "First-come first-served. Not counted against the tuition waiver."
    },
    {
      "id": "federal_pell",
      "name": "Federal Pell Grant",
      "type": "grant",
      "what_it_covers": "Tuition, fees, room and board, books, supplies, transportation",
      "max_amount_per_year": 7395,
      "eligibility": {
        "requires_fafsa": true,
        "foster_youth_advantage": "Automatically classified as independent student — no parental info required",
        "answer_yes_if": "You were in foster care, a group home, or kinship placement any time after age 13"
      },
      "application": {
        "url": "https://studentaid.gov/h/apply-for-aid/fafsa",
        "opens": "October 1 each year", "recommended_deadline": "January 1",
        "asu_school_code": "001081"
      },
      "source": { "url": "https://studentaid.gov/understand-aid/types/grants/pell" }
    },
    {
      "id": "bridging_success",
      "name": "Bridging Success Program (Maricopa Community Colleges)",
      "type": "support_program",
      "what_it_covers": "Campus champions, tutoring, mentoring, basic needs, career exploration",
      "cost": "Free",
      "application": { "url": "https://www.maricopa.edu/students/student-support/foster-youth" }
    },
    {
      "id": "asu_foster_youth",
      "name": "ASU Foster Youth Programs",
      "type": "support_program",
      "what_it_covers": "Dedicated support office, tuition waiver + ETV + campus resources",
      "application": { "url": "https://fosteryouth.asu.edu/", "office": "UCENT 240" }
    },
    {
      "id": "az_medicaid_extension",
      "name": "Arizona Medicaid (AHCCCS) — Former Foster Youth",
      "type": "healthcare",
      "what_it_covers": "Health insurance until age 26 regardless of income"
    }
  ],
  "documents_needed": {
    "birth_certificate": { "how_to_get": "Arizona Vital Records. ~$20.", "url": "https://azdhs.gov/vital-records/" },
    "social_security_card": { "how_to_get": "SSA office, free replacement.", "url": "https://www.ssa.gov/myaccount/replacement-card.html" },
    "high_school_diploma_or_ged": { "how_to_get": "Arizona GED Testing Service", "url": "https://ged.com/" },
    "school_transcripts": { "how_to_get": "Contact last school attended.", "note": "Gaps from school changes are expected — not a barrier." },
    "proof_of_foster_care": { "how_to_get": "DCS, former caseworker, or court records.", "note": "Often the hardest to get. ETV portal may help verify." },
    "state_id": { "how_to_get": "Arizona MVD. Bring birth cert + SSN + AZ address proof.", "url": "https://azmvdnow.gov/" }
  }
}
```

---

## 5. Claude API System Prompt (prompt.ts)

Use `senior-prompt-engineer` skill exclusively for this file.

```
You are Vazhi, an AI college readiness assessment engine for foster
youth aging out of the system in Arizona.

Return ONLY valid JSON — no prose, no markdown fences, no explanation.

CORE PRINCIPLES:
- You are a navigation tool, not a counselor.
- Every eligibility determination must include confidence level + source URL.
- Never shame. Say "here's where things stand."
- Surface financial aid BEFORE academic requirements.
- When a deadline has passed, show the next available cycle.

ARIZONA PROGRAM DATABASE:
[Insert full arizona.json contents here at runtime]

SCORING RULES:
academic_readiness (0-100):
  Has diploma/GED: +40 | Has transcripts: +20
  Clear education goal: +20 | Specific institution type: +20

financial_aid_eligibility (0-100):
  Base: 20 | Each eligible program not yet applied for: +20 (max 100)

application_completeness (0-100):
  Points distributed evenly across needed docs + applied benefits

timeline_feasibility (0-100):
  still_in_care: 90 | just_aged_out: 75 | 3_12_months: 55 | over_a_year: 40
  Bonus per reachable deadline: +10 (max +30)
  Penalty if critical deadline within 14 days: -15

DEPENDENCY RULES (action sequencing):
1. Documents that unlock other steps go first
2. FAFSA before tuition waiver
3. Proof of foster care before ETV
4. Enrollment before ETV disbursement
5. Earlier deadlines first
6. Free/quick steps first

SCORE DELTAS: For each step, return what scores change if completed.
Keys must be integers (1, 2, 3...) not strings.

OUTPUT JSON SCHEMA:
{
  "readiness": {
    "overall": number,
    "academic": { "score": number, "summary": string },
    "financial_aid": { "score": number, "summary": string },
    "application": { "score": number, "summary": string },
    "timeline": { "score": number, "summary": string },
    "overall_summary": string
  },
  "matched_programs": [{ "id", "name", "what_it_covers", "max_amount",
    "confidence": "eligible"|"likely_eligible"|"verify",
    "confidence_reason", "deadline", "days_until_deadline",
    "next_action", "source_url", "verify_with" }],
  "action_plan": [{ "step_number", "title", "why_this_is_next",
    "deadline", "days_until_deadline",
    "documents_needed": [{ "name", "status": "have"|"need", "how_to_get" }],
    "specific_action", "where_to_go", "what_to_bring",
    "confidence": "certain"|"high"|"verify",
    "verify_with", "source_url" }],
  "score_deltas": {
    1: { "academic": n, "financial_aid": n, "application": n, "timeline": n, "overall": n, "unlocks": [n] }
  },
  "key_insight": string
}
```

---

## 6. TypeScript Interfaces (types.ts)

```typescript
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
```

---

## 7. Claude API Wrapper (claude.ts)

Use `api-integration-specialist` skill for this file.

```typescript
// Rules:
// 1. API key: import.meta.env.VITE_CLAUDE_API_KEY
// 2. Required header: 'anthropic-dangerous-direct-browser-access': 'true'
// 3. Parse: response.content[0].text as JSON
// 4. Strip accidental ```json fences before parsing
// 5. On parse failure → load DEMO_FALLBACK (never crash the demo)
// 6. Retry with exponential backoff, max 2 retries

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: JSON.stringify(intakeData) }]
  })
});
```

---

## 8. Build Order

### Phase 1 — Foundation
1. Install Tailwind CSS + shadcn/ui
2. Add Google Fonts (Playfair Display + DM Sans + DM Serif Display)
3. Define color palette in tailwind.config.ts
4. `src/lib/types.ts` — all interfaces
5. `src/lib/knowledge-base/arizona.json`
6. `src/lib/claude.ts` — use `api-integration-specialist` skill
7. `src/lib/prompt.ts` — use `senior-prompt-engineer` skill
**Checkpoint: Claude API returns valid JSON**

### Phase 2 — Landing Page
8. `src/pages/Home.tsx` — cinematic hero
   - Use `frontend-design` + `ui-design-system` skills
   - Full-bleed path background, floating nav, Playfair Display headline, amber CTA
**Checkpoint: Landing page matches visual reference**

### Phase 3 — Intake Form
9. StepIndicator, all 5 field components, IntakeReview
   - Use `react-best-practices` + `senior-frontend` skills
10. Wire form → Claude API → loading skeleton
**Checkpoint: Form submits, skeleton loads**

### Phase 4 — Dashboard
11. ScoreRing, ScoreBar, ReadinessSnapshot
    - Use `senior-architect` for state wiring decisions
12. ConfidenceBadge, SourceCitation, AidCard, FinancialAidCards
13. ActionStep, ActionPlan, DashboardView
14. Wire score deltas on step completion (client-side only)
**Checkpoint: Full dashboard renders, scores update on check**

### Phase 5 — Polish & Export
15. Score count-up animations + stagger reveal
16. PDF export — use `pdf-processing-pro` skill
17. Privacy banner, demo fallback, mobile responsive pass
18. Run `webapp-testing` skill to verify form → dashboard flow

### Phase 6 — Deploy
19. Use `git-commit-helper` for clean commits
20. Push to GitHub → deploy to Vercel

---

## 9. Environment Variables

```
VITE_CLAUDE_API_KEY=your_key_here
```

---

## 10. Code Review Standards

After every file, run `code-reviewer` + `react-best-practices`:
- Functions > 30 lines → extract
- Duplicated logic > 2x → utility
- Any `any` TypeScript type → replace
- Missing async error handling → add
- Props > 3 without grouping → group into object

---

## 11. Ethical Design

- Every eligibility result: confidence + source URL + "verify with" contact
- Never "you should have" → always "here's where things stand"
- Financial aid shown BEFORE academic requirements
- PDF bridges AI → human caseworker, never replaces
- Privacy banner on every page
- Trauma-informed language — no shame, no blame
- Demo fallback if API fails — never let a broken API kill the demo
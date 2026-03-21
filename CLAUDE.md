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
     Claude API (V2 system prompt + AZ knowledge base + AZ schools DB)
         ↓
     Structured JSON Response (V2 schema)
         ↓
     ┌─────────────┬──────────────┬────────────────┬────────────────┬──────────────────┐
     │ Readiness   │ Financial    │ School         │ Sequenced      │ Semester         │
     │ Snapshot    │ Aid Matches  │ Matches        │ Action Plan    │ Roadmap          │
     │ (4 scores)  │ (w/ sources) │ (w/ cost $$)   │ (with deltas)  │ (phased tasks)   │
     └─────────────┴──────────────┴────────────────┴────────────────┴──────────────────┘
         ↓                              ↓                                ↓
     Interactive Dashboard          PDF Export                    Step Completion
         ↓                                                        → Instant Score Updates
     Score Completion → Instant Score Updates (pre-calculated deltas)
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
│   │   │   ├── DashboardView.tsx       # Main dashboard layout (V2 render order)
│   │   │   ├── ReadinessSnapshot.tsx
│   │   │   ├── ScoreRing.tsx
│   │   │   ├── ScoreBar.tsx
│   │   │   ├── FinancialAidCards.tsx
│   │   │   ├── AidCard.tsx
│   │   │   ├── SchoolMatchCard.tsx     # V2: Individual school card with cost breakdown
│   │   │   ├── SchoolMatches.tsx       # V2: School matches list with fit labels
│   │   │   ├── SemesterRoadmap.tsx     # V2: Phased semester timeline view
│   │   │   ├── ActionPlan.tsx
│   │   │   └── ActionStep.tsx
│   │   └── shared/
│   │       ├── LoadingSkeleton.tsx
│   │       ├── ConfidenceBadge.tsx
│   │       └── SourceCitation.tsx
│   ├── lib/
│   │   ├── claude.ts                   # Claude API wrapper
│   │   ├── prompt.ts                   # V2 system prompt (8 safeguards + school matching)
│   │   ├── score-engine.ts             # Client-side delta application
│   │   ├── pdf-export.ts               # PDF generation
│   │   ├── types.ts                    # TypeScript interfaces (V2 expanded)
│   │   └── knowledge-base/
│   │       ├── arizona.json            # Programs + documents DB
│   │       └── arizona-schools.json    # V2: Arizona school profiles for matching
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

## 4b. Arizona Schools Database (arizona-schools.json) — V2

This file contains school profiles used by the V2 system prompt for school matching, cost breakdown, and semester roadmap generation. Each entry includes tuition, fees, foster support programs, housing options, transit access, and available degree paths.

**Schema per school:**
```json
{
  "id": "string",
  "name": "string",
  "type": "community_college | university",
  "location": { "city": "string", "area": "string", "transit_accessible": true },
  "tuition": { "annual_in_state_ft": 0, "mandatory_fees": 0, "tuition_url": "string" },
  "foster_support": {
    "program_name": "string",
    "has_dedicated_program": true,
    "has_campus_champion": true,
    "contact": "string",
    "program_url": "string",
    "services": ["string"]
  },
  "housing": {
    "on_campus_available": true,
    "on_campus_annual": 0,
    "avg_nearby_rent_monthly": 0
  },
  "scholarships": [{ "name": "string", "amount": 0, "foster_specific": true }],
  "online_options": true,
  "degree_paths": ["string"]
}
```

The V2 system prompt ingests this database at runtime alongside `arizona.json`. Schools are scored using the weighted matching algorithm (financial 40%, support 25%, location 20%, goal 15%) defined in the prompt.

---

## 5. Claude API System Prompt (prompt.ts) — V2

Use `senior-prompt-engineer` skill exclusively for this file.

**V2 prompt is the production prompt defined in `pathforward-implementation-plan.md`.** It includes:

### 8 Ethical Safeguards (override all other rules)
1. **Protect Against Wrong Eligibility** — confidence = "verify" if ANY condition can't be confirmed from intake data alone
2. **Protect Against Discouraging Low Scores** — scores below 40 lead with strengths, never use the word "low"
3. **Protect Against False Cost Certainty** — housing shown as ranges, tuition labeled estimated/confirmed
4. **Protect Against Overconfident School Rankings** — fit_label ("Strong match" / "Good match" / "Worth exploring") shown instead of raw scores
5. **Protect Against False Urgency** — deadlines within 14 days include urgency_note pointing to a specific helper, not panic language
6. **Protect Against Missing Options** — other_options_note always reminds that the tuition waiver applies at ALL AZ public schools
7. **Protect Privacy on Shared Devices** — housing_situation and income_status never echoed in summaries or key_insight
8. **Respect "I'd Rather Not Say"** — neutral defaults, no penalty, no inference

### V2 Additions Over V1
- **School Matching Rules** — weighted fit_score (financial 40%, support 25%, location 20%, goal 15%), returns top 3 with fit_label not raw score
- **Cost Breakdown Logic** — 12-step calculation: Pell first → tuition waiver covers remainder → ETV covers non-tuition → estimated_out_of_pocket
- **Semester Roadmap Rules** — phased timeline (pre-enrollment → semester 1 → semester 2 → 3+), each phase with tasks, dependencies, cost estimates, and funding summaries
- **Action Plan Dependency Rules** — 7 explicit ordering rules (documents first, FAFSA before waiver, etc.)
- **Score Deltas Rules** — integer deltas per step with unlocks[] array
- **Language Rules** — "you" not "the applicant", trauma-informed, never "low" for scores
- **Age-Specific Urgency** — age >= 22 flags the under-23 first-disbursement rule

### V2 Output JSON Schema
The prompt returns the full V2 schema including `school_matches[]`, `other_options_note`, `semester_roadmap`, and expanded `action_plan` with `urgency_note`, `estimated_time`, and `documents_needed[].how_to_get`.

```
ARIZONA PROGRAM DATABASE:
[Insert full arizona.json contents here at runtime]

ARIZONA SCHOOLS DATABASE:
[Insert full arizona-schools.json contents here at runtime]
```

---

## 6. TypeScript Interfaces (types.ts) — V2

```typescript
// ─── Intake ───────────────────────────────────────────
export interface IntakeFormData {
  age: number;
  state: string;
  educationGoal: string;
  timeline: 'still_in_care' | 'just_aged_out' | '3_12_months' | 'over_a_year';
  documents: string[];
  benefitsApplied: string[];
}

// ─── Readiness ────────────────────────────────────────
export interface ReadinessScore {
  overall: number;
  academic: { score: number; summary: string };
  financial_aid: { score: number; summary: string };
  application: { score: number; summary: string };
  timeline: { score: number; summary: string };
  overall_summary: string;
}

// ─── Financial Aid ────────────────────────────────────
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

// ─── School Matching (V2) ─────────────────────────────
export interface CostBreakdown {
  annual_tuition: number;
  pell_grant_applied: number;
  tuition_after_waiver: number;
  mandatory_fees: number;
  books_supplies: number;
  housing_estimate: number;
  transportation: number;
  personal: number;
  total_cost_of_attendance: number;
  etv_applied: number;
  other_scholarships: number;
  estimated_out_of_pocket: number;
  cost_note: string;
}

export interface FosterSupport {
  program_name: string;
  has_champion: boolean;
  contact: string;
  program_url: string;
  services: string[];
}

export interface HousingOptions {
  on_campus_available: boolean;
  on_campus_cost: number | null;
  avg_nearby_rent: number;
  housing_note: string;
}

export interface SchoolMatch {
  id: string;
  name: string;
  type: 'community_college' | 'university';
  fit_score: number;
  fit_label: 'Strong match' | 'Good match' | 'Worth exploring';
  fit_reasons: string[];
  cost_breakdown: CostBreakdown;
  foster_support: FosterSupport;
  housing_options: HousingOptions;
  why_this_school: string;
  source_urls: string[];
}

// ─── Semester Roadmap (V2) ────────────────────────────
export interface RoadmapTask {
  task: string;
  why: string;
  deadline: string | null;
  depends_on: string[] | null;
  estimated_time: string;
  help_from: string;
  category: 'financial' | 'academic' | 'housing' | 'administrative' | 'support';
}

export interface RoadmapPhase {
  name: string;
  phase_type: 'preparation' | 'active_semester' | 'summer' | 'graduation';
  tasks: RoadmapTask[];
  semester_cost_estimate: number | null;
  funding_applied: string;
}

export interface SemesterRoadmap {
  recommended_start: string;
  total_semesters_to_degree: number;
  based_on_school: string;
  phases: RoadmapPhase[];
}

// ─── Action Plan ──────────────────────────────────────
export interface ActionStep {
  step_number: number;
  title: string;
  why_this_is_next: string;
  deadline: string | null;
  days_until_deadline: number | null;
  urgency_note: string | null;
  documents_needed: Array<{ name: string; status: 'have' | 'need'; how_to_get?: string }>;
  specific_action: string;
  where_to_go: string;
  what_to_bring: string;
  estimated_time: string;
  confidence: 'certain' | 'high' | 'verify';
  verify_with: string;
  source_url: string;
}

// ─── Score Deltas ─────────────────────────────────────
export interface ScoreDelta {
  academic: number;
  financial_aid: number;
  application: number;
  timeline: number;
  overall: number;
  unlocks: number[];
}

// ─── Full Assessment Result (V2) ─────────────────────
export interface AssessmentResult {
  readiness: ReadinessScore;
  matched_programs: MatchedProgram[];
  school_matches: SchoolMatch[];
  other_options_note: string;
  action_plan: ActionStep[];
  semester_roadmap: SemesterRoadmap;
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
// 7. V2: max_tokens increased to 8000 (school matches + roadmap need more space)

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
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: JSON.stringify(intakeData) }]
  })
});
```

---

## 8. DashboardView Render Order — V2

The dashboard renders sections in this order, top to bottom:

```
1. Key Insight          — single most important message, personalized
2. Readiness Scores     — ReadinessSnapshot (4 ScoreRings + overall)
3. Financial Aid        — FinancialAidCards (matched programs with confidence badges)
4. School Matches       — SchoolMatches → SchoolMatchCard (top 3 with cost breakdowns)
5. Action Plan          — ActionPlan → ActionStep (sequenced, checkable, with deltas)
6. Semester Roadmap     — SemesterRoadmap (phased timeline with tasks)
7. PDF Export           — "Download Your Plan" button
```

**School Matches section (V2):**
- `SchoolMatches.tsx` renders the `other_options_note` and maps over `school_matches[]`
- `SchoolMatchCard.tsx` renders per school: fit_label badge, fit_reasons, cost_breakdown table, foster_support details, housing_options, why_this_school, and source links
- fit_label shown as colored badge: "Strong match" = teal, "Good match" = amber, "Worth exploring" = secondary
- Cost breakdown table: tuition → grants → waiver → fees → living → ETV → out of pocket

**Semester Roadmap section (V2):**
- `SemesterRoadmap.tsx` renders a vertical timeline of phases
- Each phase shows: name, phase_type icon, tasks list, semester_cost_estimate, funding_applied
- Tasks show category tag, estimated_time, help_from contact, and dependency chain

---

## 9. Build Order

### Phase 1 — Foundation
1. Install Tailwind CSS + shadcn/ui
2. Add Google Fonts (Playfair Display + DM Sans + DM Serif Display)
3. Define color palette in tailwind.config.ts
4. `src/lib/types.ts` — all interfaces (V2 expanded)
5. `src/lib/knowledge-base/arizona.json`
6. `src/lib/knowledge-base/arizona-schools.json` — V2 school profiles
7. `src/lib/claude.ts` — use `api-integration-specialist` skill
8. `src/lib/prompt.ts` — use `senior-prompt-engineer` skill (V2 prompt with 8 safeguards)
**Checkpoint: Claude API returns valid V2 JSON with school_matches + semester_roadmap**

### Phase 2 — Landing Page
9. `src/pages/Home.tsx` — cinematic hero
   - Use `frontend-design` + `ui-design-system` skills
   - Full-bleed path background, floating nav, Playfair Display headline, amber CTA
**Checkpoint: Landing page matches visual reference**

### Phase 3 — Intake Form
10. StepIndicator, all 5 field components, IntakeReview
    - Use `react-best-practices` + `senior-frontend` skills
11. Wire form → Claude API → loading skeleton
**Checkpoint: Form submits, skeleton loads**

### Phase 4 — Dashboard (Core)
12. ScoreRing, ScoreBar, ReadinessSnapshot
    - Use `senior-architect` for state wiring decisions
13. ConfidenceBadge, SourceCitation, AidCard, FinancialAidCards
14. ActionStep, ActionPlan, DashboardView (initial layout)
15. Wire score deltas on step completion (client-side only)
**Checkpoint: Core dashboard renders — readiness, aid, action plan, scores update on check**

### Phase 4.5 — School Matches + Semester Roadmap (V2)
16. `SchoolMatchCard.tsx` — single school card with cost breakdown table, fit_label badge, foster support, housing options
    - Use `frontend-design` + `ui-ux-pro-max` for cost table layout
17. `SchoolMatches.tsx` — maps school_matches[], renders other_options_note
18. `SemesterRoadmap.tsx` — vertical phased timeline with task cards
    - Use `senior-architect` for phase/task dependency rendering
19. Wire SchoolMatches + SemesterRoadmap into DashboardView (V2 render order)
**Checkpoint: Full V2 dashboard renders — all 7 sections visible, school cost breakdowns accurate**

### Phase 5 — Polish & Export
20. Score count-up animations + stagger reveal
21. PDF export — use `pdf-processing-pro` skill (V2: include school matches + roadmap in PDF)
22. Privacy banner, demo fallback, mobile responsive pass
23. Run `webapp-testing` skill to verify form → dashboard flow
**Checkpoint: PDF includes all V2 sections, mobile responsive, demo fallback works**

### Phase 6 — Deploy
24. Use `git-commit-helper` for clean commits
25. Push to GitHub → deploy to Vercel

---

## 10. Environment Variables

```
VITE_CLAUDE_API_KEY=your_key_here
```

---

## 11. Code Review Standards

After every file, run `code-reviewer` + `react-best-practices`:
- Functions > 30 lines → extract
- Duplicated logic > 2x → utility
- Any `any` TypeScript type → replace
- Missing async error handling → add
- Props > 3 without grouping → group into object

---

## 12. Ethical Design

- Every eligibility result: confidence + source URL + "verify with" contact
- Never "you should have" → always "here's where things stand"
- Financial aid shown BEFORE academic requirements
- School fit shown as labels ("Strong match"), NEVER raw scores — prevent false precision (Safeguard 4)
- Cost breakdowns distinguish confirmed vs estimated amounts (Safeguard 3)
- Housing costs shown as ranges, never single numbers presented as fact (Safeguard 3)
- Deadlines within 14 days include urgency_note with a specific helper contact (Safeguard 5)
- other_options_note always present — the 3 shown schools are not the only options (Safeguard 6)
- Sensitive fields (housing_situation, income_status) never echoed in summaries (Safeguard 7)
- "I'd rather not say" respected with neutral defaults, no penalty (Safeguard 8)
- PDF bridges AI → human caseworker, never replaces
- Privacy banner on every page
- Trauma-informed language — no shame, no blame
- Demo fallback if API fails — never let a broken API kill the demo
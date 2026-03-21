\# Vazhi — AI College Readiness Tool for Foster Youth

> வழி (vazhi) = "path" in Tamil

> \*\*Version 3.2\*\* — Tabbed lazy-load architecture with per-section API calls



\---



\## Version History



| Version | Commits | What shipped |

|---------|---------|-------------|

| V1 | `5535229` | Monolithic API → single scrolling dashboard. Score rings, financial aid cards, action plan, PDF. |

| V2 | `442c9ce` | School matching (3 schools + cost breakdowns), semester roadmap, 8 ethical safeguards, demo mode. Hit truncation bug (22k chars > 8k max\_tokens). |

| V3 | `1213d64` | \*\*Architecture redesign\*\*: 5 tabbed sections, lazy per-section API calls, independent failures, cached results. Fixed truncation. |

| V3.1 | `8436876` | Morning sprint: serverless proxy, contextual tab questions (TabQuestions.tsx), SectionIntro cards, font/design fixes, PDF partial data. |

| V3.2 | `efc4bc1` | Planned start semester in intake Step 3. PLANNED\_START\_RULES in prompt-base.ts. All prompts use it. |



\---



\## What's BUILT and Deployed (as of `efc4bc1`)



\### ✅ Landing Page

\- Cinematic hero with winding path SVG, parallax scroll

\- Floating nav pill, Playfair Display headline, amber CTA

\- "Try Demo" ghost pill + "Get My Plan →" primary CTA

\- "How It Works" 3-card section



\### ✅ Intake Form (6 steps)

\- Step 1: Age + State

\- Step 2: Education goal (CC / University / Trade / Online / Not sure)

\- Step 3: When left care + \*\*Planned start semester\*\* (Summer 2026 / Fall 2026 / Spring 2027 / Fall 2027 / Not sure)

\- Step 4: Documents on hand (6 checkboxes)

\- Step 5: Benefits already applied for

\- Step 6: Review with edit buttons

\- Timeline no longer pre-selected (fixed)



\### ✅ Tabbed Dashboard (5 tabs)

\- \*\*Tab Bar\*\*: `\[◎ Overview] \[$ Funding] \[⌂ Schools] \[✓ Action Plan] \[→ Roadmap]`

\- \*\*Overview\*\*: Auto-fires on intake submit. Score rings, key insight, slim funding summary.

\- \*\*Funding\*\*: On-demand. Full MatchedProgram cards with deadlines, source URLs, verify contacts.

\- \*\*Schools\*\*: On-demand + contextual questions (TabQuestions). 3 school cards with cost breakdowns, foster support, housing, fit\_label.

\- \*\*Action Plan\*\*: On-demand. Sequenced steps with score deltas, checkable completion.

\- \*\*Roadmap\*\*: On-demand. Semester timeline with phases, tasks, costs, funding summaries.

\- Tab switching is instant (cached results in App.tsx state)

\- Each section fails independently with per-section demo fallback



\### ✅ Serverless API Proxy

\- `api/assess.ts` — Vercel serverless function

\- CLAUDE\_API\_KEY server-side only (never exposed to browser)

\- Validates maxTokens against allowlist (2000/2500/3000/4000)

\- Client calls `/api/assess` instead of Anthropic directly



\### ✅ Per-Section Prompts

\- `src/lib/prompts/prompt-base.ts` — shared principles, 8 safeguards, PLANNED\_START\_RULES, SCORING\_RULES

\- `src/lib/prompts/overview-prompt.ts` — scoring + program IDs + safeguards 1,2,8

\- `src/lib/prompts/financial-prompt.ts` — full program DB + safeguards 1,5

\- `src/lib/prompts/schools-prompt.ts` — school DB + matching + safeguards 3,4,6

\- `src/lib/prompts/action-plan-prompt.ts` — dependency + delta rules + safeguard 5

\- `src/lib/prompts/roadmap-prompt.ts` — roadmap rules + safeguard 3



\### ✅ Demo Mode

\- "Try Demo" on landing page loads per-section demo data (DEMO\_OVERVIEW, DEMO\_FINANCIAL, etc.)

\- Amber "Demo Mode" banner on dashboard

\- Per-section fallback if any API call fails



\### ✅ Other

\- PDF export (jsPDF)

\- Score delta engine (client-side, no second API call)

\- Privacy banner on every page

\- vercel.json with SPA rewrites

\- 6 Playwright test scripts



\---



\## What's NOT YET BUILT (V3.2 remaining tasks)



\### 🔲 Deeper Intake Fields

\- Location in AZ (Phoenix Metro / East Valley / Tucson / Flagstaff / Other) → affects school matching

\- Has caseworker (Yes / No / Not sure) → affects action plan contacts

\- Housing situation (with "I'd rather not say") → affects cost estimates

\- Income status (with "I'd rather not say") → affects financial planning

\- These would add Steps 1b and 4 (Situation) to the intake



\### 🔲 School-Specific Roadmap Picker

\- Let user select which school to build roadmap around

\- Show matched schools as selectable cards

\- "Build My Roadmap for \[School Name] →"



\### 🔲 Per-Tab Contextual Questions (partially built)

\- TabQuestions.tsx component exists

\- Schools tab questions: priorities + transportation → 🔲 not yet wired to prompt

\- Roadmap tab questions: full/part-time + on/off campus → 🔲 not yet wired



\### 🔲 Design Polish

\- Font size sweep (15px body min, 24px headers)

\- Consistent card spacing/shadows across all tabs

\- Mobile responsiveness pass on tab bar

\- Creative roadmap design (path metaphor, phase icons)



\### 🔲 PDF Polish

\- Partial data support (only export generated sections)

\- Cover page with Vazhi branding

\- Time-bucketed action plan ("this week / this month / before enrollment")



\### 🔲 YouTube Video

\- 3-minute script ready (2 personas, real API, show safeguards)

\- Need to record after all polish is done



\---



\## Active Skills



| Skill | When to Use |

|-------|-------------|

| `frontend-design` | Any UI component, page, layout, or styling work |

| `code-reviewer` | After completing ANY file — never skip this |

| `react-best-practices` | Every React component — hooks, state, performance |

| `senior-frontend` | Component architecture, TypeScript patterns, Vite config |

| `senior-architect` | System design decisions, component wiring, state architecture |

| `api-integration-specialist` | claude.ts, serverless proxy, error handling, retry logic |

| `senior-prompt-engineer` | Writing and refining prompts in src/lib/prompts/ |

| `clean-code` | Refactoring, naming, function extraction |

| `ui-design-system` | Design tokens, visual consistency |

| `ui-ux-pro-max` | Color palette, accessibility, animations, spacing, tab design |

| `webapp-testing` | Testing intake form, dashboard tabs, score updates |

| `pdf-processing-pro` | PDF export |

| `git-commit-helper` | Commit messages |

| `brainstorming` | Before building any new feature |

| `senior-devops` | Vercel deploy, serverless functions |



\---



\## Architecture (V3)



```

User → Intake Form (6 steps, incl. planned\_start)

&#x20;        ↓

&#x20;    Dashboard → Overview Tab auto-fires (small API call via /api/assess)

&#x20;        ↓

&#x20;    ┌──────────────────────────────────────────────────────────────┐

&#x20;    │  \[◎ Overview] \[$ Funding] \[⌂ Schools] \[✓ Action Plan] \[→ Roadmap]  │

&#x20;    └──────────────────────────────────────────────────────────────┘

&#x20;        ↓                    ↓                ↓              ↓

&#x20;    Auto-loads          On-demand         On-demand      On-demand

&#x20;    \~2k tokens          \~1.5k tokens      \~3k tokens      \~2k tokens

```



\*\*Stack:\*\* React 19 + TypeScript + Vite 8 + Tailwind v4 + React Router v7 + Claude API via serverless proxy + jsPDF + Vercel



\---



\## Project Structure (Current)



```

vazhi/

├── api/

│   └── assess.ts                       # ✅ Serverless proxy

├── src/

│   ├── components/

│   │   ├── intake/

│   │   │   ├── IntakeForm.tsx          # 6 steps (planned\_start ✅)

│   │   │   ├── StepIndicator.tsx

│   │   │   ├── IntakeReview.tsx

│   │   │   └── fields/

│   │   │       ├── AgeStateField.tsx

│   │   │       ├── EducationGoalField.tsx

│   │   │       ├── TimelineField.tsx    # ✅ Includes planned\_start picker

│   │   │       ├── DocumentsField.tsx

│   │   │       └── BenefitsField.tsx

│   │   ├── dashboard/

│   │   │   ├── DashboardView.tsx       # Tabbed layout

│   │   │   ├── TabBar.tsx              # 5 tabs

│   │   │   ├── SectionIntro.tsx        # Pre-generation CTA card

│   │   │   ├── TabQuestions.tsx         # Contextual questions

│   │   │   ├── OverviewTab.tsx

│   │   │   ├── FinancialAidTab.tsx

│   │   │   ├── SchoolsTab.tsx

│   │   │   ├── ActionPlanTab.tsx

│   │   │   ├── RoadmapTab.tsx

│   │   │   ├── ReadinessSnapshot.tsx / ScoreRing.tsx / ScoreBar.tsx

│   │   │   ├── FinancialAidCards.tsx / AidCard.tsx

│   │   │   ├── SchoolMatchCard.tsx / SchoolMatches.tsx

│   │   │   ├── ActionPlan.tsx / ActionStep.tsx

│   │   │   └── SemesterRoadmap.tsx

│   │   └── shared/

│   │       ├── LoadingSkeleton.tsx / ConfidenceBadge.tsx / SourceCitation.tsx

│   ├── lib/

│   │   ├── claude.ts                   # Per-section fetch functions

│   │   ├── demo-data.ts               # Per-section demo data

│   │   ├── prompts/

│   │   │   ├── prompt-base.ts          # ✅ Includes PLANNED\_START\_RULES

│   │   │   ├── overview-prompt.ts

│   │   │   ├── financial-prompt.ts

│   │   │   ├── schools-prompt.ts

│   │   │   ├── action-plan-prompt.ts

│   │   │   └── roadmap-prompt.ts

│   │   ├── score-engine.ts / pdf-export.ts / types.ts

│   │   └── knowledge-base/

│   │       ├── arizona.json / arizona-schools.json

│   ├── pages/ Home.tsx / Intake.tsx / Dashboard.tsx

│   ├── App.tsx                         # Per-section state + callbacks

│   └── main.tsx / index.css

├── vercel.json                         # SPA rewrites + API routing

└── vite.config.ts / tailwind.config.ts / tsconfig\*.json

```



\---



\## Design System



```

Primary:    #0F6E56  (deep teal)       Accent:     #BA7517  (warm amber)

Success:    #3B6D11  (forest green)    Warning:    #D85A30  (coral)

Danger:     #A32D2D  (muted red)       Background: #FAFAF7  (warm off-white)

Surface:    #F5F3EE  (soft cream)      Text:       #1C1C1A  (near-black)

Secondary:  #6B6A65

```



NO dark mode. Min 44px touch targets. Skeleton loading per-section. Scores animate up.



\---



\## 8 Ethical Safeguards (in prompt-base.ts)



1\. Wrong Eligibility → confidence = "verify" if unconfirmable

2\. Discouraging Low Scores → lead with strengths, never say "low"

3\. False Cost Certainty → housing ranges, labeled estimates

4\. Overconfident Rankings → fit\_label not raw scores

5\. False Urgency → point to helper, not panic

6\. Missing Options → other\_options\_note always present

7\. Shared Device Privacy → housing/income never in summaries

8\. "I'd Rather Not Say" → neutral defaults, no penalty



\---



\## Ethical Design Rules



\- Navigator, not counselor — every result includes confidence + source + verify contact

\- Financial aid before academics — money first

\- "I'd rather not say" is first-class — Safeguards 7+8

\- PDF bridges AI → human caseworker handoff

\- Privacy banner on every page

\- Demo fallback per-section — never crash the demo

\- Trauma-informed language — no shame, no blame



\---



\## Environment Variables



```

\# Server-side (Vercel — used by api/assess.ts)

CLAUDE\_API\_KEY=sk-ant-...



\# Client-side (legacy fallback — being phased out)

VITE\_CLAUDE\_API\_KEY=sk-ant-...

```


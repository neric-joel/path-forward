---
name: presentation-builder
description: Build hackathon presentation scripts, slide outlines, and demo flow plans. Use before recording the YouTube demo video or preparing for live judging. Covers story structure, demo script timing, and slide content.
---

# Presentation Builder

## When to Use
- Before recording YouTube demo video
- Preparing for live judging Q&A
- Creating slide deck outline

## Demo Video Structure (3 minutes max)

### 0:00–0:15 — Hook
"800 foster youth age out in Arizona every year. Most leave $12,000+ on the table."
- Show a single stat on screen
- Voiceover only, no app yet

### 0:15–0:40 — Problem
Show the complexity: multiple programs, different deadlines, confusing eligibility
- Screenshot or list of programs (Pell Grant, ETV, Tuition Waiver, AHCCCS)
- Key point: eligibility is interconnected, sequencing matters, most youth don't know where to start

### 0:40–1:00 — Solution
"Path Forward uses AI to build a personalized college readiness plan in under a minute."
- Show the landing page (hero section, 3-step How It Works)
- Click "Get My Plan →"

### 1:00–2:20 — Demo
Walk through the full flow:
1. Fill intake form (speed run — 6 steps, show auto-advance on goal selection)
2. Show 3D loading animation (analyzing screen with rotating rings)
3. Overview dashboard: score rings, key insight, funding summary
4. Funding tab: click → loading → matched programs with confidence badges + deadlines
5. Schools tab: click → loading → 3 schools with cost waterfall (tuition minus aid)
6. Action Plan tab: auto-loads → step list → check a step, watch score update
7. Roadmap tab: select school, attendance + housing questions → semester stepper
8. Click "Download Your Plan (PDF)" → show PDF cover + tables

### 2:20–2:40 — Ethics
"We built 8 safeguards into every AI response."
- Show confidence badges ("Needs verification" vs "Very likely eligible")
- Show source URLs and verify contact numbers on aid cards
- Quote Safeguard 2: "We lead with strengths, never say 'low score'"
- Quote Safeguard 7: "Sensitive answers never appear in summaries"

### 2:40–3:00 — Impact
"If every foster youth in Arizona used Path Forward, that's $9.6M+ in unclaimed funding accessed each year."
- Calculation: 800 youth × $12,000 avg unclaimed = $9.6M
- CTA: "Try it at vazhii.vercel.app — it's free, private, and takes 2 minutes."

---

## Slide Outline (8 slides for live judging)

### Slide 1 — Title
- "Path Forward"
- Tagline: "AI-powered college readiness for foster youth in Arizona"
- vazhii.vercel.app

### Slide 2 — The Problem
- 800 Arizona foster youth age out each year
- $12,000+ in available funding per youth (Pell, ETV, Tuition Waiver)
- Most don't know where to start, which comes first, or if they even qualify
- Quote: "The system is designed for people who already know how to navigate the system"

### Slide 3 — Our Solution
- One sentence: "Path Forward is a 2-minute AI assessment that builds a personalized college funding plan"
- Screenshot: landing page hero
- 3 bullets: Intake → AI Analysis → Action Plan

### Slide 4 — How It Works
Visual: 3 columns
- "Tell us where you are" → intake form screenshot
- "See your funding" → matched programs screenshot
- "Get your roadmap" → semester stepper screenshot

### Slide 5 — Live Demo
Switch to app, or screenshot walkthrough
- Intake → Analyzing screen → Dashboard → PDF

### Slide 6 — Technical Architecture
```
Browser (React + TypeScript + Vite + Tailwind)
  ↓ /api/assess (Vercel serverless)
  ↓ Claude API (claude-sonnet-4-6)
  ↓ Per-section prompts with Arizona program data
  → Cached per tab, independent failures
```

### Slide 7 — Ethical Safeguards
8 safeguards embedded in every AI response:
1. Wrong Eligibility → confidence levels + verify contacts
2. Discouraging Language → leads with strengths, never uses "low"
3. False Cost Certainty → ranges, labeled estimates
4. Overconfident Rankings → fit labels, not raw scores
5. False Urgency → helper contacts, not panic
6. Missing Options → other_options_note always present
7. Shared Device Privacy → sensitive data excluded from summaries
8. "I'd Rather Not Say" → neutral defaults, no penalty

### Slide 8 — Impact & Next Steps
- Impact: $9.6M+ in unclaimed funding accessible per year
- Next: Other states, Spanish language, DCS caseworker integration
- Team + GitHub + Demo URL

---

## Judging Q&A Prep

### "What if the AI gives wrong eligibility info?"
Confidence levels (certain / likely / verify) on every program. Source URLs and verify contacts on every card. Users are always told to confirm directly. Safeguard 1 is built into every prompt.

### "Why not just a static website with program info?"
Static sites can't cross-reference eligibility. ETV requires age + foster status + FAFSA complete. The Tuition Waiver requires enrollment + age < 23 + FAFSA. The sequencing matters and is personalized to your specific situation.

### "What about data privacy?"
Nothing is stored. No accounts, no database, no analytics, no tracking. Everything runs in the browser. You can verify at devtools → Network → no external data calls.

### "How would you scale this?"
Same architecture works for any state — swap the Arizona program database for Texas/California/etc. Spanish language support via prompt localization. Partner with DCS offices for caseworker integration.

### "What's the business model?"
Nonprofit/grant-funded. Partners: DCS (Arizona Department of Child Safety), Casey Family Programs, Foster Care to Success. Potential: $1/plan fee, caseworker dashboard subscription.

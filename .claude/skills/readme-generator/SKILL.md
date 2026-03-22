---
name: readme-generator
description: Generate a professional README.md for Path Forward. Use when updating the repo README, preparing for hackathon submission, or creating project documentation. Covers project overview, features, tech stack, setup instructions, screenshots, and team info.
---

# README Generator

## When to Use
- Before hackathon submission
- After major feature changes
- When setting up the repo for public viewing

## What It Produces
A complete README.md with:
1. Project banner/logo area
2. One-line description + badges (React, TypeScript, Tailwind, Claude API, Vercel)
3. "What is Path Forward?" section — elevator pitch for foster youth college readiness
4. Screenshots section (placeholder paths for landing, dashboard, PDF)
5. Features list — organized by section (intake, overview, funding, schools, action plan, roadmap, PDF)
6. Tech Stack table (React 18, TypeScript, Vite, Tailwind, shadcn/ui, Claude API, jsPDF, Vercel)
7. Architecture diagram (text-based)
8. Getting Started — clone, install, env setup, run
9. Ethical Design section — the 8 safeguards
10. Demo link to deployed Vercel site
11. Team section
12. License
13. Hackathon info (HackASU 2026, Track 3: Economic Empowerment)

## Style
- Clean, minimal, no emoji overload
- Use badges from shields.io
- Code blocks for setup instructions
- Keep it scannable — judges spend 30 seconds on READMEs

## README Template

When generating, use this structure:

```markdown
# Path Forward

<p align="center">
  <strong>AI-powered college readiness for foster youth in Arizona</strong>
</p>

<p align="center">
  [badges here]
</p>

---

## What is Path Forward?

[Elevator pitch — 2-3 sentences]

## Live Demo

[Vercel URL]

## Screenshots

[landing | dashboard | pdf]

## Features

### Intake (6 steps)
- ...

### Dashboard (5 tabs)
- ...

### PDF Export
- ...

## Tech Stack

| Layer | Technology |
|-------|-----------|
| ... | ... |

## Architecture

[text diagram]

## Getting Started

[clone, install, env, run]

## Ethical Design

[8 safeguards]

## Hackathon

[event details]

## Team

[names]

## License

MIT
```

## Generation Instructions

When this skill is invoked:
1. Pull project details from CLAUDE.md (version, features, architecture)
2. Use the deployed URL: https://pathforward-az.vercel.app
3. Use the GitHub URL: https://github.com/neric-joel/path-forward
4. Generate complete, submission-ready README.md
5. Write directly to the project root README.md

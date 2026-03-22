---
name: git-workflow
description: Manage git commits, branches, and deployment for Path Forward. Use for clean commit messages, branch management, and Vercel deployment. Enforces conventional commits and clean git history.
---

# Git Workflow

## Remotes
- `origin` → https://github.com/neric-joel/vazhi.git (source of truth)
- `vercel-repo` → https://github.com/neric-joel/vazhii.git (Vercel deploy trigger)

Always push to both:
```bash
git push origin main && git push vercel-repo main
```

## Commit Convention
Format: `type(scope): description`

### Types
| Type | When |
|------|------|
| `feat` | New feature or component |
| `fix` | Bug fix |
| `style` | Visual/CSS-only changes |
| `refactor` | Code restructuring, no behavior change |
| `docs` | README, comments, CLAUDE.md |
| `test` | Playwright tests |
| `chore` | Build config, dependencies, env |

### Scopes
`landing` · `intake` · `dashboard` · `overview` · `funding` · `schools` · `action-plan` · `roadmap` · `pdf` · `api` · `prompts` · `shared`

### Examples
```
feat(dashboard): add bento grid overview layout
fix(roadmap): stepper label truncation on mobile
style(landing): switch to Space Grotesk headline font
refactor(intake): extract compact pill component
docs: update README for hackathon submission
chore: upgrade jspdf-autotable to 3.8
test(intake): add Playwright happy-path spec
```

## Branch Strategy
- `main` — always deployable, always passing build
- Feature branches only if multi-day work: `git checkout -b feat/bento-overview`
- For hackathon speed: commit directly to main, keep commits small + focused

## Pre-Push Checklist
Run before every push to vercel-repo:
```bash
npm run build          # Must pass with no TypeScript errors
```

Manual checks:
- [ ] Build passes clean (`npm run build`)
- [ ] Demo mode works: landing → Try Demo → all 5 tabs load with demo data
- [ ] PDF export downloads and opens
- [ ] No console errors in browser devtools
- [ ] Mobile responsive at 375px (Chrome devtools)
- [ ] Intake form: all 6 steps advance correctly
- [ ] Analyzing screen shows after intake submit

## Common Commands
```bash
# Status
git status
git log --oneline -10

# Stage and commit
git add src/components/dashboard/OverviewTab.tsx
git commit -m "feat(overview): add key insight card"

# Push both remotes
git push origin main && git push vercel-repo main

# Check what's different from last deploy
git diff HEAD~1 --stat

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

## Vercel Deployment
- Vercel auto-deploys on push to `vercel-repo` main
- Build command: `npm run build`
- Output dir: `dist`
- Environment variables set in Vercel dashboard:
  - `CLAUDE_API_KEY` — server-side only (used by api/assess.ts)
- Client-side fallback: `VITE_CLAUDE_API_KEY` in `.env.local` (never commit)

## .env.local (never commit)
```bash
# Local dev only — bypasses serverless proxy
VITE_CLAUDE_API_KEY=sk-ant-api...
```

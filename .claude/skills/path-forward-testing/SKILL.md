---
name: path-forward-testing
description: Test Path Forward with Playwright. Use for E2E testing of intake form, dashboard tabs, score updates, demo mode, and PDF export. Includes test personas and critical user flows for the Path Forward app specifically.
---

# Path Forward — Webapp Testing

## Test Personas

### Maria — Standard flow
- Age: 19, State: Arizona
- Just aged out (0–3 months)
- Goal: Community College
- Has: State ID, Social Security Card, Diploma
- Benefits: FAFSA complete
- Expected: High confidence for Pell Grant + ETV, eligible for Tuition Waiver

### James — Edge case: age pressure
- Age: 22, State: Arizona
- Over a year out
- Goal: University
- Has: All documents
- Benefits: None applied yet
- Expected: Age 22+ warning on step 1, urgent action plan for Tuition Waiver (must apply before 23)

### Ava — Minimal data
- Age: 17, State: Arizona
- Still in foster care
- Goal: Not sure yet
- Has: Nothing checked
- Benefits: Nothing applied
- Expected: Lower scores, strong guidance toward FAFSA first, document checklist

## Critical Flows

### Flow 1: Full happy path (Maria)
```
Landing → "Get My Plan" → Intake (all 6 steps) → Submit →
Analyzing screen → Overview tab loads →
Click Funding tab → questions → generate → results →
Click Schools tab → generate → results →
Click Action Plan tab → auto-generates →
Click Roadmap tab → select school → generate → results →
Click "Download Your Plan (PDF)" → file downloads
```

### Flow 2: Demo mode
```
Landing → "Try Demo" → Analyzing screen (brief) →
Dashboard with amber "Demo Mode" banner →
All 5 tabs pre-populated with demo data (instant, no API call) →
PDF export uses demo data
```

### Flow 3: Score updates (Action Plan)
```
Action Plan tab → results loaded →
Note the current score values →
Check step 1 checkbox → scores increase →
Uncheck step 1 → scores revert to original
```

### Flow 4: Logo navigation
```
Dashboard (any tab) → click "Path Forward" logo in header →
Lands on homepage (/) →
Back button → returns to dashboard
```

### Flow 5: Mobile (375px viewport)
```
Set viewport to 375px →
Landing page → hero text readable, CTAs accessible (min 44px) →
Intake form → all steps fit in viewport, no horizontal scroll →
Dashboard → tab bar scrollable or wraps, content readable
```

## Run Tests

```bash
# Start dev server first
npm run dev

# All tests
npx playwright test

# Watch mode (headed browser)
npx playwright test --headed

# Single spec
npx playwright test tests/happy-path.spec.ts

# Debug mode (step through)
npx playwright test --debug

# Generate report
npx playwright show-report
```

## Writing New Tests

Use the webapp-testing skill pattern — recon first, then act:

```typescript
import { test, expect } from '@playwright/test';

test('demo mode loads all tabs', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');

  // Click Try Demo
  await page.click('button:has-text("Try Demo")');
  await page.waitForLoadState('networkidle');

  // Verify demo banner
  await expect(page.locator('text=Demo Mode')).toBeVisible();

  // Verify overview tab content
  await expect(page.locator('[aria-label*="score"]').first()).toBeVisible();
});
```

## Key Selectors
- Logo: `a[aria-label="Path Forward home"]`
- Tab buttons: `button:has-text("Funding")`, `button:has-text("Schools")` etc.
- Intake next: `button:has-text("Continue")`
- Intake submit: `button:has-text("Get My Plan")`
- Generate buttons: `button:has-text("Generate")`
- PDF button: `button:has-text("Download")`
- Demo banner: `text=Demo Mode`
- Age input: `input[type="number"]`
- State select: `select`

## Environment
- Local dev: `http://localhost:5173`
- Production: `https://vazhii.vercel.app`
- Demo mode: click "Try Demo" on landing page

## Server Setup with with_server.py
```bash
python .claude/skills/webapp-testing/scripts/with_server.py \
  --server "npm run dev" --port 5173 \
  -- python my_test_script.py
```

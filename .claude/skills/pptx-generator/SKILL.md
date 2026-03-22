---
name: pptx-generator
description: Generate PowerPoint presentations for Path Forward using python-pptx. Use when creating hackathon pitch decks, demo slides, or presentation materials. Creates professional .pptx files with the Path Forward design system.
---

# PPTX Generator

## When to Use
- Creating hackathon pitch deck
- Building demo presentation slides
- Generating visual aids for judging

## Prerequisites
```bash
pip install python-pptx --break-system-packages
```

## Design System for Slides
- Background: White (#FAFAF7) → use RGB(250, 250, 247)
- Title font: Calibri Bold (closest to Space Grotesk in PowerPoint)
- Body font: Calibri Regular
- Colors:
  - Teal: #0F6E56 → RGB(15, 110, 86)
  - Amber: #BA7517 → RGB(186, 117, 23)
  - Ink: #1A2A22 → RGB(26, 42, 34)
  - Sage: #5C6B63 → RGB(92, 107, 99)
  - Light cream: #F5F2EC → RGB(245, 242, 236)
- Slide dimensions: Widescreen 16:9 (13.33" × 7.5")

## Slide Templates

### 1. Title Slide
- Background: Teal (#0F6E56) full bleed
- Title: "Path Forward" — Calibri Bold 54pt, white, centered
- Subtitle: tagline — Calibri 24pt, light teal (RGB 180,230,215), centered
- Amber accent bar (8pt height) below subtitle
- Bottom: URL + event name in small white text

### 2. Problem Slide
- Background: White
- Teal header bar (40px) with white slide title
- Big stat number: e.g. "800" — Calibri Bold 96pt, Teal
- Stat label: Calibri 20pt, Ink
- Body text: Calibri 16pt, Sage, left-aligned

### 3. Solution Slide
- Background: White
- Teal header bar
- Left column (55%): text content
- Right column (45%): screenshot placeholder (rounded rect, cream fill)

### 4. How It Works Slide
- 3-column grid
- Each column: number (Teal, 48pt) + title (Bold 18pt) + description (14pt Sage)
- Amber accent dots between columns

### 5. Architecture Slide
- Dark background (Ink #1A2A22)
- Monospace font (Courier New 14pt, light teal text)
- Code-style box showing the system flow

### 6. Ethics Slide
- White background
- 8 items in 2×4 grid
- Each: number badge (Teal circle) + short title + one-line description

### 7. Impact Slide
- Teal background (full bleed)
- Big number: "$9.6M+" — white, Calibri Bold 72pt
- Subtitle: "in unclaimed funding accessed per year" — white 24pt
- CTA bar at bottom: amber background, white text

### 8. Thank You Slide
- White background
- "Path Forward" title (Teal, 48pt)
- Team names, GitHub URL, demo URL
- QR code placeholder

## Python Script Template

When this skill is invoked, generate and run a Python script:

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

# Colors
TEAL = RGBColor(15, 110, 86)
AMBER = RGBColor(186, 117, 23)
INK = RGBColor(26, 42, 34)
SAGE = RGBColor(92, 107, 99)
WHITE = RGBColor(255, 255, 255)
CREAM = RGBColor(250, 250, 247)

prs = Presentation()
prs.slide_width = Inches(13.33)
prs.slide_height = Inches(7.5)

# Add slides using blank layout
blank_layout = prs.slide_layouts[6]

# --- Add slides following the templates above ---

prs.save('path-forward-pitch.pptx')
print("Saved: path-forward-pitch.pptx")
```

## Generation Instructions

When this skill is invoked:
1. Ask: "Full 8-slide deck, or specific slides?"
2. Generate the Python script with all slides
3. Run with: `python generate_pptx.py`
4. Output file: `path-forward-pitch.pptx` in project root
5. Open and verify slide count + content

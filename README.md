# HGUGM Surgical Residency Course

**Evidence-based surgical education for HGUGM residents — Hospital General Universitario Gregorio Marañón, Madrid**

A static, mobile-first, offline-capable Progressive Web App (PWA) for surgical residents. Runs entirely from GitHub Pages — no server, no login, no cost, no maintenance.

---

## Quick Start

### Live Site

> **GitHub Pages URL will be shown here after first deployment.**

After pushing to GitHub and enabling GitHub Pages (Settings → Pages → Source: GitHub Actions), the site deploys automatically on every push to `main`.

### Local Development

No build tools required — it's plain HTML + CSS + JavaScript.

```bash
# Serve locally (any static server works)
npx serve .
# or
python3 -m http.server 8080
```

Open `http://localhost:8080` in your browser.

---

## Architecture

```
surgical-residency-course/
├── index.html                    # SPA shell — all navigation via hash routing
├── manifest.json                 # PWA manifest
├── sw.js                         # Service worker — cache-first, offline support
├── assets/
│   ├── css/main.css              # Full design system (CSS custom properties)
│   └── js/
│       ├── app.js                # Router, views, curriculum manifest
│       ├── reader.js             # Chapter renderer — all 8 block types
│       ├── quiz.js               # Consolidation quiz — tutor mode with explanations
│       ├── progress.js           # localStorage progress tracking
│       ├── search.js             # Lunr.js full-text search
│       └── knowledge.js          # Daily pearls and knowledge base
├── content/
│   ├── chapters/                 # 18 chapter JSON files (A1–A6, B1–B4, C1–C8)
│   └── pearls/daily_pearls.json  # 20 daily clinical pearls
└── assets/img/
    ├── logo.svg                  # HGUGM logo
    └── diagrams/                 # 6 anatomically accurate SVG diagrams
        ├── tme_planes.svg
        ├── liver_segments.svg
        ├── research_pyramid.svg
        ├── pico_framework.svg
        ├── tnm_staging_colorectal.svg
        └── gastric_lymph_nodes.svg
```

### Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Vanilla HTML/CSS/JS | Zero dependencies, zero build tools, GitHub Pages compatible |
| Routing | Hash-based SPA (`#/`, `#/chapter/:id`) | No server-side routing required |
| Typography | Georgia serif (body), system-ui (UI) | Reading-optimised at 780px max width |
| Markdown | marked.js 9.1.6 via CDN | Lightweight MD rendering in text blocks |
| Search | lunr.js 2.3.9 via CDN | Client-side full-text search |
| Charts | Chart.js 4.4.1 via CDN | Progress visualisation |
| Persistence | localStorage (`surgres_progress`) | Zero backend, works offline |
| PWA | Service Worker + manifest.json | Installable, cache-first, offline |
| Deployment | GitHub Actions → GitHub Pages | Automatic on push to main |

---

## Curriculum — 18 Chapters

### Block A — Surgical Oncology (PGY2–4)
| ID | Chapter | Level |
|----|---------|-------|
| A1 | Oncology Principles | PGY2-3 |
| A2 | Colorectal Surgery | PGY2-3 |
| A3 | Gastric Surgery | PGY2-3 |
| A4 | HPB Surgery | PGY3-4 |
| A5 | Breast Surgery & Oncology | PGY2-3 |
| A6 | Sarcoma & Peritoneal Oncology | PGY3-4 |

### Block B — General Surgery (PGY1–3)
| ID | Chapter | Level |
|----|---------|-------|
| B1 | Emergency Surgery | PGY1-2 |
| B2 | Hernia Surgery | PGY1-2 |
| B3 | Bariatric & Metabolic Surgery | PGY2-3 |
| B4 | Endocrine Surgery | PGY2-3 |

### Block C — Academic Surgery (PGY1–4)
| ID | Chapter | Level |
|----|---------|-------|
| C1 | Hypothesis & Research Design | PGY1-2 |
| C2 | Study Design | PGY2-4 |
| C3 | Biostatistics for Surgeons | PGY2-4 |
| C4 | Surgical Databases & Registries | PGY2-4 |
| C5 | Scientific Writing | PGY2-4 |
| C6 | Peer Review & Publication | PGY2-4 |
| C7 | Systematic Review & Meta-Analysis | PGY3-4 |
| C8 | Critical Appraisal | PGY2-4 |

---

## Chapter JSON Format

Each chapter is a self-contained JSON file. The schema:

```json
{
  "id": "A1",
  "title": "Chapter Title",
  "subtitle": "Block — Specific Subtitle",
  "block": "A",
  "block_name": "Surgical Oncology",
  "level": "PGY2-3",
  "reading_time_min": 45,
  "guidelines_version": "NCCN 2024 · ESMO 2023",
  "textbook_refs": ["..."],
  "learning_objectives": ["..."],
  "sections": [
    {
      "id": "A1-S1",
      "title": "Section Title",
      "blocks": [
        { "type": "text", "content": "**Markdown** supported text." },
        { "type": "table", "title": "...", "headers": ["..."], "rows": [["..."]] },
        { "type": "callout", "variant": "pearl|warning|clinical|guideline|trial", "title": "...", "content": "..." },
        { "type": "figure", "src": "assets/img/diagrams/xxx.svg", "caption": "..." },
        { "type": "landmark_trial", "name": "...", "citation": "...", "population": "...", "intervention": "...", "result": "...", "practice_change": "..." }
      ]
    }
  ],
  "consolidation": {
    "intro": "Test your knowledge.",
    "questions": [
      {
        "id": "A1-Q1",
        "stem": "Clinical vignette question stem...",
        "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
        "correct": "B",
        "explanation": {
          "correct": "Why B is correct...",
          "wrong": { "A": "...", "C": "...", "D": "..." },
          "guideline": "Guideline reference...",
          "trial": "Landmark trial reference...",
          "pearl": "Clinical pearl..."
        }
      }
    ]
  }
}
```

### Callout Variants

| Variant | Colour | Use for |
|---------|--------|---------|
| `pearl` | Gold | Board pearls, high-yield facts |
| `warning` | Orange | Common pitfalls, errors to avoid |
| `clinical` | Teal | Clinical decision points |
| `guideline` | Navy | Guideline recommendations |
| `trial` | Purple | Landmark trial summaries |

---

## Adding a New Chapter

1. Create `content/chapters/XX_title.json` following the schema above
2. Add the chapter to the `CURRICULUM` array in `assets/js/app.js`
3. Add the filename mapping to `CHAPTER_FILES` in `assets/js/app.js` (line ~286)
4. Add the file to the `PRECACHE_ASSETS` list in `sw.js`
5. Push to `main` — GitHub Actions deploys automatically

---

## Guidelines Covered

- NCCN Breast Cancer v5.2024 · ESMO Breast 2023 · St Gallen 2023
- NCCN Colorectal 2024 · ESMO CRC 2023 · ESMO Peritoneal 2023
- IFSO/ASMBS Bariatric 2022 · WSES Jerusalem Guidelines 2022
- EHS Hernia Guidelines 2018 · HerniaSurge 2018
- ATA Thyroid 2015 · ETA 2023 · AAES 2016
- TARPSWG Retroperitoneal Sarcoma 2023
- CONSORT 2010 · STROBE 2007 · PRISMA 2020 · GRADE 2013
- ICMJE Recommendations 2023 · COPE 2022

---

## Author

**Dr. Pablo Lozano Lominchar, MD, PhD, EBPSM**  
Consultant Surgeon — CRS/HIPEC & Peritoneal Oncology  
Hospital General Universitario Gregorio Marañón, Madrid, Spain

---

## Licence

Educational content — HGUGM internal use. All clinical content is based on published guidelines and landmark trials cited within each chapter. Not for commercial distribution.

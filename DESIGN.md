# DESIGN.md: PDF Tools (Hole Money Architectural Workbench Direction)

## Design Read
Reading this as: Multi-tool PDF & OCR document workbench for Indonesian students, educators, and academic staff, in a Hole Money architectural paper-and-ink minimalist language, dial ENERGY 2 / RHYTHM 2 / MOTION 2.

## Three Dials
- **ENERGY 2**: Quiet editorial authority on a warm archival stone-paper canvas paired with tactile obsidian primary actions and one deliberate cobalt accent.
- **RHYTHM 2**: Structured variation across bands: centered Hole Money hero + double-rimmed interactive workbench command frame -> 12-column asymmetric category index ledgers -> 2-column technical and privacy specification table.
- **MOTION 2**: Crisp transitions on border state, card elevation, and drag-and-drop zones, strictly gated behind `@media (prefers-reduced-motion: reduce)`.

## Identity Motif (Hole Money Reference: `hole-money-finance-manager`)
1. **Warm Archival Paper Canvas with Vertical Column Rules**: Light canvas `#EAEAE6` (and Dark ink canvas `#111110`) crossed by hairline vertical structural columns (`calc(100vw / 6)`) and subtle archival paper grain.
2. **Left-Edge Precision Ruler**: Fixed left-margin scale ticks (`.hm-ruler`) with a cobalt center marker, referencing physical document margins and Hole Money's measuring-instrument aesthetic.
3. **Monumental Editorial Serif + Hand-Drawn Cobalt Underline**: `Newsreader` display typography anchored by a curved `#2B3AE8` SVG underline beneath "Sepenuhnya gratis".
4. **Double-Rimmed Drafting Table Frame (`.hm-frame` / `.hm-sheet`)**: Tactile nested container framing the tool command bar and each active document workbench.

## Palette & Contrast Verification (`R-25`, `R-29`)
Palette cap: 2 Core Neutrals (Warm Paper + Deep Obsidian Ink) + 1 Deliberate Accent (Architectural Cobalt).

### Light Mode
- Canvas (`--background`): `#EAEAE6` (`HSL 60 9% 91%`)
- Elevated Sheet (`--card` / `--popover`): `#F7F7F4` (`HSL 60 18% 96.3%`)
- Secondary Surface (`--secondary` / `--muted`): `#DFDFD9` (`HSL 60 9% 86.3%`)
- Primary Ink (`--foreground` / `--primary`): `#141413` (`HSL 60 3% 7.6%`) - Contrast **15.30:1** on `#EAEAE6` (AAA), **17.22:1** on `#F7F7F4` (AAA)
- Secondary Ink (`--muted-foreground`): `#52524E` (`HSL 60 3% 31.4%`) - Contrast **6.47:1** on `#EAEAE6` (AA), **7.28:1** on `#F7F7F4` (AAA)
- Deliberate Cobalt Accent (`--accent-cobalt` / `--ring`): `#2B3AE8` (`HSL 235 80% 54%`) - Contrast **6.75:1** on `#F7F7F4` (AA); white `#FFFFFF` on `#2B3AE8` is **7.24:1** (AAA)
- Interactive Control Border (`--input`): `#787872` (`HSL 60 3% 46%`) - Non-text contrast **4.10:1** on `#F7F7F4` (PASS WCAG 1.4.11)

### Dark Mode (`.dark`, via Header theme toggle)
- Canvas (`--background`): `#111110` (`HSL 60 3% 6.5%`)
- Elevated Sheet (`--card` / `--popover`): `#1A1A18` (`HSL 60 4% 10%`)
- Secondary Surface (`--secondary` / `--muted`): `#252522` (`HSL 60 4% 14%`)
- Primary Ink (`--foreground` / `--primary`): `#F2F2EE` (`HSL 60 14% 94%`) - Contrast **16.80:1** on `#111110` (AAA), **15.42:1** on `#1A1A18` (AAA)
- Secondary Ink (`--muted-foreground`): `#A7A79F` (`HSL 60 5% 64%`) - Contrast **7.86:1** on `#111110` (AAA), **7.22:1** on `#1A1A18` (AAA)
- Deliberate Cobalt Accent (`--accent-cobalt` / `--ring`): `#8090FF` (`HSL 233 100% 75%`) with `#141413` foreground - Contrast **5.98:1** on `#1A1A18` (AA); dark ink `#141413` on `#8090FF` is **6.36:1** (AA)
- Interactive Control Border (`--input`): `#787872` (`HSL 60 3% 46%`) - Non-text contrast **3.94:1** on `#1A1A18` (PASS WCAG 1.4.11)

## Purpose-Gate Written Reasons (`R-31`)
- **R-01 (No default ambient gradients)**: All blue-to-blue and blue-to-yellow AI template gradients were removed in favor of solid warm paper surfaces and high-contrast obsidian/cobalt fills so typography and interactive controls remain legible at every pixel.
- **R-04 (Icons)**: Lucide line glyphs are used strictly inside tool cards, file upload dropzones, and action triggers as functional format/tool signifiers (merge, split, lock, OCR), while all decorative emoji (lock and checkmark glyphs) were eliminated.
- **R-06 (Typography: `Newsreader` + `Plus Jakarta Sans` + `JetBrains Mono`)**: `Newsreader` supplies Hole Money's editorial warmth and prestige for headlines, `Plus Jakarta Sans` provides clean Indonesian UI legibility at all body sizes, and `JetBrains Mono` aligns document indices, file format tags, and upload progress percentages.
- **R-07 (Architectural background rules, left-edge ruler ticks, and archival grain)**: Vertical hairline column rules (`calc(100vw / 6)`), fine paper texture, and margin ruler ticks physically evoke a manuscript drafting table and page-layout grid tailored to PDF workflows.
- **R-08 (No decorative arrows on every button)**: Primary CTAs and tool cards use clear Indonesian action verbs and a bottom monospace specification line instead of repetitive trailing arrow glyphs.
- **R-09 (Functional spec tags only)**: Monospace tags inside category headers and flagship cards indicate real operational scope (e.g., `18 ALAT AKTIF`, `MULTI-PDF`, `MAX 50 MB`) rather than generic hype pills.
- **R-10 (Zero multi-layer glassmorphism)**: Frosted translucency is avoided on cards and modals; only a subtle solid/high-opacity sticky header bar separates scrolling content.
- **R-12 (Selective frame elevation)**: Most directory sheets sit flat on `1px` borders; shadow is reserved strictly for the outer Hole Money workbench frame (`.hm-frame`) and the primary cobalt centerpiece emblem.
- **R-14 (Hierarchy across 18 tools)**: Flagship academic tools (`Gabungkan PDF`, `Word ke PDF`, `PDF ke Word`, `Kunci PDF`, `OCR PDF`) span 2 columns in desktop category grids with workflow specification labels so users scan 18 workflows quickly without copy-paste card fatigue.
- **R-19 (Purposeful micro-transitions)**: Hover border shifts, subtle drag-over highlight in `Dropzone`, and smooth accordion expansion respond strictly to direct user interaction and halt under `prefers-reduced-motion: reduce`.

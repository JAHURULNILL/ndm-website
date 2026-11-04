---
name: Recording Desk
description: A measured desktop-download interface built from light enamel, dark ink, steel rails, walnut trim, and restrained signal red.
colors:
  canvas: "#f4ecd6"
  wood: "#211914"
  wood-mid: "#403326"
  wood-light: "#604930"
  face: "#fffdf8"
  face-light: "#f8f3e8"
  face-dim: "#ebe2d2"
  ink: "#1c1a16"
  ink-soft: "#514b42"
  text: "#211c16"
  text-dim: "#5b5348"
  steel: "#7c8789"
  steel-light: "#c8cecc"
  line-dark: "#a99e8c"
  line-light: "#d4cbbd"
  signal: "#bd4032"
  signal-deep: "#a93e31"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(3.55rem, 7vw, 6.2rem)"
    fontWeight: 600
    lineHeight: 0.97
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 4.8vw, 4.35rem)"
    fontWeight: 600
    lineHeight: 0.99
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.65rem"
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "General Sans, Segoe UI, sans-serif"
    fontSize: "clamp(0.98rem, 0.95rem + 0.14vw, 1.08rem)"
    fontWeight: 400
    lineHeight: 1.58
  label:
    fontFamily: "General Sans, Segoe UI, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.075em"
  mono:
    fontFamily: "SFMono-Regular, Consolas, Liberation Mono, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  square: "0px"
  status-dot: "50%"
spacing:
  gutter: "clamp(20px, 5vw, 72px)"
  section: "clamp(76px, 9vw, 132px)"
  section-small-screen: "74px"
  panel: "clamp(24px, 4vw, 48px)"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "#fff8ed"
    rounded: "{rounded.square}"
    padding: "12px 18px 12px 21px"
    height: "58px"
  button-primary-hover:
    backgroundColor: "{colors.signal-deep}"
    textColor: "#fff8ed"
    rounded: "{rounded.square}"
  platform-selected:
    backgroundColor: "{colors.signal}"
    textColor: "#fff8ed"
    rounded: "{rounded.square}"
    padding: "8px 17px"
    height: "44px"
  release-panel:
    backgroundColor: "{colors.face}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "clamp(24px, 4vw, 48px)"
  navigation:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-dim}"
    rounded: "{rounded.square}"
    height: "78px"
  package-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "14px 0 13px"
---

# Design System: Recording Desk

## Overview

**Creative North Star: "Recording Desk"**

Recording Desk treats the interface as a calm, physical control surface: light warm enamel and cream surfaces carry the field, dark ink keeps information readable, steel frames the evidence, walnut appears only as small trim or mark-making, and a small amount of signal red marks action or status. It is dense enough to feel instrument-like, but the hierarchy remains factual and open rather than ornamental. Condensed display lettering supplies the calibrated scale; General Sans keeps explanation and controls direct; mono is reserved for filenames, hashes, and other actual data.

Depth comes from layered light surfaces and structural rules more than decoration. Square or near-square silhouettes, measured dividers, and restrained state changes make the system feel assembled and dependable. The visual language is page-level and reusable across related surfaces without prescribing any one landing-page composition. A compact dark code sample and the genuine NDM screenshot are functional exceptions for code legibility and product proof, not the page theme.

**Key Characteristics:**
- Light cream and warm-enamel surfaces dominate, with dark ink and steel rails for structure.
- Walnut is accent/trim only; no large dark page surfaces.
- Condensed display hierarchy paired with an uncluttered sans UI voice.
- Data-aware mono treatment for filenames, hashes, and the compact code sample only.
- Tactile, square-edged controls with restrained signal-red emphasis.

## Colors

The palette is a light warm-instrument range: cream canvas and enamel faces carry the page, dark ink supplies contrast, steel provides hardware-like structure, walnut is reserved for small trim, and signal red stays scarce and functional.

### Primary
- **Calibrated Signal Red** (`{colors.signal}`): The principal action and active-status accent; use sparingly for decisive controls, selected platform indicators, and completion/error emphasis.
- **Deep Signal Red** (`{colors.signal-deep}`): The darker interaction state for signal-red actions, links, and focus treatment.

### Secondary
- **Brushed Steel** (`{colors.steel}`) and **Light Steel** (`{colors.steel-light}`): Hardware-like rails, proof framing, utility bands, and neutral structural contrast.

### Tertiary
- **Walnut Trim** (`{colors.wood}`), **Walnut Mid** (`{colors.wood-mid}`), and **Walnut Light** (`{colors.wood-light}`): Small marks, brand detail, and restrained trim only; never the dominant page field.

### Neutral
- **Cream Canvas** (`{colors.canvas}`): Dominant page, header, footer, and mechanism background.
- **Warm Enamel** (`{colors.face}`) and **Light Enamel** (`{colors.face-light}`): Release/catalog/FAQ surfaces, controls, skip treatment, and readable light content.
- **Dim Enamel** (`{colors.face-dim}`): Capabilities surface and platform-control tray.
- **Instrument Ink** (`{colors.ink}`) and **Soft Ink** (`{colors.ink-soft}`): Primary and supporting text on light surfaces.
- **Warm Text** (`{colors.text}`) and **Dim Warm Text** (`{colors.text-dim}`): Secondary text hierarchy on the cream canvas.
- **Dark Rule** (`{colors.line-dark}`) and **Light Rule** (`{colors.line-light}`): Structural dividers matched to light surfaces.

**The Light Field Rule.** Light surfaces dominate; walnut is accent/trim only, and no large dark page surface is permitted. The compact dark code sample and genuine NDM screenshot remain functional exceptions.

**The Signal Rarity Rule.** Signal red is a functional accent, not a wallpaper color: reserve it for action, status, and meaningful emphasis.

## Typography

**Display Font:** Barlow Condensed (with Arial Narrow, sans-serif fallback)
**Body Font:** General Sans (with Segoe UI, sans-serif fallback)
**Label/Mono Font:** General Sans for UI labels; SFMono-Regular, Consolas, Liberation Mono for filenames, hashes, and the compact code sample.

**Character:** Barlow Condensed gives headings a compact, instrument-panel authority without becoming retro display type. General Sans keeps descriptions, navigation, and controls plainspoken; mono is deliberately evidentiary rather than decorative.

### Hierarchy
- **Display** (600, `clamp(3.55rem, 7vw, 6.2rem)`, 0.97): Large page-level statements and primary display moments.
- **Headline** (600, `clamp(2.6rem, 4.8vw, 4.35rem)`, 0.99): Section headings that act as readable panel labels.
- **Title** (600, `1.65rem`, 1.1): Component and subsection headings.
- **Body** (400, `clamp(0.98rem, 0.95rem + 0.14vw, 1.08rem)`, 1.58): Explanatory copy and default document text.
- **Label** (700, `0.72rem`, `0.075em`, uppercase where used): Instrument metadata, status bands, and compact utility labels.
- **Mono data** (400, `0.72rem`, 1.4): Filenames, hashes, and code/data strings only.

**The Two-Voice Rule.** Use Barlow Condensed for hierarchy and General Sans for operating the interface; do not use the display face for body copy or mono for atmosphere.

## Layout

The shared shell is capped at `1280px` and uses fluid inline gutters of `clamp(20px, 5vw, 72px)`. Section rhythm is `clamp(76px, 9vw, 132px)` on larger screens and `74px` on small screens. Content uses structured grids, ledger rows, and aligned rules rather than card grids by default.

The observed responsive breakpoints are `1100px`, `900px`, `680px`, `420px`, and `360px`. At `1100px` and above, major opening content can use a two-column split; below that it progressively compresses, and at `680px` it stacks into one column with 20px gutters. Small screens preserve usable 44px control targets, make the platform control full width, and keep the primary action prominent. At `900px`, package rows reflow their identity, size, download, and hash disclosure into a readable sequence; at `420px` and `360px`, metadata and opening spacing tighten further.

The first fold presents a coherent Windows selection with `Universal installer`, `Download for Windows`, `NDM_2.3.1_setup.exe`, and the direct optional extension download action in the release-panel footer alongside the platform/package context. The catalogue retains five desktop packages plus one separate optional Chrome/Firefox extension row.

## Elevation & Depth

This system is layered rather than shadow-heavy. Cream canvas, warm enamel, steel, walnut trim, and rule colors do most of the depth work; shadows are reserved for large instrument panels or product-proof frames where a physical lift clarifies the boundary. The release panel uses `0 18px 38px rgba(46, 34, 19, 0.14)`, and the mechanism proof frame uses `0 16px 32px rgba(46, 34, 19, 0.14)`. Do not add ambient shadows to ordinary rows, links, or navigation.

**The Structural Depth Rule.** Establish hierarchy with light surface changes and measured borders first; use a shadow only when a large framed object needs to separate from the field.

## Shapes

Corners are square by default (`0px`); the only recurring rounded silhouette is a small status dot (`50%`). Structural borders, enamel layers, and clipped panel edges carry the material character. The release console and proof frames hide overflow where their frame needs a clean edge. Focus is a `3px` solid `{colors.signal-deep}` ring with `4px` offset, visible on keyboard focus without changing the component silhouette.

## Components

### Buttons
- **Shape:** Square, tactile rectangles (`0px`) with minimum heights of 44px for compact controls and 58px for the primary download action.
- **Primary:** Signal red with warm near-white text, `12px 18px 12px 21px` padding, and a download glyph aligned at the trailing edge.
- **Hover / Focus:** Background shifts to deep signal red; primary action lifts `1px` on hover and settles `1px` on active. All keyboard focus uses the shared 3px signal-deep ring with 4px offset. State transitions are `150ms ease`.
- **Secondary / Tertiary:** Platform choices use a light warm-neutral tray; the selected choice becomes signal red with warm near-white text. Hash-copy buttons remain compact, bordered, and enamel-filled.

### Cards / Containers
- **Corner Style:** Square, with overflow clipped where the frame is a composed instrument surface.
- **Background:** Release, catalog, and FAQ panels use warm enamel; the page, header, footer, and mechanism use cream canvas; capabilities use dim enamel. Walnut is limited to trim and small brand marks.
- **Shadow Strategy:** Large release/product-proof frames only; see Elevation & Depth.
- **Border:** One-pixel structural borders, with heavier steel framing reserved for proof imagery.
- **Internal Padding:** Console body uses `clamp(24px, 4vw, 48px)` generally and `clamp(20px, 2.4vw, 32px)` in the wide two-column variant.

### Navigation
- **Style:** Light cream-canvas header with a 1px structural rule, a 78px minimum inner height, and a walnut-mid brand mark. Links use General Sans at `0.84rem`, muted at rest and signal-deep on hover.
- **Focus / mobile:** Navigation links retain 44px targets on wide screens; at 680px they use 40px targets, hide the secondary “How it works” link and external-link glyph, and reduce gaps. The skip link is a light-enamel, square utility surface.

### Segmented Platform Control
- **Style:** A 1px bordered dim-enamel tray with 4px inner padding and 2px inter-button gap.
- **States:** Each choice is at least 44px high; hover darkens text, selected state uses signal red with warm near-white text and a signal-red border. At 680px the control fills the row and each choice takes half the width.

### Release Panel
- **Style:** A framed warm-enamel console with a steel top rail, two-column body when space permits, a factual metadata footer, and a genuine NDM proof image area. It is a signature container, not a universal card recipe.
- **Behavior:** Keep the selected build, filename, size, primary action, alternate package, and direct “Download extension” action visibly adjacent within the release panel. Preserve the panel's hierarchy when stacking at narrow widths.

### Package Rows and Accordions
- **Package rows:** Use a three-column ledger at wide widths with identity, size, and download aligned above a hash disclosure; rows use 1px light rules and `14px 0 13px` padding. The catalogue contains five desktop packages and one separate optional Chrome/Firefox extension row; the extension sends browser downloads to NDM and can carry link cookies.
- **Accordions:** Native `details` disclosures use border-top/bottom rules, a condensed summary, and a small plus/minus mark. Open state rotates the mark rather than introducing a new surface. Hash values and the compact dark code sample use the mono face. Do not invent or display fake checksum values in component examples.

## Do's and Don'ts

### Do:
- **Do** make light cream, warm-enamel, and dim-enamel surfaces the dominant visual field.
- **Do** keep walnut restricted to small accent/trim roles; use dark ink and steel rails for structure.
- **Do** use Barlow Condensed for display hierarchy and General Sans for operating text.
- **Do** reserve mono styling for filenames, hashes, genuine code/data strings, and the compact dark code sample.
- **Do** use signal red for primary and selected-platform actions, with signal-deep for hover/focus states.
- **Do** use structural borders and tonal layering before adding shadow; keep the two observed large-frame shadows purposeful.
- **Do** preserve square silhouettes, clear 44px interaction targets, the 3px signal-deep focus ring, and reduced-motion behavior.
- **Do** let responsive layouts reflow through the observed `1100px`, `900px`, `680px`, `420px`, and `360px` thresholds rather than shrinking every element uniformly.
- **Do** keep the direct extension download visible in the release-panel footer and the optional extension row in the package catalogue.

### Don't:
- **Don't** make walnut or any dark color a dominant page, header, footer, or navigation surface.
- **Don't** turn signal red into a broad decorative gradient or dominant page background.
- **Don't** claim that this website downloads video; video downloads happen in the NDM desktop app.
- **Don't** remove the optional Chrome/Firefox extension or its browser-download handoff and link-cookie truth.
- **Don't** introduce rounded cards, pill controls, glassmorphism, or soft ambient shadows that conflict with the structural instrument language.
- **Don't** use Barlow Condensed for paragraphs or monospace as a general UI font.
- **Don't** replace measured rules and tonal surfaces with a generic equal-card feature grid.
- **Don't** remove visible focus treatment or motion-reduction support from interactive components.

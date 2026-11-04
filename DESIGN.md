---
name: NDM Route Map
description: A light-first download route map with direct Windows, Linux, and optional browser-companion paths.
colors:
  canvas: "#f6f8ff"
  paper: "#ffffff"
  paper-blue: "#e9eeff"
  paper-green: "#e8f5ef"
  paper-orange: "#fff0e9"
  ink: "#17233d"
  ink-soft: "#354661"
  muted: "#50627d"
  blue: "#2b50d9"
  blue-deep: "#1d3eae"
  green: "#18785a"
  green-deep: "#10583f"
  orange: "#c9472f"
  orange-deep: "#b83d27"
  line: "#cdd8ed"
  line-light: "#e2e8f5"
  success: "#176343"
  danger: "#a3312d"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(3.5rem, 6.4vw, 5.8rem)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.65rem, 4.7vw, 4rem)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(1.65rem, 2vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.04
  body:
    fontFamily: "General Sans, Segoe UI, sans-serif"
    fontSize: "clamp(0.98rem, 0.95rem + 0.14vw, 1.08rem)"
    fontWeight: 400
    lineHeight: 1.58
  label:
    fontFamily: "General Sans, Segoe UI, sans-serif"
    fontSize: "0.76rem"
    fontWeight: 700
    lineHeight: 1.25
  mono:
    fontFamily: "SFMono-Regular, Consolas, Liberation Mono, monospace"
    fontSize: "0.62rem"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  square: "0px"
  status-dot: "50%"
spacing:
  page-width: "1320px"
  gutter: "clamp(20px, 4.6vw, 68px)"
  section: "clamp(76px, 9vw, 124px)"
  route-gap: "clamp(12px, 1.6vw, 22px)"
  route-body: "18px clamp(14px, 1.8vw, 24px) 16px"
components:
  route-button:
    backgroundColor: "{colors.blue}"
    textColor: "#ffffff"
    rounded: "{rounded.square}"
    padding: "11px 14px 11px 16px"
    height: "50px"
  route-button-hover:
    backgroundColor: "{colors.blue-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.square}"
  linux-route-button:
    backgroundColor: "{colors.green}"
    textColor: "#ffffff"
    rounded: "{rounded.square}"
    padding: "11px 14px 11px 16px"
    height: "50px"
  extension-route-button:
    backgroundColor: "{colors.orange}"
    textColor: "#ffffff"
    rounded: "{rounded.square}"
    padding: "11px 14px 11px 16px"
    height: "50px"
  navigation:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.square}"
    height: "74px"
  route-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0"
  package-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "14px 0 13px"
---

# Design System: NDM Route Map

## Overview

**Creative North Star: "The Route Map"**

NDM’s visual system is a light-first distribution map: a calm cool field makes three direct paths easy to distinguish, while navy ink and compact display type keep the decision factual. Cobalt marks the Windows route, green marks the Linux route, and AA-safe vermilion marks the optional browser-companion route. Broad route bands, square download controls, and restrained rules create wayfinding without pretending the page is a live transfer console.

Barlow Condensed supplies compact, purposeful display hierarchy; General Sans carries readable explanation and interface copy. Mono is evidentiary only: filenames and hashes use it because those strings are data. Existing authentic NDM application screenshots are retained as proof of the desktop product, not as decorative stock imagery. The system stays light, with purposeful surfaces, rules, and restrained shadows rather than dark panels or faux telemetry.

**Key Characteristics:**
- Light canvas and white paper surfaces with pale-blue, pale-green, and pale-vermilion fields.
- Navy ink and muted blue-gray supporting text for clear hierarchy.
- Cobalt, green, and vermilion identify the three direct route families.
- Barlow Condensed display type paired with General Sans body/UI text.
- Square controls, route bands, real app evidence, and visible keyboard focus.

## Colors

The palette is a cool, light route-map range: porcelain and pale-blue surfaces carry the page, navy ink provides hierarchy, and saturated route colors identify destinations and their states.

### Primary
- **Cobalt Route** (`{colors.blue}`): Windows route bands, primary links, focus-adjacent emphasis, and default direct-download actions.
- **Deep Cobalt** (`{colors.blue-deep}`): Windows hover state, stronger links, focus outline, and selected emphasis.

### Secondary
- **Linux Green** (`{colors.green}`): Linux route bands and direct-download actions.
- **Deep Linux Green** (`{colors.green-deep}`): Linux hover state and darker route interaction.

### Tertiary
- **Vermilion Route** (`{colors.orange}`): Optional browser-companion route and warm route markers.
- **Deep Vermilion** (`{colors.orange-deep}`): Extension hover state and warm link emphasis.

### Neutral
- **Cool Porcelain** (`{colors.canvas}`) and **White Paper** (`{colors.paper}`): Page field, header, catalogue, and primary containers.
- **Pale Blue Field** (`{colors.paper-blue}`): Proof strip, hash details, FAQ field, and cool status surfaces.
- **Pale Green Field** (`{colors.paper-green}`): Capability information surface.
- **Pale Vermilion Field** (`{colors.paper-orange}`): Release/version note surface.
- **Navy Ink** (`{colors.ink}`), **Soft Navy** (`{colors.ink-soft}`), and **Muted Blue Gray** (`{colors.muted}`): Headings, readable copy, and supporting metadata.
- **Cool Rule** (`{colors.line}`) and **Light Rule** (`{colors.line-light}`): Structural dividers and ledger rules.
- **Success Green** (`{colors.success}`) and **Danger Red** (`{colors.danger}`): Status feedback only.

**The Route Color Rule.** Use cobalt, green, and vermilion to identify route families and their actions; do not turn route colors into decorative gradients or a replacement for readable labels.

## Typography

**Display Font:** Barlow Condensed (with Arial Narrow, sans-serif fallback)
**Body Font:** General Sans (with Segoe UI, sans-serif fallback)
**Label/Mono Font:** General Sans for labels; SFMono-Regular, Consolas, Liberation Mono for filenames and hashes.

**Character:** Barlow Condensed gives the map its compact destination-label voice. General Sans keeps navigation, explanations, package metadata, and controls plainspoken; mono remains a precise data treatment rather than atmosphere.

### Hierarchy
- **Display** (600, `clamp(3.5rem, 6.4vw, 5.8rem)`, 0.94): Opening promise and highest-level statement.
- **Headline** (600, `clamp(2.65rem, 4.7vw, 4rem)`, 0.96): Section headings and major route-map labels.
- **Title** (600, `clamp(1.65rem, 2vw, 2rem)`, 1.04): Route-card and subsection headings.
- **Body** (400, `clamp(0.98rem, 0.95rem + 0.14vw, 1.08rem)`, 1.58): Explanatory copy and default document text.
- **Label** (700, `0.76rem`, 1.25): Route bands, compact metadata, and direct action labels.
- **Mono data** (400, `0.62rem`, 1.35): Filenames and hashes only.

**The Two-Face Rule.** Use Barlow Condensed for display hierarchy and General Sans for operating text; use mono only when a filename or hash is actually being shown.

## Layout

The shared shell is capped at `1320px` and uses fluid inline gutters of `clamp(20px, 4.6vw, 68px)`. The opening route map uses three equal desktop columns with gaps of `clamp(12px, 1.6vw, 22px)`; each lane keeps its route band, package identity, size, direct action, and alternate note together. The extension route remains equally legible beside the Windows and Linux routes, while its optional status is explicit.

At `1020px`, route spacing and package rows compress. At `760px`, the header and major grids tighten, route lanes stack as compact two-column cards, and alternate route links are hidden while direct actions remain. At `420px` and `360px`, route labels and metadata tighten further. The page preserves the same route order and direct-download hierarchy rather than introducing a platform tab or hiding the extension.

The page uses section rhythm from `clamp(76px, 9vw, 124px)` and a `70px` small-screen section rhythm. Interactive targets retain generous minimum heights: navigation links are 44px at wide widths and 40px on small screens; route buttons are 50px at wide widths and compact to 38px in the phone route-map treatment.

## Elevation & Depth

This system is tonal and lightly lifted. White paper, pale-blue/green/vermilion fields, and cool rules establish most hierarchy; shadows are reserved for route cards, proof frames, and other framed evidence that needs a modest physical boundary. Route cards use `0 8px 18px rgba(34, 56, 105, 0.09)` at rest and `0 12px 24px rgba(34, 56, 105, 0.14)` on hover. The proof image frame uses `0 5px 14px rgba(23, 35, 61, 0.12)` and the mechanism frame uses `0 10px 22px rgba(23, 35, 61, 0.14)`.

**The Tonal Depth Rule.** Establish hierarchy with light surfaces and rules first; shadows remain restrained and purposeful, never ambient decoration for ordinary text or navigation.

## Shapes

Corners are square by default (`0px`). Route bands, direct-download controls, package rows, status notes, and content surfaces use crisp rectangular silhouettes; the recurring circular shape is limited to the availability/status dot (`50%`). Focus is a `3px` solid deep-cobalt ring with `4px` offset, visible on keyboard focus without changing the component silhouette.

## Components

### Buttons
- **Shape:** Square direct-download controls (`0px`) with a `50px` minimum height on wide screens and responsive compact heights on small screens.
- **Primary route actions:** Cobalt, Linux green, or vermilion according to route; white text, `11px 14px 11px 16px` padding, and an inline SVG download icon at the trailing edge.
- **Hover / Focus / Active:** Route-specific deep color on hover, `translateY(-1px)` on hover, `translateY(1px)` on active, and the shared `3px` deep-cobalt focus ring with `4px` offset. Transitions use `150ms ease`.
- **Secondary:** Package download links and alternate package links remain text-led, underlined where useful, and inherit the cool ink hierarchy.

### Cards / Containers
- **Corner Style:** Square, with route cards and proof frames composed as clean rectangular surfaces.
- **Background:** White paper for route cards and catalogue; pale-blue, pale-green, or pale-vermilion fields for contextual bands.
- **Shadow Strategy:** Restrained route-card and proof-frame shadows only; see Elevation & Depth.
- **Border / Rules:** One-pixel cool rules and heavier route-color bands establish structure.
- **Internal Padding:** Route bodies use `18px clamp(14px, 1.8vw, 24px) 16px`; compact phone bodies tighten to `9px 13px 8px` and then `9px 10px 8px` at the smallest route layout.

### Navigation
- **Style:** White-paper header with a `1px` bottom rule, `74px` minimum inner height, a cobalt mark, and muted General Sans links.
- **States:** Links shift to cobalt on hover; source is deep cobalt by default; all links keep visible keyboard focus.
- **Mobile:** At `760px`, the header compresses to 66px, hides the descriptor and secondary “How it works” link, and removes the source glyph while retaining the source link.

### Package Rows and Disclosures
- **Style:** Catalogue rows use identity, size, download, and SHA-256 disclosure columns with `14px 0 13px` padding and `1px` light rules.
- **Data:** Filenames and hashes use the mono face; hash copy controls are compact square bordered buttons.
- **Responsive:** At `1020px`, rows reflow to identity, size/action, then disclosure; at `760px`, hash content wraps to a readable full-width line.

### Proof Imagery
- **Style:** Existing authentic NDM application screenshots sit in white/pale-blue framed surfaces with modest shadow and factual captions.
- **Behavior:** Imagery is evidence of the desktop app, not a simulated live web download state; preserve the existing screenshots and their descriptive alt text.

## Do's and Don'ts

### Do:
- **Do** keep the page light-first with cool porcelain, white paper, and purposeful pale-blue, pale-green, and pale-vermilion surfaces.
- **Do** use cobalt for Windows, green for Linux, and AA-safe vermilion for the optional extension route.
- **Do** use Barlow Condensed for display hierarchy and General Sans for readable interface copy.
- **Do** reserve mono styling for filenames and hashes.
- **Do** use square direct-download controls, route bands, structural rules, and restrained shadows.
- **Do** preserve clear keyboard focus with the `3px` deep-cobalt ring and `4px` offset, plus reduced-motion behavior.
- **Do** let the route map stack responsively at `760px`, `420px`, and `360px` without hiding the extension route.
- **Do** use authentic existing app screenshots as evidence and keep them factual.

### Don't:
- **Don't** reintroduce an obsolete palette or contradictory visual vocabulary.
- **Don't** make this a dark dashboard, faux telemetry view, or live video-downloader website.
- **Don't** replace route labels with a platform tab or hide the optional browser companion.
- **Don't** use rounded cards, pill controls, glassmorphism, broad gradients, or generic feature-card grids.
- **Don't** use Barlow Condensed for paragraphs or monospace as a general UI font.
- **Don't** invent screenshots, visual claims, product capabilities, or proof that is not present in the implementation.

# NDM Website — Product-First Redesign

## Intent

Replace the current long, repeated landing page with a purpose-built download experience for Windows and Debian-family Linux users. The owner has authorized expert judgment on design and confirmed that desktop download is the site's primary action. Success means a first-time visitor can identify NDM, understand its strongest truthful benefit, and reach the correct desktop package quickly; visitors who need more detail can still verify every release file.

## Goals

- Rebuild the page's information architecture and reading order, not just its CSS.
- Put one platform-aware desktop download action at the top, with a clear route to the other platform and to all release files.
- Explain resumability once, simply and accurately, supported by a real screenshot of the app.
- Preserve release version/feed updates, all six package entries, each URL, file size, SHA-256 value, supported systems, key feature facts, FAQ facts, and release notes.
- Keep detailed package hashes and release notes available without forcing every visitor to scan them in the opening flow.
- Reuse authentic application screenshots already in `tools/shots.json`; do not add stock imagery or fabricate testimonials, benchmarks, or product UI.
- Keep the static page functional without JavaScript, with graceful feed failure and reduced-motion/accessibility support.

## Non-goals

- Changing the NDM desktop application, its extension, release artifacts, backend, or release process.
- Building a real video resolver or downloader in the website. The existing selectable video picker is only a scripted sample-data demonstration and will be removed as an apparent working web feature.
- Updating release metadata or claiming that the site's screenshots depict version 2.3.1 specifically.
- Publishing/deploying the redesign or pushing it to GitHub. The current live site is not approved for replacement by this request.
- Adding a JavaScript framework, external runtime dependency, account, analytics, or new product claims.

## Anti-goals

Do not preserve the existing site's long scrollytelling, dense open release/change section, oversized multi-feature catalogue, repeated download calls to action, or footer clock merely because they exist. Avoid card grids where every feature is given equal weight, ornamental controls that imply functionality, and hiding the primary download behind an explanatory story.

## Constraints and confirmed product truth

The project is a static site: `build_site.py` generates `index.html` from `index.template.html` and embeds genuine application screenshots from `tools/shots.json`; no front-end framework or test runner is present. The former browser request to the release-asset JSON is blocked by CORS. Keep plain HTML/CSS/vanilla JavaScript; refresh the version and all six package names, URLs, sizes, and hashes together from the CORS-enabled official GitHub Releases API, after validating all six assets. If the API is unavailable or incomplete, keep the full bundled metadata intact. Do not publish changes.

NDM is free and open source under MIT OR Apache-2.0. It supports Windows 7 SP1, 8, 8.1, 10, and 11 in 32- and 64-bit; the universal setup includes both architectures, and separate portable packages are available. Linux packages serve x86-64 Debian-family systems, including Debian, Ubuntu, Zorin OS, Linux Mint, and derivatives. Up to 32 connections use 1 MiB blocks written at final offsets; a journal records progress so transfers can resume after interruption. The Chrome/Firefox extension is optional and hands browser downloads to the app. The app supports video downloads with browser stream data and yt-dlp fallback; that capability belongs to the app, not to an interactive website picker. Other documented desktop capabilities include speed limiting and quotas, scheduled queues, Site Grabber, categories, and hash-verified self-updates. Package names, release URLs, sizes, hashes, OS support, and release notes remain sourced from the existing page/feed.

The product audience and primary website action are confirmed by the owner. No customer, benchmark, or endorsement evidence exists. The application screenshot set is authentic, but some captures predate 2.3.1; captions must not claim otherwise.

## Approaches considered

1. **Refine the current long page.** Keep its section flow and interactions, then restyle and trim copy. This would be the smallest implementation, but would retain the core structure the owner found cluttered and would fail the explicit request for a complete rebuild.
2. **Product-first download page — selected.** Lead with the real desktop action and authentic transfer proof, route all secondary detail through a short sequence, and progressively disclose the full release manifest and notes. This directly fixes the hierarchy and repetition while retaining exact technical information for visitors who need it.
3. **Technical release catalogue.** Put six package rows, hashes, changelog, and engine capabilities first. This is strongest for existing users checking artifacts but repeats the dense technical-first experience and makes new-user conversion harder.

Approach 2 is the project choice because it changes what the visitor sees and does before introducing another visual treatment.

## Visual and surface direction

Replace the incumbent visual system with a disciplined modular identity: authentic app imagery paired with flat, confident color bars and strict alignment. Use the assigned direction seed `seed:3cc0412e45f182bd` (modular identity system) as a visual grammar, not as permission for confetti, rotation, or visual noise. The owner explicitly asked for a cleaner, rebuilt site; therefore large color blocks are limited to a few purposeful regions, while whitespace, clear labels, one strong action, and compact type hierarchy govern the reading order. Use real NDM screenshots as the only product imagery. Keep visible distinctions understandable without color alone.

The full page remains a single landing page, but has a new reading order:

1. Compact navigation with only the primary page destinations.
2. Hero with a one-line promise about completing interrupted downloads, a short factual explanation, one OS-aware primary download button, a secondary route to the alternate OS and all release files, and one authentic app screenshot.
3. A small proof band that states the mechanism plainly: up to 32 connections, 1 MiB blocks, and progress recorded for resume.
4. A short, selective product-capability section: browser handoff; controls/queues; video support stated as a desktop-app capability; and the remaining documented utilities grouped without a feature wall. Use only the few genuine screenshots that directly improve comprehension.
5. A compact release manifest. Keep all six files, package names, sizes, download destinations, and SHA-256 checks accessible. Put hashes in native expandable details per file so the precise values remain present without dominating the default scan. Keep verification instructions and full release notes in native details.
6. A short FAQ for OS support, free/open-source status, and privacy. Keep resume, extension, and video explanations in the capability section instead of repeating them below.
7. A restrained footer with repository/release-feed links and licensing; remove the duplicated download CTA and unrelated live clock.

## Interaction and implementation calls

- Rewrite `index.template.html`, `styles.css`, and `app.js` as a coherent replacement instead of appending overrides to the prior CSS.
- Keep platform detection for the hero CTA and dynamic GitHub Releases API refresh with complete static fallback values. Users can still reach all packages if script or API access fails.
- Use native `<details>` for hashes and long release notes. If copy-hash controls are included, add accessible names, successful-copy feedback, and a fallback when Clipboard API access is unavailable.
- Use semantic headings, keyboard-visible focus, touch-sized controls, responsive package rows, descriptive image alternatives, and `prefers-reduced-motion`. Do not make information depend on hover or color.
- Remove the fake video-picker interaction and sample format sizes from the website; replace it with a truthful text explanation of the desktop feature.
- Run `python3 build_site.py` after source edits so `index.html` is regenerated with embedded screenshots. Check that no image placeholders remain.

## Release and review boundary

Make changes locally on the current branch only. Do not commit, push, deploy, or update the live site without a new publication decision. Before handoff, verify generated HTML, desktop/mobile layouts, release metadata links/hashes, keyboard and reduced-motion basics, and the browser console. Report any limitation instead of implying that a feature was tested or deployed when it was not.

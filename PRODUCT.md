# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience confirmed for this rebuild: people using Windows or Debian-family Linux who want to download files with NDM. The website should lead with the desktop-app download, with the operating-system-appropriate release easy to choose.

## Product Purpose

NDM (Nill Download Manager) is a free, open-source desktop download manager for Windows and Linux. It helps people manage downloads, continue interrupted transfers, and hand browser downloads to the desktop app.

## Positioning

NDM writes parallel file blocks to their final offsets while recording progress in a journal, so an interrupted download can resume from the recorded byte rather than relying on temporary part files and a later merge. The engine supports up to 32 connections per file.

## Operating Context

People can add a URL in the app, drag a file to the drop basket, or use the Chrome/Firefox extension to hand a browser download to NDM. The site is a static landing page built from `index.template.html` by `build_site.py`; `app.js` provides the release-feed and page behavior, and `tools/shots.json` embeds screenshots of the application.

## Capabilities and Constraints

- Windows support: Windows 7 SP1, 8, 8.1, 10, and 11, in 32-bit and 64-bit. The universal setup includes both builds and selects the one matching the machine. Separate portable 64-bit and 32-bit packages are also published.
- Linux support: x86-64 Debian-family distributions through a `.deb` package or portable tarball; the site lists Debian, Ubuntu, Zorin OS, Linux Mint, and derivatives as examples.
- Downloads use up to 32 connections and 1 MiB blocks. Progress is journaled as it happens and can resume after an app or machine restart. Expired signed links can be refreshed for the existing entry. Finished files are not overwritten.
- The Chrome/Firefox extension hands browser downloads to the desktop app and can carry the link's cookies with the download entry. The extension is optional; users can also paste a link or use the drop basket.
- The desktop app supports video downloads using browser-provided stream data first and `yt-dlp` as a fallback; `ffmpeg` merges split picture and sound where needed. The interactive video picker currently present on the website is a scripted demonstration with sample data, not a live resolver or downloader integration. Do not present it as an operative web feature or invent results from it.
- Other documented desktop features include per-download and global speed limits, quotas, scheduled queues, Site Grabber, categories, and hash-verified self-updates.
- The site must preserve release version, package names, download URLs, sizes, SHA-256 values, supported operating systems, and relevant release notes as published. Feed-backed package/version/hash values should continue to update from the release feed; packages or metadata absent from that feed remain explicit static values.
- Release files are served from GitHub. The product is free and open source under MIT OR Apache-2.0. The site documents an update-feed check and an anonymous install-count request with no attached identifier; it states that there is no telemetry or sign-in.

## Evidence on Hand

- Release copy, package URLs, sizes, hashes, support details, and release notes: `index.template.html` and the latest-release feed at `https://github.com/JAHURULNILL/ndm/releases/latest/download/release.json`.
- Real application screenshots embedded through `tools/shots.json`. These are product screenshots; the website's scripted video-picker states are not evidence of a working web downloader.
- Product source repository: `https://github.com/JAHURULNILL/ndm`.
- No customer testimonials, third-party endorsements, or independent benchmark figures are provided. Do not invent them.

## Product Principles

- Make the correct desktop download easy to identify before introducing secondary features.
- Explain resumability in terms of what the application actually records and does.
- Use real release metadata and real product screenshots as proof; do not imply a website demo performs a download.
- Keep the browser extension optional and distinguish it from the desktop application.

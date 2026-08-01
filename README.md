<h1 align="center">Portfolio</h1>

<p align="center">
  <strong>Designed with the shadow system for an interactive experience</strong>
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#custom-design-features">Custom Design</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <a href="https://github.com/Jakob-Strobl/portfolio/releases">
    <img src="https://img.shields.io/github/package-json/v/Jakob-Strobl/portfolio?color=blue" alt="Current package version" />
  </a>
  <a href="https://github.com/Jakob-Strobl/portfolio/actions/workflows/prod-page-deploy.yml">
    <img src="https://github.com/Jakob-Strobl/portfolio/actions/workflows/prod-page-deploy.yml/badge.svg" alt="Build Status" />
  </a>
  <a href="https://jstrobl.dev">
    <img src="https://img.shields.io/badge/link-jstrobl.dev-9743df.svg" alt="Link to Site" />
  </a>
  <img src="https://img.shields.io/badge/license-Proprietary-lightgrey" alt="License: Proprietary" />
</p>

---

## About

This portfolio site showcases professional experience through an interactive timeline, curated photo galleries from travels across Korea and Japan, and contact information. It is built around a custom shadow system and lightweight WebGL backgrounds, with a focus on responsive interaction, smooth transitions, and performance.

<table>
  <tr>
    <td align="center"><strong>Waves</strong><br /><img src="docs/waves.png" alt="Portfolio with the custom waves background" width="600" /></td>
    <td align="center"><strong>Tessellation</strong><br /><img src="docs/tessellation.png" alt="Portfolio with the custom tessellation background" width="600" /></td>
  </tr>
</table>

## Tech Stack

- **Framework**: SolidJS with SolidStart 2 RC (SSR-enabled)
- **Styling**: Tailwind CSS v4
- **Rendering**: Multiple custom WebGL 2 background effect models with custom GLSL vertex and fragment shaders
- **Runtime**: Bun
- **Deployment**: Cloudflare Pages through Nitro's `cloudflare_pages` preset and GitHub Actions CI/CD
- **Testing**: Vitest + SolidJS Testing Library
- **Language**: TypeScript (strict mode)

### Background Payload

The background rewrite removes the old Three.js dependency and substantially reduces the effect payload. These figures compare the old production `waves` chunk with the current Vite build; sizes are decimal bytes, with gzip recompressed from the decoded JavaScript for an apples-to-apples comparison.

| Background payload              | Uncompressed         | Gzip                 | Source                            |
| ------------------------------- | -------------------- | -------------------- | --------------------------------- |
| Old production waves + Three.js | 490,673 B (490.7 KB) | 124,896 B (124.9 KB) | Live `waves-CqeVZqS3.js` asset    |
| Current custom effect models    | 29,422 B (29.4 KB)   | 10,512 B (10.5 KB)   | Current Vite `waves` client chunk |

Cloudflare currently serves the old production asset with Brotli at 124,585 B; the table uses gzip for both generations. The current Vite build reports the same new chunk at 10.61 kB gzip. This comparison covers the background payload, not the complete initial client bundle.

## Custom Design Features

### Umbra Shadow System

A custom shadow management system that dynamically tracks DOM elements and renders synchronized shadow overlays. Umbra uses smooth FLIP-style transitions for entering, moving, and removing content; observes source geometry with `ResizeObserver`; snaps shadows back to their sources after resizes; and conditionally renders detached content based on source visibility. It supports fixed and relative positioning, configurable warmup/content fades, and responsive viewport synchronization. The system leverages SolidJS stores for reactive state management, creating a unique depth effect throughout the interface.

### Custom WebGL Backgrounds

- **Waves**: A redesigned, procedurally generated wave field driven by a custom WebGL 2 pipeline and custom GLSL vertex/fragment shaders. Multiple overlapping waves are seeded and animated without a third-party 3D engine.
- **Tessellation**: A second living background effect model built from a changing triangulated mesh, with evolving topology, per-facet lighting, lifecycle pulses, and smooth transitions between mesh states.
- Both effects expose controls for effect selection, seed regeneration, motion speed, visual intensity, quality, and frame rate. Preferences can be saved for future sessions.

## Quick Start

```bash
# Prerequisites: Bun and Node >= 24
# Install dependencies
bun install
# Start development server
bun run dev
# Run tests
bun run test
# Build for production
bun run build
```

## Available Scripts

| Command                           | Description                                         |
| --------------------------------- | --------------------------------------------------- |
| `bun run dev`                     | Start development server                            |
| `bun run build`                   | Production build                                    |
| `bun run test`                    | Run test suite                                      |
| `bun run test-watch`              | Run tests in watch mode                             |
| `bun run pretty-check`            | Check code formatting                               |
| `bun run prettify`                | Format code with Prettier                           |
| `bun run cloudflare-step-deploy`  | Run tests, then build (used by Cloudflare Pages CI) |
| `bun run cloudflare-deploy-local` | Build and deploy to Cloudflare Pages from local dev |

### Cloudflare Deployment Scripts

- **`cloudflare-step-deploy`**: Installs dependencies, runs the full test suite (`vitest run`), and only if tests pass, proceeds to build the project with Vite/Nitro (`vite build`). This is used by Cloudflare Pages CI.

- **`cloudflare-deploy-local`**: Builds the project with Vite/Nitro and deploys the generated `dist` directory directly to Cloudflare Pages using Wrangler CLI (`wrangler pages deploy`). Useful for local testing before pushing to CI/CD.

## Project Highlights

- **Custom interaction systems**: Umbra coordinates detached shadows, smooth transitions, resize snapping, and visibility-aware rendering across the site.
- **Two procedural backgrounds**: Waves and tessellation are built in-house with WebGL 2 and GLSL, with runtime controls and persisted preferences.
- **SSR-first application structure**: SolidStart 2 RC file-based routing keeps the timeline, contact page, and photo galleries organized while supporting server rendering.
- **Cloudflare-native media and deployment**: Gallery images use Cloudflare R2/Image Transformations, while Nitro builds the app for Cloudflare Pages and GitHub Actions gates deployment on tests.
- **Focused automated coverage**: Vitest tests the background models/effects, Umbra lifecycle and geometry behavior, settings, routing, and links.

## Deployment

Automatically deployed to Cloudflare Pages via GitHub Actions on branch updates. SolidStart 2 uses the Vite/Nitro build pipeline with Nitro's `cloudflare_pages` preset; the deployment workflow runs the full test suite before building and deploying. The project no longer uses Vinxi.

The version badge above reads directly from `package.json`, which is also injected into the app at build time as `PROJECT_VERSION`, so the README badge and in-app version stay aligned without manually editing the README.

---

Built with ❤️ using SolidJS

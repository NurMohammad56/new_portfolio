# Project showcase

The eight entries in `data/project-showcase.ts` use the supplied screenshots and descriptions. All eight are presented as Nur Mohammad's **backend** work. Flutter and SQLite, where mentioned, are explicitly described as client architecture, not personal frontend development. Node.js, Express.js, and REST APIs are the shared app-backend foundation; database/ORM names are not guessed for projects without supplied details.

The gallery retains its scrolling/dragging WebGL loop and accessible DOM/reduced-motion fallback. Each project has backend highlights, product capabilities, backend tools, real links only, screenshot selection and zoom, and previous/next project controls.

## Artwork

`public/projects/covers/*.webp` contains eight 1440 × 960 device compositions. The frames, shadows, grid, and restrained teal lighting are drawn in code by `scripts/project-mockup-art.mjs`; the original screenshot pixels and aspect ratios are preserved. Browser windows are used for GCL, portrait tablets for iLearnReady, and phones for the mobile apps. Beardfriends' supplied marketing images already contain phones, so those are presented as editorial panels instead of nested phones.

To regenerate covers, have Chrome running with a local debugging endpoint (default `http://localhost:9223`, override with `NUR_CHROME_DEBUG_URL`), then run:

```sh
node scripts/generate-project-mockups.mjs
node scripts/verify-project-showcase.mjs
```

The generator starts a temporary loopback-only static server and creates its own temporary Chrome tab. No external design service is required. All original PNGs are retained. The iLearnReady screenshot containing a Snipping Tool notification and the duplicate GCL admin screenshot are intentionally not featured.

## Source-note safety

The original GCL note included account credentials. It was moved intact to `docs/project-source/gcl-commerce-source.txt`, outside `public`, and that directory is ignored by Git. Do not publish or paste those credentials. If the original public folder has already been deployed, rotate the credentials.

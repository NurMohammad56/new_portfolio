# Career diary and scroll-edge lines

The Career progression section uses `components/interactive/career-diary.tsx`, with its facts in `data/career.ts`. Scaleup IT Limited and Arabian Services Company retain their resume-backed details. LSKIT is a third chapter, based on Nur's directly supplied three-month internship-style frontend/backend work. Exact dates, location, and technologies were not supplied, so none are inferred. Its wide SVG wordmark follows the supplied logo reference and is displayed without stretching.

The desktop diary uses CSS 3D transforms and spring-smoothed scroll values from the already-installed Motion library. The cover opens first, then each experience receives a stationary reading hold before the next page turns. Page depth, stacking, reading holds, and scene length adapt to the chapter count. The paper folds back and the cover closes before the sticky scene releases into Selected work. Reverse scrolling reverses the whole sequence. Timing and quintic easing live in `diary-timeline.ts`. There are no wheel/touch interceptors, forced scrolling, timers, or extra WebGL scenes.

Both desktop and mobile resume downloads use `/resume/Nur_Mohammad_Resume.pdf`, matching the actual updated file's capitalization for case-sensitive hosting. The browser check compares the served PDF bytes with the local file.

Journal notes are on the actual inner cover face, not an independent left-hand page. Backface culling keeps them hidden until the cover opens; the cover's front, inside, and thickness have separate depth positions. Perspective, gentle book tilt/lift, paper edges, and moving shadows provide depth without compromising the reading holds.

Chapter buttons offer direct access and keyboard navigation. Inactive paper faces are inert and excluded from the accessibility tree. The cover and companion notes are decorative; the active experience article contains the actual accessible content.

Below 900px width, below 680px height, or with reduced motion enabled, the diary becomes a readable, naturally scrolling notebook. This version is also server-rendered, so career information remains available without client-side animation.

`scroll-edge-lines.tsx` adds mirrored teal waves and six small points per side in the outer gutters. Their highlights follow current document scroll progress in either direction. Height is remeasured with a ResizeObserver and a passive, frame-batched scroll listener so the responsive diary and lazy content cannot leave a stale scroll range. The highlight stays inside the path even at the footer. The entire decoration is non-interactive and hidden from assistive technology. Reduced motion leaves static lines and points.

## Verification

```sh
npm run build
npm run lint
node scripts/verify-career-diary.mjs
```

The browser check expects a preview on localhost:3100 and a local Chrome debugging endpoint on localhost:9223. Override them with `NUR_PREVIEW_URL` and `NUR_CHROME_DEBUG_URL`. It creates and closes its own tab, keeps screenshots in a unique OS temp folder, and checks opening, turning, reverse scrolling, chapter controls, scroll release, seven viewport sizes, reduced motion, text bounds, and the existing project dialog.

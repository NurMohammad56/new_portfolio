# Portfolio colors

Use the sun/moon button in the top navigation to switch between the original midnight-teal theme and the new light, warm-white/teal theme. It is available on desktop and mobile. Dark stays the default; the selected theme is saved locally and restored before the portfolio body renders. Other open tabs update too. If browser storage is blocked, switching still works for the current visit.

To customize the colors, edit `portfolioPalette` (dark) or `lightPortfolioPalette` (light) in `data/palette.ts`. Matching CSS variables and RGB values are generated from these palettes. The hero wireframe follows the selected accent. Project screenshot covers retain their dark photographic captions so they stay readable; the project modal and surrounding section follow the selected theme. Company logos and diary paper retain their original colors.

The head initialization script and root hydration suppression are intentional: saved preferences change the root's theme attributes/styles before hydration without changing the server-rendered content or layout. No extra dependencies are required.

Reduced-motion side lines keep identical server/client markup; CSS hides animated strokes. This avoids a pre-existing hydration mismatch when a reduced-motion visitor opens the portfolio.

## Verification

Run `npm run build`, `npm run lint`, and `node scripts/verify-themes.mjs`. The browser check expects a production preview on localhost:3100 and a Chrome debugging endpoint on localhost:9323; override these with `NUR_PREVIEW_URL` and `NUR_CHROME_DEBUG_URL`. It checks readable contrast, persistence before body rendering, real cross-tab synchronization, seven header widths, light dialogs, reduced motion, blocked storage, and hydration/runtime errors. Screenshots are kept in a unique OS temp directory and its test tabs are closed afterward.

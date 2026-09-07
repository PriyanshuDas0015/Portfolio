# Validation notes

Validated locally on Windows with Node.js 24 on September 7, 2026.

## Completed checks

- `npm install`: completed; npm audit reported zero vulnerabilities.
- `npm run build`: passed for both React applications. Public JS is about 120 KB gzip and admin JS about 114 KB gzip, excluding self-hosted fonts.
- `npm test`: all 13 backend tests passed, including clean GitHub/LinkedIn profile validation.
- Admin browser checks: both scenarios passed in Chromium, including login failure/success, dashboard data, project validation and creation, resume PDF upload, message viewing, expanded mobile navigation and axe checks. On this Windows host the Playwright wrapper retained its Vite child after reporting both passes and was stopped manually.
- Public browser tests: all 3 Chromium cases passed after the CMS expansion. They cover all six responsive widths, dynamic sections/navigation, filters, resume state, contact behavior, cursor/reduced motion and axe accessibility. The earlier cross-browser run also passed these scenarios in Chrome for Testing and Microsoft Edge.
- `npm run format:check`: passed after the final source formatting run.

The admin suite found and drove a fix for a React lifecycle defect in async manager loaders. Route changes now cleanly unmount every manager, and toast callbacks keep a stable identity.

## Firefox runtime finding

The same three public tests could not start in Playwright Firefox because this Windows host's Playwright runtime fails at `browserContext.newPage` with `Cannot read properties of undefined (reading '_page')`. A forced download of a fresh Playwright Firefox 155 runtime reproduced the same failure in a one-line blank-page launch, before any portfolio code loaded. This is a local browser-runtime limitation; the application test cases did not execute in Firefox during this final run.

## Verification limits

- No resume PDF or certificate files were present in the supplied attachment directory, so those assets could not be seeded or inspected. Their upload, history/publishing, public view and download paths are implemented.
- MongoDB, Cloudinary, SMTP and deployed production origins need the owner's credentials for live integration checks.
- Project URLs, email and LinkedIn details that were not supplied remain explicitly unavailable; no personal information was invented.
- API success paths use injected test adapters, and browser upload/delivery success uses route mocks. These checks do not claim a real Atlas write, Cloudinary upload or mailbox delivery.
- Lighthouse scores and production hosting have not been measured.

Screenshots from the Chromium run are stored as `portfolio-hero.png`, `portfolio-desktop.png`, and `portfolio-mobile.png` in this directory.

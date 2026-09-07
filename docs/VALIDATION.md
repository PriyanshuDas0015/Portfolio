# Validation notes

Validated locally on Windows using Node.js 24 on September 6, 2026.

## Build and API

- `npm install`: completed; the Nodemailer dependency was updated to the patched release. The resulting npm audit reported **zero vulnerabilities**.
- `npm run build`: passed. The final frontend JavaScript is approximately **116 KB gzip**, and CSS is approximately **8.2 KB gzip**, excluding self-hosted fonts.
- `npm run format:check`: passed.
- `npm test`: all **9 API tests** passed.
- `npm run dev`: starts both Vite and Express.
- `npm start`: production API started successfully on a separate test port. Health returned 200; a contact request without credentials returned the expected safe 503.

API tests cover health/security headers, invalid input, sanitization, persistence/notification success, email-only delivery, stored-message behavior after notification failure, total delivery failure, rate limiting, CORS, malformed JSON and request-size limits. MongoDB and SMTP success paths are tested with injected adapters; no real database or mailbox credentials were supplied.

## Browser checks

The final full run passed **12 of 12 browser tests** across all four browser projects, with **zero axe accessibility violations** in the tested rule sets. No page exceptions or console errors occurred in the navigation/layout checks. The final suite completed in approximately 1.6 minutes.

The browser suite is in `frontend/tests/portfolio.spec.js`, with projects for Chromium, Chrome for Testing, Microsoft Edge and Firefox. Firefox required execution outside the restricted process sandbox on this machine.

Each browser is checked at **1440, 1024, 768, 430, 390 and 375 pixels** for horizontal overflow and navigation. The tests also cover project filtering, expandable features, safe external links, mobile menu/Escape behavior, desktop cursor, keyboard fallback, reduced motion, form validation, actual unconfigured-backend feedback, and simulated loading/success/duplicate-submit behavior.

Automated accessibility checks use axe's WCAG 2 A/AA and WCAG 2.1 AA rule sets. Section reveals display immediately under reduced motion. This automated check supplements, rather than replaces, manual accessibility review.

Screenshots from the Chromium run:

- [Desktop hero](portfolio-hero.png)
- [Full desktop page](portfolio-desktop.png)
- [Full mobile page](portfolio-mobile.png)

## Verification limits

- The reference design image and original resume were not attached, so exact reference matching and resume-file verification were unavailable.
- Real project URLs, email and LinkedIn details were not supplied. No URLs or personal information were guessed.
- Actual MongoDB Atlas storage, SMTP inbox receipt and a deployed production origin require the owner's service configuration and a final live test.
- Contact success in browser tests uses an explicit mocked response. It is not a claim of real message delivery.
- Lighthouse scores have not been measured; the PRD's targets are not claimed as achieved.
- The website is prepared for the requested deployment split and has not been published.

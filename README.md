# Priyanshu Das — Interactive Developer Portfolio

A dark, responsive developer portfolio built with React and Vite, with a separate Express API for contact messages. The interface includes an animated technology orbit, a transparent desktop cursor, project filtering, a learning timeline, and accessible contact feedback.

![Desktop portfolio preview](docs/portfolio-hero.png)

## Start here

Requires Node.js **22.12+** (Node 24 recommended) and npm. From this folder:

```bash
npm install
npm run dev
```

Open **http://127.0.0.1:5173**. The API runs on port **3001**. The root command starts both applications; Ctrl+C stops both. `npm run install:all` is also available and installs both workspaces through npm.

The frontend works immediately. Actual contact delivery requires at least **MongoDB or SMTP**. Without a delivery destination, the form returns an honest temporary-unavailability error and keeps the visitor's message. No message is silently discarded with a success response.

## Content that still needs your details

The supplied requirements included the GitHub profile, education and project descriptions, but no resume, reference image, project screenshots, email, LinkedIn URL or verified project URLs.

- `frontend/src/data/socialLinks.js`: add your email, verified LinkedIn URL and resume path.
- `frontend/public/resume/Priyanshu-Das-Resume.pdf`: put your actual PDF here, then enable its configured path.
- `frontend/src/data/projects.js`: add each verified live/repository URL in its one central entry. `YOUR_HOME_LIVE_URL` and `YOUR_HOME_GITHUB_URL` are named placeholders.
- `frontend/public/project-images/`: add real screenshots and configure their paths. Empty or failed images use labeled abstract artwork.
- `frontend/.env`: configure the canonical production origin with `VITE_SITE_URL`.

Unavailable social links are disabled, project links are explicitly marked as coming soon, and the resume link is enabled only when configured. Employment, project dates, URLs and personal details have not been invented.

## Features

- Eight distinct content sections, sticky active-section navigation and a mobile menu with Escape support.
- React/JavaScript/Node.js/MongoDB/Firebase orbital graphic, reveal animations, scroll progress, hover glow and restrained pointer effects.
- Custom desktop outline-and-dot cursor that yields to keyboard use and disables for touch, narrow screens and reduced motion.
- Project category filters, expandable features, safe external links and broken-image fallbacks.
- Shared configuration for all repeated content and personal links.
- Accessible form labels, inline errors, loading state, duplicate-submit guard, success feedback, timeout and network handling.
- Express validation, sanitization, rate limiting, Helmet, restricted CORS, MongoDB persistence and SMTP notifications.
- Self-hosted fonts, semantic metadata, favicon, canonical support and mobile layouts.

## Architecture

```text
frontend/
  public/              # Resume, favicon and project screenshots
  src/
    components/        # One clearly named folder per section
    data/              # Projects, skills, journey, services and personal links
    hooks/             # Pointer, viewport and scroll hooks
    services/          # Contact API client
    styles/            # Shared design tokens and animations
    utils/             # Small interaction helpers
    App.jsx            # Section composition only
  tests/               # Browser and accessibility checks
backend/
  src/
    config/            # Environment and database setup
    controllers/       # Contact delivery orchestration
    middleware/        # Validation, rate limiting and error handling
    models/            # ContactMessage MongoDB schema
    routes/            # Health and contact routes
    services/          # Email notifications
    utils/             # Plain-text sanitization
  test/                # API behavior tests
docs/                  # Browser screenshots and validation notes
```

## Environment configuration

Copy `frontend/.env.example` to `frontend/.env` and `backend/.env.example` to `backend/.env`. Both are ignored by Git. In PowerShell:

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
```

Frontend variables are public build-time values. Never place secrets in a `VITE_` variable.

| Variable           | Purpose                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL`     | Backend origin, without `/api`, such as your deployed API HTTPS origin. Empty uses same-origin requests. |
| `API_PROXY_TARGET` | Development-only proxy target; defaults to local port 3001.                                              |
| `VITE_SITE_URL`    | Canonical public site URL; omitted until configured.                                                     |

Backend environment keys are documented in `backend/.env.example` and `backend/README.md`. Set `FRONTEND_URL` to the exact permitted frontend origin, with comma-separated values if needed. Set `TRUST_PROXY_HOPS` only to match the actual hosting proxy topology; never blindly trust every proxy.

## Contact form and MongoDB setup

1. Create a MongoDB Atlas cluster and a database user with access only to the portfolio database.
2. Allow network access from your backend host and put its connection URI in `MONGODB_URI`. Keep it server-side.
3. For email notifications, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `CONTACT_RECEIVER_EMAIL`. Use a sender verified with your email provider. Port 465 uses implicit TLS; 587 uses STARTTLS when offered by the provider.
4. Restart the API after editing environment variables.
5. Submit a message and verify it in MongoDB and/or the recipient mailbox.

Messages are saved to MongoDB when connected and emailed when SMTP is configured. Success means at least one destination accepted the message. A saved message remains successful if its email notification fails; `notificationStatus` records that failure so you can inspect it. There is no automatic email retry worker. SMTP acceptance is not a guarantee of inbox placement.

The public API does not expose stored messages. Access them through your secured MongoDB tools. Limit access to this personal data and choose an appropriate retention policy before public launch. The development rate limiter is in-process: use a shared store if you scale the API to multiple instances.

## How to edit the website

Each major section owns its JSX and CSS. Start with the folder matching what you see on the page:

| Change                    | Files to open                                                                 |
| ------------------------- | ----------------------------------------------------------------------------- |
| Navbar / menu             | `frontend/src/components/Navbar/`                                             |
| Hero / orbit              | `frontend/src/components/Hero/`                                               |
| About text                | `frontend/src/components/About/`                                              |
| Skills                    | `frontend/src/components/Skills/` and `frontend/src/data/skills.js`           |
| Projects / links          | `frontend/src/components/Projects/` and `frontend/src/data/projects.js`       |
| Learning journey          | `frontend/src/components/LearningJourney/` and `frontend/src/data/journey.js` |
| Education                 | `frontend/src/components/Education/`                                          |
| Services                  | `frontend/src/components/Services/` and `frontend/src/data/services.js`       |
| Contact layout / form     | `frontend/src/components/Contact/`                                            |
| Footer                    | `frontend/src/components/Footer/`                                             |
| Personal details / resume | `frontend/src/data/socialLinks.js`                                            |
| Colors / fonts / spacing  | `frontend/src/styles/variables.css` and `globals.css`                         |
| Cursor / background       | `frontend/src/components/CustomCursor/` and `BackgroundEffects/`              |
| Form request behavior     | `frontend/src/services/contactApi.js`                                         |
| API validation            | `backend/src/middleware/validateContact.js`                                   |

To add a project, copy an object in `data/projects.js`, give it a unique `id`, and fill in verified information. To change a URL, edit only that object's `liveUrl` or `githubUrl`. To add a milestone, edit `data/journey.js`; use milestone labels unless you know exact dates.

## Build and checks

```bash
npm run build
npm test
npx playwright install chromium firefox
npm run test:browser
npm run format:check
```

Keep `npm run dev` running in another terminal for browser tests. Microsoft Edge must be installed to run the `edge` project. Browser checks cover 1440, 1024, 768, 430, 390 and 375-pixel layouts, navigation, filters, form validation, cursor/reduced-motion behavior and automated accessibility. API success paths use injected test destinations; browser success feedback uses an explicitly mocked response. Neither is a claim of delivery to a real mailbox or Atlas cluster. Real unconfigured API failure is tested end to end.

`npm run build` writes `frontend/dist`. `npm start` runs the production API. `npm run format` formats source for readability. See `docs/VALIDATION.md` for the checks completed in this environment.

## Deployment

The requested frontend/backend deployment split is preserved. This project has not been published or connected to external service accounts.

**Vercel:** import the repository, set Root Directory to `frontend`, enable including files outside the root for npm workspace resolution, choose Vite, set `VITE_API_URL` and `VITE_SITE_URL`, and deploy. `frontend/vercel.json` specifies the build output.

**Netlify:** import from the repository root. `netlify.toml` runs the workspace build and publishes `frontend/dist`. Configure `VITE_API_URL` and `VITE_SITE_URL` before the build.

**Render:** use `render.yaml` or create a Node web service with build command `npm ci --workspace backend --include-workspace-root`, start command `npm start --workspace backend`, and health path `/api/health`. Add the backend environment values in the host's secret settings.

**Railway:** deploy the repository as a Node service, use the same backend build/start commands, set the environment keys, and use the platform-provided `PORT`.

After deployment, set backend `FRONTEND_URL` to the deployed frontend origin, verify `GET /api/health`, send a real test message, and confirm receipt/storage. Use HTTPS on both services. Static preview alone cannot deliver contact messages without the configured API.

# Portfolio API

Express API for the public portfolio and admin CMS. It provides MongoDB-backed content, bcrypt/JWT authentication, HTTP-only session cookies, Cloudinary uploads, contact persistence and optional SMTP notification.

## Setup

Copy `.env.example` to `.env`, configure the services you use, then run `npm run dev -w backend`. Production starts with `npm start` from the repository root.

Required for the full CMS:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_USERNAME`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` for the optional non-interactive `npm run seed:admin`
- Cloudinary credentials for project media, certificates, library assets and resume PDFs
- Exact `FRONTEND_URL` and `ADMIN_URL` origins

Optional SMTP settings send contact notifications. A contact request succeeds when MongoDB stores it or SMTP accepts it; it never returns a fake success when every destination fails.

## Route groups

- `GET /api/health`: process health.
- `POST /api/contact`: validated, sanitized, rate-limited visitor messages.
- `GET /api/public/projects|skills|timeline|education|services|certificates|resume|site`: public portfolio content.
- `GET /api/public/resume/download`: streams the active PDF as a download.
- `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me`: admin session lifecycle.
- `/api/admin/projects`: project CRUD, publishing, image galleries and video uploads.
- `/api/admin/profile`: protected combined profile and About editor with profile-photo upload.
- `/api/admin/skill-categories`, `/skills`, `/timeline`, `/experience`, `/education`, `/services`: protected content CRUD.
- `/api/admin/certificates`, `/media`: protected credential and asset APIs.
- `/api/admin/resume` and `/resumes`: upload, history, activation and inactive-version deletion.
- `/api/admin/settings`, `/messages`, `/account`, `/dashboard`: protected settings, inbox, account and summary APIs.

Admin management routes require a valid signed cookie. Request bodies are constrained with Zod, uploads are restricted by MIME type and size, Helmet sets security headers, and CORS accepts only configured frontend/admin origins.

## Seed and test

```powershell
npm run seed
npm run create-admin
npm run seed:admin
npm test
```

The content seed uses upserts so it can be rerun. For the first account, set `MONGODB_URI` and `JWT_SECRET` in `backend/.env`, then use `npm run create-admin`; it interactively asks for username, email, and a masked password. The optional admin seed requires the three `ADMIN_*` variables. Both account commands require a password of at least 12 characters and store only a bcrypt hash. Tests use injected delivery adapters and do not contact a real database or mailbox.

The interactive entry point is `backend/scripts/createAdmin.js`. From the backend folder, run:

```powershell
npm run create-admin
```

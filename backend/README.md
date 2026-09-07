# Portfolio API

Express API with optional MongoDB persistence and SMTP notifications. From the repository root, install with `npm install`, then run `npm run dev` for both apps or `npm run dev -w backend` for only the API. Production starts with `npm start`.

Copy `.env.example` to `.env` inside this folder and set your real service credentials privately.

| Key | Purpose |
| --- | --- |
| `PORT` | Listen port; defaults to 3001; hosting providers may supply it. |
| `FRONTEND_URL` | Comma-separated exact allowed browser origins. |
| `MONGODB_URI` | Atlas/local MongoDB URI; optional if SMTP works. |
| `SMTP_HOST`, `SMTP_PORT` | SMTP host and port (default 587). |
| `SMTP_USER`, `SMTP_PASS` | SMTP authentication credentials. |
| `SMTP_FROM` | Verified sender; falls back to SMTP_USER. |
| `CONTACT_RECEIVER_EMAIL` | Private destination for contact notifications. |
| `TRUST_PROXY_HOPS` | Number of trusted proxy hops (default 0). Configure for your hosting topology. |

## Routes

`GET /api/health` returns `200 { "status": "ok" }`. This is a process liveness check, not a guarantee that a destination is configured.

`POST /api/contact` accepts JSON with `name`, `email` and `message`. Names must contain 2–80 characters, emails must be valid and at most 254 characters, messages must contain 10–5,000 characters. HTML tags and unsafe control characters are stripped from text. Email body content is plain text and user input is never used for the sender header.

- `201`: MongoDB saved the message or SMTP accepted the notification.
- `400`: validation errors in the `errors` map or malformed JSON.
- `403`: browser origin not allowed.
- `413`: request over the 16 KB body limit.
- `429`: more than five contact attempts in 15 minutes per IP.
- `503`: no configured delivery destination or all delivery attempts failed.

No secrets or raw internal errors are returned. If MongoDB stores a message but email fails, the API succeeds and marks `notificationStatus: failed`. Review failed notifications in MongoDB; automatic retries are not implemented. If only MongoDB is configured, read incoming messages there.

`npm test -w backend` uses injected destination adapters to test behavior without real credentials or external messages. For final deployment verification, test with your own Atlas database and SMTP mailbox.

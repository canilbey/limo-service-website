# Booking notification email: Gmail SMTP configuration

This backend sends an HTML email when a new booking is created (`POST /api/bookings`). The message goes to `NOTIFICATION_EMAIL` (default `info@budget-limousine.com`). Outgoing mail is sent through **SMTP**, commonly **Gmail** or **Google Workspace**.

## Prerequisites

- A Google account that is allowed to send mail (personal `@gmail.com` or Workspace user such as `Info@yourdomain.com`).
- **2-Step Verification** enabled on the account.
- An **App Password** (16 characters) used only for this app—not your normal Google password.

Google does not allow typical “less secure app” passwords for SMTP anymore; use an App Password.

## Quick setup: `EMAIL_SERVICE=gmail`

In `backend/.env` (never commit real secrets):

```env
EMAIL_SERVICE=gmail
EMAIL_USER=youraccount@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM=info@budget-limousine.com
NOTIFICATION_EMAIL=info@budget-limousine.com
```

- `EMAIL_USER` / `EMAIL_PASS`: the Gmail or Workspace account that authenticates to Google SMTP (App Password in `EMAIL_PASS`).
- `EMAIL_FROM`: visible “From” address. It should match an address your account is allowed to send as (see below).
- `NOTIFICATION_EMAIL`: where operations receive new-booking alerts (often the same as `EMAIL_FROM`).

Restart the API after changing `.env`.

## Alternative: explicit SMTP host (no `EMAIL_SERVICE`)

Same Gmail servers, useful if you prefer explicit host/port:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youraccount@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM=info@budget-limousine.com
NOTIFICATION_EMAIL=info@budget-limousine.com
```

Port **587** uses STARTTLS (`requireTLS` is set in code). Port **465** uses implicit TLS (`secure: true`).

## Creating a Google App Password

1. Open [Google Account](https://myaccount.google.com/) → **Security**.
2. Enable **2-Step Verification** if it is not already on.
3. Search for **App passwords** (or: Security → How you sign in to Google → App passwords).
4. Create an app password for **Mail** / **Other** (custom name e.g. `limo-backend`).
5. Copy the 16-character password into `EMAIL_PASS` (spaces optional).

Workspace users: the admin may need to allow App Passwords for the organization; some policies restrict them.

## Google Workspace and `EMAIL_FROM`

- If `EMAIL_USER` is `dispatcher@yourdomain.com` and you want `EMAIL_FROM=Info@yourdomain.com`, that address must be a valid user or an alias / “Send mail as” address permitted for that mailbox in Gmail or Admin console.
- If `FROM` is not permitted, Google may reject the message or rewrite the sender.

## Production practices

- Store secrets only on the server or in a secrets manager; do not commit `.env`.
- Rotate App Passwords if leaked or when staff changes.
- Monitor bounces and Google’s sending limits (typical consumer Gmail has low daily caps; Workspace limits are higher).

## Troubleshooting

| Symptom | What to check |
|--------|----------------|
| `535` / `534` / authentication failed | App Password correct, 2FA on, copy/paste errors, Workspace policy blocking SMTP |
| Connection timeout | Firewall allows outbound **587** or **465** to `smtp.gmail.com` |
| “Invalid login” with correct password | Using normal password instead of App Password; or account security blocks “less secure” access (use App Password) |
| Wrong “From” / rejected | `EMAIL_FROM` must be allowed for `EMAIL_USER` |
| Email skipped at startup | Logs: set `EMAIL_SERVICE=gmail` with `EMAIL_USER` + `EMAIL_PASS`, or `EMAIL_HOST` + `EMAIL_USER` for generic SMTP |

## Verification

1. Set variables in `backend/.env`.
2. Run the API (`npm run dev` or production `node`).
3. Submit a test booking via the site or `POST /api/bookings`.
4. Check inbox for `NOTIFICATION_EMAIL`. In development, a log line confirms send: `[email] booking notification sent for reference BL-…`.

For automated tests, email is skipped when SMTP is not configured (no credentials), so CI does not need Gmail.

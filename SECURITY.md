# Security

This is the website of the Acharya Shanti Sagar Foundation, built and
looked after by Sahajta AI.

## Reporting a problem

If you find a security weakness in this website, please tell us privately —
not in a public issue:

- **GitHub:** the repository's **Security → Report a vulnerability** form
  (private vulnerability reporting is on), or
- **Email:** info@shantisagarfoundation.org, with "Security" in the subject.

Please include what you found, how to reproduce it, and what it could allow.
We will reply within a few days and fix confirmed problems as a priority.
Please don't access or change data that isn't yours, run denial-of-service
or spam tests, or make real donations to test the payment flow.

## How the site is protected

- **Sign-in:** the site editor and trustee portal use Google sign-in
  (verified addresses only) against allowlists kept in Vercel, re-checked on
  every request; sessions last a week. The AI connector uses OAuth 2.1 with
  PKCE, signed short-lived tokens and an allowlist of AI apps.
- **Private data** (visitors' questions, gift outcomes, the mailing list)
  is encrypted (AES-256-GCM) before it is stored; the key lives only in Vercel.
- **The browser:** a strict Content-Security-Policy, HSTS, framing refused,
  and a narrower policy on the donate page for the payment provider alone.
- **Abuse:** per-visitor rate limits on the assistant, voice, speech, sign-in
  and donation endpoints.
- **Watching:** CodeQL code scanning, secret scanning with push protection,
  Dependabot alerts and updates, and the Security watch workflow
  (`.github/workflows/security.yml`), which checks dependencies and that the
  live site's locked doors stay locked.

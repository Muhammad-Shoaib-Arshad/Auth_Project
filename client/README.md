Simple static frontend to test the auth backend.

How to serve locally (option A: using Node's http-server):

This project now includes a small React + Vite frontend that mimics a real website for testing the auth flows.

Quick start (install and run the client):

1. Install dependencies (from project root or `client`):

   cd client
   npm install

2. Start the dev server on http://localhost:3000:

   npm run dev

Notes:
- The client calls the backend at `http://localhost:5000` by default. To change this, set `VITE_API_URL` in `client/.env`.
- The client includes pages: Register, Login, Verify, Forgot, Reset.
- Cookies are sent with `credentials: include` so the server must allow `CLIENT_URL` in CORS (already set to http://localhost:3000 in `server/.env`).
- If SMTP is configured in `server/.env`, OTPs will be sent via Brevo; otherwise the server logs OTP codes for testing.

Build for production:

  npm run build

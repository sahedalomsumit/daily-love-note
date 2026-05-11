# Daily Love Note 💖

Full-stack automation app that sends a daily heartfelt message from **Sahed** to **Tamanna**. Featuring advanced AI fallback systems and WhatsApp integration.

## ✨ Key Features
- **Smart AI Generation**: Uses a 7-tier dynamic fallback system (Gemini 2.0, 3.1, Flash, Pro) to ensure a message is always generated.
- **WhatsApp Automation**: Real-time message delivery via WhatsApp Web.
- **Modern Dashboard**: Premium UI with live connection status, message history, and manual trigger modes.
- **Robust Storage**: Firebase Firestore integration for message deduplication and history.
- **Multi-lingual**: Naturally rotates between English and Bangla script.

## 🚀 Deployment

### 1. Backend (Render)
- Deploy the `server/` directory to **Render** as a Web Service.
- **Dependencies**: Puppeteer requires specific build settings on Render (see `puppeteer` config in `whatsapp.js`).
- **Environment Variables**:
  - `GEMINI_API_KEY`: Your Google AI Studio key.
  - `GEMINI_MODELS`: Comma-separated list of 7+ models (e.g., `gemini-2.0-flash,gemini-flash-latest...`).
  - `FIREBASE_SERVICE_ACCOUNT`: Minified JSON service account key.
  - `WIFE_PHONE`: Recipient's phone number with country code.
  - `APP_SECRET`: Security token for API access.

### 2. Frontend (GitHub Pages)
- Deploy the `client/` directory to **GitHub Pages**.
- **Important**: Update `vite.config.js` with `base: '/repo-name/'` if not using a custom domain.
- **Environment Variables**:
  - `VITE_API_URL`: Your Render backend URL.
  - `VITE_APP_SECRET`: Must match backend `APP_SECRET`.

## 🛠️ Local Setup

### Backend
1. `cd server`
2. `npm install`
3. `node index.js`
4. Scan the QR code from the Dashboard to link WhatsApp.

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev`

## 📅 Scheduling
Set up two jobs on **cron-job.org**:
1. **Keep Alive**: `GET /api/health` every 10 minutes to prevent Render sleep.
2. **Daily Trigger**: `POST /api/trigger` once daily at your preferred time with `Authorization: Bearer YOUR_APP_SECRET`.

## 🔒 Security
- **Bearer Token Auth**: All sensitive routes are protected.
- **Secure Storage**: Sessions are persisted securely via `LocalAuth`.
- **API Robustness**: Firestore API must be enabled in Google Cloud Console to track history.

---
Created with love by **Sahed** for **Tamanna**.
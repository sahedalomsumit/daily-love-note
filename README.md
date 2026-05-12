# Daily Love Note 💖

> A premium full-stack automation bridge that sends heartfelt, AI-crafted messages daily. Because love should never be on autopilot, even when the messages are.

![Daily Love Note Dashboard](file:///C:/Users/sahed/.gemini/antigravity/brain/ee6446ae-0b6f-4bec-a144-10d946e7683d/daily_love_note_dashboard_mockup_1778571230568.png)

## ✨ Key Features

- **🧠 Smart AI Generation**: Powered by a **7-tier dynamic fallback system**. If one Gemini model is busy, the system automatically tries the next (Pro, Flash, 2.0, etc.), ensuring your loved one never misses a note.
- **📲 WhatsApp Automation**: Seamless delivery via WhatsApp Web integration. Now supports **Pairing Code** authentication for a QR-free, stable connection.
- **🎨 Premium Dashboard**: A glassmorphic, responsive UI built with React 19 and Tailwind CSS 4. Monitor connection status, view message history, and trigger manual notes with style.
- **🛡️ Robust & Resilient**: Integrated with **Firebase Firestore** for message deduplication and persistent state management. Never sends the same note twice.
- **🌍 Multi-lingual Romance**: Naturally rotates between English and Bangla script to keep the connection authentic.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Backend**: [Node.js 20](https://nodejs.org/), [Express 5](https://expressjs.com/), [WhatsApp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- **AI**: [Google Gemini AI](https://ai.google.dev/) (Multiple fallback tiers)
- **Infrastructure**: [Firebase](https://firebase.google.com/) (Hosting, Functions, Firestore)

## 🚀 Getting Started

### 1. Environment Configuration

Create a `.env` file in both `client/` and `server/` directories.

**Server (`server/.env`):**
```env
GEMINI_API_KEY=your_google_ai_key
GEMINI_MODELS=gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-pro...
FIREBASE_SERVICE_ACCOUNT={"project_id": "..."}
WIFE_PHONE=8801XXXXXXXXX
APP_SECRET=your_secure_token
```

**Client (`client/.env`):**
```env
VITE_API_URL=https://your-api-url.com
VITE_APP_SECRET=your_secure_token
```

### 2. Local Installation

```bash
# Install root dependencies
npm install

# Run Backend
cd server
npm install
npm run dev

# Run Frontend
cd ../client
npm install
npm run dev
```

### 3. Connecting WhatsApp

1. Open the Dashboard.
2. Select **Pairing Code** (or Scan QR if preferred).
3. Enter your phone number and follow the instructions to link the device.

## 📦 Deployment

This project is optimized for **Firebase**.

1. **Firestore**: Enable Firestore in your Firebase Console.
2. **GitHub Actions**: The repository includes a `firebase-deploy.yml` workflow.
3. **Secrets**: Add `FIREBASE_TOKEN` and `VITE_APP_SECRET` to your GitHub Repository Secrets.
4. **Trigger**: Simply push to `main` to deploy both Frontend (Hosting) and Backend (Functions).

## 📅 Automation

To automate the daily message, set up a cron job (via GitHub Actions or external services like `cron-job.org`):

- **Daily Trigger**: `POST /api/trigger`
- **Headers**: `Authorization: Bearer YOUR_APP_SECRET`

---

Created with ❤️ by **Sahed** for **Tamanna**.
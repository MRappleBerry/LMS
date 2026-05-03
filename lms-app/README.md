# LexisAI – Legal Learning Management System

> A full-stack LMS with AI assistant for law students. Built with React + Vite (frontend) and Node.js + Express (backend), deployable for free on Vercel and Render.

---

## ✨ Features

- 📊 **Dashboard** – Stats, quick access cards, recent activity
- 🤖 **AI Chat** – Ask legal questions powered by OpenAI (falls back to mock responses if no key)
- 📚 **Case Library** – Browse and filter landmark legal cases
- 🧠 **Study Mode** – Flashcards, quiz mode, and category mastery tracking
- 📝 **Notes** – Notion-style editor linked to cases
- ⚙️ **Settings** – Theme toggle and feature switches
- 🌙 **Dark/Light mode** – Full theme support

---

## 🗂 Project Structure

```
lms-app/
├── client/          # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/   # Sidebar, Topbar
│   │   ├── views/        # Dashboard, ChatView, CaseLibrary, StudyMode, Notes, Settings
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/          # Node.js + Express backend
│   ├── index.js     # API server with /api/chat endpoint
│   ├── .env.example
│   └── package.json
│
└── .gitignore
```

---

## 🚀 Local Development

### Prerequisites
- Node.js ≥ 18
- npm or pnpm

### 1. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure environment variables

```bash
# Server
cd server
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY (optional — app works without it in mock mode)

# Client
cd ../client
cp .env.example .env
# Leave VITE_API_URL empty for local dev (Vite proxies /api → localhost:5000)
```

### 3. Run locally

```bash
# Terminal 1 — backend
cd server
npm run dev      # starts on http://localhost:5000

# Terminal 2 — frontend
cd client
npm run dev      # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## ☁️ Deployment (Free Tier)

### Step 1 — Push to GitHub

```bash
cd lms-app
git init
git add .
git commit -m "Initial commit — LexisAI LMS"
git remote add origin https://github.com/YOUR_USERNAME/lexis-ai.git
git push -u origin main
```

---

### Step 2 — Deploy Backend on Render (free)

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Configure:
   | Setting | Value |
   |---|---|
   | **Root Directory** | `server` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node index.js` |
   | **Instance Type** | Free |

4. Add **Environment Variables**:
   | Key | Value |
   |---|---|
   | `OPENAI_API_KEY` | `sk-your-key-here` |
   | `CLIENT_URL` | *(set this after Vercel deploys — see Step 3)* |

5. Click **Deploy** — Render gives you a URL like `https://lms-server-xxxx.onrender.com`

> **Note:** Free Render instances spin down after inactivity. First request after sleep takes ~30 seconds.

---

### Step 3 — Deploy Frontend on Vercel (free)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Configure:
   | Setting | Value |
   |---|---|
   | **Root Directory** | `client` |
   | **Framework Preset** | Vite |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

4. Add **Environment Variable**:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://lms-server-xxxx.onrender.com` *(your Render URL)* |

5. Click **Deploy** — Vercel gives you a URL like `https://lexis-ai.vercel.app`

6. Go back to **Render** and set `CLIENT_URL` to your Vercel URL (for CORS).

---

### Step 4 — Verify

- Open your Vercel URL in the browser
- Navigate to **AI Assistant** and send a message
- Check `/health` endpoint on Render: `https://lms-server-xxxx.onrender.com/health`

---

## 🔐 Security Notes

- **Never** commit `.env` files — they are gitignored
- OpenAI API key lives only on the server (never exposed to the browser)
- CORS is configured to only allow requests from your Vercel frontend

---

## 🛠 API Reference

### `GET /health`
Returns server status and AI mode.

```json
{ "status": "ok", "timestamp": "...", "aiMode": "openai" }
```

### `POST /api/chat`
```json
// Request
{ "message": "Explain judicial review" }

// Response
{ "reply": "Judicial review is...", "mode": "openai" }
```

---

## 🤖 AI Behaviour

| Scenario | Behaviour |
|---|---|
| `OPENAI_API_KEY` set | Real GPT-3.5-turbo responses |
| No API key | Rotating mock educational responses |
| API error | Graceful error message shown in chat |
| Rate limit | User-friendly message with retry prompt |

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Backend | Node.js 18+, Express 4 |
| AI | OpenAI API (gpt-3.5-turbo) |
| Hosting (Frontend) | Vercel (free) |
| Hosting (Backend) | Render (free) |

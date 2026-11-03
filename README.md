# 🎬 PRANAYFLIX: Season 20

A mobile-first, Netflix-style streaming platform created exclusively for **Pranay's 20th Birthday** (10 November 2026), premiering "Pranay: Season 20" after 19 seasons of childhood and teenage chaos.

Designed and directed with endless love & humor by **Janmesh Roida**.

Repository: [https://github.com/janmesh16/Pranay-Birthday](https://github.com/janmesh16/Pranay-Birthday)

---

## 🌐 Deploying to Render (Web Service)

PRANAYFLIX is configured for production deployment on Render as a **Web Service** (Node.js server) using the included [`render.yaml`](./render.yaml) and high-performance [`server.js`](./server.js) HTTP streaming server.

### Step-by-Step Render Web Service Guide

#### Step 1: Push Code to GitHub
Ensure all your latest files are committed and pushed to your repository:
```bash
git add .
git commit -m "Configure PRANAYFLIX for Render Web Service deployment"
git push origin main
```
> **Security Notice**: `.gitignore` strictly protects your `.env` file so your real keys are never committed to GitHub.

#### Step 2: Create Web Service on Render
1. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. Connect your GitHub repository: `janmesh16/Pranay-Birthday`.
3. Configure the service settings (or let Render auto-detect from [`render.yaml`](./render.yaml)):
   - **Name**: `pranayflix`
   - **Environment / Runtime**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (or `node server.js`)
   - **Instance Type**: `Free`

#### Step 3: Add Environment Variables on Render
Under the **Environment** tab in your Render Web Service settings, add the following environment variables:

| Key | Example / Description |
| :--- | :--- |
| `VITE_PREVIEW_KEY` | `pranay20` *(Secret key to bypass countdown before 10 Nov)* |
| `VITE_FIREBASE_API_KEY` | `AIzaSyBYEbNC8FCcNHi3kkiZOYN7l5RCUtscoOc` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `pranayflix-20.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `pranayflix-20` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `pranayflix-20.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `741073625710` |
| `VITE_FIREBASE_APP_ID` | `1:741073625710:web:516f2cdc567945ad3ebc7f` |

#### Step 4: Click Create Web Service!
Render will build the Vite bundle, start the Node.js server on `$PORT`, and provide your live HTTPS URL (e.g. `https://pranayflix.onrender.com`).

---

## 🔑 Preview Bypass (Testing Before Midnight 10 Nov 2026)

By default, the platform displays the **Premiere Lock** counting down accurately to **10 November 2026, 00:00:00 IST** (synchronized against reliable network time).

The lock screen has **no UI skip buttons** to prevent Pranay from peeking before his birthday.

To preview and test the full experience before midnight:
- Append `?preview=1` AND your secret key:
  ```
  https://<your-render-url>.onrender.com/?preview=1&key=pranay20
  ```
  *(Or locally at `http://localhost:5173/?preview=1&key=pranay20`)*

---

## 📝 Customizing Content (`src/content.js`)

All personal details, photos, video links, inside jokes, and friend codes live in **one single file**:
👉 [`src/content.js`](./src/content.js)

### What to Fill In:
1. **19 Seasons (`CONFIG.seasons`)**: 19 entries (years 2007 to 2025) with custom titles, captions, and photo paths.
2. **Friends & Secret Codes (`CONFIG.friends`)**: Each friend has their name, role, photo path, personal birthday message, and a unique secret code (e.g. `ARYAN-404`, `ROHAN-99`, `KABIR-CHAI`, `TANVI-VIBES`).
3. **Special Episode (`CONFIG.special`)**: Janmesh Roida's photos, name, and personal emotional letter (Secret code: `JANMESH-ROIDA`).
4. **Secret Director's Cut (`CONFIG.directorsCut`)**: Uncensored bonus reel and director notes, unlocked automatically when all friend codes are cracked!
5. **Deleted Scenes (`CONFIG.deletedScenes`)**: Bloopers, embarrassing archives, voice notes, and old chat screenshots.
6. **Season 30 Time Capsule (`CONFIG.timeCapsule`)**: Sealed decade predictions & letter with automated countdown to 10 Nov 2036.
7. **Year in Review Stories (`CONFIG.yearInReview`)**: Swipeable Wrapped-style stats (4,218 "Bhais", WhatsApp latency, chai consumption).
8. **Main Trailer Video (`CONFIG.mainVideo`)**: Path to the birthday montage video (e.g. `/video/journey.mp4`).

> **Zero Crash Guarantee**: If any photo or video file is missing or left as a placeholder, the app automatically renders a stylish dark gradient card with "Coming soon", never crashing or looking broken.

---

## 📁 Media Files Guide (`/public/`)

Place all your media assets in the `/public/` directory:
- `/public/photos/hero.jpg` : Main banner hero photo of Pranay.
- `/public/photos/video-poster.jpg` : Video player thumbnail poster.
- `/public/photos/seasons/` : Photos `01.jpg` through `19.jpg`.
- `/public/photos/friends/` : Photos for each friend (`friend01.jpg`, etc.).
- `/public/photos/janmesh/` : Photos `01.jpg`, `02.jpg`, `03.jpg` for the special letterbox episode.
- `/public/video/journey.mp4` : The main trailer / journey video (MP4, H.264).
- `/public/audio/intro.mp3` : (Optional) Custom audio sting. If omitted, the app uses its custom Web Audio API synthesized cinematic bass boom & chord!

> **GitHub File Size Rule**: Keep individual files in `/public/` under 50 MB (GitHub strictly blocks pushes containing files over 100 MB).

---

## 🎂 Features & Flow

1. **Premiere Lock**: Live countdown to IST midnight 10 Nov 2026. Auto-unlocks at zero with smooth fade.
2. **Who's Watching**:
   - **Pranay**: Starts intro sound and enters the platform.
   - **Guest**: Shakes with "Access denied: not invited."
   - **Roast Mode**: Activates hilarious roast toasts and overlays.
   - **Mom / Family**: Heartwarming family surprise modal.
3. **Xbox-Style Achievements**:
   - Pop-up toasts with chime sound for: *Found a friend's code*, *Watched the full trailer*, *Blew out all 20 candles*, *Read Janmesh's letter*, etc.
   - Unlocking every friend opens the secret **Director's Cut** bonus screen.
4. **Deleted Scenes & Bloopers**:
   - Unfiltered vault row featuring leaked voice notes with audio visualizer, blooper reels, and chat screenshots.
5. **Live Notifications Bell**:
   - Red dot badge with unread count updating dynamically when friends unlock or reviews arrive.
6. **Season 30 Time Capsule**:
   - Cryogenically sealed vault counting down to 10 Nov 2036 with encrypted friend predictions.
7. **Your Year in Review (Wrapped Stories)**:
   - Fullscreen animated stories with progress bars, sound effects, confetti, and shareable stat card.
8. **Finale Celebration**:
   - "Are you still watching?" confirmation.
   - **20th Birthday Cake**: 20 candles with real microphone blow detection + tap fallback.
   - Confetti explosion, rolling credits, gift card voucher reveal, and HD Poster generator.
9. **Fan Reviews Wall**:
   - Real-time Firestore reviews wall (4 or 5 stars only) with local storage fallback.
   - Deploy Firestore rules anytime with: `npm run deploy:rules`.

---

Happy 20th Birthday Pranay! 🎉

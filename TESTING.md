# 📱 PRANAYFLIX: Two-Phone Testing Checklist

Use this checklist to verify PRANAYFLIX across two different mobile devices (e.g. **Phone A: iPhone / Safari** and **Phone B: Android / Chrome**).

> ⚠️ **HTTPS Notice:** The Web Audio microphone blow detection strictly requires an HTTPS connection (or `localhost`). Deploying to Firebase Hosting automatically provides full HTTPS SSL.

---

## 🛠️ Step 0: Setup & URL Preparation

Deploy the app to Firebase Hosting, then open the links on both phones:
- **Locked URL**: `https://<YOUR-FIREBASE-PROJECT-ID>.web.app/`
- **Preview Bypass URL**: `https://<YOUR-FIREBASE-PROJECT-ID>.web.app/?preview=1&key=pranay20`

---

## 📋 Testing Matrix

| # | Feature / Test Case | Phone A (Tester 1) | Phone B (Tester 2) | Expected Result | Pass? |
|---|---------------------|--------------------|--------------------|-----------------|:-----:|
| **1** | **Strict Premiere Lock** | Open without query parameters | Open without query parameters | Live countdown to **10 Nov 2026 IST**. No UI skip buttons are visible. Lock cannot be bypassed. | [ ] |
| **2** | **Secret Key Bypass** | Open `?preview=1` (no key) | Open `?preview=1&key=wrongkey` | Lock remains strictly **ACTIVE**. | [ ] |
| **3** | **Authorized Access** | Open `?preview=1&key=pranay20` | Open `?preview=1&key=pranay20` | Lock screen instantly bypasses to **Who's Watching?**. | [ ] |
| **4** | **Guest Profile Rejection** | Tap **Guest** profile | Tap **Guest** profile | Card shakes violently with buzzer sound: *"Access denied: not invited."* | [ ] |
| **5** | **Profile Audio Unlock** | Tap **Pranay** profile | Tap **Roast Mode** profile | Browser audio context unlocks; original PRANAYFLIX cinematic bass boom and synth chord plays. | [ ] |
| **6** | **Cloud Sync Status** | Scroll down to **Fan Reviews** | Scroll down to **Fan Reviews** | Green badge shows **🟢 Live Cloud Sync** on both devices. | [ ] |
| **7** | **Real-Time Cross-Phone Review** | Post a 5★ review from **Phone A**: *"Testing live from iPhone!"* | Keep **Phone B** open on Fan Reviews | **Phone B** automatically receives the new review **in real-time without page refresh**. Badge flashes `⚡ Synced New Review`. | [ ] |
| **8** | **Friend Code Vault Independence** | Unlock Aryan with `ARYAN-404` | Check Aryan card | Aryan is unlocked on Phone A, but remains locked on Phone B (independent device `localStorage`). | [ ] |
| **9** | **Special Episode (Janmesh Roida)** | Enter `JANMESH-ROIDA` | — | Cinematic letterbox mode activates: black bars, Ken Burns photo zoom, paragraph-by-paragraph letter in serif font. | [ ] |
| **10** | **Video Player & Roast Subtitles** | Tap **Watch Trailer** | Tap **Watch Trailer** | Custom player loads with controls. Select *Roast Mode* subtitles: funny roasts appear at timestamps. Thumbs-down shows joke error. | [ ] |
| **11** | **Microphone Blow Detection** | Tap **Birthday Finale** -> Allow mic | Tap **Birthday Finale** -> Allow mic | Blow air gently onto phone microphone -> Candles extinguish dynamically. Confetti explodes! | [ ] |
| **12** | **Tap Fallback for Cake** | — | Tap "Extinguish All" button | Candles extinguish immediately and trigger confetti without microphone needed. | [ ] |
| **13** | **Poster Canvas Download** | Proceed to Step 7 (Poster) | Proceed to Step 7 (Poster) | Tap **Download Season 20 Poster (HD)** -> 1080×1920 phone-story PNG saves directly to camera roll / downloads. | [ ] |
| **14** | **Logo Easter Egg** | Tap **PRANAYFLIX** logo 5 times | — | Secret *Creator's Cut* Easter egg dialog unlocks! | [ ] |
| **15** | **Search Easter Egg** | Tap search, type `"my crush"` | — | Displays: *"Error 404: Relationship not found."* | [ ] |

---

## 🎯 Verification Complete!
Once all boxes are checked, PRANAYFLIX is ready for Pranay's 20th birthday premiere on **10 November 2026**! 🎉


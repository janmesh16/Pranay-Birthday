import React, { useState, useEffect } from 'react';
import { CONFIG } from './content';
import { PremiereLock } from './components/PremiereLock';
import { WhosWatching } from './components/WhosWatching';
import { IntroSting } from './components/IntroSting';
import { Homepage } from './components/Homepage';
import { VideoPlayer } from './components/VideoPlayer';
import { SpecialEpisode } from './components/SpecialEpisode';
import { FinaleCelebration } from './components/FinaleCelebration';
import { RoastToasts } from './components/RoastToasts';
import { AchievementToast } from './components/AchievementToast';
import { hasUnlocked } from './utils/timeSync';
import { unlockAchievement } from './utils/achievements';

// Secret preview key configured via .env (e.g. ?preview=1&key=pranay20)
const configuredPreviewKey = import.meta.env.VITE_PREVIEW_KEY || "pranay20";

function checkPreviewBypass() {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const hasPreview = params.get('preview') === '1';
    const key = params.get('key');
    return Boolean(hasPreview && key && key === configuredPreviewKey);
  } catch {
    return false;
  }
}

export function App() {
  // Check if ?preview=1&key=<secret_key> bypass is active
  const hasPreviewBypass = checkPreviewBypass();
  const isPastUnlockTime = hasUnlocked(CONFIG.unlockAt);

  // Screens: 'lock' | 'profile' | 'intro' | 'home' | 'video' | 'special' | 'finale'
  const [currentScreen, setCurrentScreen] = useState(() => {
    if (hasPreviewBypass || isPastUnlockTime) {
      return 'profile';
    }
    return 'lock';
  });

  const [roastMode, setRoastMode] = useState(() => {
    try {
      return localStorage.getItem('pranayflix_roast_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [activeToast, setActiveToast] = useState(null);

  const triggerToast = (msg) => {
    setActiveToast(msg);
    setTimeout(() => {
      setActiveToast((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const handleToggleRoastMode = () => {
    const nextVal = !roastMode;
    setRoastMode(nextVal);
    try {
      localStorage.setItem('pranayflix_roast_mode', String(nextVal));
    } catch {
      // ignore
    }
    if (nextVal) {
      unlockAchievement('ROAST_MODE');
    }
    triggerToast(nextVal ? "Roast Mode ACTIVATED 🌶️" : "Roast Mode Deactivated");
  };

  const handleSelectProfile = ({ role, roastMode: isRoast }) => {
    if (isRoast) {
      setRoastMode(true);
      try {
        localStorage.setItem('pranayflix_roast_mode', 'true');
      } catch {
        // ignore
      }
    }
    setCurrentScreen('intro');
  };

  return (
    <div className="relative min-h-screen bg-[#0b0b0f] text-white selection:bg-[#E50914] selection:text-white font-sans">
      {/* SCREEN 1: Premiere Lock */}
      {currentScreen === 'lock' && (
        <PremiereLock onUnlock={() => setCurrentScreen('profile')} />
      )}

      {/* SCREEN 2: Who's Watching? */}
      {currentScreen === 'profile' && (
        <WhosWatching onSelectProfile={handleSelectProfile} />
      )}

      {/* SCREEN 3: Intro Sting */}
      {currentScreen === 'intro' && (
        <IntroSting onComplete={() => setCurrentScreen('home')} />
      )}

      {/* SCREEN 4: Homepage */}
      {currentScreen === 'home' && (
        <Homepage
          roastMode={roastMode}
          onToggleRoastMode={handleToggleRoastMode}
          onOpenVideo={() => setCurrentScreen('video')}
          onOpenSpecial={() => setCurrentScreen('special')}
          onOpenFinale={() => setCurrentScreen('finale')}
          onSwitchProfile={() => setCurrentScreen('profile')}
          onTriggerToast={triggerToast}
        />
      )}

      {/* SCREEN 5: Special Episode (Janmesh Roida) */}
      {currentScreen === 'special' && (
        <SpecialEpisode onClose={() => setCurrentScreen('home')} />
      )}

      {/* SCREEN 6: Main Video Player */}
      {currentScreen === 'video' && (
        <VideoPlayer
          initialRoastMode={roastMode}
          onVideoEnd={() => setCurrentScreen('finale')}
          onClose={() => setCurrentScreen('home')}
        />
      )}

      {/* SCREEN 7: Finale Celebration */}
      {currentScreen === 'finale' && (
        <FinaleCelebration
          onReturnHome={() => setCurrentScreen('home')}
          onFinish={() => setCurrentScreen('home')}
        />
      )}

      {/* Global Roast & Notification Toasts */}
      <RoastToasts
        roastMode={roastMode}
        activeCustomToast={activeToast}
        onCloseCustomToast={() => setActiveToast(null)}
      />

      {/* Xbox-style Achievement Unlocked Toasts */}
      <AchievementToast />
    </div>
  );
}

export default App;


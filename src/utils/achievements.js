import { playAchievementSound } from './audio';

export const ACHIEVEMENTS = {
  FRIEND_CODE: {
    id: 'friend_code',
    title: "Found a Friend's Code",
    desc: "Cracked an encrypted friend vault",
    gamerscore: "25G",
    icon: "Key"
  },
  ALL_FRIENDS: {
    id: 'all_friends',
    title: "The Whole Squad",
    desc: "Unlocked all friend episodes + Director's Cut",
    gamerscore: "100G",
    icon: "Users"
  },
  WATCH_TRAILER: {
    id: 'watch_trailer',
    title: "Watched the Full Trailer",
    desc: "Sat through the 20-Year Teaser without skipping",
    gamerscore: "50G",
    icon: "Tv"
  },
  BLOW_CANDLES: {
    id: 'blow_candles',
    title: "Blew Out All 20 Candles",
    desc: "Extinguished every single candle on the Season 20 cake",
    gamerscore: "50G",
    icon: "Flame"
  },
  JANMESH_LETTER: {
    id: 'janmesh_letter',
    title: "Read Janmesh's Letter",
    desc: "Surviving the emotional director's cut note",
    gamerscore: "50G",
    icon: "Heart"
  },
  ROAST_MODE: {
    id: 'roast_mode',
    title: "Spicy Taste",
    desc: "Activated the uncensored roast subtitles",
    gamerscore: "25G",
    icon: "Flame"
  },
  YEAR_IN_REVIEW: {
    id: 'year_in_review',
    title: "Season 19 Wrapped",
    desc: "Finished reviewing your ridiculous yearly stats",
    gamerscore: "25G",
    icon: "BarChart3"
  },
  TIME_CAPSULE: {
    id: 'time_capsule',
    title: "Time Traveler",
    desc: "Inspected the Season 30 Cryogenic Vault",
    gamerscore: "25G",
    icon: "Clock"
  },
  DELETED_SCENES: {
    id: 'deleted_scenes',
    title: "Behind the Scenes",
    desc: "Discovered an unfiltered vault deleted scene",
    gamerscore: "25G",
    icon: "Film"
  },
  FAN_REVIEW: {
    id: 'fan_review',
    title: "Film Critic",
    desc: "Shared a 5-star review on the Fan Wall",
    gamerscore: "25G",
    icon: "Star"
  }
};

const STORAGE_KEY = 'pranayflix_achievements';

/**
 * Returns array of unlocked achievement IDs
 */
export function getUnlockedAchievements() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Unlocks an achievement if not already earned.
 * Plays the Xbox chime and triggers a global custom event for the toast popup.
 */
export function unlockAchievement(achievementKey) {
  if (typeof window === 'undefined') return null;

  const achievement = typeof achievementKey === 'string' 
    ? ACHIEVEMENTS[achievementKey] || { id: achievementKey, title: achievementKey, desc: "Achievement unlocked!", gamerscore: "25G" }
    : achievementKey;

  if (!achievement || !achievement.id) return null;

  try {
    const unlocked = getUnlockedAchievements();
    if (unlocked.includes(achievement.id)) {
      return null; // Already unlocked
    }

    const updated = [...unlocked, achievement.id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Play signature Xbox chime
    playAchievementSound();

    // Broadcast event for the Xbox-style toast UI
    window.dispatchEvent(new CustomEvent('pranayflix:achievement', {
      detail: achievement
    }));

    return achievement;
  } catch (err) {
    console.warn("Failed to save achievement:", err);
    return null;
  }
}


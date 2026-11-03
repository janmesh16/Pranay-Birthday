/**
 * Reliable Network Time Synchronization
 * 
 * Protects countdown accuracy by checking real server/network time rather than
 * solely trusting local device clock (which can be manipulated or incorrect).
 * Gracefully falls back to device clock if offline or unreachable.
 */

let networkOffsetMs = 0; // difference: (reliableNow - localNow)
let hasAttemptedSync = false;
let isSyncedFromNetwork = false;

/**
 * Attempts to synchronize time with reliable network sources.
 * Returns { synced: boolean, now: number, source: string }
 */
export async function syncNetworkTime() {
  if (hasAttemptedSync && isSyncedFromNetwork) {
    return { synced: true, now: getAccurateNow(), source: 'cached' };
  }
  hasAttemptedSync = true;

  // Attempt 1: Fast HTTP HEAD request to origin server to parse standard 'date' header
  try {
    if (typeof window !== 'undefined' && window.location) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(window.location.origin + '/?_t=' + Date.now(), {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeout);

      const serverDateHeader = res.headers.get('date');
      if (serverDateHeader) {
        const parsedServerTime = new Date(serverDateHeader).getTime();
        if (!isNaN(parsedServerTime) && parsedServerTime > 0) {
          networkOffsetMs = parsedServerTime - Date.now();
          isSyncedFromNetwork = true;
          return { synced: true, now: getAccurateNow(), source: 'origin_server' };
        }
      }
    }
  } catch {
    // Continue to external time APIs
  }

  // Attempt 2: TimeAPI.io (Asia/Kolkata IST)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://timeapi.io/api/time/current/zone?timeZone=Asia%2FKolkata', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.dateTime) {
        const parsedTime = new Date(data.dateTime).getTime();
        if (!isNaN(parsedTime) && parsedTime > 0) {
          networkOffsetMs = parsedTime - Date.now();
          isSyncedFromNetwork = true;
          return { synced: true, now: getAccurateNow(), source: 'timeapi' };
        }
      }
    }
  } catch {
    // Continue to next fallback
  }

  // Attempt 3: WorldTimeAPI fallback
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && (data.utc_datetime || data.datetime)) {
        const parsedTime = new Date(data.utc_datetime || data.datetime).getTime();
        if (!isNaN(parsedTime) && parsedTime > 0) {
          networkOffsetMs = parsedTime - Date.now();
          isSyncedFromNetwork = true;
          return { synced: true, now: getAccurateNow(), source: 'worldtimeapi' };
        }
      }
    }
  } catch {
    // Offline or blocked
  }

  // Fallback: local device clock
  networkOffsetMs = 0;
  isSyncedFromNetwork = false;
  return { synced: false, now: Date.now(), source: 'device_clock' };
}

/**
 * Returns current accurate timestamp (adjusted by network offset if available)
 */
export function getAccurateNow() {
  return Date.now() + networkOffsetMs;
}

/**
 * Checks whether the unlock date has passed
 */
export function hasUnlocked(unlockAtString) {
  try {
    const target = new Date(unlockAtString).getTime();
    return getAccurateNow() >= target;
  } catch {
    return false;
  }
}


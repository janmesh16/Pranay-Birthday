/**
 * Audio helper for PRANAYFLIX
 * 
 * Provides an original synthesized cinematic intro sting (no copyright infringement),
 * plus UI sounds and microphone blow detection for the 20th birthday cake.
 * 
 * Includes explicit iOS Safari audio unlock helpers.
 */

let audioCtx = null;
let isAudioUnlocked = false;

export function getAudioContext() {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (err) {
    console.warn("AudioContext unavailable:", err);
    return null;
  }
}

/**
 * Explicit iOS Safari AudioContext Unlocker.
 * Must be executed synchronously within a touchstart / click event.
 */
export function unlockAudio() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Play a 1-sample silent buffer to officially satisfy iOS Safari's audio gate
    if (!isAudioUnlocked) {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      isAudioUnlocked = true;
    }
  } catch (e) {
    console.warn("iOS audio unlock error:", e);
  }
}

// Global one-time first touch listener to unlock audio on mobile devices automatically
if (typeof window !== 'undefined') {
  const handleFirstInteraction = () => {
    unlockAudio();
    window.removeEventListener('touchstart', handleFirstInteraction, true);
    window.removeEventListener('touchend', handleFirstInteraction, true);
    window.removeEventListener('click', handleFirstInteraction, true);
  };
  window.addEventListener('touchstart', handleFirstInteraction, { capture: true, passive: true });
  window.addEventListener('touchend', handleFirstInteraction, { capture: true, passive: true });
  window.addEventListener('click', handleFirstInteraction, { capture: true, passive: true });
}

/**
 * Plays an original cinematic PRANAYFLIX intro sound.
 * If custom introSound file is available, attempts to play it.
 * Otherwise plays a rich synthesized bass boom + warm harmonic chord.
 */
export async function playIntroSound(customSoundPath) {
  // Synchronously wake up audio for iOS
  unlockAudio();

  // If custom audio file provided and playable
  if (customSoundPath) {
    try {
      const audio = new Audio(customSoundPath);
      audio.playsInline = true;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        return;
      }
    } catch {
      // Fallback to Web Audio synthesizer
    }
  }

  // Synthesize an original cinematic sting:
  // Deep bass impact (sub frequency) + dramatic swelling orchestral chord + shimmer
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Deep Sub Bass Impact (65Hz down to 35Hz)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(65, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.8);

    subGain.gain.setValueAtTime(0.01, now);
    subGain.gain.linearRampToValueAtTime(0.8, now + 0.08);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 2.5);

    // 2. Punch Transient (Kick drum style thump)
    const punchOsc = ctx.createOscillator();
    const punchGain = ctx.createGain();
    punchOsc.type = 'triangle';
    punchOsc.frequency.setValueAtTime(160, now);
    punchOsc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

    punchGain.gain.setValueAtTime(0.9, now);
    punchGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    punchOsc.connect(punchGain);
    punchGain.connect(ctx.destination);
    punchOsc.start(now);
    punchOsc.stop(now + 0.3);

    // 3. Cinematic Brass/Synth Swell (Chord: D3, A3, D4, F#4)
    const chordFreqs = [146.83, 220.00, 293.66, 369.99];
    chordFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + 0.1);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now + 0.1);
      filter.frequency.exponentialRampToValueAtTime(2800, now + 0.7);
      filter.frequency.exponentialRampToValueAtTime(300, now + 2.5);

      gain.gain.setValueAtTime(0.001, now + 0.1);
      gain.gain.linearRampToValueAtTime(0.25 / chordFreqs.length, now + 0.45);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + 0.1);
      osc.stop(now + 2.7);
    });

    // 4. Shimmer Chime at top
    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(1174.66, now + 0.4); // D6
    chimeGain.gain.setValueAtTime(0.001, now + 0.4);
    chimeGain.gain.linearRampToValueAtTime(0.12, now + 0.55);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chimeOsc.start(now + 0.4);
    chimeOsc.stop(now + 2.3);

  } catch (err) {
    console.warn("Synthesized intro audio failed:", err);
  }
}

/**
 * Short UI click sound
 */
export function playClickSound() {
  try {
    unlockAudio();
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // ignore
  }
}

/**
 * Success unlock chime
 */
export function playUnlockSound() {
  try {
    unlockAudio();
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.12, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.45);
    });
  } catch {
    // ignore
  }
}

/**
 * Error / Wrong code buzzer
 */
export function playErrorSound() {
  try {
    unlockAudio();
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(120, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  } catch {
    // ignore
  }
}

/**
 * Xbox-Style Achievement Unlocked Chime
 * Harmonious, crisp dual-tone ascending bell with shimmering decay
 */
export function playAchievementSound() {
  try {
    unlockAudio();
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Harmonic bell frequencies (F#5, A#5, C#6, F#6)
    const notes = [
      { f: 739.99, t: 0.00, dur: 0.6 },
      { f: 932.33, t: 0.08, dur: 0.6 },
      { f: 1108.73, t: 0.16, dur: 0.7 },
      { f: 1479.98, t: 0.24, dur: 1.2 }
    ];

    notes.forEach(({ f, t, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + t);
      
      gain.gain.setValueAtTime(0.001, now + t);
      gain.gain.linearRampToValueAtTime(0.18, now + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + dur + 0.05);
    });
  } catch {
    // ignore
  }
}

/**
 * Story Card Flip / Swipe swoosh sound
 */
export function playCardFlipSound() {
  try {
    unlockAudio();
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.12);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  } catch {
    // ignore
  }
}

/**
 * Creates a microphone audio listener that detects blowing.
 * Blow detection watches for sustained low-frequency sound energy / high RMS amplitude.
 * Includes complete mobile Safari & Chrome permission safety.
 */
export async function startBlowDetector(onBlowDetected) {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { 
        supported: false, 
        error: "Microphone access requires HTTPS or is not supported on this browser." 
      };
    }

    // Request audio stream with mobile-optimized constraints
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    const ctx = getAudioContext();
    if (!ctx) {
      return { supported: false, error: "Audio context unavailable on this device." };
    }

    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.2;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let isRunning = true;
    let blowStreak = 0;

    const checkBlow = () => {
      if (!isRunning) return;
      analyser.getByteFrequencyData(dataArray);

      // Low frequency energy (bins 1 to 15 represent roughly 40Hz to 600Hz)
      let lowFreqSum = 0;
      for (let i = 1; i <= 15; i++) {
        lowFreqSum += dataArray[i];
      }
      const lowFreqAvg = lowFreqSum / 15;

      // Overall volume
      let totalSum = 0;
      for (let i = 0; i < bufferLength; i++) {
        totalSum += dataArray[i];
      }
      const totalAvg = totalSum / bufferLength;

      // Blowing on a phone mic causes turbulent rushing low-freq noise
      if (lowFreqAvg > 40 && totalAvg > 30) {
        blowStreak++;
        if (blowStreak >= 3) {
          onBlowDetected();
          blowStreak = 0;
        }
      } else {
        blowStreak = Math.max(0, blowStreak - 1);
      }

      requestAnimationFrame(checkBlow);
    };

    requestAnimationFrame(checkBlow);

    return {
      supported: true,
      stop: () => {
        isRunning = false;
        try {
          stream.getTracks().forEach(track => track.stop());
        } catch {}
      }
    };
  } catch (err) {
    const errorMsg = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
      ? "Microphone permission was not granted."
      : err.message || "Microphone access unavailable.";
    return { supported: false, error: errorMsg };
  }
}

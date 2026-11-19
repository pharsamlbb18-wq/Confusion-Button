/**
 * Web Audio API Sound Synthesizer for subtle haptic-like sound feedback
 */

const SoundEngine = (function() {
  let audioCtx = null;
  let isMuted = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type = 'sine', duration = 0.12, gainValue = 0.08) {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  return {
    toggleMute: function() {
      isMuted = !isMuted;
      return isMuted;
    },
    isMuted: function() {
      return isMuted;
    },
    clickGreen: function() {
      playTone(587.33, 'triangle', 0.15, 0.08); // D5
      setTimeout(() => playTone(880.00, 'sine', 0.18, 0.06), 70); // A5
    },
    clickYellow: function() {
      playTone(440.00, 'triangle', 0.18, 0.08); // A4
      setTimeout(() => playTone(523.25, 'sine', 0.15, 0.07), 80); // C5
    },
    clickRed: function() {
      playTone(329.63, 'sawtooth', 0.22, 0.07); // E4
      setTimeout(() => playTone(261.63, 'triangle', 0.28, 0.09), 90); // C4
    },
    alertWarning: function() {
      if (isMuted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        
        // Two-tone warning beep
        [659.25, 587.33, 659.25].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.14);
          gain.gain.setValueAtTime(0.12, now + i * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.14);
          osc.stop(now + i * 0.14 + 0.12);
        });
      } catch (e) {}
    }
  };
})();

// Native Web Audio API Sound Synthesizer for Tiny Tales Adventure Bank
// Zero external audio assets required - 100% offline & instant response!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tiny_tales_muted');
      if (saved !== null) {
        this.muted = saved === 'true';
      }
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tiny_tales_muted', String(muted));
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /**
   * Tactile Wooden Pop:
   * Short resonant pitch-drop creating the satisfying Toca Boca / Nintendo Switch bubble click.
   */
  public playWoodenPop(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Filter settings for warm wooden resonance
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(3.5, now);

      osc.type = 'triangle';
      // Fast downward pitch sweep (pop / tock)
      osc.frequency.setValueAtTime(560, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      // Snappy envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.7, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore audio context errors gracefully
    }
  }

  /**
   * Dynamic Arcade Coin "Cha-Ching":
   * High-pitch sparkle with ascending two-tone fanfare (B5 -> E6) and crystalline harmonics.
   */
  public playCoinChime(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1: B5 (987.77 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.4, now + 0.01);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Note 2: E6 (1318.51 Hz) - slightly delayed for that classic arcade chime
      const t2 = now + 0.065;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, t2);

      gain2.gain.setValueAtTime(0, t2);
      gain2.gain.linearRampToValueAtTime(0.55, t2 + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.38);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t2);
      osc2.stop(t2 + 0.4);

      // Harmonic Sparkle: E7 (2637 Hz) shimmer
      const oscSparkle = ctx.createOscillator();
      const gainSparkle = ctx.createGain();
      oscSparkle.type = 'triangle';
      oscSparkle.frequency.setValueAtTime(2637, t2);

      gainSparkle.gain.setValueAtTime(0, t2);
      gainSparkle.gain.linearRampToValueAtTime(0.18, t2 + 0.01);
      gainSparkle.gain.exponentialRampToValueAtTime(0.001, t2 + 0.25);

      oscSparkle.connect(gainSparkle);
      gainSparkle.connect(ctx.destination);
      oscSparkle.start(t2);
      oscSparkle.stop(t2 + 0.26);
    } catch {
      // Ignore
    }
  }

  /**
   * Toy PIN Pad Keypad Click:
   * Playful wooden marimba chime tone corresponding to keypad interactions.
   */
  public playPinClick(digit?: number): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const baseFreq = 520;
      const pitch = typeof digit === 'number' ? baseFreq + ((digit * 35) % 300) : 620;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.9, now + 0.05);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Ignore
    }
  }

  /**
   * Parent Approval Ding:
   * High, clear double bell chime (A5 -> A6) confirming quest completion.
   */
  public playApprovalDing(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      [
        { f: 880, delay: 0, dur: 0.25, vol: 0.4 },
        { f: 1760, delay: 0.08, dur: 0.4, vol: 0.5 }
      ].forEach(({ f, delay, dur, vol }) => {
        const start = now + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(vol, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Playful Soft Error Wobble:
   * Cartoon "uh-oh" bounce for incorrect PIN.
   */
  public playErrorBuzz(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [0, 0.1].forEach((delay) => {
        const start = now + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, start);
        osc.frequency.linearRampToValueAtTime(170, start + 0.08);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.09);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Grand Celebration Fanfare:
   * Major arpeggio chime chord sequence with joyous bell chime finish when goal is reached!
   */
  public playCelebrationFanfare(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // C5, E5, G5, C6, E6
      const notes = [
        { f: 523.25, time: 0, dur: 0.18 },
        { f: 659.25, time: 0.12, dur: 0.18 },
        { f: 783.99, time: 0.24, dur: 0.22 },
        { f: 1046.50, time: 0.36, dur: 0.45 },
        { f: 1318.51, time: 0.52, dur: 0.7 }
      ];

      notes.forEach(({ f, time, dur }) => {
        const start = now + time;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.45, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
      });
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundEngine();

import { LanguageCode } from './types';
import { configureFemaleUtterance, CANONICAL_FEMALE_SPEAKER } from '@/lib/voice/femaleVoice';

class PhoneSettingsVoiceManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isMuted: boolean = false;
  private audioCtx: AudioContext | null = null;
  private speakingListeners: ((isSpeaking: boolean) => void)[] = [];
  public isCurrentlySpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices();
    } catch {
      this.voices = [];
    }
  }

  public onSpeakingChange(callback: (isSpeaking: boolean) => void) {
    this.speakingListeners.push(callback);
    return () => {
      this.speakingListeners = this.speakingListeners.filter((cb) => cb !== callback);
    };
  }

  private notifySpeaking(speaking: boolean) {
    this.isCurrentlySpeaking = speaking;
    this.speakingListeners.forEach((cb) => cb(speaking));
  }

  public getVoiceForLang(lang: LanguageCode): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    const targetPrefix = lang === 'ta' ? 'ta' : lang === 'hi' ? 'hi' : 'en';
    return (
      this.voices.find((v) => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l.startsWith(targetPrefix);
      }) || null
    );
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private getAudioContext(): AudioContext | null {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  // Realistic UI & Setting Sound Effects
  public playSound(
    type:
      | 'click'
      | 'toggle'
      | 'torch'
      | 'wifi'
      | 'ringtone'
      | 'vibrate'
      | 'mute'
      | 'success'
      | 'swipe'
  ) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'torch') {
      // Crisp mechanical flashlight switch click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'swipe') {
      // Soft woosh / slide sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'toggle') {
      // Pleasant toggling chime (data / wifi / hotspot)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'wifi') {
      // Connected Wi-Fi double chirp
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now); // G5
      gain1.gain.setValueAtTime(0.07, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.5, now + 0.09); // C6
      gain2.gain.setValueAtTime(0.08, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.22);
    } else if (type === 'ringtone') {
      // Realistic phone ringtone marimba melody: E5 -> G#5 -> B5 -> E6
      const notes = [659.25, 830.61, 987.77, 1318.51];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.09, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.2);
      });
    } else if (type === 'vibrate') {
      // Haptic phone vibration buzz (low frequency dual pulse)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(80, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(80, now + 0.2);
      gain2.gain.setValueAtTime(0.08, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.35);
    } else if (type === 'mute') {
      // Quiet gentle click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      // Cheerful victory arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } else {
      // Standard gentle tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  }

  private audioCache: Map<string, string> = new Map();
  private currentAudio: HTMLAudioElement | null = null;
  private currentAbortController: AbortController | null = null;
  private speechCounter: number = 0;

  public stop() {
    this.speechCounter++;
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Speech cancellation error:', e);
      }
    }
    this.notifySpeaking(false);
  }

  // Enhanced speak: Uses Sarvam Bulbul / AI TTS with canonical female voice
  public async speak(text: string, lang: LanguageCode, onEnd?: () => void) {
    if (this.isMuted) {
      if (onEnd) setTimeout(onEnd, 1000);
      return;
    }

    this.stop();
    const currentSpeechId = ++this.speechCounter;
    this.notifySpeaking(true);

    const bcp47 = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    const cacheKey = `${bcp47}:${CANONICAL_FEMALE_SPEAKER}:${text}`;
    let audioUrl = this.audioCache.get(cacheKey);

    // Try AI TTS from backend first
    if (!audioUrl) {
      try {
        this.currentAbortController = new AbortController();
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            language: bcp47,
            language_code: bcp47,
            speaker: CANONICAL_FEMALE_SPEAKER,
          }),
          signal: this.currentAbortController.signal,
        });

        if (res.ok && currentSpeechId === this.speechCounter && !this.isMuted) {
          const data = await res.json();
          if (data.audioDataUrl) {
            audioUrl = data.audioDataUrl;
          } else if (data.audioBase64) {
            const format = data.mimeType || data.format || 'audio/wav';
            audioUrl = `data:${format};base64,${data.audioBase64}`;
          }
          if (audioUrl) {
            this.audioCache.set(cacheKey, audioUrl);
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('[tts] AI TTS fetch error:', err);
        }
      }
    }

    if (currentSpeechId !== this.speechCounter || this.isMuted) {
      this.notifySpeaking(false);
      return;
    }

    // If AI audio is available, play natural high-fidelity wav audio
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        audio.onended = () => {
          if (this.currentAudio === audio) {
            this.currentAudio = null;
          }
          if (currentSpeechId === this.speechCounter) {
            this.notifySpeaking(false);
            if (onEnd) onEnd();
          }
        };

        audio.onerror = () => {
          if (this.currentAudio === audio) {
            this.currentAudio = null;
          }
          if (currentSpeechId === this.speechCounter) {
            this.fallbackBrowserSpeak(text, lang, onEnd, currentSpeechId);
          }
        };

        await audio.play();
        return;
      } catch (playErr: any) {
        if (playErr?.name === 'AbortError' || currentSpeechId !== this.speechCounter) {
          return;
        }
        console.warn('[tts] Audio play failed, falling back:', playErr);
      }
    }

    if (currentSpeechId !== this.speechCounter || this.isMuted) {
      this.notifySpeaking(false);
      return;
    }

    // Fallback: Browser Web Speech API
    this.fallbackBrowserSpeak(text, lang, onEnd, currentSpeechId);
  }

  private fallbackBrowserSpeak(text: string, lang: LanguageCode, onEnd?: () => void, speechId?: number) {
    if (this.isMuted || !this.synth || (speechId && speechId !== this.speechCounter)) {
      if (!speechId || speechId === this.speechCounter) {
        this.notifySpeaking(false);
      }
      return;
    }

    try {
      if (this.voices.length === 0) {
        this.loadVoices();
      }

      const bcp47 = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      const utterance = new SpeechSynthesisUtterance(text);
      configureFemaleUtterance(utterance, bcp47, this.voices);

      utterance.onstart = () => {
        this.notifySpeaking(true);
      };

      utterance.onend = () => {
        this.notifySpeaking(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.notifySpeaking(false);
        if (onEnd) onEnd();
      };

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Browser speech error:', e);
      this.notifySpeaking(false);
      if (onEnd) onEnd();
    }
  }
}

export const settingsVoice = new PhoneSettingsVoiceManager();

import { LanguageCode } from './types';
import { configureFemaleUtterance, CANONICAL_FEMALE_SPEAKER } from '@/lib/voice/femaleVoice';

class WABusinessVoiceManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isMuted: boolean = false;
  private audioCtx: AudioContext | null = null;
  private speakingListeners: ((isSpeaking: boolean) => void)[] = [];
  private audioCache: Map<string, string> = new Map();
  private currentAudio: HTMLAudioElement | null = null;
  private speechCounter: number = 0;
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

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public stop() {
    this.speechCounter++;
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Speech cancellation error:', e);
      }
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = '';
      this.currentAudio = null;
    }
    this.notifySpeaking(false);
  }

  public playChime(type: 'tap' | 'success' | 'alert' | 'ding' = 'tap') {
    if (this.isMuted) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      if (type === 'tap') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.1);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'success') {
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.setValueAtTime(280, now + 0.12);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // AudioContext not allowed or unsupported
    }
  }

  public async speak(text: string, lang: LanguageCode, onEnd?: () => void) {
    if (this.isMuted || typeof window === 'undefined' || !text.trim()) {
      if (onEnd) setTimeout(onEnd, 500);
      return;
    }

    this.stop();
    const currentSpeechId = ++this.speechCounter;
    this.notifySpeaking(true);

    const bcp47 = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    const cacheKey = `${bcp47}:${CANONICAL_FEMALE_SPEAKER}:${text}`;

    // 1. Try AI TTS route with consistent female voice (ishita)
    let audioUrl = this.audioCache.get(cacheKey);

    if (!audioUrl) {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            language: bcp47,
            language_code: bcp47,
            speaker: CANONICAL_FEMALE_SPEAKER,
          }),
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
      } catch (err) {
        console.warn('[WABusinessVoice] AI TTS fetch error, falling back:', err);
      }
    }

    if (audioUrl && currentSpeechId === this.speechCounter && !this.isMuted) {
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
            this.fallbackBrowserSpeak(text, bcp47, onEnd, currentSpeechId);
          }
        };

        await audio.play();
        return;
      } catch (playErr: any) {
        if (playErr?.name === 'AbortError' || currentSpeechId !== this.speechCounter) {
          return;
        }
        console.warn('[WABusinessVoice] Audio play error, using browser fallback:', playErr);
      }
    }

    if (currentSpeechId !== this.speechCounter || this.isMuted) {
      this.notifySpeaking(false);
      return;
    }

    // 2. Browser fallback with guaranteed female voice
    this.fallbackBrowserSpeak(text, bcp47, onEnd, currentSpeechId);
  }

  private fallbackBrowserSpeak(
    text: string,
    bcp47: string,
    onEnd?: () => void,
    speechId?: number
  ) {
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
      console.warn('Speech synthesis invocation error:', e);
      this.notifySpeaking(false);
      if (onEnd) onEnd();
    }
  }
}

export const waVoice = new WABusinessVoiceManager();

import { LanguageCode } from './types';
import { configureFemaleUtterance, CANONICAL_FEMALE_SPEAKER } from '@/lib/voice/femaleVoice';

class MapsVoiceManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isMuted: boolean = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private speakingListeners: ((isSpeaking: boolean) => void)[] = [];
  public isCurrentlySpeaking: boolean = false;
  private speechCounter: number = 0;
  private audioCache: Map<string, string> = new Map();

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

  public stop() {
    this.speechCounter++;
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Speech cancellation error:', e);
      }
    }
    this.activeUtterance = null;
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.src = '';
      this.activeAudio = null;
    }
    this.notifySpeaking(false);
  }

  // Soft audio chime for pleasant auditory reinforcement
  public playGuidanceChime() {
    if (this.isMuted) return;
    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  public async speakAsync(
    text: string,
    lang: LanguageCode = 'en',
    options?: { fallbackTimeoutMs?: number; cancelPrevious?: boolean; rate?: number }
  ): Promise<boolean> {
    if (this.isMuted || typeof window === 'undefined' || !text.trim()) {
      return false;
    }

    if (options?.cancelPrevious !== false) {
      this.stop();
    }

    this.playGuidanceChime();

    const currentSpeechId = ++this.speechCounter;
    this.notifySpeaking(true);

    const bcp47 = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    const cacheKey = `${bcp47}:${CANONICAL_FEMALE_SPEAKER}:${text}`;

    // 1. Try unified Sarvam AI Bulbul female voice (ishita) via /api/tts
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
        console.warn('[MapsVoice] AI TTS fetch error, trying browser synthesis:', err);
      }
    }

    if (audioUrl && currentSpeechId === this.speechCounter && !this.isMuted) {
      return new Promise<boolean>((resolve) => {
        const audio = new Audio(audioUrl);
        this.activeAudio = audio;

        let settled = false;
        const cleanup = (wasCompleted: boolean) => {
          if (settled) return;
          settled = true;
          if (this.activeAudio === audio) {
            this.activeAudio = null;
          }
          if (currentSpeechId === this.speechCounter) {
            this.notifySpeaking(false);
          }
          resolve(wasCompleted && currentSpeechId === this.speechCounter);
        };

        audio.onended = () => cleanup(true);
        audio.onerror = () => cleanup(false);

        audio.play().catch((playErr: any) => {
          cleanup(false);
        });
      });
    }

    if (currentSpeechId !== this.speechCounter || this.isMuted) {
      this.notifySpeaking(false);
      return false;
    }

    // 2. Web Speech API Fallback with guaranteed female voice tuning
    return new Promise<boolean>((resolve) => {
      if (!this.synth || this.isMuted || currentSpeechId !== this.speechCounter) {
        this.notifySpeaking(false);
        resolve(false);
        return;
      }

      let settled = false;
      const finish = (wasCompleted: boolean) => {
        if (!settled) {
          settled = true;
          this.activeUtterance = null;
          if (currentSpeechId === this.speechCounter) {
            this.notifySpeaking(false);
          }
          resolve(wasCompleted && currentSpeechId === this.speechCounter);
        }
      };

      if (this.voices.length === 0) {
        this.loadVoices();
      }

      const timer = setTimeout(() => {
        finish(true);
      }, options?.fallbackTimeoutMs || 10000);

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        this.activeUtterance = utterance;

        configureFemaleUtterance(utterance, bcp47, this.voices);
        if (options?.rate) {
          utterance.rate = options.rate;
        }

        utterance.onend = () => {
          clearTimeout(timer);
          finish(true);
        };

        utterance.onerror = () => {
          clearTimeout(timer);
          finish(false);
        };

        this.synth.speak(utterance);
      } catch (err) {
        clearTimeout(timer);
        console.warn('Maps speak error:', err);
        finish(false);
      }
    });
  }
}

export const mapsVoiceManager = new MapsVoiceManager();

import { configureFemaleUtterance, CANONICAL_FEMALE_SPEAKER } from '@/lib/voice/femaleVoice';

export type LanguageCode = 'ta' | 'hi' | 'en';

export type VoiceStateListener = (hasTamilVoice: boolean) => void;

class VoiceManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isMuted: boolean = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private listeners: Set<VoiceStateListener> = new Set();
  private speechCounter: number = 0;
  private audioCache: Map<string, string> = new Map();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
          this.notifyListeners();
        };
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public subscribe(listener: VoiceStateListener): () => void {
    this.listeners.add(listener);
    listener(this.hasTamilVoice());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const hasTa = this.hasTamilVoice();
    this.listeners.forEach((l) => l(hasTa));
  }

  public hasTamilVoice(): boolean {
    return true;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.activeUtterance = null;
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.src = '';
      this.activeAudio = null;
    }
  }

  public speak(
    text: string,
    lang: LanguageCode = 'en',
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (onStart) onStart();
    this.speakAsync(text, lang).then(() => {
      if (onEnd) onEnd();
    });
  }

  public async speakAsync(
    text: string,
    lang: LanguageCode = 'en',
    options?: { fallbackTimeoutMs?: number; cancelPrevious?: boolean }
  ): Promise<void> {
    if (this.isMuted || typeof window === 'undefined' || !text.trim()) {
      return;
    }

    if (options?.cancelPrevious !== false) {
      this.stop();
    }

    const currentSpeechId = ++this.speechCounter;
    const bcp47 = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    const cacheKey = `${bcp47}:${CANONICAL_FEMALE_SPEAKER}:${text}`;

    // 1. Check audio cache or fetch from Sarvam AI Bulbul TTS route (Female speaker: ishita)
    let audioUri = this.audioCache.get(cacheKey);

    if (!audioUri) {
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
            audioUri = data.audioDataUrl;
          } else if (data.audioBase64) {
            const format = data.mimeType || data.format || 'audio/wav';
            audioUri = `data:${format};base64,${data.audioBase64}`;
          }
          if (audioUri) {
            this.audioCache.set(cacheKey, audioUri);
          }
        }
      } catch (err) {
        console.warn('[WhatsApp Voice] AI TTS route failed, trying WebSpeech fallback:', err);
      }
    }

    if (audioUri && currentSpeechId === this.speechCounter && !this.isMuted) {
      return new Promise<void>((resolve) => {
        const audio = new Audio(audioUri);
        this.activeAudio = audio;

        const cleanup = () => {
          if (this.activeAudio === audio) {
            this.activeAudio = null;
          }
          resolve();
        };

        audio.onended = cleanup;
        audio.onerror = () => {
          cleanup();
        };

        audio.play().catch(() => {
          cleanup();
        });
      });
    }

    // 2. Web Speech API Fallback with guaranteed female voice tuning
    return new Promise((resolve) => {
      if (!this.synth || this.isMuted || currentSpeechId !== this.speechCounter) {
        resolve();
        return;
      }

      let settled = false;
      const finish = () => {
        if (!settled) {
          settled = true;
          this.activeUtterance = null;
          resolve();
        }
      };

      if (this.voices.length === 0) {
        this.loadVoices();
      }

      const fallbackMs = options?.fallbackTimeoutMs ?? 12000;
      const timer = setTimeout(() => {
        finish();
      }, fallbackMs);

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        this.activeUtterance = utterance;

        configureFemaleUtterance(utterance, bcp47, this.voices);

        utterance.onend = () => {
          clearTimeout(timer);
          finish();
        };

        utterance.onerror = () => {
          clearTimeout(timer);
          finish();
        };

        this.synth.speak(utterance);
      } catch {
        clearTimeout(timer);
        finish();
      }
    });
  }
}

export const voiceManager = new VoiceManager();

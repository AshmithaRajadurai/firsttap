import { SpamLanguageCode } from './types';
import { configureFemaleUtterance, CANONICAL_FEMALE_SPEAKER } from '@/lib/voice/femaleVoice';

class SpamVoiceManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isMuted: boolean = false;
  private isPaused: boolean = false;
  private isSpeaking: boolean = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private speechCounter: number = 0;
  private stateChangeListeners: Set<() => void> = new Set();
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
    this.voices = this.synth.getVoices();
  }

  public subscribe(listener: () => void): () => void {
    this.stateChangeListeners.add(listener);
    return () => this.stateChangeListeners.delete(listener);
  }

  private notify() {
    this.stateChangeListeners.forEach((l) => l());
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
    this.notify();
  }

  public toggleMute() {
    this.setMuted(!this.isMuted);
  }

  public pause() {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.isPaused = true;
      this.notify();
    } else if (this.synth && this.isSpeaking) {
      this.synth.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.activeAudio && this.isPaused) {
      this.activeAudio.play().catch(() => {});
      this.isPaused = false;
      this.notify();
    } else if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    this.speechCounter++;
    if (this.synth) {
      this.synth.cancel();
    }
    this.activeUtterance = null;
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.src = '';
      this.activeAudio = null;
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.notify();
  }

  public async speak(
    text: string,
    lang: SpamLanguageCode = 'en',
    onEnd?: () => void
  ): Promise<void> {
    if (this.isMuted || typeof window === 'undefined' || !text.trim()) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    const currentSpeechId = ++this.speechCounter;
    this.isSpeaking = true;
    this.isPaused = false;
    this.notify();

    const bcp47 = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    const cacheKey = `${bcp47}:${CANONICAL_FEMALE_SPEAKER}:${text}`;

    // 1. Check audio cache or route through FirstTap Sarvam Bulbul TTS route (ishita female speaker)
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
        console.warn('[SpamVoice] AI TTS fallback to browser synthesis:', err);
      }
    }

    if (audioUri && currentSpeechId === this.speechCounter && !this.isMuted) {
      return new Promise<void>((resolve) => {
        const audio = new Audio(audioUri);
        this.activeAudio = audio;

        let settled = false;
        const cleanup = (wasCompletedNormally: boolean) => {
          if (settled) return;
          settled = true;

          if (this.activeAudio === audio) {
            this.activeAudio = null;
          }

          if (currentSpeechId === this.speechCounter) {
            this.isSpeaking = false;
            this.isPaused = false;
            this.notify();
            if (wasCompletedNormally && onEnd) {
              onEnd();
            }
          }
          resolve();
        };

        audio.onended = () => cleanup(true);
        audio.onerror = () => cleanup(false);

        audio.play().catch((playErr: any) => {
          cleanup(false);
        });
      });
    }

    // 2. Browser SpeechSynthesis for fallback with strict female voice configuration
    if (!this.synth || currentSpeechId !== this.speechCounter || this.isMuted) {
      if (currentSpeechId === this.speechCounter) {
        this.isSpeaking = false;
        this.notify();
      }
      return;
    }

    return new Promise<void>((resolve) => {
      if (this.voices.length === 0) {
        this.loadVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      this.activeUtterance = utterance;

      configureFemaleUtterance(utterance, bcp47, this.voices);

      let finished = false;
      const finish = (wasCompletedNormally: boolean) => {
        if (finished) return;
        finished = true;

        if (this.activeUtterance === utterance) {
          this.activeUtterance = null;
        }

        if (currentSpeechId === this.speechCounter) {
          this.isSpeaking = false;
          this.isPaused = false;
          this.notify();
          if (wasCompletedNormally && onEnd) {
            onEnd();
          }
        }
        resolve();
      };

      utterance.onend = () => finish(true);
      utterance.onerror = () => finish(false);

      try {
        if (this.synth) {
          this.synth.speak(utterance);
        } else {
          finish(false);
        }
      } catch {
        finish(false);
      }
    });
  }

  public async speakAsync(
    text: string,
    lang: SpamLanguageCode = 'en',
    options?: { fallbackTimeoutMs?: number; cancelPrevious?: boolean }
  ): Promise<void> {
    if (options?.cancelPrevious) {
      this.stop();
    }
    return new Promise<void>((resolve) => {
      let timeoutId: NodeJS.Timeout | null = null;
      if (options?.fallbackTimeoutMs) {
        timeoutId = setTimeout(() => {
          resolve();
        }, options.fallbackTimeoutMs);
      }
      this.speak(text, lang, () => {
        if (timeoutId) clearTimeout(timeoutId);
        resolve();
      });
    });
  }
}

export const spamVoiceManager = new SpamVoiceManager();

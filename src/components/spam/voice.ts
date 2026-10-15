import { SpamLanguageCode } from './types';

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

  private getVoiceForLanguage(lang: SpamLanguageCode): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    const targetCode = lang === 'ta' ? 'ta' : lang === 'hi' ? 'hi' : 'en';
    return (
      this.voices.find((v) => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l.startsWith(targetCode);
      }) || null
    );
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

    // 1. For Tamil, route through FirstTap Sarvam Bulbul v3 backend route (ishita speaker)
    if (lang === 'ta') {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            language: 'ta-IN',
            speaker: 'ishita',
          }),
        });

        if (res.ok && currentSpeechId === this.speechCounter && !this.isMuted) {
          const data = await res.json();
          if (data.audioBase64) {
            const format = data.format || 'audio/wav';
            const audioUri = `data:${format};base64,${data.audioBase64}`;
            return new Promise<void>((resolve) => {
              const audio = new Audio(audioUri);
              this.activeAudio = audio;

              const cleanup = () => {
                if (this.activeAudio === audio) {
                  this.activeAudio = null;
                }
                this.isSpeaking = false;
                this.isPaused = false;
                this.notify();
                if (onEnd) onEnd();
                resolve();
              };

              audio.onended = cleanup;
              audio.onerror = cleanup;

              audio.play().catch(() => {
                cleanup();
              });
            });
          }
        }
      } catch (err) {
        console.warn('[SpamVoice] Sarvam TTS fallback to browser synthesis:', err);
      }
    }

    // 2. Browser SpeechSynthesis for English, Hindi, or Tamil fallback
    if (!this.synth || currentSpeechId !== this.speechCounter || this.isMuted) {
      this.isSpeaking = false;
      this.notify();
      if (onEnd) onEnd();
      return;
    }

    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      this.activeUtterance = utterance;

      const voice = this.getVoiceForLanguage(lang);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const finish = () => {
        if (this.activeUtterance === utterance) {
          this.activeUtterance = null;
        }
        this.isSpeaking = false;
        this.isPaused = false;
        this.notify();
        if (onEnd) onEnd();
        resolve();
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      try {
        if (this.synth) {
          this.synth.speak(utterance);
        } else {
          finish();
        }
      } catch {
        finish();
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

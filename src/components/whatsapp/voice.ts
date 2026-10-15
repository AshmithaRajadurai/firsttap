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
    // We have server-side Sarvam AI TTS for Tamil, so Tamil voice is always available
    return true;
  }

  public getTamilVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return (
      this.voices.find((v) => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l === 'ta-in' || l.startsWith('ta');
      }) || null
    );
  }

  public getHindiVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return (
      this.voices.find((v) => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l === 'hi-in' || l.startsWith('hi');
      }) || null
    );
  }

  public getEnglishVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return (
      this.voices.find((v) => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l === 'en-in';
      }) ||
      this.voices.find((v) => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l.startsWith('en');
      }) ||
      null
    );
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
    if (this.isMuted || typeof window === 'undefined') {
      return;
    }

    if (options?.cancelPrevious !== false) {
      this.stop();
    }

    const currentSpeechId = ++this.speechCounter;

    // 1. For Tamil, try Sarvam AI Bulbul v3 backend route first (Female speaker: ishita)
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
                resolve();
              };

              audio.onended = cleanup;
              audio.onerror = () => {
                cleanup();
              };

              audio.play().catch(() => {
                // If autoplay blocked, finish gracefully
                cleanup();
              });
            });
          }
        }
      } catch (err) {
        console.warn('[WhatsApp Voice] Sarvam TTS route failed, trying WebSpeech fallback:', err);
      }
    }

    // 2. Web Speech API Fallback for English, Hindi, or failed Tamil
    return new Promise((resolve) => {
      if (!this.synth || this.isMuted) {
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

        if (lang === 'ta') {
          utterance.lang = 'ta-IN';
          const taVoice = this.getTamilVoice();
          if (taVoice) utterance.voice = taVoice;
          utterance.rate = 0.88;
        } else if (lang === 'hi') {
          utterance.lang = 'hi-IN';
          const hiVoice = this.getHindiVoice();
          if (hiVoice) utterance.voice = hiVoice;
          utterance.rate = 0.90;
        } else {
          utterance.lang = 'en-IN';
          const enVoice = this.getEnglishVoice();
          if (enVoice) utterance.voice = enVoice;
          utterance.rate = 0.90;
        }

        utterance.pitch = 1.0;

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

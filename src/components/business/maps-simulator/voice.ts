import { LanguageCode } from './types';

class MapsVoiceManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isMuted: boolean = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
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

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Speech cancellation error:', e);
      }
    }
    this.activeUtterance = null;
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
    if (this.isMuted) return false;

    if (options?.cancelPrevious !== false) {
      this.stop();
    }

    this.playGuidanceChime();

    if (!this.synth) {
      this.notifySpeaking(true);
      setTimeout(() => this.notifySpeaking(false), 2500);
      return false;
    }

    return new Promise((resolve) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = options?.rate ?? 0.95;

        const voice = this.getVoiceForLang(lang);
        if (voice) {
          utterance.voice = voice;
        }

        let settled = false;
        const complete = () => {
          if (!settled) {
            settled = true;
            this.notifySpeaking(false);
            resolve(true);
          }
        };

        utterance.onstart = () => {
          this.notifySpeaking(true);
        };
        utterance.onend = complete;
        utterance.onerror = complete;

        const timer = setTimeout(complete, options?.fallbackTimeoutMs || 10000);
        this.activeUtterance = utterance;

        if (this.synth) {
          this.synth.speak(utterance);
        } else {
          clearTimeout(timer);
          complete();
        }
      } catch (err) {
        console.warn('Maps speak error:', err);
        this.notifySpeaking(false);
        resolve(false);
      }
    });
  }
}

export const mapsVoiceManager = new MapsVoiceManager();

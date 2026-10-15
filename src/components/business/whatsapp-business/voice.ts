import { LanguageCode } from './types';

class WABusinessVoiceManager {
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

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Speech cancellation error:', e);
      }
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
        // Joyful 3-tone arpeggio: C5 -> E5 -> G5
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

  public speak(text: string, lang: LanguageCode, onEnd?: () => void) {
    if (this.isMuted || !this.synth) {
      if (onEnd) setTimeout(onEnd, 1500);
      return;
    }

    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

      const voice = this.getVoiceForLang(lang);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = lang === 'en' ? 0.95 : 0.88; // gentle, steady pace for shopkeepers
      utterance.pitch = 1.05;

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

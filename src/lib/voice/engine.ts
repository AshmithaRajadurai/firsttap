import { SupportedLanguage, VoiceEngineState } from '@/types';
import { matchLanguageIntent, normaliseTranscript } from '@/lib/fsm/intents';
import { logger } from '@/lib/logger';

export interface VoiceEngineCallbacks {
  onStateChange: (state: VoiceEngineState) => void;
  onAudioAmplitude: (amplitude: number) => void;
  onTranscriptionComplete: (text: string, isMock: boolean) => void;
  onSpeechStarted: () => void;
  onSpeechEnded: () => void;
  onError: (errorMessage: string) => void;
}

export type ListeningMode = 'language' | 'normal';

export class VoiceEngine {
  private state: VoiceEngineState = 'IDLE';
  private callbacks: VoiceEngineCallbacks;

  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingStartTime = 0;

  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;

  private currentAudioElement: HTMLAudioElement | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  private silenceTimer: NodeJS.Timeout | null = null;
  private initialSilenceTimer: NodeJS.Timeout | null = null;
  private maxRecordTimer: NodeJS.Timeout | null = null;
  private sequenceTimer: NodeJS.Timeout | null = null;

  private isSequenceActive = false;
  private isProcessingRecording = false;

  private speechRecognition: any = null;
  private latestSpeechRecognitionText = '';
  private currentListeningMode: ListeningMode = 'normal';
  private currentSessionId = 0;

  constructor(callbacks: VoiceEngineCallbacks) {
    this.callbacks = callbacks;
  }

  public getState(): VoiceEngineState {
    return this.state;
  }

  private setState(newState: VoiceEngineState) {
    if (this.state === newState) return;
    this.log(`State transition: ${this.state} -> ${newState}`);
    this.state = newState;
    this.callbacks.onStateChange(newState);
  }

  private log(message: string, ...args: any[]) {
    console.log(`[VoiceEngine:${this.state}] ${message}`, ...args);
  }

  /**
   * Request microphone permission and initialize audio context
   */
  public async initializeMicrophone(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;

      this.log('Initializing microphone permission and audio context...');
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        if (!this.audioContext || this.audioContext.state === 'closed') {
          this.audioContext = new AudioCtx();
        }
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
      }

      if (!this.mediaStream || !this.mediaStream.active) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        this.log('Microphone access granted. Audio tracks:', this.mediaStream.getAudioTracks().length);
      }

      this.initWebSpeechRecognition();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Microphone permission denied';
      console.warn('[VoiceEngine] Microphone initialization failed:', msg);
      this.setState('ERROR');
      this.callbacks.onError('Microphone access is needed so FirstTap can hear your answers.');
      return false;
    }
  }

  private initWebSpeechRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec && !this.speechRecognition) {
      try {
        const rec = new SpeechRec();
        rec.continuous = false;
        rec.interimResults = true;
        rec.maxAlternatives = 1;

        rec.onresult = (event: any) => {
          let interimChunk = '';
          let finalChunk = '';
          for (let i = 0; i < event.results.length; ++i) {
            const res = event.results[i];
            if (res.isFinal) {
              finalChunk += res[0].transcript;
            } else {
              interimChunk += res[0].transcript;
            }
          }
          const best = (finalChunk || interimChunk).trim();
          if (best) {
            this.latestSpeechRecognitionText = best;
            this.log(`WebSpeech onresult: best="${best}" (final="${finalChunk}", interim="${interimChunk}")`);
            logger.logTranscript('interim', best, normaliseTranscript(best), this.currentSessionId);
          }
        };

        rec.onerror = (e: any) => {
          if (e.error !== 'no-speech') {
            this.log('WebSpeech recognition event error:', e.error);
            logger.logVoiceError('WebSpeech', e.error);
          }
        };

        rec.onend = () => {
          this.log('WebSpeech recognition ended');
        };

        this.speechRecognition = rec;
      } catch (e) {
        this.log('Could not setup speech recognition fallback:', e);
      }
    }
  }

  /**
   * Speak multiple sentences in sequence, each in its specific language voice.
   * State: PLAYING_LANGUAGE_OPTIONS -> WAITING_FOR_AUDIO_TO_FINISH
   */
  public async speakSequence(
    items: { text: string; language: SupportedLanguage }[],
    onFinished?: () => void
  ): Promise<void> {
    this.log(`speakSequence started with ${items?.length || 0} items.`);
    // 1. Ensure any prior playback or recording is stopped
    this.stopSpeaking();
    this.stopListening();

    if (!items || items.length === 0) {
      this.setState('IDLE');
      if (onFinished) onFinished();
      return;
    }

    this.isSequenceActive = true;
    this.setState('PLAYING_LANGUAGE_OPTIONS');
    this.callbacks.onSpeechStarted();

    let currentIndex = 0;

    const playNext = async () => {
      if (!this.isSequenceActive) {
        this.log('speakSequence was stopped or cancelled.');
        return;
      }

      if (currentIndex >= items.length) {
        this.log('speakSequence finished all items. State -> WAITING_FOR_AUDIO_TO_FINISH');
        this.setState('WAITING_FOR_AUDIO_TO_FINISH');
        this.isSequenceActive = false;
        this.stopSpeakingVisualizer();

        // Safe 400ms buffer so speaker audio finishes completely before microphone activates
        setTimeout(() => {
          this.log('WAITING_FOR_AUDIO_TO_FINISH completed safely. Triggering onFinished callback.');
          this.setState('IDLE');
          this.callbacks.onSpeechEnded();
          if (onFinished) onFinished();
        }, 400);
        return;
      }

      const item = items[currentIndex++];
      this.log(`speakSequence playing item [${currentIndex}/${items.length}] in [${item.language}]: "${item.text}"`);

      await this.speakSingleItem(item.text, item.language, () => {
        if (!this.isSequenceActive) return;
        // Natural 350ms pause between language choices without dropping out of sequence
        this.sequenceTimer = setTimeout(playNext, 350);
      });
    };

    playNext();
  }

  /**
   * Speak single utterance
   */
  public async speak(
    text: string,
    language: SupportedLanguage,
    onFinished?: () => void
  ): Promise<void> {
    this.log(`speak called for: "${text}" in [${language}]`);
    this.stopSpeaking();
    this.stopListening();

    this.setState('SPEAKING');
    this.callbacks.onSpeechStarted();

    await this.speakSingleItem(text, language, () => {
      this.setState('WAITING_FOR_AUDIO_TO_FINISH');
      this.stopSpeakingVisualizer();

      setTimeout(() => {
        this.setState('IDLE');
        this.callbacks.onSpeechEnded();
        if (onFinished) onFinished();
      }, 250);
    });
  }

  /**
   * Internal player for a single sentence
   */
  private async speakSingleItem(
    text: string,
    language: SupportedLanguage,
    onComplete: () => void
  ): Promise<void> {
    try {
      // 1. Try Sarvam TTS API
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language_code: language,
        }),
      });

      const data = await res.json();

      if (data.audioBase64) {
        const audioSrc = `data:audio/wav;base64,${data.audioBase64}`;
        const audio = new Audio(audioSrc);
        this.currentAudioElement = audio;

        this.startSpeakingVisualizer();

        audio.onended = () => {
          this.log('Sarvam audio playback ended');
          this.currentAudioElement = null;
          onComplete();
        };

        audio.onerror = (e) => {
          this.log('Sarvam audio playback error, falling back to Web Speech:', e);
          this.currentAudioElement = null;
          this.speakWithBrowserFallback(text, language, onComplete);
        };

        await audio.play();
        return;
      }
    } catch (err) {
      this.log('TTS fetch error, using Web Speech fallback:', err);
    }

    // 2. Fallback to Browser Speech Synthesis
    this.speakWithBrowserFallback(text, language, onComplete);
  }

  private speakWithBrowserFallback(
    text: string,
    language: SupportedLanguage,
    onFinished: () => void
  ) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      this.log('Browser SpeechSynthesis unavailable');
      onFinished();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = language.split('-')[0];
    const matchingVoice = voices.find(
      (v) =>
        v.lang === language ||
        v.lang.startsWith(langPrefix) ||
        (langPrefix === 'en' && (v.lang.includes('IN') || v.name.includes('India')))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.lang = language;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    this.startSpeakingVisualizer();

    utterance.onend = () => {
      this.log('Browser SpeechSynthesis utterance ended');
      this.activeUtterance = null;
      onFinished();
    };

    utterance.onerror = (e: any) => {
      if (e.error === 'canceled' || e.error === 'interrupted') {
        this.log('SpeechSynthesis utterance was cancelled or interrupted. Ignoring callback.');
        return;
      }
      this.log('SpeechSynthesis utterance error:', e.error);
      this.activeUtterance = null;
      onFinished();
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Start listening for user speech with explicit audio state machine:
   * STARTING_MICROPHONE -> LISTENING -> STOPPING_RECORDING -> TRANSCRIBING -> DETECTING_LANGUAGE
   */
  public async startListening(
    modeOrLang: ListeningMode | SupportedLanguage,
    langOrCallback: SupportedLanguage | ((text: string) => void),
    callbackOrUndefined?: (text: string) => void
  ): Promise<void> {
    // Determine overload arguments
    let mode: ListeningMode = 'normal';
    let language: SupportedLanguage = 'ta-IN';
    let onFinishedTranscription: (text: string) => void = () => {};

    if (modeOrLang === 'language' || modeOrLang === 'normal') {
      mode = modeOrLang;
      language = (langOrCallback as SupportedLanguage) || 'en-IN';
      onFinishedTranscription = callbackOrUndefined || (() => {});
    } else {
      mode = 'normal';
      language = modeOrLang;
      onFinishedTranscription = langOrCallback as (text: string) => void;
    }

    this.currentListeningMode = mode;

    // Guard: Do not start recording if already recording, transcribing, or speaking options
    if (
      this.state === 'PLAYING_LANGUAGE_OPTIONS' ||
      this.state === 'WAITING_FOR_AUDIO_TO_FINISH' ||
      this.state === 'SPEAKING' ||
      this.state === 'STARTING_MICROPHONE' ||
      this.state === 'LISTENING' ||
      this.state === 'STOPPING_RECORDING' ||
      this.state === 'TRANSCRIBING' ||
      this.state === 'DETECTING_LANGUAGE' ||
      this.state === 'UNDERSTANDING' ||
      this.state === 'RESPONDING'
    ) {
      this.log(`startListening ignored: active state is [${this.state}]`);
      return;
    }

    this.currentSessionId++;
    const sessionId = this.currentSessionId;

    this.setState('STARTING_MICROPHONE');
    this.log(`Preparing microphone (session #${sessionId})... Mode: [${mode}], Target lang: [${language}]`);
    logger.logRecognitionStart(mode, language, sessionId);

    const hasMic = await this.initializeMicrophone();
    if (!hasMic || !this.mediaStream) {
      this.setState('ERROR');
      return;
    }

    if (this.currentSessionId !== sessionId) return;

    this.audioChunks = [];
    this.isProcessingRecording = false;
    this.latestSpeechRecognitionText = '';

    try {
      // Connect real-time audio analyser for amplitude & silence endpointing
      if (this.audioContext && this.mediaStream) {
        try {
          const source = this.audioContext.createMediaStreamSource(this.mediaStream);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 256;
          source.connect(this.analyser);
        } catch (e) {
          this.log('Analyser connection note:', e);
        }
      }

      // Configure SpeechRecognition
      if (this.speechRecognition) {
        try {
          // Multilingual Indian English mode for language selection; otherwise selected language
          this.speechRecognition.lang = mode === 'language' ? 'en-IN' : language;
          this.speechRecognition.start();
          this.log(`WebSpeech started with lang: [${this.speechRecognition.lang}]`);
        } catch (e) {
          this.log('WebSpeech start note (may already be active):', e);
        }
      }

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(this.mediaStream, { mimeType });
      this.mediaRecorder = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      recorder.onstart = () => {
        if (this.currentSessionId !== sessionId) return;
        this.recordingStartTime = Date.now();
        this.setState('LISTENING');
        this.log(`Microphone confirmed recording. State -> LISTENING. Start time: ${this.recordingStartTime}`);
        this.startListeningVisualizer();
      };

      recorder.onstop = async () => {
        if (this.isProcessingRecording) return;
        this.isProcessingRecording = true;
        this.log(`MediaRecorder onstop fired for session #${sessionId}.`);
        logger.logRecognitionStop('MediaRecorder onstop', sessionId);

        this.stopListeningVisualizer();

        if (this.speechRecognition) {
          try {
            this.speechRecognition.stop();
          } catch (e) {}
        }

        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const durationMs = Date.now() - this.recordingStartTime;
        this.log(`Recording ended. Duration: ${durationMs}ms, Blob size: ${audioBlob.size} bytes`);

        // Wait for WebSpeech to settle before transcribing, avoiding empty fallback race condition
        await new Promise<void>((resolve) => {
          let timer: NodeJS.Timeout | null = null;
          let settled = false;

          const finish = () => {
            if (!settled) {
              settled = true;
              if (timer) clearTimeout(timer);
              resolve();
            }
          };

          // Maximum wait of 300ms for WebSpeech final result
          timer = setTimeout(finish, 300);

          // If text already arrived from interim/final, resolve faster
          if (this.latestSpeechRecognitionText) {
            setTimeout(finish, 100);
          }
        });

        if (this.currentSessionId !== sessionId) {
          this.log(`Ignoring stale recording completion for session #${sessionId}`);
          return;
        }

        await this.handleTranscription(audioBlob, language, onFinishedTranscription, sessionId);
      };

      recorder.start(250);

      // Maximum recording timeout (6.5 seconds for snappy one-word/short answers)
      this.maxRecordTimer = setTimeout(() => {
        if (this.currentSessionId === sessionId) {
          this.log('Max recording duration (6500ms) reached. Stopping recording.');
          logger.logRecognitionStop('Max recording duration reached', sessionId);
          this.stopListening();
        }
      }, 6500);

      // Initial silence timeout (5 seconds): if user does not speak at all
      this.initialSilenceTimer = setTimeout(() => {
        if (this.currentSessionId === sessionId) {
          this.log('Initial silence timeout (5000ms) reached. Stopping recording.');
          logger.logRecognitionStop('Initial silence timeout', sessionId);
          this.stopListening();
        }
      }, 5000);
    } catch (err) {
      console.error('[VoiceEngine] Failed to start recorder:', err);
      this.setState('ERROR');
      logger.logVoiceError('RecorderStart', String(err));
      this.callbacks.onError('Microphone recording error. Please check permissions.');
    }
  }

  /**
   * Stop recording
   */
  public stopListening(): void {
    if (this.state !== 'LISTENING' && this.state !== 'STARTING_MICROPHONE') {
      return;
    }

    this.setState('STOPPING_RECORDING');
    this.log('Stopping recording...');
    logger.logRecognitionStop('User or timeout stopped listening', this.currentSessionId);

    if (this.maxRecordTimer) {
      clearTimeout(this.maxRecordTimer);
      this.maxRecordTimer = null;
    }
    if (this.initialSilenceTimer) {
      clearTimeout(this.initialSilenceTimer);
      this.initialSilenceTimer = null;
    }
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.requestData();
        this.mediaRecorder.stop();
      } catch (e) {
        this.log('MediaRecorder stop error:', e);
      }
    }
  }

  /**
   * Send recorded audio to STT API and detect intent
   */
  private async handleTranscription(
    blob: Blob,
    language: SupportedLanguage,
    onSuccess: (text: string) => void,
    sessionId: number
  ) {
    if (this.currentSessionId !== sessionId) return;

    this.setState('TRANSCRIBING');
    this.log(`Transcribing audio (session #${sessionId})... Blob size: ${blob.size} bytes. Fallback text: "${this.latestSpeechRecognitionText}"`);

    let recognized = '';
    let isMock = true;

    try {
      const formData = new FormData();
      formData.append('file', blob, 'user_audio.webm');
      formData.append('language_code', this.currentListeningMode === 'language' ? 'en-IN' : language);
      formData.append('fallback_text', this.latestSpeechRecognitionText || '');

      const res = await fetch('/api/stt', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      recognized = (data.transcript || this.latestSpeechRecognitionText || '').trim();
      isMock = !!data.isMock;
      this.log(`STT response received: "${recognized}" (isMock: ${isMock})`);
    } catch (err) {
      this.log('STT request failed, using client fallback transcript:', err);
      recognized = (this.latestSpeechRecognitionText || '').trim();
    }

    if (this.currentSessionId !== sessionId) return;

    logger.logTranscript('final', recognized, normaliseTranscript(recognized), sessionId);
    this.callbacks.onTranscriptionComplete(recognized, isMock);

    // If in Language Selection mode, run deterministic language intent detection
    if (this.currentListeningMode === 'language') {
      this.setState('DETECTING_LANGUAGE');
      this.log(`Detecting language choice from transcript: "${recognized}"`);

      const detected = matchLanguageIntent(recognized);
      if (detected) {
        this.setState('LANGUAGE_CONFIRMED');
        this.log(`Language confirmed: [${detected}]`);
        onSuccess(recognized);
      } else {
        this.setState('RETRY');
        this.log(`Language choice unrecognised or empty: "${recognized}". State -> RETRY`);
        onSuccess(''); // Empty string signals FSM to trigger clear spoken retry
      }
      return;
    }

    this.setState('IDLE');
    onSuccess(recognized);
  }

  /**
   * Stop audio playback immediately
   */
  public stopSpeaking(): void {
    this.isSequenceActive = false;

    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }

    if (this.sequenceTimer) {
      clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.activeUtterance = null;
    }

    this.stopSpeakingVisualizer();
    if (this.state === 'SPEAKING' || this.state === 'PLAYING_LANGUAGE_OPTIONS') {
      this.setState('IDLE');
      this.callbacks.onSpeechEnded();
    }
  }

  /**
   * Audio Analyser Visualizer and Silence Endpointing
   */
  private startListeningVisualizer() {
    let silenceStart: number | null = null;
    let hasHeardSpeech = false;
    let consecutiveSpeechFrames = 0;
    const startTimestamp = Date.now();

    const checkAudioLevel = () => {
      if (!this.analyser || this.state !== 'LISTENING') return;

      const buffer = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(buffer);

      let sum = 0;
      for (let i = 0; i < buffer.length; i++) {
        sum += buffer[i];
      }
      const average = sum / buffer.length;
      const normalized = Math.min(1, average / 128);

      this.callbacks.onAudioAmplitude(normalized);

      const now = Date.now();
      // Ignore audio for first 350ms to discard microphone hardware startup click
      if (now - startTimestamp < 350) {
        this.animFrameId = requestAnimationFrame(checkAudioLevel);
        return;
      }

      // Check for genuine speech (amplitude > 0.08 for >= 2 consecutive frames OR WebSpeech heard text)
      if (normalized > 0.08 || this.latestSpeechRecognitionText.length > 0) {
        consecutiveSpeechFrames++;
        if (consecutiveSpeechFrames >= 2 || this.latestSpeechRecognitionText.length > 0) {
          if (!hasHeardSpeech) {
            hasHeardSpeech = true;
            this.log('User speech onset detected. Resetting initial silence timer.');
            if (this.initialSilenceTimer) {
              clearTimeout(this.initialSilenceTimer);
              this.initialSilenceTimer = null;
            }
          }
          silenceStart = null;
        }
      } else {
        consecutiveSpeechFrames = 0;
        if (hasHeardSpeech) {
          if (!silenceStart) {
            silenceStart = now;
          } else if (now - silenceStart > 1800) {
            // Natural 1.8 second silence after speech -> endpoint reached!
            this.log(`Silence endpoint (1800ms) reached after speech. Auto-stopping.`);
            this.stopListening();
            return;
          }
        }
      }

      this.animFrameId = requestAnimationFrame(checkAudioLevel);
    };

    this.animFrameId = requestAnimationFrame(checkAudioLevel);
  }

  private stopListeningVisualizer() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.callbacks.onAudioAmplitude(0);
  }

  private startSpeakingVisualizer() {
    let phase = 0;
    const animateSpeaking = () => {
      if (
        this.state !== 'SPEAKING' &&
        this.state !== 'PLAYING_LANGUAGE_OPTIONS' &&
        this.state !== 'WAITING_FOR_AUDIO_TO_FINISH'
      ) {
        return;
      }
      phase += 0.2;
      const amp = 0.4 + 0.5 * Math.abs(Math.sin(phase) * Math.cos(phase * 0.7));
      this.callbacks.onAudioAmplitude(amp);
      this.animFrameId = requestAnimationFrame(animateSpeaking);
    };
    this.animFrameId = requestAnimationFrame(animateSpeaking);
  }

  private stopSpeakingVisualizer() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.callbacks.onAudioAmplitude(0);
  }

  /**
   * Clean up all audio tracks and listeners on component unmount
   */
  public cleanup(): void {
    this.log('Cleaning up VoiceEngine resources...');
    this.stopSpeaking();
    this.stopListening();

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
    }
  }
}

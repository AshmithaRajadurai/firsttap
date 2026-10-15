/**
 * FirstTap Diagnostic Logger for Development Mode
 * Provides visibility into speech recognition, transcripts, validation, and state machine transitions.
 */

const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  logFSMState(state: string, questionId: string) {
    if (!isDev) return;
    console.log(`[FSM:State] State: "${state}" | Active Question: "${questionId}"`);
  },

  logRecognitionStart(mode: string, lang: string, sessionId: number) {
    if (!isDev) return;
    console.log(`[Voice:Start] Session #${sessionId} | Mode: ${mode} | Lang: ${lang}`);
  },

  logRecognitionStop(reason: string, sessionId: number) {
    if (!isDev) return;
    console.log(`[Voice:Stop] Session #${sessionId} | Reason: ${reason}`);
  },

  logTranscript(type: 'interim' | 'final', raw: string, normalised: string, sessionId?: number) {
    if (!isDev) return;
    const sessionTag = sessionId !== undefined ? `[#${sessionId}] ` : '';
    console.log(`[Transcript:${type}] ${sessionTag}Raw: "${raw}" | Normalised: "${normalised}"`);
  },

  logValidation(questionType: string, resultStatus: string, details?: any) {
    if (!isDev) return;
    console.log(`[Validation:${questionType}] Status: ${resultStatus}`, details ? details : '');
  },

  logTransition(fromState: string, toState: string, trigger: string) {
    if (!isDev) return;
    console.log(`[FSM:Transition] "${fromState}" ➔ "${toState}" (Trigger: "${trigger}")`);
  },

  logVoiceError(errorType: string, message: string) {
    if (!isDev) return;
    console.warn(`[Voice:Error] ${errorType}: ${message}`);
  },
};

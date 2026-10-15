import React, { useState } from 'react';
import { Sparkles, X, Send, Volume2, Mic, ArrowLeft, HelpCircle } from 'lucide-react';
import { LanguageCode } from './types';
import { voiceManager } from './voice';

interface AskSelviModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  lessonId?: string;
  lessonTitle?: string;
  currentStepInstruction?: string;
  contextPrompt?: string;
}

export const AskSelviModal: React.FC<AskSelviModalProps> = ({
  isOpen,
  onClose,
  language,
  lessonId = 'OVERVIEW',
  lessonTitle = 'WhatsApp Learning Module',
  currentStepInstruction,
  contextPrompt,
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  if (!isOpen) return null;

  const quickQuestions: Record<LanguageCode, string[]> = {
    ta: [
      'இந்த பொத்தான் என்ன செய்யும்?',
      'தவறான தொடுதல் என்று ஏன் கூறுகிறது?',
      'மோசடி அழைப்புகளை எப்படி கண்டறிவது?',
      'குரல் செய்தியை எப்படி அனுப்புவது?',
    ],
    hi: [
      'यह बटन क्या काम करता है?',
      'गलत टैप क्यों बता रहा है?',
      'फर्जी कॉल की पहचान कैसे करें?',
      'वॉयस मैसेज कैसे भेजें?',
    ],
    en: [
      'What does this highlighted button do?',
      'Why did it say wrong tap?',
      'How do I identify scam calls?',
      'How do I send a voice message?',
    ],
  };

  const handleAsk = async (textToAsk: string) => {
    if (!textToAsk.trim() || isLoading) return;
    setIsLoading(true);
    setAnswer(null);

    const langCodeMap = { ta: 'ta-IN', hi: 'hi-IN', en: 'en-IN' } as const;
    const fullLang = langCodeMap[language] || 'en-IN';

    try {
      const res = await fetch('/api/llm-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToAsk.trim(),
          doubtQuestion: textToAsk.trim(),
          language_code: fullLang,
          language: fullLang,
          context:
            contextPrompt ||
            `Digital Literacy Lesson: ${lessonId} (${lessonTitle}). Step: ${currentStepInstruction || 'Practice screen'}.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply =
          data.answer ||
          (language === 'ta'
            ? 'நான் உங்கள் டிஜிட்டல் வழிகாட்டி செல்வி! எளிய முறையில் தொடர்ந்து கற்றுக்கொள்ளுங்கள்.'
            : language === 'hi'
            ? 'मैं आपकी डिजिटल मेंटर सेलवी हूँ! सीखते रहें, मैं हमेशा मदद के लिए हूँ।'
            : 'I am your digital guide Selvi! Keep practicing step by step, I am always here to guide you.');
        setAnswer(reply);
        voiceManager.speak(reply, language);
      } else {
        const fallback =
          language === 'ta'
            ? 'திரையில் ஒளிரும் பகுதியையோ அல்லது தேவையான பொத்தானையோ தொட்டுப் பழகலாம்.'
            : language === 'hi'
            ? 'स्क्रीन पर चमकते हुए हिस्से या आवश्यक बटन को छूकर अभ्यास करें।'
            : 'Please tap the glowing area or target button on the screen to practice.';
        setAnswer(fallback);
        voiceManager.speak(fallback, language);
      }
    } catch {
      const fallback =
        language === 'ta'
          ? 'திரையில் ஒளிரும் பட்டனை மெதுவாக ஒருமுறை தொடவும்.'
          : 'Please gently tap the glowing button on the screen to continue.';
      setAnswer(fallback);
      voiceManager.speak(fallback, language);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    try {
      const rec = new SpeechRec();
      const langCodeMap = { ta: 'ta-IN', hi: 'hi-IN', en: 'en-IN' } as const;
      rec.lang = langCodeMap[language] || 'en-IN';
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      setIsRecording(true);

      rec.onresult = (e: any) => {
        const transcript = e.results?.[0]?.[0]?.transcript?.trim();
        if (transcript) {
          setQuestion(transcript);
          handleAsk(transcript);
        }
      };

      rec.onerror = () => {
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.start();
    } catch (err) {
      console.warn('Voice input error:', err);
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full shadow-2xl border-2 border-amber-300 dark:border-amber-500/50 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === 'ta' ? 'செல்வியிடம் கேளுங்கள்' : language === 'hi' ? 'सेल्वी से पूछें' : 'Ask Selvi'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lessonId}: {lessonTitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              voiceManager.stop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {/* Answer Bubble */}
          {answer && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'செல்வியின் விளக்கம்:' : 'Selvi says:'}</span>
                </span>
                <button
                  onClick={() => voiceManager.speak(answer, language)}
                  className="p-1 rounded-lg hover:bg-amber-200/50 cursor-pointer"
                  title="Replay voice"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {answer}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center space-y-2 animate-pulse">
              <Sparkles className="w-5 h-5 text-amber-500 mx-auto animate-spin" />
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {language === 'ta' ? 'செல்வி பதிலளிக்கிறார்...' : 'Selvi is thinking...'}
              </p>
            </div>
          )}

          {/* Quick Doubt Suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {language === 'ta' ? 'எளிதான சந்தேகங்கள்:' : 'Common questions:'}
            </span>
            <div className="flex flex-col gap-1.5">
              {(quickQuestions[language] || quickQuestions.en).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(q);
                    handleAsk(q);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition cursor-pointer flex items-center justify-between"
                >
                  <span>{q}</span>
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Input */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAsk(question);
              }}
              placeholder={
                language === 'ta'
                  ? 'உங்கள் சந்தேகத்தை தட்டச்சு செய்க...'
                  : 'Ask Selvi a question...'
              }
              className="flex-1 bg-transparent px-2 text-xs text-slate-900 dark:text-white outline-hidden font-medium"
            />
            <button
              type="button"
              onClick={handleStartVoiceInput}
              disabled={isLoading}
              title="Speak your question aloud"
              className={`p-2 rounded-xl transition cursor-pointer ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 text-amber-800 dark:text-amber-300'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleAsk(question)}
              disabled={!question.trim() || isLoading}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              voiceManager.stop();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-[#0D5C63] hover:bg-[#09454A] text-white font-bold text-xs shadow-xs transition cursor-pointer text-center"
          >
            {language === 'ta' ? 'பயிற்சிக்குத் திரும்பு (Resume Practice)' : 'Resume Practice'}
          </button>
        </div>
      </div>
    </div>
  );
};

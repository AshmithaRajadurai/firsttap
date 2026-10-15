import React, { useReducer, useRef, useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Paperclip,
  Send,
  Mic,
  Camera,
  ImageIcon,
  FileText,
  MapPin,
  Phone,
  Video,
  MicOff,
  UserPlus,
  CheckCircle2,
  X,
  Plus,
  Info,
  RotateCcw,
  Volume2,
  VolumeX,
  Monitor,
  PhoneOff,
  ShieldAlert,
  ShieldCheck,
  Play,
  Share2,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { LanguageCode, StepAttempt, Lesson } from './types';
import { PrimaryCategory, WhatsAppProgress, WhatsAppSegmentId, WhatsAppStepAttempt } from '@/types';
import { voiceManager } from './voice';
import { CHAT_SEGMENTS, ChatSegment, ChatSegmentStep } from './chatLessonTracks';
import { DemoRunnerOverlay } from './DemoRunnerOverlay';
import { PracticeSpotlightOverlay } from './PracticeSpotlightOverlay';
import { SegmentDoneCard } from './SegmentDoneCard';
import { SimulatedKeyboard } from './SimulatedKeyboard';
import {
  getWhatsAppSequenceForCategory,
  getNextRecommendedLesson,
  getPreviousRecommendedLesson,
  getSequenceIndexForLesson,
  SEQUENCE_RATIONALE,
} from './personalizedSequences';
import { AskSelviModal } from './AskSelviModal';
import { LessonMenuModal } from './LessonMenuModal';
import { ModuleCompletionModal } from './ModuleCompletionModal';

const translations: Record<
  LanguageCode,
  {
    back: string;
    askSelvi: string;
    exit: string;
    backToPath: string;
    chatsTab: string;
    callsTab: string;
    prev: string;
    next: string;
    skip: string;
    finish: string;
  }
> = {
  en: {
    back: 'Back',
    askSelvi: 'Ask Selvi',
    exit: 'Exit',
    backToPath: '← Back to Path',
    chatsTab: 'Chats',
    callsTab: 'Calls',
    prev: 'Prev',
    next: 'Next',
    skip: 'Skip',
    finish: 'Finish',
  },
  ta: {
    back: 'பின்செல்',
    askSelvi: 'செல்வி உதவி',
    exit: 'வெளியேறு',
    backToPath: '← பாதைக்கு திரும்பு',
    chatsTab: 'அரட்டைகள் (Chats)',
    callsTab: 'அழைப்புகள் (Calls)',
    prev: 'முந்தைய',
    next: 'அடுத்தது',
    skip: 'தவிர்',
    finish: 'முடி',
  },
  hi: {
    back: 'पीछे जाएं',
    askSelvi: 'सेलवी सहायता',
    exit: 'बाहर',
    backToPath: '← पाथ पर वापस',
    chatsTab: 'चैट्स (Chats)',
    callsTab: 'कॉल्स (Calls)',
    prev: 'पिछला',
    next: 'अगला',
    skip: 'छोड़ें',
    finish: 'समाप्त',
  },
};

interface ChatContact {
  id: string;
  name: string;
  phone: string;
  lastMsg: string;
  time: string;
  unread: number;
  demoId: string;
}

export const getLocalizedContacts = (lang: LanguageCode = 'en'): ChatContact[] => [
  {
    id: 'lakshmi',
    name: lang === 'ta' ? 'லக்ஷ்மி (Lakshmi)' : lang === 'hi' ? 'लक्ष्मी' : 'Lakshmi',
    phone: '+91 90000 00001',
    lastMsg: lang === 'ta' ? 'வணக்கம்! எப்படி இருக்கிறீர்கள்?' : lang === 'hi' ? 'नमस्ते! आप कैसे हैं?' : 'Hello! How are you?',
    time: '10:30 AM',
    unread: 1,
    demoId: 'chat-row-lakshmi',
  },
  {
    id: 'amma',
    name: lang === 'ta' ? 'அம்மா (Amma)' : lang === 'hi' ? 'अम्मा' : 'Amma',
    phone: '+91 98401 11223',
    lastMsg: lang === 'ta' ? 'மதிய உணவு சாப்பிட்டீர்களா?' : lang === 'hi' ? 'क्या आपने खाना खाया?' : 'Have you eaten lunch?',
    time: '10:42 AM',
    unread: 0,
    demoId: 'chat-row-first',
  },
  {
    id: 'ravi-anna',
    name: lang === 'ta' ? 'ரவி அண்ணா (Ravi Anna)' : lang === 'hi' ? 'रवि भैया' : 'Ravi Anna',
    phone: '+91 98402 33445',
    lastMsg: lang === 'ta' ? 'இன்று மாலை அழைக்கிறேன்' : lang === 'hi' ? 'आज शाम कॉल करता हूँ' : 'Will call you this evening',
    time: lang === 'ta' ? 'நேற்று' : lang === 'hi' ? 'कल' : 'Yesterday',
    unread: 0,
    demoId: 'chat-row-ravi',
  },
];

const INITIAL_CONTACTS: ChatContact[] = getLocalizedContacts('en');

type MessageScreen =
  | 'CHAT_LIST'
  | 'SAVE_CONTACT'
  | 'INSIDE_CHAT'
  | 'SHARING_MENU'
  | 'PHOTO_PICKER'
  | 'LOCATION_VIEW'
  | 'CALL_SCREEN'
  | 'INCOMING_CALL';

interface MessageState {
  segmentId: 'W0' | 'W1' | 'W2' | 'W3' | 'W4' | 'W5' | 'W6' | 'W7';
  phase: 'DEMO' | 'PRACTICE' | 'DONE';
  practiceStepIndex: number;
  failedAttempts: number;
  screen: MessageScreen;
  contacts: ChatContact[];
  searchQuery: string;
  newContactName: string;
  newContactNumber: string;
  chatInputText: string;
  chatMessages: {
    id: string;
    sender: 'user' | 'lakshmi' | 'amma';
    text?: string;
    type?: 'text' | 'voice' | 'photo' | 'location';
    photoUrl?: string;
    time: string;
  }[];
  typingNextCharIndex: number;
  isCallMuted: boolean;
  isCallVideoOn: boolean;
  incomingCallerType: 'lakshmi' | 'scam';
  scamDrillSuccess: boolean;
}

type MessageAction =
  | { type: 'SET_SEGMENT'; segmentId: MessageState['segmentId'] }
  | { type: 'SET_PHASE'; phase: 'DEMO' | 'PRACTICE' | 'DONE' }
  | { type: 'ADVANCE_PRACTICE_STEP' }
  | { type: 'RECORD_WRONG_TAP' }
  | { type: 'RESET_FAILED_ATTEMPTS' }
  | { type: 'GO_TO_SCREEN'; screen: MessageScreen }
  | { type: 'KEYPRESS'; char: string }
  | { type: 'BACKSPACE' }
  | { type: 'SAVE_CONTACT_ACTION' }
  | { type: 'SEND_MESSAGE_ACTION' }
  | { type: 'RECEIVE_REPLY'; text: string }
  | { type: 'ADD_VOICE_MESSAGE'; duration: string }
  | { type: 'ADD_PHOTO_MESSAGE'; url: string }
  | { type: 'ADD_LOCATION_MESSAGE' }
  | { type: 'TOGGLE_CALL_MUTE' }
  | { type: 'TOGGLE_CALL_VIDEO' }
  | { type: 'TRIGGER_SCAM_CALL' }
  | { type: 'FINISH_SCAM_DRILL' }
  | { type: 'SET_CONTACTS'; contacts: ChatContact[] }
  | { type: 'RESET_SEGMENT' };

const initialMessageState: MessageState = {
  segmentId: 'W0',
  phase: 'DEMO',
  practiceStepIndex: 0,
  failedAttempts: 0,
  screen: 'CHAT_LIST',
  contacts: INITIAL_CONTACTS,
  searchQuery: '',
  newContactName: '',
  newContactNumber: '',
  chatInputText: '',
  chatMessages: [
    { id: '1', sender: 'lakshmi', text: 'Hello! This is Lakshmi.', time: '10:30 AM', type: 'text' },
  ],
  typingNextCharIndex: 0,
  isCallMuted: false,
  isCallVideoOn: false,
  incomingCallerType: 'lakshmi',
  scamDrillSuccess: false,
};

function messageReducer(state: MessageState, action: MessageAction): MessageState {
  switch (action.type) {
    case 'SET_SEGMENT': {
      let initialScreen: MessageScreen = 'CHAT_LIST';
      if (['W2', 'W3', 'W4', 'W5', 'W6'].includes(action.segmentId)) {
        initialScreen = 'INSIDE_CHAT';
      } else if (action.segmentId === 'W7') {
        initialScreen = 'INCOMING_CALL';
      }

      return {
        ...state,
        segmentId: action.segmentId,
        phase: 'DEMO',
        practiceStepIndex: 0,
        failedAttempts: 0,
        typingNextCharIndex: 0,
        chatInputText: '',
        screen: initialScreen,
        incomingCallerType: 'lakshmi',
        scamDrillSuccess: false,
      };
    }

    case 'SET_PHASE':
      return {
        ...state,
        phase: action.phase,
        practiceStepIndex: 0,
        failedAttempts: 0,
        typingNextCharIndex: 0,
      };

    case 'ADVANCE_PRACTICE_STEP':
      return {
        ...state,
        practiceStepIndex: state.practiceStepIndex + 1,
        failedAttempts: 0,
        typingNextCharIndex: 0,
      };

    case 'RECORD_WRONG_TAP':
      return {
        ...state,
        failedAttempts: state.failedAttempts + 1,
      };

    case 'RESET_FAILED_ATTEMPTS':
      return {
        ...state,
        failedAttempts: 0,
      };

    case 'GO_TO_SCREEN':
      return {
        ...state,
        screen: action.screen,
      };

    case 'KEYPRESS': {
      if (state.screen === 'SAVE_CONTACT') {
        const currentSeg = CHAT_SEGMENTS.find((s) => s.id === state.segmentId);
        const currentStep = currentSeg?.steps[state.practiceStepIndex];

        if (currentStep?.target === 'field-name') {
          return {
            ...state,
            newContactName: state.newContactName + action.char,
            typingNextCharIndex: state.typingNextCharIndex + 1,
          };
        }
        if (currentStep?.target === 'field-number') {
          return {
            ...state,
            newContactNumber: state.newContactNumber + action.char,
            typingNextCharIndex: state.typingNextCharIndex + 1,
          };
        }
      }

      if (state.screen === 'INSIDE_CHAT') {
        return {
          ...state,
          chatInputText: state.chatInputText + action.char,
          typingNextCharIndex: state.typingNextCharIndex + 1,
        };
      }

      return state;
    }

    case 'BACKSPACE': {
      if (state.screen === 'SAVE_CONTACT') {
        return {
          ...state,
          newContactName: state.newContactName.slice(0, -1),
          typingNextCharIndex: Math.max(0, state.typingNextCharIndex - 1),
        };
      }
      if (state.screen === 'INSIDE_CHAT') {
        return {
          ...state,
          chatInputText: state.chatInputText.slice(0, -1),
          typingNextCharIndex: Math.max(0, state.typingNextCharIndex - 1),
        };
      }
      return state;
    }

    case 'SAVE_CONTACT_ACTION': {
      const name = state.newContactName || 'Lakshmi';
      const phone = state.newContactNumber || '+91 90000 00001';
      const exists = state.contacts.some((c) => c.id === 'lakshmi');
      const updatedContacts = exists
        ? state.contacts
        : [
            {
              id: 'lakshmi',
              name: `${name} (லக்ஷ்மி)`,
              phone: phone,
              lastMsg: 'Chat saved to contacts',
              time: 'Just now',
              unread: 0,
              demoId: 'chat-row-lakshmi',
            },
            ...state.contacts,
          ];

      return {
        ...state,
        contacts: updatedContacts,
        screen: 'CHAT_LIST',
      };
    }

    case 'SEND_MESSAGE_ACTION': {
      const msg = state.chatInputText || 'hi, how are you doing?';
      const newMessages = [
        ...state.chatMessages,
        { id: Date.now().toString(), sender: 'user' as const, text: msg, time: '10:44 AM', type: 'text' as const },
      ];
      return {
        ...state,
        chatMessages: newMessages,
        chatInputText: '',
      };
    }

    case 'RECEIVE_REPLY': {
      return {
        ...state,
        chatMessages: [
          ...state.chatMessages,
          { id: Date.now().toString(), sender: 'lakshmi' as const, text: action.text, time: '10:45 AM', type: 'text' as const },
        ],
      };
    }

    case 'ADD_VOICE_MESSAGE': {
      return {
        ...state,
        chatMessages: [
          ...state.chatMessages,
          { id: Date.now().toString(), sender: 'user' as const, text: `Voice note (${action.duration})`, time: '10:46 AM', type: 'voice' as const },
        ],
      };
    }

    case 'ADD_PHOTO_MESSAGE': {
      return {
        ...state,
        chatMessages: [
          ...state.chatMessages,
          { id: Date.now().toString(), sender: 'user' as const, photoUrl: action.url, time: '10:47 AM', type: 'photo' as const },
        ],
        screen: 'INSIDE_CHAT',
      };
    }

    case 'ADD_LOCATION_MESSAGE': {
      return {
        ...state,
        chatMessages: [
          ...state.chatMessages,
          { id: Date.now().toString(), sender: 'user' as const, text: 'Live Location (15 mins)', time: '10:48 AM', type: 'location' as const },
        ],
        screen: 'INSIDE_CHAT',
      };
    }

    case 'TOGGLE_CALL_MUTE':
      return { ...state, isCallMuted: !state.isCallMuted };

    case 'TOGGLE_CALL_VIDEO':
      return { ...state, isCallVideoOn: !state.isCallVideoOn };

    case 'TRIGGER_SCAM_CALL':
      return { ...state, incomingCallerType: 'scam', screen: 'INCOMING_CALL' };

    case 'FINISH_SCAM_DRILL':
      return { ...state, scamDrillSuccess: true, screen: 'CHAT_LIST' };

    case 'SET_CONTACTS':
      return { ...state, contacts: action.contacts };

    case 'RESET_SEGMENT':
      return {
        ...state,
        practiceStepIndex: 0,
        failedAttempts: 0,
        typingNextCharIndex: 0,
        chatInputText: '',
      };

    default:
      return state;
  }
}

export interface FirstTapWhatsAppProps {
  language?: LanguageCode;
  category?: PrimaryCategory | null;
  initialSegmentId?: WhatsAppSegmentId;
  completedSegments?: WhatsAppSegmentId[];
  skippedSegments?: WhatsAppSegmentId[];
  onProgressUpdate?: (progress: WhatsAppProgress) => void;
  onLogAttempt?: (attempt: StepAttempt) => void;
  onOpenDoubt?: (contextNote?: string) => void;
  onFinishModule?: () => void;
  onExit?: () => void;
}

const EMPTY_SEGMENTS: WhatsAppSegmentId[] = [];

export const FirstTapWhatsApp: React.FC<FirstTapWhatsAppProps> = ({
  language = 'en',
  category = null,
  initialSegmentId,
  completedSegments = EMPTY_SEGMENTS,
  skippedSegments = EMPTY_SEGMENTS,
  onProgressUpdate,
  onLogAttempt = () => {},
  onOpenDoubt = () => {},
  onFinishModule = () => {},
  onExit = () => {},
}) => {
  const t = translations[language] || translations.en;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const sequence = getWhatsAppSequenceForCategory(category);
  const defaultStartingSegment = initialSegmentId || sequence[0] || 'W0';

  const [state, dispatch] = useReducer(messageReducer, {
    ...initialMessageState,
    contacts: getLocalizedContacts(language),
    segmentId: defaultStartingSegment,
  });

  // Keep contacts localized if language changes
  useEffect(() => {
    dispatch({ type: 'SET_CONTACTS', contacts: getLocalizedContacts(language) });
  }, [language]);

  const [completedList, setCompletedList] = useState<WhatsAppSegmentId[]>(completedSegments);
  const [skippedList, setSkippedList] = useState<WhatsAppSegmentId[]>(skippedSegments);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelviOpen, setIsSelviOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [attemptsList, setAttemptsList] = useState<WhatsAppStepAttempt[]>([]);

  // Keep state synced with props if initialSegmentId changes
  useEffect(() => {
    if (initialSegmentId && initialSegmentId !== state.segmentId) {
      dispatch({ type: 'SET_SEGMENT', segmentId: initialSegmentId });
    }
  }, [initialSegmentId, state.segmentId]);

  useEffect(() => {
    if (!completedSegments) return;
    setCompletedList((prev) => {
      if (
        prev.length === completedSegments.length &&
        prev.every((val, idx) => val === completedSegments[idx])
      ) {
        return prev;
      }
      return completedSegments;
    });
  }, [completedSegments]);

  useEffect(() => {
    if (!skippedSegments) return;
    setSkippedList((prev) => {
      if (
        prev.length === skippedSegments.length &&
        prev.every((val, idx) => val === skippedSegments[idx])
      ) {
        return prev;
      }
      return skippedSegments;
    });
  }, [skippedSegments]);

  const emitProgress = (
    currentId: WhatsAppSegmentId,
    newCompleted: WhatsAppSegmentId[],
    newSkipped: WhatsAppSegmentId[],
    isCompleted: boolean = false
  ) => {
    if (onProgressUpdate) {
      onProgressUpdate({
        current_segment_id: currentId,
        completed_segments: newCompleted,
        skipped_segments: newSkipped,
        attempts: attemptsList,
        is_module_completed: isCompleted,
        last_active_at: new Date().toISOString(),
      });
    }
  };

  // Voice recording state for W3
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voiceStartRef = useRef<number>(0);
  const [toastAlert, setToastAlert] = useState<string | null>(null);

  const currentSegment =
    CHAT_SEGMENTS.find((s) => s.id === state.segmentId) || CHAT_SEGMENTS[0];

  const currentPracticeStep = currentSegment.steps[state.practiceStepIndex] || currentSegment.steps[0];
  const sequenceIndex = getSequenceIndexForLesson(state.segmentId as WhatsAppSegmentId, category);

  // Convert current segment into Lesson format for DemoRunnerOverlay
  const segmentLesson: Lesson = {
    id: currentSegment.id,
    title: currentSegment.title,
    steps: currentSegment.steps.map((s) => ({
      id: s.id,
      say: s.say,
      do: s.do,
      target: s.target,
      text: s.textToType,
      duration: s.duration,
    })),
  };

  // Determine what key needs to be spotlighted in PRACTICE phase for typing steps
  let spotlightKey: string | undefined;
  if (state.phase === 'PRACTICE' && currentPracticeStep?.do === 'type' && currentPracticeStep.textToType) {
    const text = currentPracticeStep.textToType;
    const nextChar = text[state.typingNextCharIndex]?.toLowerCase();
    if (nextChar) {
      if (nextChar === ' ') spotlightKey = 'key-space';
      else if (nextChar === ',') spotlightKey = 'key-comma';
      else if (nextChar === '?') spotlightKey = 'key-question';
      else spotlightKey = `key-${nextChar}`;
    }
  }

  // Active target during practice: if typing, spotlight key; otherwise spotlight target
  const practiceActiveTargetId =
    state.phase === 'PRACTICE'
      ? spotlightKey || currentPracticeStep?.target || ''
      : '';

  // Handle user completing a step in PRACTICE phase
  const handlePracticeStepSuccess = useCallback(() => {
    const isTypingStep = currentPracticeStep?.do === 'type';
    if (isTypingStep && currentPracticeStep.textToType) {
      const targetLength = currentPracticeStep.textToType.length;
      if (state.typingNextCharIndex + 1 < targetLength) {
        return;
      }
    }

    const nextIndex = state.practiceStepIndex + 1;
    if (nextIndex >= currentSegment.steps.length) {
      const segId = state.segmentId as WhatsAppSegmentId;
      const updatedCompleted = Array.from(new Set([...completedList, segId]));
      const updatedSkipped = skippedList.filter((id) => id !== segId);
      setCompletedList(updatedCompleted);
      setSkippedList(updatedSkipped);

      const seq = getWhatsAppSequenceForCategory(category);
      const isAllDone = seq.every((s) => updatedCompleted.includes(s));

      const attempt: StepAttempt = {
        step_id: segId,
        module_id: 'message',
        correct: true,
        hesitation_ms: 1200,
        attempt_number: 1,
        timestamp: Date.now(),
      };
      setAttemptsList((prev) => [...prev, attempt]);
      onLogAttempt(attempt);

      emitProgress(segId, updatedCompleted, updatedSkipped, isAllDone);

      voiceManager.speak(
        language === 'ta'
          ? 'மிக நன்று! இந்த பாடத்தை வெற்றிகரமாக முடித்துவிட்டீர்கள்.'
          : language === 'hi'
          ? 'बहुत बढ़िया! आपने यह पाठ सफलतापूर्वक पूरा कर लिया है।'
          : 'Well done! You have successfully completed this lesson.',
        language
      );

      dispatch({ type: 'SET_PHASE', phase: 'DONE' });
    } else {
      dispatch({ type: 'ADVANCE_PRACTICE_STEP' });
    }
  }, [currentPracticeStep, currentSegment.steps.length, state.segmentId, state.practiceStepIndex, state.typingNextCharIndex, onLogAttempt, language, completedList, skippedList, category]);

  // Handle DEMO completion -> Transition to PRACTICE phase
  const handleDemoComplete = useCallback(() => {
    if (['W2', 'W3', 'W4', 'W5', 'W6'].includes(state.segmentId)) {
      dispatch({ type: 'GO_TO_SCREEN', screen: 'INSIDE_CHAT' });
    } else if (state.segmentId === 'W7') {
      dispatch({ type: 'GO_TO_SCREEN', screen: 'INCOMING_CALL' });
    } else {
      dispatch({ type: 'GO_TO_SCREEN', screen: 'CHAT_LIST' });
    }

    dispatch({ type: 'RESET_SEGMENT' });
    dispatch({ type: 'SET_PHASE', phase: 'PRACTICE' });

    voiceManager.speak(
      language === 'ta'
        ? 'இப்போது உங்கள் முறை! ஒளிரும் பொத்தானைத் தொட்டு செய்யுங்கள்.'
        : language === 'hi'
        ? 'अब आपकी बारी! चमकते हुए बटन को छूकर अभ्यास करें।'
        : 'Now your turn! Follow the glowing button to practice.',
      language
    );
  }, [state.segmentId, language]);

  // Scripted reply arrival in W2
  const triggerScriptedReply = useCallback(() => {
    setTimeout(() => {
      dispatch({
        type: 'RECEIVE_REPLY',
        text: 'I am doing well, thank you! (நன்றாக இருக்கிறேன்)',
      });
      voiceManager.speak(
        language === 'ta'
          ? 'லக்ஷ்மியிடமிருந்து பதில் வந்தது: நன்றாக இருக்கிறேன்.'
          : language === 'hi'
          ? 'लक्ष्मी से जवाब आया: मैं ठीक हूँ, धन्यवाद।'
          : 'Reply received: I am doing well, thank you!',
        language
      );
    }, 1200);
  }, [language]);

  // Mic hold handler for W3
  const handleMicPointerDown = () => {
    setIsRecordingVoice(true);
    setVoiceSeconds(0);
    voiceStartRef.current = Date.now();
    voiceTimerRef.current = setInterval(() => {
      setVoiceSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleMicPointerUp = () => {
    if (!isRecordingVoice) return;
    setIsRecordingVoice(false);
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    const elapsedMs = Date.now() - voiceStartRef.current;

    if (elapsedMs < 1000 && state.phase === 'PRACTICE') {
      setToastAlert(
        language === 'ta'
          ? 'இன்னும் சிறிது நேரம் அழுத்திப் பிடிக்கவும் (Hold a little longer)'
          : 'Hold a little longer'
      );
      voiceManager.speak(
        language === 'ta' ? 'இன்னும் சிறிது நேரம் அழுத்திப் பிடிக்கவும்.' : 'Hold a little longer.',
        language
      );
      setTimeout(() => setToastAlert(null), 2000);
      return;
    }

    dispatch({ type: 'ADD_VOICE_MESSAGE', duration: '0:03' });

    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'mic-btn') {
      handlePracticeStepSuccess();
    }
  };

  const { isFirstInSequence } = getPreviousRecommendedLesson(
    state.segmentId as WhatsAppSegmentId,
    category
  );
  const { isLastInSequence } = getNextRecommendedLesson(
    state.segmentId as WhatsAppSegmentId,
    category,
    completedList,
    skippedList
  );

  // Exit handler: saves progress and returns to WhatsApp Path screen / dashboard
  const handleExit = () => {
    voiceManager.stop();
    emitProgress(state.segmentId as WhatsAppSegmentId, completedList, skippedList, false);
    onExit();
  };

  // Previous Segment Button (following personalized sequence)
  const handlePreviousSegment = () => {
    voiceManager.stop();
    const segId = state.segmentId as WhatsAppSegmentId;
    const { prevId, isFirstInSequence: atStart } = getPreviousRecommendedLesson(segId, category);

    if (prevId && !atStart) {
      emitProgress(prevId, completedList, skippedList, false);
      dispatch({ type: 'SET_SEGMENT', segmentId: prevId });
    }
  };

  // Next Segment Button (from persistent Next control or DONE card)
  const handleNextSegment = (isFromExplicitNextButton: boolean = false) => {
    voiceManager.stop();
    const segId = state.segmentId as WhatsAppSegmentId;

    // When the current lesson is completed, record the completion before navigating.
    // If the current lesson has not been completed, allow forward navigation according to
    // the product's intended learning rules without falsely marking it completed.
    let updatedCompleted = completedList;
    if (state.phase === 'DONE' && !completedList.includes(segId)) {
      updatedCompleted = Array.from(new Set([...completedList, segId]));
      setCompletedList(updatedCompleted);
    }

    const { nextId, isLastInSequence: atEnd } = getNextRecommendedLesson(
      segId,
      category,
      updatedCompleted,
      skippedList
    );

    if (nextId) {
      emitProgress(nextId, updatedCompleted, skippedList, false);
      dispatch({ type: 'SET_SEGMENT', segmentId: nextId });
    } else {
      const isAllDone = sequence.every((s) => updatedCompleted.includes(s));
      emitProgress(segId, updatedCompleted, skippedList, isAllDone);
      setIsCompletionModalOpen(true);
      if (isAllDone) {
        onFinishModule();
      }
    }
  };

  // Skip Current Lesson Handler (separate skipped status, does not mark completed)
  const handleSkipLesson = () => {
    voiceManager.stop();
    const segId = state.segmentId as WhatsAppSegmentId;

    let updatedSkipped = skippedList;
    if (!completedList.includes(segId) && !skippedList.includes(segId)) {
      updatedSkipped = [...skippedList, segId];
      setSkippedList(updatedSkipped);
    }

    const { nextId, isLastInSequence } = getNextRecommendedLesson(
      segId,
      category,
      completedList,
      updatedSkipped
    );

    voiceManager.speak(
      language === 'ta'
        ? 'இந்த பாடம் தவிர்க்கப்பட்டது. அடுத்த பாடத்திற்கு செல்கிறோம்.'
        : language === 'hi'
        ? 'यह पाठ छोड़ दिया गया है। अगले पाठ पर जा रहे हैं।'
        : 'Lesson skipped. Moving to next lesson.',
      language
    );

    if (nextId) {
      emitProgress(nextId, completedList, updatedSkipped, false);
      dispatch({ type: 'SET_SEGMENT', segmentId: nextId });
    } else {
      emitProgress(segId, completedList, updatedSkipped, true);
      setIsCompletionModalOpen(true);
      onFinishModule();
    }
  };

  const handleDoAgain = () => {
    voiceManager.stop();
    dispatch({ type: 'SET_PHASE', phase: 'DEMO' });
  };

  const handleSelectLesson = (segId: WhatsAppSegmentId) => {
    voiceManager.stop();
    emitProgress(segId, completedList, skippedList, false);
    dispatch({ type: 'SET_SEGMENT', segmentId: segId });
    setIsMenuOpen(false);
  };

  const handleRevisitSkipped = () => {
    const seq = getWhatsAppSequenceForCategory(category);
    const firstSkipped = seq.find((s) => skippedList.includes(s));
    if (firstSkipped) {
      handleSelectLesson(firstSkipped);
      setIsCompletionModalOpen(false);
    }
  };

  // Keyboard handler for typing
  const handleKeypadPress = (char: string) => {
    dispatch({ type: 'KEYPRESS', char });

    if (state.phase === 'PRACTICE' && currentPracticeStep?.do === 'type') {
      handlePracticeStepSuccess();
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F8F6F0] flex flex-col justify-between max-w-md mx-auto w-full relative select-none shadow-2xl font-sans"
    >
      {/* 1. Top Control Bar - elevated to z-60 relative so it is always clickable above any demo overlay */}
      <div className="bg-slate-900 text-white px-3 py-2 flex items-center justify-between text-xs z-60 relative border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <button
            data-demo-id="back-btn"
            onClick={handleExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-black transition cursor-pointer border border-teal-500 shadow-md shrink-0 active:scale-95"
            title="Exit to WhatsApp Learning Path"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            <span className="font-extrabold">{t.backToPath}</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                {sequenceIndex}/8
              </span>
              <span className="font-bold text-xs truncate text-slate-100 max-w-[140px] sm:max-w-[200px]">
                {currentSegment.title[language] || currentSegment.title.en}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-teal-200 text-[11px] font-bold transition cursor-pointer border border-teal-600/50"
            title="All 8 Lessons Menu"
          >
            <BookOpen className="w-3 h-3" />
            <span className="hidden sm:inline">{language === 'ta' ? 'பட்டியல்' : 'Menu'}</span>
          </button>

          {/* Ask Selvi Button */}
          <button
            onClick={() => {
              voiceManager.stop();
              setIsSelviOpen(true);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold transition cursor-pointer shadow-xs"
            title="Ask Selvi for help"
          >
            <Sparkles className="w-3 h-3" />
            <span>{t.askSelvi}</span>
          </button>
        </div>
      </div>

      {/* 2. Persistent Lesson Navigation Bar (Previous, Track Dots, Skip, Next) */}
      <div className="bg-[#09454A] px-2.5 py-1.5 flex items-center justify-between text-xs border-b border-teal-700/50 z-30 shadow-xs">
        {/* PREVIOUS BUTTON */}
        <button
          onClick={handlePreviousSegment}
          disabled={isFirstInSequence}
          className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
            isFirstInSequence
              ? 'opacity-30 cursor-not-allowed bg-slate-900/40 text-slate-400 border-transparent'
              : 'bg-teal-800 hover:bg-teal-700 text-teal-100 border-teal-600/70 shadow-2xs active:scale-95'
          }`}
          title={isFirstInSequence ? 'First lesson in sequence' : 'Go to previous lesson'}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>{t.prev}</span>
        </button>

        {/* 8 Track Sequence Dots */}
        <div className="flex items-center gap-1 flex-1 px-2 py-0.5">
          {sequence.map((segId) => {
            const isCompleted = completedList.includes(segId);
            const isSkipped = skippedList.includes(segId);
            const isCurrent = state.segmentId === segId;

            return (
              <button
                key={segId}
                onClick={() => handleSelectLesson(segId)}
                title={`${segId}: ${isCompleted ? 'Completed' : isSkipped ? 'Skipped' : isCurrent ? 'Current' : 'Pending'}`}
                className={`h-2 flex-1 rounded-full transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-400 ring-2 ring-amber-300 scale-y-125'
                    : isCompleted
                    ? 'bg-emerald-400'
                    : isSkipped
                    ? 'bg-slate-400'
                    : 'bg-teal-900/80'
                }`}
              />
            );
          })}
        </div>

        {/* SKIP & NEXT CONTROLS */}
        <div className="flex items-center gap-1 shrink-0">
          {/* SKIP LESSON BUTTON */}
          <button
            onClick={handleSkipLesson}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition cursor-pointer border border-slate-700 shadow-2xs active:scale-95"
            title="Skip this lesson without completing"
          >
            <SkipForward className="w-3 h-3 text-amber-400" />
            <span>{t.skip}</span>
          </button>

          {/* NEXT LESSON BUTTON */}
          <button
            onClick={() => handleNextSegment(true)}
            className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold transition cursor-pointer shadow-xs active:scale-95 border border-emerald-400/50"
            title={isLastInSequence ? 'Finish module' : 'Go to next lesson'}
          >
            <span>{isLastInSequence ? t.finish : t.next}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {/* Phase Pill */}
        <div className="flex items-center gap-1 text-[10px] text-teal-200 font-bold shrink-0 ml-1">
          <span className="uppercase font-mono px-1.5 py-0.5 rounded bg-teal-900/90 text-amber-300 border border-teal-600/50">
            {state.phase}
          </span>
        </div>
      </div>

      {/* Toast Alert Banner */}
      {toastAlert && (
        <div className="absolute top-20 left-4 right-4 z-50 p-2.5 rounded-xl bg-slate-900/90 text-amber-300 text-xs font-bold shadow-xl border border-amber-400 text-center animate-in fade-in duration-200">
          {toastAlert}
        </div>
      )}

      {/* 3. PHASE 1: DEMO Runner Overlay */}
      {state.phase === 'DEMO' && (
        <DemoRunnerOverlay
          language={language}
          lesson={segmentLesson}
          containerRef={containerRef}
          isActive={state.phase === 'DEMO'}
          onDemoComplete={handleDemoComplete}
          onStopLetMeTry={handleDemoComplete}
        />
      )}

      {/* 4. PHASE 2: PRACTICE Spotlight Overlay */}
      {state.phase === 'PRACTICE' && (
        <PracticeSpotlightOverlay
          language={language}
          targetId={practiceActiveTargetId}
          instructionText={currentPracticeStep?.say[language] || currentPracticeStep?.say.en}
          containerRef={containerRef}
          failedAttempts={state.failedAttempts}
          onCorrectTap={() => {}}
          onWrongTap={() => {
            dispatch({ type: 'RECORD_WRONG_TAP' });
            if (state.failedAttempts + 1 >= 3) {
              setTimeout(() => {
                dispatch({ type: 'SET_PHASE', phase: 'DEMO' });
              }, 600);
            }
          }}
          onReplayDemo={() => {
            dispatch({ type: 'SET_PHASE', phase: 'DEMO' });
          }}
        />
      )}

      {/* 5. PHASE 3: DONE Card */}
      {state.phase === 'DONE' && (
        <SegmentDoneCard
          language={language}
          title={currentSegment.doneTitle[language] || currentSegment.doneTitle.en}
          onNext={handleNextSegment}
          onDoAgain={handleDoAgain}
          onMenu={() => setIsMenuOpen(true)}
        />
      )}

      {/* Ask Selvi Modal */}
      <AskSelviModal
        isOpen={isSelviOpen}
        onClose={() => setIsSelviOpen(false)}
        language={language}
        lessonId={currentSegment.code}
        lessonTitle={currentSegment.title[language] || currentSegment.title.en}
        currentStepInstruction={currentPracticeStep?.say[language] || currentPracticeStep?.say.en}
      />

      {/* Lesson Menu Drawer */}
      <LessonMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        language={language}
        category={category}
        currentSegmentId={state.segmentId as WhatsAppSegmentId}
        completedSegments={completedList}
        skippedSegments={skippedList}
        onSelectLesson={handleSelectLesson}
      />

      {/* Module Completion Celebration Screen */}
      <ModuleCompletionModal
        isOpen={isCompletionModalOpen}
        language={language}
        completedSegments={completedList}
        skippedSegments={skippedList}
        onRevisitSkipped={handleRevisitSkipped}
        onOpenMenu={() => {
          setIsCompletionModalOpen(false);
          setIsMenuOpen(true);
        }}
        onReturnToDashboard={onExit}
      />

      {/* 6. MAIN CHAT APP SCREENS */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        {/* ================= SCREEN 1: CHAT_LIST (W0, W1) ================= */}
        {state.screen === 'CHAT_LIST' && (
          <div className="flex-1 flex flex-col justify-between bg-slate-100 relative">
            <div className="bg-[#0D5C63] text-white p-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={onExit} className="p-1 rounded-full hover:bg-teal-700 cursor-pointer">
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <h3 className="font-bold text-base tracking-tight">FirstTapMessage</h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* Search Icon: data-demo-id="search-icon" */}
                  <button
                    data-demo-id="search-icon"
                    onClick={() => {
                      if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'search-icon') {
                        handlePracticeStepSuccess();
                      }
                    }}
                    className="p-2 rounded-full hover:bg-teal-700/80 cursor-pointer"
                    title="Search Contacts"
                  >
                    <Search className="w-5 h-5 text-white" />
                  </button>
                  <MoreVertical className="w-5 h-5 text-teal-200 cursor-pointer" />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs border-b border-teal-600/40 pb-1">
                <span className="font-bold text-white border-b-2 border-amber-400 pb-1 cursor-pointer">
                  {t.chatsTab}
                </span>
                <span className="text-teal-200 pb-1 cursor-pointer">{t.callsTab}</span>
              </div>
            </div>

            {/* Chat List Container: data-demo-id="chat-list" */}
            <div
              data-demo-id="chat-list"
              onClick={() => {
                if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'chat-list') {
                  handlePracticeStepSuccess();
                }
              }}
              className="flex-1 divide-y divide-slate-200 bg-white overflow-y-auto"
            >
              {state.contacts.map((contact, idx) => (
                <button
                  key={contact.id}
                  data-demo-id={contact.demoId}
                  onClick={() => {
                    if (state.phase === 'PRACTICE') {
                      if (
                        currentPracticeStep?.target === contact.demoId ||
                        (currentPracticeStep?.target === 'chat-row-first' && idx === 0)
                      ) {
                        handlePracticeStepSuccess();
                      }
                    }
                    if (contact.id === 'lakshmi') {
                      dispatch({ type: 'GO_TO_SCREEN', screen: 'INSIDE_CHAT' });
                    }
                  }}
                  className="w-full p-3 text-left flex items-center gap-3 transition cursor-pointer hover:bg-slate-50"
                >
                  <div className="w-11 h-11 rounded-full font-bold text-sm flex items-center justify-center shrink-0 text-white bg-[#0D5C63]">
                    {contact.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {contact.name}
                      </h4>
                      <span className="text-[10px] text-teal-800 font-bold shrink-0">
                        {contact.time}
                      </span>
                    </div>
                    <p className="text-xs truncate text-slate-500 mt-0.5">
                      {contact.lastMsg}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Floating New Chat Button: data-demo-id="new-chat-btn" */}
            <div className="relative">
              <button
                data-demo-id="new-chat-btn"
                onClick={() => {
                  dispatch({ type: 'GO_TO_SCREEN', screen: 'SAVE_CONTACT' });
                  if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'new-chat-btn') {
                    handlePracticeStepSuccess();
                  }
                }}
                className="absolute right-4 -top-16 w-14 h-14 rounded-full bg-[#0D5C63] text-white flex items-center justify-center shadow-2xl hover:bg-teal-800 active:scale-95 transition cursor-pointer z-20 border-2 border-white"
                title="New Chat / Save Contact"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 2: SAVE_CONTACT (W1) ================= */}
        {state.screen === 'SAVE_CONTACT' && (
          <div className="flex-1 flex flex-col justify-between p-4 bg-white">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <button
                  data-demo-id="back-btn"
                  onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'CHAT_LIST' })}
                  className="p-1 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <h3 className="font-bold text-slate-900 text-sm">புதிய தொடர்பு (New Contact)</h3>
              </div>

              {/* New Contact Button: data-demo-id="new-contact-btn" */}
              <button
                data-demo-id="new-contact-btn"
                onClick={() => {
                  if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'new-contact-btn') {
                    handlePracticeStepSuccess();
                  }
                }}
                className="w-full p-3 rounded-2xl bg-teal-50 border border-teal-200 text-[#0D5C63] font-bold text-xs flex items-center gap-2 hover:bg-teal-100 cursor-pointer"
              >
                <UserPlus className="w-5 h-5" />
                <span>+ புதிய நபரைச் சேமிக்க (New Contact)</span>
              </button>

              {/* Name Input: data-demo-id="field-name" */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">பெயர் (Name):</label>
                <div
                  data-demo-id="field-name"
                  onClick={() => {
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'field-name') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 flex items-center justify-between"
                >
                  <span>{state.newContactName || <span className="text-slate-400">Lakshmi</span>}</span>
                  {currentPracticeStep?.target === 'field-name' && (
                    <span className="w-1.5 h-4 bg-teal-600 animate-pulse inline-block" />
                  )}
                </div>
              </div>

              {/* Number Input: data-demo-id="field-number" */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">தொலைபேசி எண் (Number):</label>
                <div
                  data-demo-id="field-number"
                  onClick={() => {
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'field-number') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono flex items-center justify-between"
                >
                  <span>{state.newContactNumber || <span className="text-slate-400">9000000001</span>}</span>
                  {currentPracticeStep?.target === 'field-number' && (
                    <span className="w-1.5 h-4 bg-teal-600 animate-pulse inline-block" />
                  )}
                </div>
              </div>

              {/* Save Button: data-demo-id="save-contact" */}
              <button
                data-demo-id="save-contact"
                onClick={() => {
                  dispatch({ type: 'SAVE_CONTACT_ACTION' });
                  if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'save-contact') {
                    handlePracticeStepSuccess();
                  }
                }}
                className="w-full min-h-[54px] py-3.5 rounded-2xl bg-[#0D5C63] hover:bg-[#09454A] text-white font-bold text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-5 h-5 text-amber-300" />
                <span>தொடர்பைச் சேமி (Save Contact)</span>
              </button>
            </div>

            {/* On-screen keyboard for typing name and number */}
            <div className="pt-2">
              <SimulatedKeyboard
                mode={currentPracticeStep?.target === 'field-number' ? 'numeric' : 'alpha'}
                spotlightKey={spotlightKey}
                onKeyPress={handleKeypadPress}
                onBackspace={() => dispatch({ type: 'BACKSPACE' })}
              />
            </div>
          </div>
        )}

        {/* ================= SCREEN 3: INSIDE_CHAT (W2, W3, W4, W5, W6) ================= */}
        {state.screen === 'INSIDE_CHAT' && (
          <div className="flex-1 flex flex-col justify-between bg-[#EFEAE2]">
            {/* Chat Top Header */}
            <div className="bg-[#0D5C63] text-white px-3 py-2.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  data-demo-id="back-btn"
                  onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'CHAT_LIST' })}
                  className="p-1 hover:bg-teal-700 rounded-full cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
                <div className="w-8 h-8 rounded-full bg-teal-100 text-[#0D5C63] font-bold text-xs flex items-center justify-center">
                  L
                </div>
                <div>
                  <h4 className="font-bold text-xs">{language === 'ta' ? 'லக்ஷ்மி (Lakshmi)' : language === 'hi' ? 'लक्ष्मी' : 'Lakshmi'}</h4>
                  <span className="text-[9px] text-teal-200 block">online</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Call Icon: data-demo-id="call-icon" */}
                <button
                  data-demo-id="call-icon"
                  onClick={() => {
                    dispatch({ type: 'GO_TO_SCREEN', screen: 'CALL_SCREEN' });
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'call-icon') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className="p-1.5 rounded-full hover:bg-teal-700 cursor-pointer"
                  title="Audio Call"
                >
                  <Phone className="w-4 h-4 text-white" />
                </button>
                <MoreVertical className="w-4 h-4 text-teal-200 cursor-pointer" />
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {state.chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[80%] p-2.5 rounded-2xl shadow-2xs text-xs text-slate-800 ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-[#D9FDD3] rounded-tr-xs'
                      : 'bg-white rounded-tl-xs'
                  }`}
                >
                  {msg.type === 'photo' ? (
                    <div className="space-y-1">
                      <img
                        src={msg.photoUrl || '/photos/photo1.jpg'}
                        alt="Photo"
                        className="w-48 h-36 object-cover rounded-xl shadow-xs"
                      />
                    </div>
                  ) : msg.type === 'voice' ? (
                    <div className="flex items-center gap-2 py-1">
                      <div className="w-8 h-8 rounded-full bg-[#0D5C63] text-white flex items-center justify-center shrink-0">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                      <div className="flex-1">
                        <div className="h-1.5 bg-slate-300 rounded-full overflow-hidden w-28">
                          <div className="w-2/3 h-full bg-[#0D5C63]" />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">{msg.text}</span>
                      </div>
                    </div>
                  ) : msg.type === 'location' ? (
                    <div className="space-y-1">
                      <div className="w-48 h-24 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-red-500 animate-bounce" />
                        <span className="text-[11px] font-bold text-teal-900 ml-1">Live Location</span>
                      </div>
                      <span className="text-[10px] text-slate-600 block">Shared for 15 mins</span>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-1">
                    <span>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Message Input Bar */}
            <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 border-t border-slate-200">
              {/* Paperclip Share Menu Button: data-demo-id="attach-btn" */}
              <button
                data-demo-id="attach-btn"
                onClick={() => {
                  dispatch({ type: 'GO_TO_SCREEN', screen: 'SHARING_MENU' });
                  if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'attach-btn') {
                    handlePracticeStepSuccess();
                  }
                }}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="Attach"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Message Box: data-demo-id="msg-input" */}
              <div
                data-demo-id="msg-input"
                onClick={() => {
                  if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'msg-input') {
                    handlePracticeStepSuccess();
                  }
                }}
                className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-slate-800 border border-slate-200 flex items-center justify-between cursor-pointer"
              >
                <span>
                  {state.chatInputText || (
                    <span className="text-slate-400">hi, how are you doing?</span>
                  )}
                </span>
                {currentPracticeStep?.target === 'msg-input' && (
                  <span className="w-1.5 h-4 bg-teal-600 animate-pulse inline-block" />
                )}
              </div>

              {/* Send Button: data-demo-id="send-btn" */}
              <button
                data-demo-id="send-btn"
                onClick={() => {
                  dispatch({ type: 'SEND_MESSAGE_ACTION' });
                  triggerScriptedReply();
                  if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'send-btn') {
                    handlePracticeStepSuccess();
                  }
                }}
                className="p-2.5 rounded-full bg-[#0D5C63] text-white shadow-2xs cursor-pointer hover:bg-teal-800 active:scale-95"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>

              {/* Mic Button: data-demo-id="mic-btn" (Supports pointerdown/pointerup for W3 hold) */}
              <button
                data-demo-id="mic-btn"
                onPointerDown={handleMicPointerDown}
                onPointerUp={handleMicPointerUp}
                onMouseDown={handleMicPointerDown}
                onMouseUp={handleMicPointerUp}
                className={`p-2.5 rounded-full transition shadow-xs cursor-pointer ${
                  isRecordingVoice
                    ? 'bg-red-600 text-white scale-110 animate-pulse ring-4 ring-red-400'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-teal-700'
                }`}
                title="Hold for Voice Note"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Voice Recording Timer Display when active */}
            {isRecordingVoice && (
              <div className="bg-red-50 text-red-700 p-2 text-center text-xs font-bold flex items-center justify-center gap-2 border-t border-red-200">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span>Recording Voice: 0:0{voiceSeconds} (Release to send)</span>
              </div>
            )}

            {/* On-screen keyboard for typing message */}
            {!isRecordingVoice && (
              <div className="bg-slate-200 border-t border-slate-300">
                <SimulatedKeyboard
                  mode="alpha"
                  spotlightKey={spotlightKey}
                  onKeyPress={handleKeypadPress}
                  onBackspace={() => dispatch({ type: 'BACKSPACE' })}
                />
              </div>
            )}
          </div>
        )}

        {/* ================= SCREEN 4: SHARING_MENU (W4, W5) ================= */}
        {state.screen === 'SHARING_MENU' && (
          <div className="flex-1 flex flex-col justify-between bg-black/60 relative">
            <div className="p-4 text-white text-xs opacity-80">
              <p className="font-bold">Share with Lakshmi</p>
            </div>

            <div className="bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 text-sm">பகிர்வு விருப்பங்கள் (Share Options)</h4>
                <button
                  onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'INSIDE_CHAT' })}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                {/* Photo: data-demo-id="attach-photo" */}
                <button
                  data-demo-id="attach-photo"
                  onClick={() => {
                    dispatch({ type: 'GO_TO_SCREEN', screen: 'PHOTO_PICKER' });
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'attach-photo') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className="p-2 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-50 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1 shadow-xs">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Photo</span>
                </button>

                {/* Location: data-demo-id="attach-location" */}
                <button
                  data-demo-id="attach-location"
                  onClick={() => {
                    dispatch({ type: 'GO_TO_SCREEN', screen: 'LOCATION_VIEW' });
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'attach-location') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className="p-2 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-50 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-600 text-white flex items-center justify-center mb-1 shadow-xs">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Location</span>
                </button>

                {/* Document */}
                <button className="p-2 rounded-2xl flex flex-col items-center justify-center opacity-60">
                  <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center mb-1 shadow-xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-slate-700">Document</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= SCREEN 5: PHOTO_PICKER (W4) ================= */}
        {state.screen === 'PHOTO_PICKER' && (
          <div className="flex-1 flex flex-col justify-between bg-slate-900 text-white p-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <button
                onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'SHARING_MENU' })}
                className="text-white flex items-center gap-1 text-xs cursor-pointer hover:text-teal-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="text-xs font-bold text-teal-300">புகைப்படம் தேர்வு (Choose Photo)</span>
            </div>

            <div className="my-auto space-y-4">
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <button
                  data-demo-id="photo-sample-1"
                  onClick={() => {
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'photo-sample-1') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className="group relative rounded-2xl overflow-hidden border-2 border-teal-400 shadow-lg cursor-pointer bg-slate-800 text-left"
                >
                  <div className="aspect-4/3 w-full overflow-hidden bg-slate-950">
                    <img src="/photos/photo1.jpg" alt="Sample 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 bg-slate-950/90">
                    <span className="text-[11px] font-bold text-white block">Snowy Mountains</span>
                    <span className="text-[9px] text-teal-400 font-semibold block mt-0.5">தேர்வு செய்ய (Selected)</span>
                  </div>
                </button>

                <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 opacity-60">
                  <div className="aspect-4/3 w-full bg-slate-950 overflow-hidden">
                    <img src="/photos/photo2.jpg" alt="Sample 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 bg-slate-950/90">
                    <span className="text-[11px] font-bold text-white block">Taj Mahal</span>
                  </div>
                </div>
              </div>

              {/* Send Photo Button: data-demo-id="send-photo-btn" */}
              <div className="max-w-sm mx-auto w-full pt-2">
                <button
                  data-demo-id="send-photo-btn"
                  onClick={() => {
                    dispatch({ type: 'ADD_PHOTO_MESSAGE', url: '/photos/photo1.jpg' });
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'send-photo-btn') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className="w-full min-h-[52px] py-3.5 rounded-2xl bg-[#0D5C63] hover:bg-[#09454A] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-teal-400/40"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Send Photo (அனுப்பு)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= SCREEN 6: LOCATION_VIEW (W5) ================= */}
        {state.screen === 'LOCATION_VIEW' && (
          <div className="flex-1 flex flex-col justify-between bg-[#EFEAE2] p-3 space-y-3">
            <div className="bg-[#0D5C63] text-white p-2.5 rounded-xl flex items-center gap-2">
              <button
                onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'INSIDE_CHAT' })}
                className="p-1 hover:bg-teal-700 rounded-full cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
              <span className="font-bold text-xs">இருப்பிடம் பகிர்தல் (Share Location)</span>
            </div>

            <div className="bg-white p-3 rounded-2xl max-w-xs shadow-xs space-y-2">
              <div className="w-full h-28 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col items-center justify-center relative overflow-hidden">
                <MapPin className="w-8 h-8 text-red-500 animate-bounce" />
                <span className="text-[10px] text-slate-600 font-bold mt-1">Sample practice map</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3 mt-auto">
              <h4 className="font-bold text-slate-900 text-sm">Send your location</h4>

              {/* Send this location button: data-demo-id="send-location" */}
              <button
                data-demo-id="send-location"
                onClick={() => {
                  dispatch({ type: 'ADD_LOCATION_MESSAGE' });
                  if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'send-location') {
                    handlePracticeStepSuccess();
                  }
                }}
                className="w-full min-h-[52px] py-3 rounded-2xl font-bold text-xs shadow-md transition cursor-pointer text-white bg-[#0D5C63] hover:bg-[#09454A]"
              >
                Send this location (தற்போதைய இடம்)
              </button>

              <p className="text-[11px] text-slate-500 text-center font-medium">
                Share your location only with people you trust.
              </p>
            </div>
          </div>
        )}

        {/* ================= SCREEN 7: CALL_SCREEN (W6) ================= */}
        {state.screen === 'CALL_SCREEN' && (
          <div className="flex-1 flex flex-col justify-between bg-slate-950 text-white p-5">
            <div className="text-center pt-6 space-y-2">
              <div className="w-24 h-24 rounded-full bg-[#0D5C63] text-white font-bold text-3xl flex items-center justify-center mx-auto shadow-2xl border-2 border-teal-400/50">
                L
              </div>
              <h3 className="font-bold text-lg">{language === 'ta' ? 'லக்ஷ்மி (Lakshmi)' : language === 'hi' ? 'लक्ष्मी' : 'Lakshmi'}</h3>
              <span className="text-xs text-teal-300 font-semibold block">00:03 (Connected)</span>
            </div>

            {/* Video preview simulation */}
            {state.isCallVideoOn && (
              <div className="w-36 h-48 bg-slate-800 rounded-2xl border border-teal-500 mx-auto flex flex-col items-center justify-center shadow-2xl animate-in zoom-in-95 duration-200">
                <Camera className="w-8 h-8 text-teal-400 mb-1" />
                <span className="text-[10px] text-teal-200">Camera Preview On</span>
              </div>
            )}

            {/* Call Controls */}
            <div className="bg-slate-900/90 rounded-3xl p-4 border border-slate-800 space-y-4">
              <div className="grid grid-cols-4 gap-3 text-center">
                {/* Mute: data-demo-id="call-mute" */}
                <button
                  data-demo-id="call-mute"
                  onClick={() => {
                    dispatch({ type: 'TOGGLE_CALL_MUTE' });
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'call-mute') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer ${
                    state.isCallMuted ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  {state.isCallMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span className="text-[10px] font-bold mt-1">{state.isCallMuted ? 'Muted' : 'Mute'}</span>
                </button>

                {/* Video: data-demo-id="call-video" */}
                <button
                  data-demo-id="call-video"
                  onClick={() => {
                    dispatch({ type: 'TOGGLE_CALL_VIDEO' });
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'call-video') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer ${
                    state.isCallVideoOn ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span className="text-[10px] font-bold mt-1">Video</span>
                </button>

                {/* Speaker: data-demo-id="call-speaker" */}
                <button
                  data-demo-id="call-speaker"
                  onClick={() => {
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'call-speaker') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className="p-3 rounded-2xl flex flex-col items-center justify-center bg-slate-800 text-white hover:bg-slate-700 cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                  <span className="text-[10px] font-bold mt-1">Speaker</span>
                </button>

                {/* Share Screen: data-demo-id="call-share-screen" */}
                <button
                  data-demo-id="call-share-screen"
                  onClick={() => {
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'call-share-screen') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className="p-3 rounded-2xl flex flex-col items-center justify-center bg-slate-800 text-white hover:bg-slate-700 cursor-pointer"
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-[10px] font-bold mt-1">Share</span>
                </button>
              </div>

              {/* End Call: data-demo-id="call-end" */}
              <button
                data-demo-id="call-end"
                onClick={() => {
                  dispatch({ type: 'GO_TO_SCREEN', screen: 'INSIDE_CHAT' });
                  if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'call-end') {
                    handlePracticeStepSuccess();
                  }
                }}
                className="w-full min-h-[56px] py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <PhoneOff className="w-6 h-6" />
                <span>{language === 'ta' ? 'அழைப்பை முடிக்க (End Call)' : language === 'hi' ? 'कॉल समाप्त करें' : 'End Call'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 8: INCOMING_CALL (W7) ================= */}
        {state.screen === 'INCOMING_CALL' && (
          <div className="flex-1 flex flex-col justify-between bg-slate-950 text-white p-5">
            <div className="text-center pt-8 space-y-3">
              <div
                className={`w-24 h-24 rounded-full font-bold text-3xl flex items-center justify-center mx-auto shadow-2xl border-4 ${
                  state.incomingCallerType === 'lakshmi'
                    ? 'bg-[#0D5C63] text-white border-teal-400'
                    : 'bg-red-600 text-white border-red-400 animate-pulse'
                }`}
              >
                {state.incomingCallerType === 'lakshmi' ? 'L' : '!'}
              </div>

              <div>
                <h3 className="font-bold text-xl">
                  {state.incomingCallerType === 'lakshmi'
                    ? (language === 'ta' ? 'லக்ஷ்மி (Lakshmi)' : language === 'hi' ? 'लक्ष्मी' : 'Lakshmi')
                    : (language === 'ta' ? 'அறியாதவர்: "Support" என கூறுகிறார்' : language === 'hi' ? 'अज्ञात: "Support" दावा' : 'Unknown: Claiming "Support"')}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {state.incomingCallerType === 'lakshmi' ? '+91 90000 00001' : '+91 91234 56789'}
                </p>
              </div>

              {state.incomingCallerType === 'scam' && (
                <div
                  data-demo-id="scam-call-alert"
                  className="bg-red-950/80 border-2 border-red-500 p-3 rounded-2xl text-left text-xs text-red-200 space-y-1 animate-in zoom-in-95 duration-200"
                >
                  <div className="flex items-center gap-1.5 font-bold text-red-400">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span>
                      {language === 'ta'
                        ? 'மோசடி எச்சரிக்கை! (Scam Alert)'
                        : language === 'hi'
                        ? 'धोखाधड़ी चेतावनी! (Scam Alert)'
                        : 'Scam Alert!'}
                    </span>
                  </div>
                  <p>
                    {language === 'ta'
                      ? 'அழைப்பாளர் உங்கள் திரையைப் பகிருமாறு (Share Screen) கேட்கிறார். ஒருபோதும் திரையைப் பகிரக் கூடாது!'
                      : language === 'hi'
                      ? 'कॉलर आपकी स्क्रीन साझा करने (Share Screen) को कह रहा है। कभी भी स्क्रीन साझा न करें!'
                      : 'Caller is asking you to share your screen. NEVER share your screen with strangers!'}
                  </p>
                </div>
              )}
            </div>

            {/* Answer (Green) & Decline (Red) Controls */}
            <div className="flex justify-around items-center pt-8 pb-6">
              {/* Decline (Red): data-demo-id="call-decline" */}
              <div className="flex flex-col items-center">
                <button
                  data-demo-id="call-decline"
                  onClick={() => {
                    dispatch({ type: 'FINISH_SCAM_DRILL' });
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'call-decline') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl active:scale-95 transition cursor-pointer"
                  title="Decline"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
                <span className="text-xs text-red-400 font-bold mt-2">
                  {language === 'ta' ? 'நிராகரி (Decline)' : language === 'hi' ? 'अस्वीकार (Decline)' : 'Decline'}
                </span>
              </div>

              {/* Answer (Green): data-demo-id="call-answer" */}
              <div className="flex flex-col items-center">
                <button
                  data-demo-id="call-answer"
                  onClick={() => {
                    dispatch({ type: 'GO_TO_SCREEN', screen: 'CALL_SCREEN' });
                    if (state.phase === 'PRACTICE' && currentPracticeStep?.target === 'call-answer') {
                      handlePracticeStepSuccess();
                    }
                  }}
                  className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-2xl active:scale-95 transition cursor-pointer"
                  title="Answer"
                >
                  <Phone className="w-7 h-7" />
                </button>
                <span className="text-xs text-emerald-400 font-bold mt-2">
                  {language === 'ta' ? 'ஏற்றுக்கொள் (Answer)' : language === 'hi' ? 'उत्तर दें (Answer)' : 'Answer'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const FirstTapMessage = FirstTapWhatsApp;
export default FirstTapWhatsApp;

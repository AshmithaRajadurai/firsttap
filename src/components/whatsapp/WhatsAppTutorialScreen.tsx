import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  MoreVertical,
  ArrowLeft,
  Paperclip,
  Send,
  Mic,
  Camera,
  ImageIcon,
  FileText,
  MapPin,
  User,
  Phone,
  Video,
  Volume2,
  MicOff,
  PhoneOff,
  Check,
  CheckCheck,
  Plus,
  Play,
  X,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  Info,
  MousePointer,
  HelpCircle,
} from 'lucide-react';
import { WHATSAPP_LESSONS, WhatsAppLesson, LessonStep } from './whatsappLessons';
import { voiceManager } from './voice';

export interface WhatsAppTutorialScreenProps {
  onBackToMainMenu?: () => void;
  language?: 'ta' | 'hi' | 'en';
}

interface ChatContactItem {
  id: string;
  name: string;
  avatarColor: string;
  avatarTextColor: string;
  avatarLetter: string;
  lastMsg: string;
  time: string;
  unreadCount?: number;
  demoId: string;
}

const DEFAULT_CONTACTS: ChatContactItem[] = [
  {
    id: 'amma',
    name: 'Amma',
    avatarColor: 'bg-[#C2E7FF]',
    avatarTextColor: 'text-[#004A77]',
    avatarLetter: 'A',
    lastMsg: 'Have you eaten lunch?',
    time: '10:42',
    unreadCount: 2,
    demoId: 'chat-row-amma',
  },
  {
    id: 'ravi',
    name: 'Ravi Anna',
    avatarColor: 'bg-[#FFE082]',
    avatarTextColor: 'text-[#6D4C41]',
    avatarLetter: 'R',
    lastMsg: 'Voice message (0:12)',
    time: 'Yesterday',
    demoId: 'chat-row-ravi',
  },
  {
    id: 'family',
    name: 'Family Group',
    avatarColor: 'bg-[#E1BEE7]',
    avatarTextColor: 'text-[#4A148C]',
    avatarLetter: 'F',
    lastMsg: 'Photo from Sunday',
    time: 'Yesterday',
    demoId: 'chat-row-family',
  },
  {
    id: 'clinic',
    name: 'Clinic Reminder',
    avatarColor: 'bg-[#C8E6C9]',
    avatarTextColor: 'text-[#1B5E20]',
    avatarLetter: 'C',
    lastMsg: 'Your visit is on Friday',
    time: 'Mon',
    demoId: 'chat-row-clinic',
  },
  {
    id: 'unknown',
    name: 'Unknown number',
    avatarColor: 'bg-[#FFCDD2]',
    avatarTextColor: 'text-[#B71C1C]',
    avatarLetter: '!',
    lastMsg: 'You won a prize! Click here',
    time: 'Mon',
    demoId: 'chat-row-unknown',
  },
];

export interface PracticeTask {
  lessonId: number;
  description: string;
  name?: string;
  phone?: string;
  contact?: string;
  message?: string;
}

export interface PracticeStep {
  id: string;
  targetId: string;
  instruction: string;
  guideText: string;
  actionType: 'tap' | 'type';
  expectedScreen: 'HOME' | 'NEW_CONTACT' | 'SEARCH' | 'CHAT' | 'SHARING_MENU' | 'PHOTO_PICKER' | 'LOCATION' | 'CALL';
}

const generatePracticeTask = (lessonId: number): { task: PracticeTask; steps: PracticeStep[] } => {
  const names = ['Ravi', 'Lakshmi', 'Hari', 'Guru', 'Priya', 'Kumar'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
  const randomPhone = `9${randomDigits}`;
  const formattedPhone = `${randomPhone.slice(0, 5)} ${randomPhone.slice(5)}`;

  if (lessonId === 1) {
    const task: PracticeTask = {
      lessonId: 1,
      name: randomName,
      phone: formattedPhone,
      description: `Save a contact named ${randomName} with the number ${formattedPhone}.`,
    };
    const steps: PracticeStep[] = [
      {
        id: 'p1_s1',
        targetId: 'new-contact-fab',
        instruction: 'Tap the New Contact button.',
        guideText: 'Tap + New Contact',
        actionType: 'tap',
        expectedScreen: 'HOME',
      },
      {
        id: 'p1_s2',
        targetId: 'contact-name-input',
        instruction: `Type the name ${randomName}.`,
        guideText: `Type ${randomName}`,
        actionType: 'type',
        expectedScreen: 'NEW_CONTACT',
      },
      {
        id: 'p1_s3',
        targetId: 'contact-phone-input',
        instruction: `Type the number ${formattedPhone}.`,
        guideText: `Type ${formattedPhone}`,
        actionType: 'type',
        expectedScreen: 'NEW_CONTACT',
      },
      {
        id: 'p1_s4',
        targetId: 'save-contact-btn',
        instruction: 'Now tap Save to save the contact.',
        guideText: 'Tap Save',
        actionType: 'tap',
        expectedScreen: 'NEW_CONTACT',
      },
    ];
    return { task, steps };
  }

  if (lessonId === 2) {
    const contactsList = ['Amma', 'Lakshmi', 'Ravi Anna', 'Family Group'];
    const targetContact = contactsList[Math.floor(Math.random() * contactsList.length)];
    const messages = ['Hello, how are you?', 'Good morning!', 'Where are you?', 'See you soon'];
    const targetMessage = messages[Math.floor(Math.random() * messages.length)];
    const contactSlug = targetContact.toLowerCase().split(' ')[0];

    const task: PracticeTask = {
      lessonId: 2,
      contact: targetContact,
      message: targetMessage,
      description: `Search for ${targetContact} and send the message "${targetMessage}".`,
    };
    const steps: PracticeStep[] = [
      {
        id: 'p2_s1',
        targetId: 'search-icon-btn',
        instruction: 'Tap the search icon at the top.',
        guideText: 'Tap search icon',
        actionType: 'tap',
        expectedScreen: 'HOME',
      },
      {
        id: 'p2_s2',
        targetId: 'search-input-field',
        instruction: `Type "${targetContact}" in the search field.`,
        guideText: `Type ${targetContact}`,
        actionType: 'type',
        expectedScreen: 'SEARCH',
      },
      {
        id: 'p2_s3',
        targetId: `search-result-${contactSlug}`,
        instruction: `Tap ${targetContact} to open the conversation.`,
        guideText: `Tap ${targetContact}`,
        actionType: 'tap',
        expectedScreen: 'SEARCH',
      },
      {
        id: 'p2_s4',
        targetId: 'chat-input-box',
        instruction: 'Tap the message box to start typing.',
        guideText: 'Tap message box',
        actionType: 'tap',
        expectedScreen: 'CHAT',
      },
      {
        id: 'p2_s5',
        targetId: 'chat-input-field',
        instruction: `Type your message "${targetMessage}".`,
        guideText: `Type "${targetMessage}"`,
        actionType: 'type',
        expectedScreen: 'CHAT',
      },
      {
        id: 'p2_s6',
        targetId: 'send-message-btn',
        instruction: 'Now tap the green Send button.',
        guideText: 'Tap Send',
        actionType: 'tap',
        expectedScreen: 'CHAT',
      },
    ];
    return { task, steps };
  }

  if (lessonId === 3) {
    const task: PracticeTask = {
      lessonId: 3,
      description: 'In chat with Amma, tap the paperclip, select Photo, and send it.',
    };
    const steps: PracticeStep[] = [
      {
        id: 'p3_s1',
        targetId: 'paperclip-attach-btn',
        instruction: 'Tap the paperclip icon in the message bar.',
        guideText: 'Tap paperclip',
        actionType: 'tap',
        expectedScreen: 'CHAT',
      },
      {
        id: 'p3_s2',
        targetId: 'share-menu-photo',
        instruction: 'Tap Photo to choose an image from your gallery.',
        guideText: 'Tap Photo',
        actionType: 'tap',
        expectedScreen: 'SHARING_MENU',
      },
      {
        id: 'p3_s3',
        targetId: 'sample-photo-1',
        instruction: 'Select the sample photo you want to send.',
        guideText: 'Select sample photo',
        actionType: 'tap',
        expectedScreen: 'PHOTO_PICKER',
      },
      {
        id: 'p3_s4',
        targetId: 'send-photo-btn',
        instruction: 'Now tap Send to share the photo.',
        guideText: 'Tap Send',
        actionType: 'tap',
        expectedScreen: 'PHOTO_PICKER',
      },
    ];
    return { task, steps };
  }

  if (lessonId === 4) {
    const task: PracticeTask = {
      lessonId: 4,
      description: 'In chat with Amma, tap the paperclip, select Location, and send your location.',
    };
    const steps: PracticeStep[] = [
      {
        id: 'p4_s1',
        targetId: 'paperclip-attach-btn',
        instruction: 'Tap the paperclip icon to open sharing options.',
        guideText: 'Tap paperclip',
        actionType: 'tap',
        expectedScreen: 'CHAT',
      },
      {
        id: 'p4_s2',
        targetId: 'share-menu-location',
        instruction: 'Tap Location to open the map options.',
        guideText: 'Tap Location',
        actionType: 'tap',
        expectedScreen: 'SHARING_MENU',
      },
      {
        id: 'p4_s3',
        targetId: 'send-current-location-btn',
        instruction: "Tap 'Send this location' to share where you are.",
        guideText: 'Tap Send this location',
        actionType: 'tap',
        expectedScreen: 'LOCATION',
      },
    ];
    return { task, steps };
  }

  // Lesson 5
  const task: PracticeTask = {
    lessonId: 5,
    description: 'In chat with Amma, start a voice call, then end the call, and view the Calls tab.',
  };
  const steps: PracticeStep[] = [
    {
      id: 'p5_s1',
      targetId: 'header-voice-call-btn',
      instruction: 'Tap the phone call icon at the top to start an audio call.',
      guideText: 'Tap call icon',
      actionType: 'tap',
      expectedScreen: 'CHAT',
    },
    {
      id: 'p5_s2',
      targetId: 'end-call-btn',
      instruction: 'Tap the red button to end the call cleanly.',
      guideText: 'Tap red End call',
      actionType: 'tap',
      expectedScreen: 'CALL',
    },
    {
      id: 'p5_s3',
      targetId: 'chat-back-arrow',
      instruction: 'Tap Back to return to the home screen.',
      guideText: 'Tap Back',
      actionType: 'tap',
      expectedScreen: 'CHAT',
    },
    {
      id: 'p5_s4',
      targetId: 'bottom-tab-calls',
      instruction: 'Tap the Calls tab at the bottom to view your call history.',
      guideText: 'Tap Calls tab',
      actionType: 'tap',
      expectedScreen: 'HOME',
    },
  ];
  return { task, steps };
};

export const WhatsAppTutorialScreen: React.FC<WhatsAppTutorialScreenProps> = ({
  onBackToMainMenu,
  language = 'en',
}) => {
  // Lesson state
  const [currentLessonId, setCurrentLessonId] = useState<number>(1);
  const [phase, setPhase] = useState<'DEMO' | 'PRACTICE' | 'SUCCESS'>('DEMO');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);

  // App screens state
  const [screen, setScreen] = useState<
    'HOME' | 'NEW_CONTACT' | 'SEARCH' | 'CHAT' | 'SHARING_MENU' | 'PHOTO_PICKER' | 'LOCATION' | 'CALL'
  >('HOME');

  const [activeTab, setActiveTab] = useState<'chats' | 'calls' | 'help'>('chats');
  const [contacts, setContacts] = useState<ChatContactItem[]>(DEFAULT_CONTACTS);

  // Practice state
  const [practiceData, setPracticeData] = useState(() => generatePracticeTask(1));
  const [practiceStepIndex, setPracticeStepIndex] = useState<number>(0);
  const [isTargetGlowing, setIsTargetGlowing] = useState<boolean>(false);
  const [wrongTapMessage, setWrongTapMessage] = useState<string | null>(null);
  const [isWrongTargetShaking, setIsWrongTargetShaking] = useState<boolean>(false);

  // Inputs state
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [chatInputText, setChatInputText] = useState<string>('');
  const [hasSentPhoto, setHasSentPhoto] = useState<boolean>(false);
  const [hasSentLocation, setHasSentLocation] = useState<boolean>(false);
  const [newSentMessages, setNewSentMessages] = useState<string[]>([]);
  const [hasReply, setHasReply] = useState<boolean>(false);

  // Demo animation states
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 50, y: 70 });
  const [pointerVisible, setPointerVisible] = useState<boolean>(false);
  const [isRippling, setIsRippling] = useState<boolean>(false);
  const [demoCaption, setDemoCaption] = useState<string>('');

  const phoneRef = useRef<HTMLDivElement | null>(null);
  const abortDemoRef = useRef<boolean>(false);

  // Timers and Speech guard refs
  const idleGlowTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleVoiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleVoiceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpokenKeyRef = useRef<string>('');

  const currentLesson =
    WHATSAPP_LESSONS.find((l) => l.id === currentLessonId) || WHATSAPP_LESSONS[0];
  const currentDemoStep = currentLesson.steps[currentStepIndex] || currentLesson.steps[0];
  const currentPracticeStep = practiceData.steps[practiceStepIndex] || practiceData.steps[0];

  // Helper: Sleep utility
  const sleep = (ms: number) =>
    new Promise((resolve) => {
      const start = Date.now();
      const interval = setInterval(() => {
        if (abortDemoRef.current || Date.now() - start >= ms) {
          clearInterval(interval);
          resolve(true);
        }
      }, 30);
    });

  // Helper: Wait for element in DOM
  const waitForEl = async (id: string, timeout = 3500): Promise<HTMLElement | null> => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (abortDemoRef.current) return null;
      if (phoneRef.current) {
        const el = phoneRef.current.querySelector(`[data-demo-id="${id}"]`) as HTMLElement;
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) return el;
        }
      }
      await new Promise((r) => setTimeout(r, 40));
    }
    return null;
  };

  // Helper: Move pointer smoothly to element inside phone frame
  const movePointerTo = async (el: HTMLElement) => {
    if (!phoneRef.current || abortDemoRef.current) return;
    const phoneRect = phoneRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const x = ((elRect.left + elRect.width / 2 - phoneRect.left) / phoneRect.width) * 100;
    const y = ((elRect.top + elRect.height / 2 - phoneRect.top) / phoneRect.height) * 100;

    setPointerPos({ x: Math.min(94, Math.max(6, x)), y: Math.min(94, Math.max(6, y)) });
    setPointerVisible(true);
    await sleep(650);
  };

  // Clear idle timers
  const clearPracticeIdleTimers = useCallback(() => {
    if (idleGlowTimerRef.current) clearTimeout(idleGlowTimerRef.current);
    if (idleVoiceTimerRef.current) clearTimeout(idleVoiceTimerRef.current);
    if (idleVoiceIntervalRef.current) clearInterval(idleVoiceIntervalRef.current);
    idleGlowTimerRef.current = null;
    idleVoiceTimerRef.current = null;
    idleVoiceIntervalRef.current = null;
  }, []);

  // Safe speak function (guarded, waits for onend)
  const safeSpeak = useCallback(
    async (text: string, key?: string) => {
      if (isVoiceMuted) return;

      if (key) {
        if (lastSpokenKeyRef.current === key) return;
        lastSpokenKeyRef.current = key;
      }

      await voiceManager.speakAsync(text, language, {
        fallbackTimeoutMs: 15000,
        cancelPrevious: false,
      });
    },
    [isVoiceMuted, language]
  );

  // Setup practice step idle timers
  const startPracticeIdleTimers = useCallback(
    (step: PracticeStep, lessonId: number, stepIdx: number) => {
      clearPracticeIdleTimers();
      setIsTargetGlowing(false);

      // Speak instruction once for this step
      const stepKey = `practice_${lessonId}_step_${stepIdx}`;
      safeSpeak(step.instruction, stepKey);

      // Timer 1: after 5 seconds, show pulsing glow & bouncing arrow on target
      idleGlowTimerRef.current = setTimeout(() => {
        setIsTargetGlowing(true);
      }, 5000);

      // Timer 2: after 7 seconds, repeat the voice instruction
      idleVoiceTimerRef.current = setTimeout(() => {
        if (!isVoiceMuted) {
          voiceManager.speakAsync(step.instruction, language, {
            fallbackTimeoutMs: 12000,
            cancelPrevious: false,
          });
        }

        // Repeat reminder every 7 seconds until the user acts
        idleVoiceIntervalRef.current = setInterval(() => {
          if (!isVoiceMuted) {
            voiceManager.speakAsync(step.instruction, language, {
              fallbackTimeoutMs: 12000,
              cancelPrevious: false,
            });
          }
        }, 7000);
      }, 7000);
    },
    [clearPracticeIdleTimers, safeSpeak, isVoiceMuted, language]
  );

  // Reset simulator state for a specific lesson & phase
  const resetSimulatorState = useCallback(
    (lessonId: number, targetPhase: 'DEMO' | 'PRACTICE') => {
      voiceManager.stop();
      abortDemoRef.current = true;
      clearPracticeIdleTimers();

      setPhase(targetPhase);
      setCurrentStepIndex(0);
      setPracticeStepIndex(0);
      setNewContactName('');
      setNewContactPhone('');
      setSearchQuery('');
      setChatInputText('');
      setHasSentPhoto(false);
      setHasSentLocation(false);
      setNewSentMessages([]);
      setHasReply(false);
      setWrongTapMessage(null);
      setIsWrongTargetShaking(false);
      setIsTargetGlowing(false);
      setPointerVisible(false);
      setActiveTab('chats');
      lastSpokenKeyRef.current = '';

      // Set initial screen based on lesson
      if (lessonId === 1 || lessonId === 2) {
        setScreen('HOME');
      } else {
        // Lessons 3, 4, 5 start inside chat with Amma
        setScreen('CHAT');
      }

      if (targetPhase === 'PRACTICE') {
        const newPractice = generatePracticeTask(lessonId);
        setPracticeData(newPractice);
        // Start practice step 0
        setTimeout(() => {
          startPracticeIdleTimers(newPractice.steps[0], lessonId, 0);
        }, 300);
      }
    },
    [clearPracticeIdleTimers, startPracticeIdleTimers]
  );

  // RUN DEMO LOOP
  useEffect(() => {
    if (phase !== 'DEMO') return;

    abortDemoRef.current = false;
    let isSubscribed = true;

    const runDemoLoop = async () => {
      await sleep(350);

      for (let i = 0; i < currentLesson.steps.length; i++) {
        if (abortDemoRef.current || !isSubscribed) return;

        const step = currentLesson.steps[i];
        setCurrentStepIndex(i);
        setDemoCaption(step.caption);

        // Ensure screen matches the step's expected screen
        setScreen(step.screen);

        // Speak instruction once for this step and WAIT for onend (or 15s fallback)!
        const stepKey = `demo_${currentLesson.id}_step_${i}`;
        if (lastSpokenKeyRef.current !== stepKey) {
          lastSpokenKeyRef.current = stepKey;
          if (!isVoiceMuted) {
            await voiceManager.speakAsync(step.caption, language, {
              fallbackTimeoutMs: 15000,
              cancelPrevious: false,
            });
          }
        }

        // Wait natural pause of ~1.0 second after voice finishes before action
        await sleep(1000);

        if (abortDemoRef.current || !isSubscribed) return;

        // Perform Demo Action
        if (step.action === 'tap') {
          const targetEl = await waitForEl(step.targetId);
          if (targetEl && !abortDemoRef.current) {
            await movePointerTo(targetEl);
            setIsRippling(true);
            await sleep(180);
            setIsRippling(false);

            // Programmatic click triggers exact app logic
            targetEl.click();
            await sleep(850);
          }
        } else if (step.action === 'type' && step.textToType) {
          const targetEl = await waitForEl(step.targetId);
          if (targetEl && !abortDemoRef.current) {
            await movePointerTo(targetEl);
            setIsRippling(true);
            await sleep(150);
            setIsRippling(false);

            // Type character by character with visible effect
            const chars = step.textToType.split('');
            let currentTyped = '';
            for (const char of chars) {
              if (abortDemoRef.current || !isSubscribed) return;
              currentTyped += char;

              if (step.targetId === 'contact-name-input') {
                setNewContactName(currentTyped);
              } else if (step.targetId === 'contact-phone-input') {
                setNewContactPhone(currentTyped);
              } else if (step.targetId === 'search-input-field') {
                setSearchQuery(currentTyped);
              } else if (step.targetId === 'chat-input-field') {
                setChatInputText(currentTyped);
              }

              await sleep(180);
            }
            await sleep(750);
          }
        } else if (step.action === 'point') {
          const targetEl = await waitForEl(step.targetId);
          if (targetEl && !abortDemoRef.current) {
            await movePointerTo(targetEl);
            await sleep(1500);
          }
        } else if (step.action === 'wait') {
          // Pointer remains hidden during intro wait steps (BUG 2 fix)
          setPointerVisible(false);
          if (step.waitMs) {
            await sleep(step.waitMs);
          }
        }

        if (abortDemoRef.current || !isSubscribed) return;
        await sleep(600);
      }

      if (isSubscribed && !abortDemoRef.current) {
        // FIX 2: Practice starts automatically within 2 seconds. Never leave a long silent pause.
        await sleep(800);
        setPointerVisible(false);

        // Step A: Voice and caption say "Now it's your turn. Try it yourself."
        const turnNotice =
          language === 'ta'
            ? 'இப்போது உங்கள் முறை. நீங்களே செய்து பழகுங்கள்!'
            : language === 'hi'
            ? 'अब आपकी बारी है। खुद करके अभ्यास करें!'
            : "Now it's your turn. Try it yourself.";
        setDemoCaption(turnNotice);
        if (!isVoiceMuted) {
          await voiceManager.speakAsync(turnNotice, language, {
            fallbackTimeoutMs: 8000,
          });
        }
        await sleep(600);

        if (isSubscribed && !abortDemoRef.current) {
          resetSimulatorState(currentLesson.id, 'PRACTICE');
        }
      }
    };

    runDemoLoop();

    return () => {
      isSubscribed = false;
      abortDemoRef.current = true;
      voiceManager.stop();
    };
  }, [phase, currentLesson, isVoiceMuted, resetSimulatorState]);

  // PRACTICE Phase: Correct action executed
  const advancePracticeStep = useCallback(
    (stepId: string) => {
      if (phase !== 'PRACTICE') return;

      clearPracticeIdleTimers();
      setWrongTapMessage(null);
      setIsWrongTargetShaking(false);

      const nextIndex = practiceStepIndex + 1;

      // Check if finished
      if (nextIndex >= practiceData.steps.length) {
        setPhase('SUCCESS');
        safeSpeak(currentLesson.successMessage, `success_${currentLesson.id}`);
      } else {
        setPracticeStepIndex(nextIndex);
        const nextStep = practiceData.steps[nextIndex];
        startPracticeIdleTimers(nextStep, currentLesson.id, nextIndex);
      }
    },
    [phase, practiceStepIndex, practiceData.steps, currentLesson, clearPracticeIdleTimers, safeSpeak, startPracticeIdleTimers]
  );

  // PRACTICE Phase: Intercept wrong taps
  const handlePhoneContainerClickCapture = (e: React.MouseEvent) => {
    if (phase !== 'PRACTICE') return;

    const currentStep = practiceData.steps[practiceStepIndex];
    if (!currentStep) return;

    // Check if the clicked target or any ancestor matches data-demo-id
    const clickTarget = e.target as HTMLElement;
    const targetEl = phoneRef.current?.querySelector(`[data-demo-id="${currentStep.targetId}"]`);

    if (!targetEl) return;

    const isInsideTarget = targetEl.contains(clickTarget);

    if (!isInsideTarget) {
      // Don't break flow on typing in correct input
      if (currentStep.actionType === 'type' && clickTarget.tagName === 'INPUT') {
        const inputDemoId = clickTarget.getAttribute('data-demo-id');
        if (inputDemoId === currentStep.targetId) return;
      }

      e.preventDefault();
      e.stopPropagation();

      setIsWrongTargetShaking(true);
      const wrongMsg =
        language === 'ta'
          ? 'இங்கு தொடாதீர்கள், ஒளிரும் பொத்தானைத் தொடவும்!'
          : language === 'hi'
          ? 'यहाँ नहीं, चमकते हुए बटन को दबाएं!'
          : 'Not this one, tap the glowing button';
      setWrongTapMessage(wrongMsg);

      if (!isVoiceMuted) {
        voiceManager.speakAsync(wrongMsg, language, {
          fallbackTimeoutMs: 5000,
          cancelPrevious: true,
        });
      }

      setTimeout(() => {
        setIsWrongTargetShaking(false);
      }, 500);

      setTimeout(() => {
        setWrongTapMessage(null);
      }, 2500);
    }
  };

  // Change lesson
  const handleSelectLesson = (lessonId: number) => {
    setCurrentLessonId(lessonId);
    resetSimulatorState(lessonId, 'DEMO');
  };

  // Skip to practice
  const handleSkipToPractice = () => {
    abortDemoRef.current = true;
    voiceManager.stop();
    resetSimulatorState(currentLessonId, 'PRACTICE');
  };

  // Replay demo
  const handleReplayDemo = () => {
    abortDemoRef.current = true;
    voiceManager.stop();
    resetSimulatorState(currentLessonId, 'DEMO');
  };

  // Next lesson
  const handleNextLesson = () => {
    if (currentLessonId < 5) {
      handleSelectLesson(currentLessonId + 1);
    } else {
      handleSelectLesson(1);
    }
  };

  // App Action Handlers
  const handleSaveContact = () => {
    const taskName = practiceData.task.name || 'Ravi';
    const taskPhone = practiceData.task.phone || '98765 43210';

    // Verify typed inputs during practice
    if (phase === 'PRACTICE') {
      const typedName = newContactName.trim();
      if (!typedName) {
        const typeMsg =
          language === 'ta'
            ? `தயவுசெய்து பெயரை உள்ளிடவும்: ${taskName}`
            : language === 'hi'
            ? `कृपया नाम लिखें: ${taskName}`
            : `Please type exactly: ${taskName}`;
        setWrongTapMessage(typeMsg);
        if (!isVoiceMuted) {
          voiceManager.speakAsync(typeMsg, language, { cancelPrevious: true });
        }
        return;
      }
    }

    const name = newContactName.trim() || taskName;
    const newContact: ChatContactItem = {
      id: 'saved_' + Date.now(),
      name: name,
      avatarColor: 'bg-[#FFE082]',
      avatarTextColor: 'text-[#6D4C41]',
      avatarLetter: name[0].toUpperCase(),
      lastMsg: 'Hey there! I am using WhatsApp.',
      time: 'Just now',
      demoId: 'chat-row-saved-contact',
    };

    setContacts([newContact, ...contacts]);
    setScreen('HOME');
    advancePracticeStep('p1_s4');
  };

  const handleSendMessage = () => {
    const text = chatInputText.trim() || practiceData.task.message || 'Hello Amma';
    setNewSentMessages((prev) => [...prev, text]);
    setChatInputText('');

    setTimeout(() => {
      setHasReply(true);
    }, 1200);

    advancePracticeStep('p2_s6');
  };

  const handleSendPhoto = () => {
    setHasSentPhoto(true);
    setScreen('CHAT');
    advancePracticeStep('p3_s4');
  };

  const handleSendLocation = () => {
    setHasSentLocation(true);
    setScreen('CHAT');
    advancePracticeStep('p4_s3');
  };

  // Active guide text
  const currentGuideText =
    phase === 'DEMO'
      ? demoCaption || currentDemoStep.caption
      : currentPracticeStep?.instruction || 'Follow the instructions above.';

  return (
    <div className="min-h-screen bg-[#1E293B] text-slate-100 flex flex-col justify-between items-center py-3 px-3 sm:px-6 font-sans">
      {/* 1. TOP HEADER & LESSON SELECTOR */}
      <header className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 mb-3 bg-slate-900/90 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          {onBackToMainMenu && (
            <button
              onClick={onBackToMainMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to lessons</span>
            </button>
          )}
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
              WhatsApp Beginner Training Simulator
            </h1>
            <p className="text-xs text-slate-400">
              Interactive video-style Demo followed by hands-on Practice
            </p>
          </div>
        </div>

        {/* Voice Mute Toggle & Current Phase Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVoiceMuted(!isVoiceMuted)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              isVoiceMuted
                ? 'bg-red-950/60 text-red-300 border-red-800'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
            }`}
            title={isVoiceMuted ? 'Unmute voice guidance' : 'Mute voice guidance'}
          >
            {isVoiceMuted ? <MicOff className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isVoiceMuted ? 'Voice Muted' : 'Voice Guide On'}</span>
          </button>

          <span
            className={`text-xs px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider ${
              phase === 'DEMO'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : phase === 'PRACTICE'
                ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 animate-pulse'
                : 'bg-purple-400/20 text-purple-300 border border-purple-400/40'
            }`}
          >
            {phase === 'DEMO' ? '📹 Phase 1: Demo' : phase === 'PRACTICE' ? '✍️ Phase 2: Practice' : '🎉 Completed'}
          </span>
        </div>
      </header>

      {/* 2. LESSON TABS: 1 to 5 in exact required order */}
      <nav className="w-full max-w-4xl mx-auto flex items-center gap-1.5 sm:gap-2 mb-3 overflow-x-auto pb-1">
        {WHATSAPP_LESSONS.map((lesson) => {
          const isCurrent = lesson.id === currentLessonId;
          return (
            <button
              key={lesson.id}
              onClick={() => handleSelectLesson(lesson.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                isCurrent
                  ? 'bg-[#008069] text-white border-teal-400 shadow-lg shadow-[#008069]/30 scale-[1.02]'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border-slate-800'
              }`}
            >
              <span>{lesson.title}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. CENTERED PHONE-SHAPED FRAME */}
      <main className="flex-1 flex flex-col items-center justify-center w-full my-auto">
        <div
          ref={phoneRef}
          onClickCapture={handlePhoneContainerClickCapture}
          className="relative w-full max-w-[390px] h-[780px] bg-white rounded-[44px] shadow-2xl overflow-hidden border-[10px] border-slate-900 flex flex-col select-none ring-1 ring-slate-800"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          }}
        >
          {/* Top Phone Bezel / Speaker & Camera Cutout */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-slate-900 z-50 flex items-center justify-center">
            <div className="w-24 h-4 bg-black rounded-b-xl flex items-center justify-center">
              <div className="w-10 h-1 bg-slate-800 rounded-full" />
            </div>
          </div>

          {/* Practice Mode Warning Banner: Exactly from Screenshot */}
          <div className="bg-[#FFF6D6] border-b border-[#F0E6B9] px-3 py-1 flex items-center justify-center text-[11px] font-medium text-slate-700 z-40 mt-6 shrink-0">
            <span>Practice mode — not a real app</span>
          </div>

          {/* TASK BANNER DURING PRACTICE PHASE (FIX 2) */}
          {phase === 'PRACTICE' && (
            <div className="bg-amber-100 border-b border-amber-300 px-3 py-2 flex items-center gap-2 text-xs font-bold text-amber-950 z-40 shrink-0 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-amber-800 uppercase tracking-wider block font-extrabold">
                  Your Task (Try It Yourself)
                </span>
                <span className="text-xs text-amber-950 leading-tight block">
                  {practiceData.task.description}
                </span>
              </div>
            </div>
          )}

          {/* ================= SCREEN 1: HOME — CHAT LIST ================= */}
          {screen === 'HOME' && (
            <div className="flex-1 flex flex-col justify-between bg-white relative overflow-hidden">
              {/* Header */}
              <div className="bg-[#008069] text-white px-4 pt-3 pb-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-tight">WhatsApp</h2>
                  <div className="flex items-center gap-4">
                    <button
                      data-demo-id="search-icon-btn"
                      onClick={() => {
                        setScreen('SEARCH');
                        advancePracticeStep('p2_s1');
                      }}
                      className="p-1 rounded-full hover:bg-teal-700/60 cursor-pointer"
                      title="Search"
                    >
                      <Search className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-1 rounded-full hover:bg-teal-700/60 cursor-pointer">
                      <MoreVertical className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 mt-3 text-xs">
                  <button className="bg-[#0F6B60] text-white px-3.5 py-1 rounded-full font-medium shadow-2xs">
                    All
                  </button>
                  <button className="bg-[#EFEAE2] text-[#54656F] px-3.5 py-1 rounded-full font-medium hover:bg-slate-200">
                    Unread
                  </button>
                  <button className="bg-[#EFEAE2] text-[#54656F] px-3.5 py-1 rounded-full font-medium hover:bg-slate-200">
                    Family
                  </button>
                </div>
              </div>

              {/* Chat list rows */}
              <div
                data-demo-id="home-screen"
                className="flex-1 overflow-y-auto divide-y divide-[#F2F2F2] bg-white"
              >
                {activeTab === 'chats' ? (
                  contacts.map((contact) => (
                    <div
                      key={contact.id}
                      data-demo-id={contact.demoId}
                      onClick={() => {
                        if (contact.id === 'amma') {
                          setScreen('CHAT');
                          advancePracticeStep('p2_s3');
                        }
                      }}
                      className="w-full p-3.5 flex items-center gap-3.5 hover:bg-slate-50 transition cursor-pointer text-left"
                    >
                      <div
                        className={`w-12 h-12 rounded-full font-bold text-base flex items-center justify-center shrink-0 ${contact.avatarColor} ${contact.avatarTextColor}`}
                      >
                        {contact.avatarLetter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="font-bold text-[#111B21] text-sm truncate">
                            {contact.name}
                          </h4>
                          <span className="text-[11px] text-[#667781] font-medium shrink-0">
                            {contact.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-[#667781] truncate pr-2">
                            {contact.lastMsg}
                          </p>
                          {contact.unreadCount && (
                            <span className="w-5 h-5 rounded-full bg-[#F39C12] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : activeTab === 'calls' ? (
                  <div data-demo-id="calls-list-view" className="p-4 space-y-3">
                    <h3 className="text-xs font-bold text-[#008069] uppercase tracking-wider">
                      Recent Calls
                    </h3>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C2E7FF] text-[#004A77] font-bold flex items-center justify-center">
                          A
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-800">Amma</p>
                          <p className="text-[10px] text-emerald-600 font-semibold">
                            ↗ Incoming call (2 mins)
                          </p>
                        </div>
                      </div>
                      <Phone className="w-4 h-4 text-[#008069]" />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-xs text-slate-500 text-center">
                    Help & Support FAQs
                  </div>
                )}
              </div>

              {/* Floating Action Button (FAB): New Contact / Chat */}
              {activeTab === 'chats' && (
                <button
                  data-demo-id="new-contact-fab"
                  onClick={() => {
                    setScreen('NEW_CONTACT');
                    advancePracticeStep('p1_s1');
                  }}
                  className="absolute right-4 bottom-24 w-14 h-14 rounded-full bg-[#008069] text-white flex items-center justify-center shadow-2xl hover:bg-[#075E54] active:scale-95 transition cursor-pointer z-20 border-2 border-white"
                  title="New contact / chat"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </button>
              )}

              {/* Bottom Guide Card: MEERA, YOUR GUIDE */}
              <div className="px-3 pb-2 z-10">
                <div className="bg-white rounded-2xl p-3 border-2 border-[#008069] shadow-md flex flex-col">
                  <span className="text-[10px] font-extrabold text-[#008069] uppercase tracking-wider mb-0.5">
                    MEERA, YOUR GUIDE
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {currentGuideText}
                  </p>
                </div>
              </div>

              {/* Bottom Navigation Tab Bar: Exactly from Screenshot */}
              <div className="bg-[#FFFFFF] border-t border-slate-200/80 px-6 py-2 flex items-center justify-between text-xs shrink-0 z-10">
                <button
                  onClick={() => setActiveTab('chats')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer font-bold ${
                    activeTab === 'chats' ? 'text-[#008069]' : 'text-[#667781]'
                  }`}
                >
                  <span className="text-xs">Chats</span>
                  {activeTab === 'chats' && (
                    <span className="w-6 h-0.5 bg-[#008069] rounded-full" />
                  )}
                </button>
                <button
                  data-demo-id="bottom-tab-calls"
                  onClick={() => {
                    setActiveTab('calls');
                    advancePracticeStep('p5_s4');
                  }}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer font-medium ${
                    activeTab === 'calls' ? 'text-[#008069] font-bold' : 'text-[#667781]'
                  }`}
                >
                  <span className="text-xs">Calls</span>
                  {activeTab === 'calls' && (
                    <span className="w-6 h-0.5 bg-[#008069] rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('help')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer font-medium ${
                    activeTab === 'help' ? 'text-[#008069] font-bold' : 'text-[#667781]'
                  }`}
                >
                  <span className="text-xs">Help</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= SCREEN 2: NEW CONTACT FORM ================= */}
          {screen === 'NEW_CONTACT' && (
            <div className="flex-1 flex flex-col justify-between bg-white relative">
              {/* Header */}
              <div className="bg-[#008069] text-white px-3 py-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScreen('HOME')}
                    className="p-1 rounded-full hover:bg-teal-700/60 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <h3 className="font-bold text-sm">New contact</h3>
                </div>
                <button
                  data-demo-id="save-contact-btn"
                  onClick={handleSaveContact}
                  className="px-3 py-1 bg-white text-[#008069] rounded-full font-bold text-xs hover:bg-slate-100 cursor-pointer shadow-xs"
                >
                  Save
                </button>
              </div>

              {/* Form Body */}
              <div className="p-4 space-y-4 flex-1 bg-[#FAFAFA]">
                <div className="w-20 h-20 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center border-2 border-slate-300">
                  <User className="w-10 h-10" />
                </div>

                <div className="space-y-3 bg-white p-4 rounded-2xl shadow-xs border border-slate-100">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                        First Name
                      </label>
                      {phase === 'PRACTICE' && practiceData.task.name && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewContactName(practiceData.task.name || '');
                            advancePracticeStep('p1_s2');
                          }}
                          className="text-[10px] text-[#008069] font-bold hover:underline cursor-pointer"
                        >
                          Auto-fill: {practiceData.task.name}
                        </button>
                      )}
                    </div>
                    <input
                      data-demo-id="contact-name-input"
                      type="text"
                      value={newContactName}
                      onChange={(e) => {
                        setNewContactName(e.target.value);
                        if (phase === 'PRACTICE') {
                          clearPracticeIdleTimers();
                        }
                      }}
                      onBlur={() => {
                        if (phase === 'PRACTICE' && newContactName.trim().length > 1) {
                          advancePracticeStep('p1_s2');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          advancePracticeStep('p1_s2');
                        }
                      }}
                      placeholder={`e.g. ${practiceData.task.name || 'Ravi'}`}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#008069] text-sm text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                        Phone Number
                      </label>
                      {phase === 'PRACTICE' && practiceData.task.phone && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewContactPhone(practiceData.task.phone || '');
                            advancePracticeStep('p1_s3');
                          }}
                          className="text-[10px] text-[#008069] font-bold hover:underline cursor-pointer"
                        >
                          Auto-fill: {practiceData.task.phone}
                        </button>
                      )}
                    </div>
                    <input
                      data-demo-id="contact-phone-input"
                      type="tel"
                      value={newContactPhone}
                      onChange={(e) => {
                        setNewContactPhone(e.target.value);
                        if (phase === 'PRACTICE') {
                          clearPracticeIdleTimers();
                        }
                      }}
                      onBlur={() => {
                        if (phase === 'PRACTICE' && newContactPhone.trim().length > 4) {
                          advancePracticeStep('p1_s3');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          advancePracticeStep('p1_s3');
                        }
                      }}
                      placeholder={`e.g. ${practiceData.task.phone || '98765 43210'}`}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#008069] text-sm font-mono text-slate-800"
                    />
                  </div>
                </div>

                {/* Save Contact Primary Button */}
                <button
                  data-demo-id="save-contact-btn"
                  onClick={handleSaveContact}
                  className="w-full py-3.5 rounded-2xl bg-[#008069] hover:bg-[#075E54] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Contact</span>
                </button>
              </div>

              {/* Bottom Guide Card */}
              <div className="p-3 bg-white border-t border-slate-100">
                <div className="bg-white rounded-2xl p-3 border-2 border-[#008069] shadow-md flex flex-col">
                  <span className="text-[10px] font-extrabold text-[#008069] uppercase tracking-wider mb-0.5">
                    MEERA, YOUR GUIDE
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {currentGuideText}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= SCREEN 3: SEARCH SCREEN ================= */}
          {screen === 'SEARCH' && (
            <div className="flex-1 flex flex-col justify-between bg-white relative">
              {/* Top Search Input Header */}
              <div className="bg-[#008069] text-white px-3 py-2 flex items-center gap-2 shadow-xs">
                <button
                  onClick={() => setScreen('HOME')}
                  className="p-1 rounded-full hover:bg-teal-700/60 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <input
                  data-demo-id="search-input-field"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (phase === 'PRACTICE') {
                      clearPracticeIdleTimers();
                      const targetContact = practiceData.task.contact || 'Amma';
                      if (e.target.value.toLowerCase().includes(targetContact.toLowerCase().slice(0, 3))) {
                        advancePracticeStep('p2_s2');
                      }
                    }
                  }}
                  placeholder="Search contacts..."
                  className="flex-1 bg-transparent text-white placeholder-teal-200 text-sm focus:outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-1 text-teal-200">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#F2F2F2]">
                <div
                  data-demo-id="search-result-amma"
                  onClick={() => {
                    setScreen('CHAT');
                    advancePracticeStep('p2_s3');
                  }}
                  className="w-full p-3.5 flex items-center gap-3.5 hover:bg-slate-50 transition cursor-pointer text-left"
                >
                  <div className="w-12 h-12 rounded-full font-bold text-base flex items-center justify-center shrink-0 bg-[#C2E7FF] text-[#004A77]">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111B21] text-sm">Amma</h4>
                    <p className="text-xs text-[#667781]">Have you eaten lunch?</p>
                  </div>
                </div>

                <div
                  data-demo-id="search-result-ravi"
                  onClick={() => {
                    setScreen('CHAT');
                    advancePracticeStep('p2_s3');
                  }}
                  className="w-full p-3.5 flex items-center gap-3.5 hover:bg-slate-50 transition cursor-pointer text-left"
                >
                  <div className="w-12 h-12 rounded-full font-bold text-base flex items-center justify-center shrink-0 bg-[#FFE082] text-[#6D4C41]">
                    R
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111B21] text-sm">Ravi Anna</h4>
                    <p className="text-xs text-[#667781]">Voice message (0:12)</p>
                  </div>
                </div>
              </div>

              {/* Guide Card */}
              <div className="p-3 bg-white border-t border-slate-100">
                <div className="bg-white rounded-2xl p-3 border-2 border-[#008069] shadow-md flex flex-col">
                  <span className="text-[10px] font-extrabold text-[#008069] uppercase tracking-wider mb-0.5">
                    MEERA, YOUR GUIDE
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {currentGuideText}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= SCREEN 4: INSIDE A CHAT ================= */}
          {screen === 'CHAT' && (
            <div
              data-demo-id="chat-screen"
              className="flex-1 flex flex-col justify-between bg-[#EFEAE2] relative overflow-hidden"
            >
              {/* Chat Top Header: Exactly from Screenshot */}
              <div className="bg-[#008069] text-white px-3 py-2 flex items-center justify-between shadow-xs z-10 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    data-demo-id="chat-back-arrow"
                    onClick={() => {
                      setScreen('HOME');
                      advancePracticeStep('p5_s3');
                    }}
                    className="p-1 rounded-full hover:bg-teal-700/60 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-[#C2E7FF] text-[#004A77] font-bold text-xs flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-xs leading-none">Amma</h4>
                    <span className="text-[10px] text-teal-200 font-medium">online</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    data-demo-id="header-video-call-btn"
                    className="p-1 hover:bg-teal-700/60 rounded-full cursor-pointer"
                    title="Video call"
                  >
                    <Video className="w-4 h-4 text-white" />
                  </button>
                  <button
                    data-demo-id="header-voice-call-btn"
                    onClick={() => {
                      setScreen('CALL');
                      advancePracticeStep('p5_s1');
                    }}
                    className="p-1 hover:bg-teal-700/60 rounded-full cursor-pointer"
                    title="Voice call"
                  >
                    <Phone className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-1 hover:bg-teal-700/60 rounded-full cursor-pointer">
                    <MoreVertical className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Feed */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                <div className="text-center my-1">
                  <span className="bg-[#FFF6D6] text-slate-700 text-[10px] px-2.5 py-1 rounded-md shadow-2xs font-medium">
                    TODAY
                  </span>
                </div>

                {/* Received message from Amma */}
                <div className="max-w-[78%] bg-white p-2.5 rounded-2xl rounded-tl-xs shadow-2xs text-xs text-slate-800">
                  <p>Have you eaten lunch?</p>
                  <div className="flex justify-end text-[9px] text-[#667781] mt-0.5">
                    <span>10:42</span>
                  </div>
                </div>

                {/* Sent Photo Card */}
                {hasSentPhoto && (
                  <div
                    data-demo-id="chat-photo-card"
                    className="max-w-[78%] ml-auto bg-[#D9FDD3] p-1.5 rounded-2xl rounded-tr-xs shadow-2xs"
                  >
                    <div className="rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                      <img
                        src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80"
                        alt="Sent photo"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-[#667781] px-1 pt-1">
                      <span>10:45</span>
                      <CheckCheck className="w-3 h-3 text-[#53BDEB]" />
                    </div>
                  </div>
                )}

                {/* Sent Location Card */}
                {hasSentLocation && (
                  <div
                    data-demo-id="chat-location-card"
                    className="max-w-[78%] ml-auto bg-[#D9FDD3] p-1.5 rounded-2xl rounded-tr-xs shadow-2xs text-xs"
                  >
                    <div className="rounded-xl overflow-hidden bg-[#E3F2FD] border border-blue-200 p-2 flex flex-col items-center justify-center text-center">
                      <MapPin className="w-6 h-6 text-red-500 mb-1" />
                      <span className="text-[10px] font-bold text-[#008069] mt-1">Meet me here</span>
                      <span className="text-[9px] text-slate-500">Sample location (practice map)</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-[#667781] px-1">
                      <span>10:46</span>
                      <CheckCheck className="w-3 h-3 text-[#53BDEB]" />
                    </div>
                  </div>
                )}

                {/* Newly Sent Text Messages */}
                {newSentMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    data-demo-id="last-chat-bubble"
                    className="max-w-[78%] ml-auto bg-[#D9FDD3] p-2.5 rounded-2xl rounded-tr-xs shadow-2xs text-xs text-slate-800"
                  >
                    <p>{msg}</p>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-[#667781] mt-0.5">
                      <span>Just now</span>
                      <CheckCheck className="w-3 h-3 text-[#53BDEB]" />
                    </div>
                  </div>
                ))}

                {/* Scripted Reply */}
                {hasReply && (
                  <div className="max-w-[78%] bg-white p-2.5 rounded-2xl rounded-tl-xs shadow-2xs text-xs text-slate-800 animate-in fade-in duration-300">
                    <p>Hello dear, how are you? (நன்றாக இருக்கிறாயா?)</p>
                    <div className="flex justify-end text-[9px] text-slate-400 mt-0.5">
                      <span>Just now</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Guide Card */}
              <div className="px-3 pb-1 shrink-0">
                <div className="bg-white rounded-2xl p-2.5 border-2 border-[#008069] shadow-md flex flex-col">
                  <span className="text-[10px] font-extrabold text-[#008069] uppercase tracking-wider mb-0.5">
                    MEERA, YOUR GUIDE
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {currentGuideText}
                  </p>
                </div>
              </div>

              {/* Bottom Message Input Bar: Exactly from Screenshot */}
              <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 border-t border-slate-200 shrink-0">
                <div
                  data-demo-id="chat-input-box"
                  onClick={() => advancePracticeStep('p2_s4')}
                  className="flex-1 bg-white rounded-full px-3.5 py-2 flex items-center justify-between shadow-2xs border border-slate-200 cursor-text"
                >
                  <input
                    data-demo-id="chat-input-field"
                    type="text"
                    value={chatInputText}
                    onChange={(e) => {
                      setChatInputText(e.target.value);
                      if (phase === 'PRACTICE') {
                        clearPracticeIdleTimers();
                        if (e.target.value.length > 2) {
                          advancePracticeStep('p2_s5');
                        }
                      }
                    }}
                    placeholder="Type a message"
                    className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
                  />
                  <button
                    data-demo-id="paperclip-attach-btn"
                    onClick={() => {
                      setScreen('SHARING_MENU');
                      advancePracticeStep('p3_s1');
                      advancePracticeStep('p4_s1');
                    }}
                    className="text-slate-500 hover:text-slate-700 ml-1 p-0.5 cursor-pointer"
                    title="Attach"
                  >
                    <Paperclip className="w-5 h-5 -rotate-45" />
                  </button>
                </div>

                {/* Send or Mic button */}
                <button
                  data-demo-id="send-message-btn"
                  onClick={handleSendMessage}
                  className="w-10 h-10 rounded-full bg-[#008069] hover:bg-[#075E54] text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer active:scale-95 transition"
                  title="Send"
                >
                  {chatInputText ? (
                    <Send className="w-4 h-4 ml-0.5" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================= SCREEN 5: SHARING MENU ================= */}
          {screen === 'SHARING_MENU' && (
            <div className="flex-1 flex flex-col justify-between bg-black/60 relative">
              {/* Dimmed chat behind */}
              <div className="p-4 text-white/80 text-xs">
                <p>Amma</p>
                <div className="mt-2 max-w-[80%] bg-white/20 p-2 rounded-xl text-[11px]">
                  Send me the photo from Sunday
                </div>
              </div>

              {/* Bottom Sheet Modal: Exactly from Screenshot */}
              <div className="bg-white rounded-t-[32px] p-5 shadow-2xl border-t border-slate-200">
                <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 text-sm mb-4 text-left">
                  Share with Amma
                </h4>

                {/* 6 Circular Icons in 2x3 Grid: Exactly from Screenshot */}
                <div className="grid grid-cols-3 gap-y-4 text-center">
                  {/* 1. Photo */}
                  <button
                    data-demo-id="share-menu-photo"
                    onClick={() => {
                      setScreen('PHOTO_PICKER');
                      advancePracticeStep('p3_s2');
                    }}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#008069] text-white flex items-center justify-center shadow-md mb-1.5 group-hover:scale-105 transition">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Photo</span>
                  </button>

                  {/* 2. Camera */}
                  <div className="flex flex-col items-center cursor-pointer opacity-80">
                    <div className="w-14 h-14 rounded-full bg-[#1E88E5] text-white flex items-center justify-center shadow-md mb-1.5">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Camera</span>
                  </div>

                  {/* 3. Document */}
                  <div className="flex flex-col items-center cursor-pointer opacity-80">
                    <div className="w-14 h-14 rounded-full bg-[#7B1FA2] text-white flex items-center justify-center shadow-md mb-1.5">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Document</span>
                  </div>

                  {/* 4. Location */}
                  <button
                    data-demo-id="share-menu-location"
                    onClick={() => {
                      setScreen('LOCATION');
                      advancePracticeStep('p4_s2');
                    }}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#D84315] text-white flex items-center justify-center shadow-md mb-1.5 group-hover:scale-105 transition">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Location</span>
                  </button>

                  {/* 5. Contact */}
                  <div className="flex flex-col items-center cursor-pointer opacity-80">
                    <div className="w-14 h-14 rounded-full bg-[#558B2F] text-white flex items-center justify-center shadow-md mb-1.5">
                      <User className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Contact</span>
                  </div>

                  {/* 6. Voice note */}
                  <div className="flex flex-col items-center cursor-pointer opacity-80">
                    <div className="w-14 h-14 rounded-full bg-[#00897B] text-white flex items-center justify-center shadow-md mb-1.5">
                      <Mic className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Voice note</span>
                  </div>
                </div>

                {/* Guide Card */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="bg-white rounded-2xl p-2.5 border-2 border-[#008069] shadow-xs flex flex-col">
                    <span className="text-[10px] font-extrabold text-[#008069] uppercase tracking-wider mb-0.5">
                      MEERA, YOUR GUIDE
                    </span>
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {currentGuideText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= SCREEN 6: PHOTO PICKER ================= */}
          {screen === 'PHOTO_PICKER' && (
            <div className="flex-1 flex flex-col justify-between bg-slate-900 text-white p-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <button
                  onClick={() => setScreen('CHAT')}
                  className="p-1 hover:bg-white/10 rounded-full cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <h3 className="font-bold text-sm">Select photo</h3>
                <div className="w-5" />
              </div>

              {/* Sample Photo Gallery Grid */}
              <div className="flex-1 py-4">
                <div
                  data-demo-id="sample-photo-1"
                  onClick={() => advancePracticeStep('p3_s3')}
                  className="w-full h-64 rounded-3xl overflow-hidden border-4 border-[#008069] shadow-2xl relative cursor-pointer group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80"
                    alt="Sample for WhatsApp lesson"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="bg-[#008069] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Sample Photo</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Send Photo Button */}
              <div className="space-y-3">
                <button
                  data-demo-id="send-photo-btn"
                  onClick={handleSendPhoto}
                  className="w-full py-3.5 rounded-2xl bg-[#008069] hover:bg-[#075E54] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Send photo</span>
                </button>

                {/* Guide Card */}
                <div className="bg-white text-slate-800 rounded-2xl p-2.5 border-2 border-[#008069] shadow-md flex flex-col">
                  <span className="text-[10px] font-extrabold text-[#008069] uppercase tracking-wider mb-0.5">
                    MEERA, YOUR GUIDE
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {currentGuideText}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= SCREEN 7: LOCATION SCREEN ================= */}
          {screen === 'LOCATION' && (
            <div className="flex-1 flex flex-col justify-between bg-white relative">
              {/* Header */}
              <div className="bg-[#008069] text-white px-3 py-2.5 flex items-center gap-2 shadow-xs">
                <button
                  onClick={() => setScreen('CHAT')}
                  className="p-1 rounded-full hover:bg-teal-700/60 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <h3 className="font-bold text-sm">Send location</h3>
              </div>

              {/* Map Preview Graphic */}
              <div className="flex-1 relative bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-200">
                <div className="w-full h-full bg-[#E8ECEF] relative flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-emerald-100/60 animate-ping absolute" />
                  <div className="w-12 h-12 rounded-full bg-[#008069] text-white flex items-center justify-center shadow-2xl z-10 border-2 border-white">
                    <MapPin className="w-7 h-7 fill-white text-[#008069]" />
                  </div>
                  <span className="absolute bottom-4 bg-white/90 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                    Simulated GPS location
                  </span>
                </div>
              </div>

              {/* Location Action Buttons */}
              <div className="p-4 space-y-3 bg-white">
                {/* Primary: Send current location */}
                <button
                  data-demo-id="send-current-location-btn"
                  onClick={handleSendLocation}
                  className="w-full py-3 rounded-2xl bg-[#008069] hover:bg-[#075E54] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Send this location</span>
                </button>

                {/* Secondary: Share live location */}
                <button className="w-full py-2.5 rounded-2xl bg-white border border-[#008069] text-[#008069] font-bold text-xs shadow-2xs">
                  Share live location (15 min)
                </button>

                {/* Safety Tip Box: Exactly from Screenshot */}
                <div className="bg-[#FEF9E7] border border-[#F7E59D] rounded-xl p-2.5 text-[10px] text-slate-700 leading-snug">
                  <strong>Safety tip:</strong> share your live location only with people you trust.
                  You can stop anytime.
                </div>

                {/* Guide Card */}
                <div className="bg-white rounded-2xl p-2 border-2 border-[#008069] shadow-xs flex flex-col">
                  <span className="text-[10px] font-extrabold text-[#008069] uppercase tracking-wider mb-0.5">
                    MEERA, YOUR GUIDE
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {currentGuideText}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= SCREEN 8: CALL PAGE ================= */}
          {screen === 'CALL' && (
            <div className="flex-1 flex flex-col justify-between bg-[#083A34] text-white p-5 relative overflow-hidden">
              {/* Practice Call Banner */}
              <div className="bg-[#FFF6D6] text-slate-800 text-center text-[10px] font-semibold py-1 rounded-lg">
                Practice call — no real call is made
              </div>

              {/* Calling Avatar & Status: Exactly from Screenshot */}
              <div className="text-center pt-8 space-y-3 my-auto">
                <div className="w-24 h-24 rounded-full bg-white text-[#083A34] font-bold text-4xl flex items-center justify-center mx-auto shadow-2xl">
                  A
                </div>
                <div>
                  <h3 className="font-bold text-xl tracking-tight text-white">Amma</h3>
                  <span className="text-xs text-emerald-300 font-medium">Calling... 00:24</span>
                </div>
              </div>

              {/* Guide Card: Exactly from Screenshot */}
              <div className="my-3">
                <div className="bg-white rounded-2xl p-3 border-2 border-[#008069] shadow-xl flex flex-col">
                  <span className="text-[10px] font-extrabold text-[#008069] uppercase tracking-wider mb-0.5">
                    MEERA, YOUR GUIDE
                  </span>
                  <p className="text-xs font-semibold text-slate-900 leading-snug">
                    {currentGuideText}
                  </p>
                </div>
              </div>

              {/* Circular Controls Row: Exactly from Screenshot */}
              <div className="space-y-5 pb-6">
                <div className="flex justify-around items-center">
                  {/* Speaker */}
                  <div className="flex flex-col items-center gap-1">
                    <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <span className="text-[10px] font-medium text-slate-300">Speaker</span>
                  </div>

                  {/* Mute */}
                  <div className="flex flex-col items-center gap-1">
                    <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer">
                      <Mic className="w-5 h-5" />
                    </button>
                    <span className="text-[10px] font-medium text-slate-300">Mute</span>
                  </div>

                  {/* Video */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      data-demo-id="call-video-control"
                      className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                    >
                      <Video className="w-5 h-5" />
                    </button>
                    <span className="text-[10px] font-medium text-slate-300">Video</span>
                  </div>
                </div>

                {/* Red End Call Button: Exactly from Screenshot */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    data-demo-id="end-call-btn"
                    onClick={() => {
                      setScreen('CHAT');
                      advancePracticeStep('p5_s2');
                    }}
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl active:scale-95 transition cursor-pointer"
                    title="End call"
                  >
                    <PhoneOff className="w-7 h-7" />
                  </button>
                  <span className="text-[10px] font-bold text-white">End call</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= PHASE 1: DEMO CURSOR & OVERLAY ================= */}
          {phase === 'DEMO' && (
            <div className="absolute inset-0 z-50 pointer-events-none select-none">
              {/* Transparent touch blocking overlay covering the screen */}
              <div className="absolute inset-0 pointer-events-auto cursor-default" />

              {/* Animated Pointer / Finger */}
              {pointerVisible && (
                <div
                  style={{
                    left: `${pointerPos.x}%`,
                    top: `${pointerPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'left 0.65s cubic-bezier(0.25, 1, 0.5, 1), top 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                  className="absolute pointer-events-none z-50 flex flex-col items-center"
                >
                  {/* Tap Ripple Effect */}
                  {isRippling && (
                    <div className="absolute w-12 h-12 -top-2 -left-2 rounded-full border-4 border-emerald-400 bg-emerald-400/30 animate-ping pointer-events-none" />
                  )}

                  {/* Finger / Hand Cursor Icon */}
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl border-2 border-white drop-shadow-lg">
                    <MousePointer className="w-5 h-5 fill-slate-950" />
                  </div>
                </div>
              )}

              {/* Floating Demo Control Bar at Bottom of Phone */}
              <div className="absolute bottom-2 left-2 right-2 pointer-events-auto z-50">
                <div className="bg-slate-950/90 backdrop-blur-md text-white p-2 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Demo playing...</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReplayDemo}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition"
                    >
                      <RotateCcw className="w-3 h-3 text-amber-400" />
                      <span>Replay demo</span>
                    </button>
                    <button
                      onClick={handleSkipToPractice}
                      className="px-3 py-1 rounded-xl bg-[#008069] hover:bg-[#075E54] text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition shadow-xs"
                    >
                      <span>Skip to practice</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PHASE 2: PRACTICE GUIDANCE SPOTLIGHT ================= */}
          {phase === 'PRACTICE' && (
            <>
              {/* Step counter top badge */}
              <div className="absolute top-8 right-3 z-40 pointer-events-none">
                <span className="bg-slate-900/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                  Step {practiceStepIndex + 1} of {practiceData.steps.length}
                </span>
              </div>

              {/* Practice Target Spotlight Glow & Bouncing Arrow (activates immediately on wrong tap, or after 5s idle) */}
              {currentPracticeStep?.targetId ? (
                <TargetHighlight
                  containerRef={phoneRef}
                  targetId={currentPracticeStep.targetId}
                  guideText={currentPracticeStep.guideText}
                  isShaking={isWrongTargetShaking}
                  isGlowing={isTargetGlowing}
                />
              ) : null}

              {/* Wrong Tap Toast Alert */}
              {wrongTapMessage && (
                <div className="absolute top-20 left-4 right-4 z-50 p-2.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-2xl text-center animate-in fade-in duration-200 border-2 border-white">
                  {wrongTapMessage}
                </div>
              )}
            </>
          )}

          {/* ================= PHASE 3: SUCCESS SCREEN ================= */}
          {phase === 'SUCCESS' && (
            <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center text-white animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-[#008069] text-white flex items-center justify-center shadow-2xl border-4 border-[#25D366] mb-4">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <h3 className="text-xl font-extrabold text-white mb-2">
                {currentLesson.successMessage}
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mb-6">
                You have mastered this skill with Meera. You can practice again or move to the next lesson!
              </p>

              <div className="w-full max-w-xs space-y-2.5">
                <button
                  onClick={handleNextLesson}
                  className="w-full py-3.5 rounded-2xl bg-[#008069] hover:bg-[#075E54] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <span>Next lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => resetSimulatorState(currentLessonId, 'PRACTICE')}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Practice again</span>
                </button>

                {onBackToMainMenu && (
                  <button
                    onClick={onBackToMainMenu}
                    className="w-full py-2.5 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Back to lessons
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// COMPONENT: Target Highlight with Pulsing Glow & Bouncing Arrow
interface TargetHighlightProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  targetId: string;
  guideText: string;
  isShaking: boolean;
  isGlowing: boolean;
}

const TargetHighlight: React.FC<TargetHighlightProps> = ({
  containerRef,
  targetId,
  guideText,
  isShaking,
  isGlowing,
}) => {
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!containerRef.current) return;
      const el = containerRef.current.querySelector(`[data-demo-id="${targetId}"]`) as HTMLElement;
      if (el) {
        const containerR = containerRef.current.getBoundingClientRect();
        const elR = el.getBoundingClientRect();
        if (elR.width > 0 && elR.height > 0) {
          setRect({
            top: elR.top - containerR.top,
            left: elR.left - containerR.left,
            width: elR.width,
            height: elR.height,
          });
          return;
        }
      }
      setRect(null);
    };

    updatePosition();
    const interval = setInterval(updatePosition, 100);
    return () => clearInterval(interval);
  }, [containerRef, targetId]);

  if (!rect) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: `${rect.top - 4}px`,
        left: `${rect.left - 4}px`,
        width: `${rect.width + 8}px`,
        height: `${rect.height + 8}px`,
      }}
      className={`pointer-events-none z-40 rounded-2xl ring-4 ring-[#25D366] shadow-xl ring-offset-2 ring-offset-slate-900 transition-all duration-300 ${
        isShaking
          ? 'animate-bounce ring-red-500'
          : isGlowing
          ? 'animate-pulse opacity-100 ring-4'
          : 'opacity-40 ring-2'
      }`}
    >
      {/* Bouncing Arrow and Instruction Tag */}
      <div
        className={`absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center transition-transform duration-200 ${
          isGlowing ? 'animate-bounce opacity-100 scale-100' : 'opacity-70 scale-95'
        }`}
      >
        <div className="bg-[#008069] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white whitespace-nowrap">
          {guideText}
        </div>
        <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#008069]" />
      </div>
    </div>
  );
};

import { SupportedLanguage } from '@/types';

export interface UITranslation {
  // App Header
  appTitle: string;
  appSubtitle: string;
  demoModeBadge: string;
  liveModeBadge: string;

  // State Banners
  stateBanners: Record<string, string>;

  // Mascot Status Badges & Overlays
  mascot: {
    teacherName: string;
    speakingBadge: string;
    listeningBadge: string;
    thinkingBadge: string;
    happyBadge: string;
    encouragingBadge: string;
    welcomeBadge: string;
    readyBadge: string;
    retryBadge: string;
    celebratingBadge: string;
    speakingTag: string;
    listeningTag: string;
    thinkingTag: string;
    preparingVoice: string;
    speakingStatus: string;
    listeningStatus: string;
    processingStatus: string;
    readyToAnswer: string;
    audioUnavailable: string;
    autoplayBlocked: string;
    tapToHearAgain: string;
  };

  // Captions
  captions: {
    hideCaptions: string;
    showCaptions: string;
    firstTapSpeaker: string;
    youSpeaker: string;
    transcribingHint: string;
  };

  // Control Bar
  controls: {
    repeatPrompt: string;
    stopSpeaking: string;
    askQuestion: string;
    tapToSpeak: string;
    listeningStop: string;
    voiceHints: {
      listening: string;
      speaking: string;
      preparingMicrophone: string;
      transcribing: string;
      couldNotHear: string;
      idle: string;
    };
    fallbackLanguageTitle: string;
    fallbackYesNoTitle: string;
    fallbackGoalTitle: string;
    fallbackNameTitle: string;
    namePlaceholder: string;
    submitNameButton: string;
    yesButton: string;
    noButton: string;
  };

  // Module 1 Assessment Summary
  assessmentSummary: {
    heading: string;
    description: string;
    nameLabel: string;
    languageLabel: string;
    categoryLabel: string;
    pathLabel: string;
    statusLabel: string;
    completedBadge: string;
    foundationBadge: string;
    savingProfile: string;
    savedSuccess: string;
    saveFailed: string;
    startAgainButton: string;
  };

  // Lesson & Simulator (reserved for future lessons)
  lesson: {
    completeButton: string;
    nextStepButton: string;
    tapHere: string;
    suspiciousCallAlert: string;
    safeAnswer: string;
    unsafeAnswer: string;
    shopLabel: string;
    amountLabel: string;
    sayToConfirm: string;
    understood: string;
  };

  // Celebration
  celebration: {
    heading: string;
    description: string;
    startAgainButton: string;
  };

  // Permission Modal
  permissionModal: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    voiceFirstFeatureTitle: string;
    voiceFirstFeatureDesc: string;
    voiceGuidanceTitle: string;
    voiceGuidanceDesc: string;
    privacyNote: string;
    startButton: string;
  };
}

export const UI_TRANSLATIONS: Record<SupportedLanguage, UITranslation> = {
  'ta-IN': {
    appTitle: 'FirstTap',
    appSubtitle: 'குரல் வழி டிஜிட்டல் பாடம்',
    demoModeBadge: 'டெமோ பயன்முறை',
    liveModeBadge: 'Sarvam AI நேரலை',

    stateBanners: {
      GREETING: 'வணக்கம்! நல்வரவு',
      APP_START: 'வணக்கம்! நல்வரவு',
      LANGUAGE_OPTIONS: 'மொழியைத் தேர்ந்தெடுக்கவும்',
      LANGUAGE_SELECT: 'மொழியைத் தேர்ந்தெடுக்கவும்',
      WAITING_FOR_LANGUAGE: 'மொழியைச் சொல்லுங்கள்...',
      LANGUAGE_CONFIRM: 'மொழி உறுதிப்படுத்தப்பட்டது',
      ASKING_NAME: 'உங்கள் பெயர் என்ன?',
      WAITING_FOR_NAME: 'பெயரைச் சொல்லுங்கள்...',
      CONFIRMING_NAME: 'பெயரை உறுதிப்படுத்துகிறது',
      ASK_NAME: 'உங்கள் பெயர்',
      ASKING_PHONE_INDEPENDENCE: 'கேள்வி 1: கைப்பேசி பயன்பாடு',
      WAITING_FOR_PHONE_ANSWER: 'ஆம் அல்லது இல்லை என்று சொல்லுங்கள்',
      ASK_PHONE_OWNERSHIP: 'கைப்பேசி பயன்பாடு',
      ASKING_LEARNING_GOAL: 'கேள்வி 2: முக்கியக் கற்றல் இலக்கு',
      WAITING_FOR_LEARNING_GOAL: 'இலக்கைத் தேர்ந்தெடுக்கவும் (1, 2, 3)',
      ASKING_BRANCH_QUESTION: 'கேள்வி 3: துறை மதிப்பீடு',
      WAITING_FOR_BRANCH_ANSWER: 'ஆம் அல்லது இல்லை என்று சொல்லுங்கள்',
      PLACEMENT_QUESTIONS: 'அறிமுக மதிப்பீடு',
      PERSONALISE_LEARNING: 'தனிப்பயனாக்கப்பட்ட பாடம்',
      SAVING_PROFILE: 'சுயவிவரத்தைச் சேமிக்கிறது...',
      ASSESSMENT_COMPLETE: 'மதிப்பீடு வெற்றிகரமாக முடிந்தது!',
      SESSION_COMPLETE: 'மதிப்பீடு நிறைவு!',
      ERROR_RECOVERY: 'குரல் மீட்பு',
      LESSON: 'செயல்முறைப் பாடம்',
      WHATSAPP_PATH: 'வாட்ஸ்அப் கற்றல் பாதை',
      WHATSAPP_MODULE: 'வாட்ஸ்அப் பாடம் — நேரடி பயிற்சி',
      DOUBT_HANDLING: 'சந்தேகம் விளக்கம்',
      RETRY: 'மீண்டும் முயற்சிக்கவும்',
    },

    mascot: {
      teacherName: 'FirstTap ஆசிரியை',
      speakingBadge: 'FirstTap பேசுகிறது...',
      listeningBadge: 'கவனமாகக் கேட்கிறது... (பேசுங்கள்)',
      thinkingBadge: 'சிந்திக்கிறது...',
      happyBadge: 'அருமை! 🎉',
      encouragingBadge: 'மீண்டும் சொல்லுங்கள்',
      welcomeBadge: 'வணக்கம்! நல்வரவு',
      readyBadge: 'தயாராக உள்ளது',
      retryBadge: 'மீண்டும் சொல்லுங்கள் 😊',
      celebratingBadge: 'அருமை! 🎉',
      speakingTag: 'பேசுகிறது...',
      listeningTag: 'கேட்கிறது...',
      thinkingTag: 'சிந்திக்கிறது...',
      preparingVoice: 'குரல் தயாராகிறது...',
      speakingStatus: 'பேசுகிறது...',
      listeningStatus: 'கேட்கிறது...',
      processingStatus: 'செயலாக்குகிறது...',
      readyToAnswer: 'பதிலளிக்கத் தயார்',
      audioUnavailable: 'ஆடியோ கிடைக்கவில்லை — மீண்டும் முயற்சிக்க தட்டவும்',
      autoplayBlocked: 'குரலைக் கேட்க இங்கே தட்டவும் 🔊',
      tapToHearAgain: 'மீண்டும் கேட்க தட்டவும் 🔁',
    },

    captions: {
      hideCaptions: 'வசனம் மறை',
      showCaptions: 'வசனம் காட்டு',
      firstTapSpeaker: 'FirstTap',
      youSpeaker: 'நீங்கள்',
      transcribingHint: 'குரல் கேட்கிறது...',
    },

    controls: {
      repeatPrompt: 'மீண்டும் சொல்',
      stopSpeaking: 'பேசுவதை நிறுத்து',
      askQuestion: 'சந்தேகம் கேள்',
      tapToSpeak: 'பேசத் தொடவும்',
      listeningStop: 'கேட்கிறது... நிறுத்தத் தொடவும்',
      voiceHints: {
        listening: '🎤 உங்கள் பதிலை இப்போது பேசுங்கள்...',
        speaking: '🔊 FirstTap பேசுகிறது... கவனித்துக் கேளுங்கள்',
        preparingMicrophone: '🎙️ மைக்ரோஃபோன் தயாராகிறது...',
        transcribing: '⏳ உங்கள் பதிலை அறிந்துகொள்கிறது...',
        couldNotHear: '⚠️ சரியாகக் கேட்கவில்லை — மீண்டும் சொல்லுங்கள்',
        idle: 'குரல் மூலம் பேச மைக்-ஐத் தொடவும் அல்லது தானாகப் பேசவும்',
      },
      fallbackLanguageTitle: 'தொட்டும் தேர்ந்தெடுக்கலாம்:',
      fallbackYesNoTitle: 'பதில் சொல்லவும்:',
      fallbackGoalTitle: 'இலக்கைத் தொடவும் அல்லது சொல்லவும்:',
      fallbackNameTitle: 'அல்லது உங்கள் பெயரை தட்டச்சு செய்யவும்:',
      namePlaceholder: 'உங்கள் பெயரை உள்ளிடவும்',
      submitNameButton: 'அனுப்பு',
      yesButton: 'ஆம்',
      noButton: 'இல்லை',
    },

    assessmentSummary: {
      heading: 'மதிப்பீடு வெற்றிகரமாக முடிந்தது!',
      description: 'உங்கள் பதில்களின் அடிப்படையில் உங்கள் தொடக்கக் கற்றல் பாதை தயார் செய்யப்பட்டுள்ளது.',
      nameLabel: 'கற்பவர் பெயர்',
      languageLabel: 'விருப்ப மொழி',
      categoryLabel: 'பயனர் வகை',
      pathLabel: 'பரிந்துரைக்கப்பட்ட கற்றல் பாதை',
      statusLabel: 'நிலை',
      completedBadge: 'முடிக்கப்பட்டது',
      foundationBadge: 'அடிப்படைப் பாதை',
      savingProfile: 'சுயவிவரம் சேமிக்கப்படுகிறது...',
      savedSuccess: 'சுயவிவரம் வெற்றிகரமாகச் சேமிக்கப்பட்டது',
      saveFailed: 'சுயவிவரத்தைச் சேமிக்க முடியவில்லை',
      startAgainButton: 'மீண்டும் மதிப்பீடு செய்ய',
    },

    lesson: {
      completeButton: 'நிறைவு செய்',
      nextStepButton: 'அடுத்த படி',
      tapHere: 'தொடுங்கள்',
      suspiciousCallAlert: 'எச்சரிக்கை: சந்தேகத்திற்குரிய அழைப்பு!',
      safeAnswer: 'இல்லை (பாதுகாப்பானது)',
      unsafeAnswer: 'ஆம் (ஆபத்தானது)',
      shopLabel: 'கடை பெயர்',
      amountLabel: 'தொகை',
      sayToConfirm: 'ஆம் அல்லது புரிகிறது என்று சொல்லுங்கள்',
      understood: 'ஆம் / புரிகிறது',
    },

    celebration: {
      heading: 'அருமை! மதிப்பீடு முடிந்தது!',
      description: 'FirstTap மூலம் உங்கள் கற்றல் சுயவிவரம் வெற்றிகரமாக உருவாக்கப்பட்டுள்ளது!',
      startAgainButton: 'மீண்டும் தொடங்க',
    },

    permissionModal: {
      welcomeTitle: 'FirstTap-க்கு நல்வரவு!',
      welcomeSubtitle: 'குரல் வழி டிஜிட்டல் கல்வித் தோழன்',
      voiceFirstFeatureTitle: 'குரல் வழி பயன்பாடு',
      voiceFirstFeatureDesc: 'நீங்கள் எதையும் தட்டாமல் பேசிக் கற்க மைக்ரோஃபோன் அனுமதி தேவைப்படுகிறது.',
      voiceGuidanceTitle: 'ஒலி வழிகாட்டல்',
      voiceGuidanceDesc: 'FirstTap உங்களுக்குத் தமிழில் பேசிப் பாடம் கற்பிக்கும்.',
      privacyNote: 'உங்கள் குரல் பாதுகாப்பானது. அனுமதியின்றி எந்த பதிவும் எடுக்கப்படாது.',
      startButton: 'தொடங்குங்கள்',
    },
  },

  'en-IN': {
    appTitle: 'FirstTap',
    appSubtitle: 'Voice-First Digital Learning Companion',
    demoModeBadge: 'Demo Mode',
    liveModeBadge: 'Sarvam AI Live',

    stateBanners: {
      GREETING: 'Welcome to FirstTap',
      APP_START: 'Welcome to FirstTap',
      LANGUAGE_OPTIONS: 'Choose Your Language',
      LANGUAGE_SELECT: 'Choose Your Language',
      WAITING_FOR_LANGUAGE: 'Speak your language choice...',
      LANGUAGE_CONFIRM: 'Language Confirmed',
      ASKING_NAME: 'What is Your Name?',
      WAITING_FOR_NAME: 'Please speak your name...',
      CONFIRMING_NAME: 'Confirming Name',
      ASK_NAME: 'What is Your Name?',
      ASKING_PHONE_INDEPENDENCE: 'Question 1: Phone Independence',
      WAITING_FOR_PHONE_ANSWER: 'Please say Yes or No',
      ASK_PHONE_OWNERSHIP: 'Phone Independence Check',
      ASKING_LEARNING_GOAL: 'Question 2: Main Learning Goal',
      WAITING_FOR_LEARNING_GOAL: 'Choose goal (1, 2, or 3)',
      ASKING_BRANCH_QUESTION: 'Question 3: Skill Assessment',
      WAITING_FOR_BRANCH_ANSWER: 'Please say Yes or No',
      PLACEMENT_QUESTIONS: 'Skill Assessment',
      PERSONALISE_LEARNING: 'Personalising Learning Path',
      SAVING_PROFILE: 'Saving Learner Profile...',
      ASSESSMENT_COMPLETE: 'Assessment Completed!',
      SESSION_COMPLETE: 'Assessment Completed!',
      ERROR_RECOVERY: 'Voice Recovery',
      LESSON: 'Hands-on Lesson',
      WHATSAPP_PATH: 'WhatsApp Learning Path',
      WHATSAPP_MODULE: 'WhatsApp Module — Interactive Practice',
      DOUBT_HANDLING: 'Answering Doubt',
      RETRY: 'Please Try Again',
    },

    mascot: {
      teacherName: 'FirstTap Tutor',
      speakingBadge: 'FirstTap is Speaking...',
      listeningBadge: 'Listening carefully... (Please speak)',
      thinkingBadge: 'Thinking...',
      happyBadge: 'Great job! 🎉',
      encouragingBadge: 'Please try saying that again',
      welcomeBadge: 'Welcome!',
      readyBadge: 'Ready',
      retryBadge: 'Could you repeat? 😊',
      celebratingBadge: 'Great job! 🎉',
      speakingTag: 'Speaking...',
      listeningTag: 'Listening...',
      thinkingTag: 'Thinking...',
      preparingVoice: 'Preparing voice...',
      speakingStatus: 'Speaking...',
      listeningStatus: 'Listening...',
      processingStatus: 'Processing...',
      readyToAnswer: 'Ready to answer',
      audioUnavailable: 'Audio unavailable — tap to retry',
      autoplayBlocked: 'Tap here to hear voice 🔊',
      tapToHearAgain: 'Tap to hear again 🔁',
    },

    captions: {
      hideCaptions: 'Hide Captions',
      showCaptions: 'Show Captions',
      firstTapSpeaker: 'FirstTap',
      youSpeaker: 'You',
      transcribingHint: 'Listening to your voice...',
    },

    controls: {
      repeatPrompt: 'Repeat Prompt',
      stopSpeaking: 'Stop Speaking',
      askQuestion: 'Ask a Question',
      tapToSpeak: 'Tap to Speak',
      listeningStop: 'Listening... Tap to stop',
      voiceHints: {
        listening: '🎤 Please speak your answer now...',
        speaking: '🔊 FirstTap is speaking... listen carefully',
        preparingMicrophone: '🎙️ Preparing microphone...',
        transcribing: '⏳ Processing your answer...',
        couldNotHear: '⚠️ Could not hear clearly — please try again',
        idle: 'Tap the microphone or simply speak your answer',
      },
      fallbackLanguageTitle: 'Or tap to select:',
      fallbackYesNoTitle: 'Or tap to answer:',
      fallbackGoalTitle: 'Or tap to choose goal:',
      fallbackNameTitle: 'Or type your name below:',
      namePlaceholder: 'Enter your name',
      submitNameButton: 'Submit',
      yesButton: 'Yes',
      noButton: 'No',
    },

    assessmentSummary: {
      heading: 'Assessment Complete!',
      description: 'Based on your spoken responses, your personalized learning path is ready.',
      nameLabel: 'Learner Name',
      languageLabel: 'Preferred Language',
      categoryLabel: 'Primary User Category',
      pathLabel: 'Recommended Starting Learning Path',
      statusLabel: 'Status',
      completedBadge: 'Completed',
      foundationBadge: 'Foundation Path',
      savingProfile: 'Saving profile...',
      savedSuccess: 'Profile saved successfully',
      saveFailed: 'Could not save profile to server',
      startAgainButton: 'Retake Assessment',
    },

    lesson: {
      completeButton: 'Complete Lesson',
      nextStepButton: 'Next Step',
      tapHere: 'Tap Here',
      suspiciousCallAlert: 'Warning: Suspicious Call!',
      safeAnswer: 'No (Safe Answer)',
      unsafeAnswer: 'Yes (Unsafe)',
      shopLabel: 'Shop Name',
      amountLabel: 'Amount',
      sayToConfirm: 'Say Yes or Understood to confirm',
      understood: 'Yes, Understood',
    },

    celebration: {
      heading: 'Congratulations! Assessment Complete!',
      description: 'Your tailored digital literacy journey with FirstTap is now ready!',
      startAgainButton: 'Start Again',
    },

    permissionModal: {
      welcomeTitle: 'Welcome to FirstTap!',
      welcomeSubtitle: 'Your Voice-First Digital Literacy Tutor',
      voiceFirstFeatureTitle: 'Voice-First Interaction',
      voiceFirstFeatureDesc: 'Microphone permission is required so you can learn naturally without typing.',
      voiceGuidanceTitle: 'Spoken Guidance',
      voiceGuidanceDesc: 'FirstTap speaks out loud and listens to guide you step-by-step.',
      privacyNote: 'Your voice is private. No audio is stored without your explicit consent.',
      startButton: 'Start FirstTap',
    },
  },

  'hi-IN': {
    appTitle: 'FirstTap',
    appSubtitle: 'आवाज़ से डिजिटल साक्षरता सीखें',
    demoModeBadge: 'डेमो मोड',
    liveModeBadge: 'Sarvam AI लाइव',

    stateBanners: {
      GREETING: 'नमस्ते! आपका स्वागत है',
      APP_START: 'नमस्ते! आपका स्वागत है',
      LANGUAGE_OPTIONS: 'अपनी भाषा चुनें',
      LANGUAGE_SELECT: 'अपनी भाषा चुनें',
      WAITING_FOR_LANGUAGE: 'अपनी भाषा बोलिए...',
      LANGUAGE_CONFIRM: 'भाषा तय हो गई',
      ASKING_NAME: 'आपका नाम क्या है?',
      WAITING_FOR_NAME: 'कृपया अपना नाम बोलिए...',
      CONFIRMING_NAME: 'नाम की पुष्टि',
      ASK_NAME: 'आपका नाम',
      ASKING_PHONE_INDEPENDENCE: 'प्रश्न 1: मोबाइल फोन चलाना',
      WAITING_FOR_PHONE_ANSWER: 'कृपया हाँ या नहीं कहें',
      ASK_PHONE_OWNERSHIP: 'फोन स्वतंत्रता जांच',
      ASKING_LEARNING_GOAL: 'प्रश्न 2: मुख्य सीखने का लक्ष्य',
      WAITING_FOR_LEARNING_GOAL: 'लक्ष्य चुनें (1, 2, या 3)',
      ASKING_BRANCH_QUESTION: 'प्रश्न 3: कौशल मूल्यांकन',
      WAITING_FOR_BRANCH_ANSWER: 'कृपया हाँ या नहीं कहें',
      PLACEMENT_QUESTIONS: 'कौशल मूल्यांकन',
      PERSONALISE_LEARNING: 'पाठ तैयार हो रहा है',
      SAVING_PROFILE: 'प्रोफ़ाइल सहेजा जा रहा है...',
      ASSESSMENT_COMPLETE: 'मूल्यांकन पूरा हुआ!',
      SESSION_COMPLETE: 'मूल्यांकन पूरा हुआ!',
      ERROR_RECOVERY: 'आवाज़ सुधार',
      LESSON: 'अभ्यास पाठ',
      WHATSAPP_PATH: 'व्हाट्सएप लर्निंग पाथ',
      WHATSAPP_MODULE: 'व्हाट्सएप मॉड्यूल — इंटरैक्टिव अभ्यास',
      DOUBT_HANDLING: 'सवाल का जवाब',
      RETRY: 'कृपया पुनः प्रयास करें',
    },

    mascot: {
      teacherName: 'FirstTap शिक्षिका',
      speakingBadge: 'FirstTap बोल रहा है...',
      listeningBadge: 'ध्यान से सुन रहा है... (बोलिए)',
      thinkingBadge: 'सोच रहा है...',
      happyBadge: 'बहुत बढ़िया! 🎉',
      encouragingBadge: 'कृपया दोबारा बोलिए',
      welcomeBadge: 'नमस्ते!',
      readyBadge: 'तैयार है',
      retryBadge: 'कृपया फिर से कहें 😊',
      celebratingBadge: 'शाबाश! 🎉',
      speakingTag: 'बोल रहा है...',
      listeningTag: 'सुन रहा है...',
      thinkingTag: 'सोच रहा है...',
      preparingVoice: 'आवाज़ तैयार हो रही है...',
      speakingStatus: 'बोल रहा है...',
      listeningStatus: 'सुन रहा है...',
      processingStatus: 'प्रोसेसिंग...',
      readyToAnswer: 'उत्तर देने के लिए तैयार',
      audioUnavailable: 'ऑडियो उपलब्ध नहीं — पुनः प्रयास करें',
      autoplayBlocked: 'आवाज़ सुनने के लिए यहाँ टैप करें 🔊',
      tapToHearAgain: 'दोबारा सुनने के लिए टैप करें 🔁',
    },

    captions: {
      hideCaptions: 'कैप्शन छिपाएं',
      showCaptions: 'कैप्शन दिखाएं',
      firstTapSpeaker: 'FirstTap',
      youSpeaker: 'आप',
      transcribingHint: 'आवाज़ समझी जा रही है...',
    },

    controls: {
      repeatPrompt: 'दोबारा सुनें',
      stopSpeaking: 'बोलना रोकें',
      askQuestion: 'सवाल पूछें',
      tapToSpeak: 'बोलने के लिए छुएं',
      listeningStop: 'सुन रहा है... रोकने के लिए छुएं',
      voiceHints: {
        listening: '🎤 कृपया अपना उत्तर अभी बोलिए...',
        speaking: '🔊 FirstTap बोल रहा है... ध्यान से सुनें',
        preparingMicrophone: '🎙️ माइक्रोफोन तैयार हो रहा है...',
        transcribing: '⏳ आपका उत्तर प्रोसेस किया जा रहा है...',
        couldNotHear: '⚠️ साफ़ सुनाई नहीं दिया — कृपया दोबारा बोलें',
        idle: 'माइक दबाकर बोलें या सीधे आवाज़ में जवाब दें',
      },
      fallbackLanguageTitle: 'या बटन दबाकर चुनें:',
      fallbackYesNoTitle: 'या बटन दबाकर जवाब दें:',
      fallbackGoalTitle: 'या लक्ष्य चुनें:',
      fallbackNameTitle: 'या अपना नाम नीचे लिखें:',
      namePlaceholder: 'अपना नाम दर्ज करें',
      submitNameButton: 'आगे बढ़ें',
      yesButton: 'हाँ',
      noButton: 'नहीं',
    },

    assessmentSummary: {
      heading: 'मूल्यांकन सफलतापूर्वक पूरा हुआ!',
      description: 'आपके मौखिक उत्तरों के आधार पर आपका व्यक्तिगत शिक्षण मार्ग तैयार है।',
      nameLabel: 'शिक्षार्थी का नाम',
      languageLabel: 'पसंदीदा भाषा',
      categoryLabel: 'प्राथमिक श्रेणी',
      pathLabel: 'अनुशंसित प्रारंभिक शिक्षण मार्ग',
      statusLabel: 'स्थिति',
      completedBadge: 'पूर्ण हुआ',
      foundationBadge: 'बुनियादी मार्ग',
      savingProfile: 'प्रोफ़ाइल सहेजा जा रहा है...',
      savedSuccess: 'प्रोफ़ाइल सफलतापूर्वक सहेजा गया',
      saveFailed: 'सर्वर पर प्रोफ़ाइल सहेजा नहीं जा सका',
      startAgainButton: 'पुनः मूल्यांकन करें',
    },

    lesson: {
      completeButton: 'पूरा करें',
      nextStepButton: 'अगला चरण',
      tapHere: 'यहाँ छुएं',
      suspiciousCallAlert: 'चेतावनी: संदिग्ध कॉल!',
      safeAnswer: 'नहीं (सुरक्षित उत्तर)',
      unsafeAnswer: 'हाँ (असुरक्षित)',
      shopLabel: 'दुकान का नाम',
      amountLabel: 'राशि',
      sayToConfirm: 'पुष्टि के लिए हाँ कहें',
      understood: 'हाँ, समझ गया',
    },

    celebration: {
      heading: 'बधाई हो! आपका मूल्यांकन पूरा हुआ!',
      description: 'FirstTap के साथ आपका डिजिटल साक्षरता प्रोफ़ाइल तैयार है!',
      startAgainButton: 'फिर से शुरू करें',
    },

    permissionModal: {
      welcomeTitle: 'FirstTap में आपका स्वागत है!',
      welcomeSubtitle: 'आवाज़ से मोबाइल चलाना सिखाने वाला साथी',
      voiceFirstFeatureTitle: 'बोलकर सीखने की सुविधा',
      voiceFirstFeatureDesc: 'बिना टाइप किए बोलकर सीखने के लिए माइक्रोफोन की अनुमति आवश्यक है।',
      voiceGuidanceTitle: 'बोलकर मार्गदर्शन',
      voiceGuidanceDesc: 'FirstTap आपको आसान भाषा में बोलकर हर कदम पर सिखाएगा।',
      privacyNote: 'आपकी आवाज़ सुरक्षित है। अनुमति के बिना कोई रिकॉर्डिंग नहीं रखी जाती।',
      startButton: 'शुरू करें (Start)',
    },
  },
};

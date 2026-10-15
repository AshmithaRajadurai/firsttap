import {
  Lesson,
  PlacementQuestion,
  SupportedLanguage,
  PrimaryCategory,
  LearningGoal,
  StartingLearningPath,
} from '@/types';

export const SUPPORTED_LANGUAGES: Record<
  SupportedLanguage,
  { name: string; nativeName: string; code: SupportedLanguage }
> = {
  'ta-IN': {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    code: 'ta-IN',
  },
  'en-IN': {
    name: 'English',
    nativeName: 'English',
    code: 'en-IN',
  },
  'hi-IN': {
    name: 'Hindi',
    nativeName: 'हिंदी',
    code: 'hi-IN',
  },
};

export const CATEGORIES_META: Record<
  PrimaryCategory,
  {
    title: Record<SupportedLanguage, string>;
    description: Record<SupportedLanguage, string>;
  }
> = {
  DIGITAL_BEGINNER: {
    title: {
      'en-IN': 'Digital Beginner',
      'ta-IN': 'டிஜிட்டல் தொடக்கநிலை',
      'hi-IN': 'डिजिटल शुरुआती',
    },
    description: {
      'en-IN': 'Building foundational phone skills step by step',
      'ta-IN': 'ஸ்மார்ட்போன் பயன்படுத்துவதற்கான எளிய அடிப்படை பயிற்சி',
      'hi-IN': 'स्मार्टफोन उपयोग की बुनियादी जानकारी चरणबद्ध तरीके से',
    },
  },
  EVERYDAY_DIGITAL_LEARNER: {
    title: {
      'en-IN': 'Everyday Digital Learner',
      'ta-IN': 'அன்றாட டிஜிட்டல் பயனர்',
      'hi-IN': 'दैनिक डिजिटल शिक्षार्थी',
    },
    description: {
      'en-IN': 'Connecting with loved ones, internet browsing, and useful daily apps',
      'ta-IN': 'குடும்பத்தினர், நண்பர்களுடன் தொடர்பு மற்றும் இணையப் பயன்பாடு',
      'hi-IN': 'परिवार से बातचीत, इंटरनेट और उपयोगी दैनिक ऐप्स का इस्तेमाल',
    },
  },
  DIGITAL_PAYMENT_LEARNER: {
    title: {
      'en-IN': 'Digital Payment Learner',
      'ta-IN': 'டிஜிட்டல் பணப் பரிவர்த்தனைப் பயனர்',
      'hi-IN': 'डिजिटल भुगतान शिक्षार्थी',
    },
    description: {
      'en-IN': 'Confident and safe UPI payments, scanning QR codes, and fraud protection',
      'ta-IN': 'பாதுகாப்பான UPI பணப் பரிவர்த்தனைகள் மற்றும் மோசடி விழிப்புணர்வு',
      'hi-IN': 'सुरक्षित यूपीआई भुगतान, क्यूआर कोड स्कैनिंग और ऑनलाइन सुरक्षा',
    },
  },
  MSME_LEARNER: {
    title: {
      'en-IN': 'MSME / Small Business Learner',
      'ta-IN': 'சிறு வணிகம் / தொழில் முனைவோர்',
      'hi-IN': 'एमएसएमई / लघु व्यवसाय शिक्षार्थी',
    },
    description: {
      'en-IN': 'Digital bookkeeping, customer payments, sales tracking, and shop tools',
      'ta-IN': 'டிஜிட்டல் கணக்குப்பதிவு, வாடிக்கையாளர் கட்டணம் மற்றும் வணிக கருவிகள்',
      'hi-IN': 'डिजिटल बहीखाता, ग्राहकों से भुगतान, बिक्री ट्रैकिंग और व्यापार उपकरण',
    },
  },
};

export const LEARNING_PATHS_META: Record<
  StartingLearningPath,
  {
    title: Record<SupportedLanguage, string>;
    description: Record<SupportedLanguage, string>;
    category: PrimaryCategory;
  }
> = {
  SMARTPHONE_BASICS: {
    title: {
      'en-IN': 'Smartphone Basics',
      'ta-IN': 'ஸ்மார்ட்போன் அடிப்படைகள்',
      'hi-IN': 'स्मार्टफोन बेसिक्स',
    },
    description: {
      'en-IN': 'How to turn on, unlock, make phone calls, and open apps with ease',
      'ta-IN': 'போனை ஆன் செய்தல், பூட்டு திறத்தல், அழைப்புகள் மற்றும் செயலிகளைத் திறத்தல்',
      'hi-IN': 'फोन चालू करना, अनलॉक करना, कॉल करना और ऐप्स खोलना',
    },
    category: 'DIGITAL_BEGINNER',
  },
  INTERNET_COMMUNICATION_BASICS: {
    title: {
      'en-IN': 'Internet & Communication Basics',
      'ta-IN': 'இணையம் மற்றும் தகவல் தொடர்பு அடிப்படைகள்',
      'hi-IN': 'इंटरनेट और संचार की बुनियादी बातें',
    },
    description: {
      'en-IN': 'Sending voice messages, making video calls, and browsing the internet',
      'ta-IN': 'குரல் செய்திகள் அனுப்புதல், வீடியோ அழைப்புகள் மற்றும் இணைய உலாவுதல்',
      'hi-IN': 'वॉइस मैसेज भेजना, वीडियो कॉल करना और इंटरनेट पर जानकारी देखना',
    },
    category: 'EVERYDAY_DIGITAL_LEARNER',
  },
  EVERYDAY_DIGITAL_SERVICES: {
    title: {
      'en-IN': 'Everyday Digital Services',
      'ta-IN': 'அன்றாட டிஜிட்டல் சேவைகள்',
      'hi-IN': 'दैनिक डिजिटल सेवाएं',
    },
    description: {
      'en-IN': 'Train ticket booking, bill payments, weather check, and news access',
      'ta-IN': 'பயணச் சீட்டு பதிவு, மின்கட்டணம் செலுத்துதல் மற்றும் பயனுள்ள ஆன்லைன் சேவைகள்',
      'hi-IN': 'टिकट बुकिंग, बिजली बिल भुगतान और सरकारी व ऑनलाइन सेवाएं',
    },
    category: 'EVERYDAY_DIGITAL_LEARNER',
  },
  DIGITAL_PAYMENTS_BASICS: {
    title: {
      'en-IN': 'Digital Payments Basics',
      'ta-IN': 'டிஜிட்டல் பணப் பரிவர்த்தனை அடிப்படைகள்',
      'hi-IN': 'डिजिटल भुगतान बेसिक्स',
    },
    description: {
      'en-IN': 'Setting up UPI, scanning shop QR codes, and sending money securely',
      'ta-IN': 'UPI அமைத்தல், கடையின் QR குறியீட்டை ஸ்கேன் செய்தல் மற்றும் பணம் செலுத்துதல்',
      'hi-IN': 'यूपीआई शुरू करना, दुकान का क्यूआर कोड स्कैन करना और पैसे भेजना',
    },
    category: 'DIGITAL_PAYMENT_LEARNER',
  },
  PAYMENT_VERIFICATION_AND_SAFETY: {
    title: {
      'en-IN': 'Payment Verification & Safety',
      'ta-IN': 'பணப் பரிவர்த்தனை சரிபார்ப்பு மற்றும் பாதுகாப்பு',
      'hi-IN': 'भुगतान सत्यापन और सुरक्षा',
    },
    description: {
      'en-IN': 'Verifying recipient names before payment and never sharing OTP or PIN',
      'ta-IN': 'பெயர் சரிபார்த்து பணம் அனுப்புதல் மற்றும் ரகசிய பின்/OTP பாதுகாப்பு',
      'hi-IN': 'पैसे भेजने से पहले नाम जांचना और पिन व ओटीपी की पूर्ण सुरक्षा',
    },
    category: 'DIGITAL_PAYMENT_LEARNER',
  },
  DIGITAL_BUSINESS_BASICS: {
    title: {
      'en-IN': 'Digital Business Basics',
      'ta-IN': 'டிஜிட்டல் வணிக அடிப்படைகள்',
      'hi-IN': 'डिजिटल व्यापार बेसिक्स',
    },
    description: {
      'en-IN': 'Accepting customer payments via soundbox QR and WhatsApp for business',
      'ta-IN': 'வாடிக்கையாளர் QR கட்டணம் பெறுதல் மற்றும் வியாபார WhatsApp பயன்பாடு',
      'hi-IN': 'दुकान के लिए क्यूआर कोड से भुगतान लेना और व्हाट्सएप बिजनेस का उपयोग',
    },
    category: 'MSME_LEARNER',
  },
  DIGITAL_BOOKKEEPING_AND_BUSINESS_TOOLS: {
    title: {
      'en-IN': 'Digital Bookkeeping & Business Tools',
      'ta-IN': 'டிஜிட்டல் கணக்குப் பதிவேடு மற்றும் வணிகக் கருவிகள்',
      'hi-IN': 'डिजिटल बहीखाता और व्यावसायिक उपकरण',
    },
    description: {
      'en-IN': 'Recording daily sales, managing customer credit (khata), and expense tracking',
      'ta-IN': 'தினசரி வரவு செலவு கணக்கு, கடன் பாக்கி (காதா) மற்றும் விற்பனை பதிவு',
      'hi-IN': 'दैनिक बिक्री दर्ज करना, उधारी (खाता) प्रबंधन और खर्चों का हिसाब',
    },
    category: 'MSME_LEARNER',
  },
};

export const APP_PROMPTS = {
  welcome: {
    'ta-IN': 'வணக்கம்! Welcome to FirstTap!',
    'en-IN': 'வணக்கம்! Welcome to FirstTap!',
    'hi-IN': 'வணக்கம்! Welcome to FirstTap!',
  },
  languageChoiceIntro: {
    fullOffer: {
      'en-IN': 'If you want to learn in English, say English.',
      'ta-IN': "தமிழில் கற்க விரும்பினால், 'தமிழ்' என்று சொல்லுங்கள்.",
      'hi-IN': "अगर आप हिंदी में सीखना चाहते हैं, तो 'हिंदी' कहें।",
    },
    promptSequence: [
      { language: 'en-IN' as SupportedLanguage, text: 'If you want to learn in English, say English.' },
      { language: 'ta-IN' as SupportedLanguage, text: "தமிழில் கற்க விரும்பினால், 'தமிழ்' என்று சொல்லுங்கள்." },
      { language: 'hi-IN' as SupportedLanguage, text: "अगर आप हिंदी में सीखना चाहते हैं, तो 'हिंदी' कहें।" },
    ],
  },
  languageConfirm: {
    'ta-IN': 'சரி! நாம் தமிழில் தொடர்ந்து கற்கலாம்.',
    'en-IN': 'Great! We will continue learning in English.',
    'hi-IN': 'बहुत अच्छा! अब हम हिंदी में सीखेंगे।',
  },
  askName: {
    'ta-IN': 'மிக்க மகிழ்ச்சி! உங்கள் பெயர் என்ன?',
    'en-IN': "That's great! What is your name?",
    'hi-IN': 'बहुत बढ़िया! आपका नाम क्या है?',
  },
  greetUser: {
    'ta-IN': (name: string) => `வணக்கம் ${name}! உங்களைச் சந்திப்பதில் மகிழ்ச்சி.`,
    'en-IN': (name: string) => `Nice to meet you, ${name}!`,
    'hi-IN': (name: string) => `नमस्ते ${name}! आपसे मिलकर बहुत खुशी हुई।`,
  },
  phoneIndependence: {
    ask: {
      'ta-IN': (name: string) =>
        `${name}, மற்றவர்களின் உதவி இல்லாமல், செயலிகளைத் திறப்பது மற்றும் அழைப்புகளை மேற்கொள்வது போன்ற உங்கள் மொபைல் போனை நீங்களாகவே பயன்படுத்த முடியுமா? ஆம் அல்லது இல்லை என்று சொல்லுங்கள்.`,
      'en-IN': (name: string) =>
        `${name}, can you use your mobile phone by yourself, such as opening apps and making calls, without anyone's help? Please say Yes or No.`,
      'hi-IN': (name: string) =>
        `${name}, क्या आप किसी की मदद के बिना, खुद से अपना मोबाइल फोन चला सकते हैं, जैसे ऐप्स खोलना और फोन कॉल करना? कृपया हाँ या नहीं कहें।`,
    },
    retry: {
      'ta-IN':
        'மன்னிக்கவும், எனக்கு சரியாகக் கேட்கவில்லை. மற்றவர்களின் உதவி இல்லாமல் உங்கள் மொபைல் போனை நீங்களாகவே பயன்படுத்த முடியுமா? தயவுசெய்து ஆம் அல்லது இல்லை என்று சொல்லுங்கள்.',
      'en-IN':
        'Sorry, I could not hear clearly. Can you use your mobile phone by yourself without anyone help? Please say Yes or No.',
      'hi-IN':
        'माफ़ कीजिए, मुझे ठीक से सुनाई नहीं दिया। क्या आप बिना किसी की मदद के खुद से अपना मोबाइल फोन चला सकते हैं? कृपया हाँ या नहीं कहें।',
    },
    clarifyYesNo: {
      'ta-IN':
        'தயவுசெய்து ஆம் அல்லது இல்லை என்று சொல்லுங்கள்: மற்றவர்களின் உதவி இல்லாமல் உங்கள் மொபைல் போனை நீங்களாகவே பயன்படுத்த முடியுமா?',
      'en-IN':
        'Please answer with Yes or No: can you use your mobile phone by yourself without anyone help?',
      'hi-IN':
        'कृपया हाँ या नहीं कहें: क्या आप बिना किसी की मदद के खुद से अपना मोबाइल फोन चला सकते हैं?',
    },
  },
  beginnerCompletion: {
    'ta-IN': (name: string) =>
      `நன்றி ${name}! கவலைப்பட வேண்டாம், ஸ்மார்ட்போனைப் பயன்படுத்தும் எளிய அடிப்படைகளில் இருந்தே நாம் தொடங்குவோம். உங்களுக்கான கற்றல் பாதை: ஸ்மார்ட்போன் அடிப்படைகள்!`,
    'en-IN': (name: string) =>
      `Thank you ${name}! Don't worry at all, we will start right from the basics of using a smartphone. Your starting learning path is Smartphone Basics!`,
    'hi-IN': (name: string) =>
      `धन्यवाद ${name}! बिल्कुल चिंता न करें, हम स्मार्टफोन के बुनियादी इस्तेमाल से ही शुरुआत करेंगे। आपका सीखने का मार्ग है: स्मार्टफोन बेसिक्स!`,
  },
  learningGoal: {
    ask: {
      'ta-IN': (name: string) =>
        `${name}, உங்கள் மொபைல் போனைப் பயன்படுத்தி முக்கியமாக என்ன கற்றுக்கொள்ள விரும்புகிறீர்கள்? ஒன்று: அன்றாட போன் மற்றும் இணையப் பயன்பாடு. இரண்டு: டிஜிட்டல் பணப் பரிவர்த்தனைகள் மற்றும் ஆன்லைன் சேவைகள். மூன்று: எனது கடை அல்லது சிறு வணிகத்திற்கான டிஜிட்டல் கருவிகள்.`,
      'en-IN': (name: string) =>
        `${name}, what would you mainly like to learn using your mobile phone? One: Everyday phone and internet use. Two: Digital payments and online services. Three: Using digital tools for my shop or small business.`,
      'hi-IN': (name: string) =>
        `${name}, आप अपने मोबाइल फोन का उपयोग करके मुख्य रूप से क्या सीखना चाहते हैं? एक: रोज़मर्रा का फोन और इंटरनेट इस्तेमाल। दो: डिजिटल भुगतान और ऑनलाइन सेवाएं। तीन: अपनी दुकान या छोटे व्यवसाय के लिए डिजिटल उपकरण।`,
    },
    options: {
      EVERYDAY_DIGITAL_SKILLS: {
        numberLabel: '1',
        'en-IN': 'Everyday phone and internet use',
        'ta-IN': 'அன்றாட போன் மற்றும் இணையப் பயன்பாடு',
        'hi-IN': 'रोज़मर्रा का फोन और इंटरनेट इस्तेमाल',
      },
      DIGITAL_PAYMENTS: {
        numberLabel: '2',
        'en-IN': 'Digital payments and online services',
        'ta-IN': 'டிஜிட்டல் பணப் பரிவர்த்தனைகள் மற்றும் ஆன்லைன் சேவைகள்',
        'hi-IN': 'डिजिटल भुगतान और ऑनलाइन सेवाएं',
      },
      MSME_BUSINESS_SKILLS: {
        numberLabel: '3',
        'en-IN': 'Using digital tools for my shop or small business',
        'ta-IN': 'எனது கடை அல்லது சிறு வணிகத்திற்கான டிஜிட்டல் கருவிகள்',
        'hi-IN': 'अपनी दुकान या छोटे व्यवसाय के लिए डिजिटल उपकरण',
      },
    },
    chooseFromThree: {
      'ta-IN':
        'தயவுசெய்து ஒன்றைத் தேர்ந்தெடுக்கவும்: அன்றாட போன் மற்றும் இணையப் பயன்பாடு, டிஜிட்டல் பணப் பரிவர்த்தனைகள், அல்லது சிறு வணிகக் கருவிகள்.',
      'en-IN':
        'Please choose one: everyday phone and internet use, digital payments, or small business.',
      'hi-IN':
        'कृपया इनमें से एक चुनें: रोज़मर्रा का फोन और इंटरनेट इस्तेमाल, डिजिटल भुगतान, या छोटा व्यवसाय।',
    },
    retry: {
      'ta-IN':
        'நீங்கள் எதை கற்க விரும்புகிறீர்கள் என்பதைத் தெளிவாகச் சொல்லுங்கள். அன்றாட பயன்பாட்டிற்கு ஒன்று என்றும், டிஜிட்டல் பணப் பரிவர்த்தனைக்கு இரண்டு என்றும், அல்லது கடை வணிகத்திற்கு மூன்று என்றும் சொல்லுங்கள்.',
      'en-IN':
        'I did not catch which goal you preferred. Please say: One, for everyday phone and internet; Two, for digital payments; or Three, for shop or business tools.',
      'hi-IN':
        'मुझे आपका चुना हुआ विकल्प समझ नहीं आया। रोज़मर्रा के इस्तेमाल के लिए एक, डिजिटल भुगतान के लिए दो, या दुकान और व्यापार के लिए तीन कहें।',
    },
  },
  branchQuestions: {
    EVERYDAY_DIGITAL_SKILLS: {
      ask: {
        'ta-IN':
          'இணையம் மற்றும் செய்தி அனுப்பும் செயலிகளை நீங்களாகவே பயன்படுத்த முடியுமா? ஆம் அல்லது இல்லை என்று சொல்லுங்கள்.',
        'en-IN':
          'Can you use the internet and messaging apps by yourself? Please say Yes or No.',
        'hi-IN':
          'क्या आप इंटरनेट और मैसेजिंग ऐप्स का इस्तेमाल खुद से कर सकते हैं? कृपया हाँ या नहीं कहें।',
      },
      retry: {
        'ta-IN':
          'மன்னிக்கவும், சரியாகக் கேட்கவில்லை. இணையம் மற்றும் செய்தி அனுப்பும் செயலிகளை நீங்களாகவே பயன்படுத்த முடியுமா? தயவுசெய்து ஆம் அல்லது இல்லை என்று சொல்லுங்கள்.',
        'en-IN':
          'Sorry, I could not hear clearly. Can you use internet and messaging apps on your own? Please say Yes or No.',
        'hi-IN':
          'माफ़ कीजिए, मुझे ठीक से सुनाई नहीं दिया। क्या आप इंटरनेट और मैसेजिंग ऐप्स खुद से इस्तेमाल कर सकते हैं? कृपया हाँ या नहीं कहें।',
      },
      clarifyYesNo: {
        'ta-IN':
          'தயவுசெய்து ஆம் அல்லது இல்லை என்று சொல்லுங்கள்: இணையம் மற்றும் செய்தி அனுப்பும் செயலிகளை நீங்களாகவே பயன்படுத்த முடியுமா?',
        'en-IN':
          'Please answer with Yes or No: can you use the internet and messaging apps by yourself?',
        'hi-IN':
          'कृपया हाँ या नहीं कहें: क्या आप इंटरनेट और मैसेजिंग ऐप्स का इस्तेमाल खुद से कर सकते हैं?',
      },
    },
    DIGITAL_PAYMENTS: {
      ask: {
        'ta-IN':
          'UPI செயலியைப் பயன்படுத்தி எப்போதாவது டிஜிட்டல் பணப் பரிவர்த்தனை செய்திருக்கிறீர்களா அல்லது பணம் பெற்றுள்ளீர்களா? ஆம் அல்லது இல்லை என்று சொல்லுங்கள்.',
        'en-IN':
          'Have you ever made or received a digital payment using a UPI app? Please say Yes or No.',
        'hi-IN':
          'क्या आपने कभी किसी यूपीआई ऐप से डिजिटल भुगतान किया है या पैसे प्राप्त किए हैं? कृपया हाँ या नहीं कहें।',
      },
      retry: {
        'ta-IN':
          'மன்னிக்கவும், சரியாகக் கேட்கவில்லை. UPI செயலியைப் பயன்படுத்தி எப்போதாவது பணப் பரிவர்த்தனை செய்திருக்கிறீர்களா? தயவுசெய்து ஆம் அல்லது இல்லை என்று சொல்லுங்கள்.',
        'en-IN':
          'Sorry, I could not hear clearly. Have you ever made or received payments with a UPI app? Please say Yes or No.',
        'hi-IN':
          'माफ़ कीजिए, मुझे ठीक से सुनाई नहीं दिया। क्या आपने कभी यूपीआई ऐप से भुगतान किया या प्राप्त किया है? कृपया हाँ या नहीं कहें।',
      },
      clarifyYesNo: {
        'ta-IN':
          'தயவுசெய்து ஆம் அல்லது இல்லை என்று சொல்லுங்கள்: UPI செயலியைப் பயன்படுத்தி எப்போதாவது பணப் பரிவர்த்தனை செய்திருக்கிறீர்களா?',
        'en-IN':
          'Please answer with Yes or No: have you ever made or received a digital payment using a UPI app?',
        'hi-IN':
          'कृपया हाँ या नहीं कहें: क्या आपने कभी यूपीआई ऐप से डिजिटल भुगतान किया है या पैसे प्राप्त किए हैं?',
      },
    },
    MSME_BUSINESS_SKILLS: {
      ask: {
        'ta-IN':
          'வணிகப் பணப் பரிவர்த்தனைகள் அல்லது விற்பனை மற்றும் செலவுகளைப் பதிவு செய்ய ஏற்கனவே உங்கள் மொபைல் போனைப் பயன்படுத்துகிறீர்களா? ஆம் அல்லது இல்லை என்று சொல்லுங்கள்.',
        'en-IN':
          'Do you already use your mobile phone for business payments or recording sales and expenses? Please say Yes or No.',
        'hi-IN':
          'क्या आप व्यावसायिक भुगतान या बिक्री और खर्चों को दर्ज करने के लिए पहले से ही अपने मोबाइल का उपयोग करते हैं? कृपया हाँ या नहीं कहें।',
      },
      retry: {
        'ta-IN':
          'மன்னிக்கவும், சரியாகக் கேட்கவில்லை. வணிகப் பணப் பரிவர்த்தனை அல்லது விற்பனை செலவுகளைப் பதிவு செய்ய போனைப் பயன்படுத்துகிறீர்களா? ஆம் அல்லது இல்லை என்று சொல்லுங்கள்.',
        'en-IN':
          'Sorry, I could not hear clearly. Do you use your phone for business payments or recording sales? Please say Yes or No.',
        'hi-IN':
          'माफ़ कीजिए, मुझे ठीक से सुनाई नहीं दिया। क्या आप बिजनेस भुगतान या हिसाब-किताब के लिए फोन का उपयोग करते हैं? कृपया हाँ या नहीं कहें।',
      },
      clarifyYesNo: {
        'ta-IN':
          'தயவுசெய்து ஆம் அல்லது இல்லை என்று சொல்லுங்கள்: வணிகப் பணப் பரிவர்த்தனைகள் அல்லது கணக்கு வைத்திருக்க போனைப் பயன்படுத்துகிறீர்களா?',
        'en-IN':
          'Please answer with Yes or No: do you already use your mobile phone for business payments or recording sales and expenses?',
        'hi-IN':
          'कृपया हाँ या नहीं कहें: क्या आप व्यापारिक भुगतान या हिसाब रखने के लिए मोबाइल फोन का उपयोग करते हैं?',
      },
    },
  },
  assessmentCompletion: {
    'ta-IN': (name: string, pathTitle: string) =>
      `அருமை ${name}! உங்கள் மதிப்பீடு வெற்றிகரமாக முடிந்தது. உங்களுக்கான கற்றல் பாதை: ${pathTitle}. நாம் இணைந்து கற்போம்!`,
    'en-IN': (name: string, pathTitle: string) =>
      `Wonderful ${name}! Your assessment is complete. Your recommended starting learning path is ${pathTitle}. Let's learn together!`,
    'hi-IN': (name: string, pathTitle: string) =>
      `शानदार ${name}! आपका आकलन सफलतापूर्वक पूरा हो गया है। आपका सीखने का मार्ग है: ${pathTitle}। चलिए साथ मिलकर सीखते हैं!`,
  },
  retryPrompts: {
    unclear: {
      'ta-IN': 'மன்னிக்கவும், எனக்கு சரியாகக் கேட்கவில்லை. தயவுசெய்து மீண்டும் ஒருமுறை சொல்லுங்கள்.',
      'en-IN': 'Sorry, I could not hear that clearly. Could you please say that again?',
      'hi-IN': 'माफ़ कीजिए, मुझे ठीक से सुनाई नहीं दिया। क्या आप दोबारा कह सकते हैं?',
    },
    silence: {
      'ta-IN': 'உங்கள் குரல் கேட்கவில்லை. தயங்காமல் சத்தமாகப் பேசுங்கள்.',
      'en-IN': 'I did not hear your voice. Please speak up clearly, do not worry.',
      'hi-IN': 'आपकी आवाज़ नहीं आई। बेझिझक थोड़ा तेज़ बोलिए।',
    },
    threeAttemptsFallback: {
      'ta-IN': 'நீங்கள் திரையில் உள்ள பொத்தானைத் தொட்டும் தேர்ந்தெடுக்கலாம்.',
      'en-IN': 'You can also tap the button on the screen.',
      'hi-IN': 'आप स्क्रीन पर दिए गए बटन को दबाकर भी चुन सकते हैं।',
    },
  },
  doubtResolutionResumption: {
    'ta-IN': 'இப்போது நாம் விட்ட இடத்தில் இருந்து தொடர்வோம்.',
    'en-IN': 'Now, let us continue where we left off.',
    'hi-IN': 'अब हम वहीं से आगे बढ़ते हैं जहाँ हमने छोड़ा था।',
  },
  lessonComplete: {
    'ta-IN': (name: string) =>
      `வாழ்த்துகள் ${name}! நீங்கள் இந்தப் பாடத்தை வெற்றிகரமாக முடித்துவிட்டீர்கள். உங்கள் கைப்பேசியை இப்போது நீங்கள் தைரியமாகப் பயன்படுத்தலாம்!`,
    'en-IN': (name: string) =>
      `Congratulations ${name}! You have successfully completed this lesson. You are now ready to use your phone with confidence!`,
    'hi-IN': (name: string) =>
      `बधाई हो ${name}! आपने यह पाठ सफलतापूर्वक पूरा कर लिया है। अब आप आत्मविश्वास से अपने फोन का उपयोग कर सकते हैं!`,
  },
  askPhoneOwnership: {
    'ta-IN': (name: string) => `${name}, உங்களிடம் கைப்பேசி இருக்கிறதா?`,
    'en-IN': (name: string) => `${name}, do you have a mobile phone?`,
    'hi-IN': (name: string) => `${name}, क्या आपके पास मोबाइल फोन है?`,
  },
  placementIntro: {
    'ta-IN': (name: string) =>
      `${name}, அருமை! நீங்கள் எதில் இருந்து தொடங்க வேண்டும் என்று தெரிந்துகொள்ள சில எளிய கேள்விகளைக் கேட்கிறேன். ஆம் அல்லது இல்லை என்று சொல்லுங்கள்.`,
    'en-IN': (name: string) =>
      `${name}, wonderful! I will ask a few simple questions to find the best place to start. Just say yes or no.`,
    'hi-IN': (name: string) =>
      `${name}, बहुत बढ़िया! सही शुरुआत जानने के लिए मैं आपसे कुछ आसान सवाल पूछूँगा। बस हाँ या नहीं कहें।`,
  },
  personaliseLearning: {
    'ta-IN': (name: string, lessonTitle: string) =>
      `${name}, அருமை! இப்போது நாம் கைப்பேசியை எளிதாகப் பயன்படுத்தக் கற்றுக்கொள்ளலாம். உங்களுக்காக "${lessonTitle}" என்ற எளிய பாடத்தைத் தொடங்குவோம்.`,
    'en-IN': (name: string, lessonTitle: string) =>
      `${name}, great job! Now let us learn to use mobile phones easily. Let us start with "${lessonTitle}".`,
    'hi-IN': (name: string, lessonTitle: string) =>
      `${name}, शानदार! अब हम मोबाइल फोन का इस्तेमाल आसानी से सीखेंगे। चलिए शुरू करते हैं "${lessonTitle}"।`,
  },
};

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 'pq_apps',
    concept: 'Using Apps like WhatsApp or YouTube',
    prompts: {
      'ta-IN': 'கைப்பேசியில் வாட்ஸ்அப் அல்லது யூடியூப் போன்ற செயலிகளைத் திறந்து பயன்படுத்த உங்களுக்குத் தெரியுமா?',
      'en-IN': 'Do you know how to open and use apps like WhatsApp or YouTube on a mobile phone?',
      'hi-IN': 'क्या आप मोबाइल में व्हाट्सएप या यूट्यूब जैसे ऐप्स खोलकर चलाना जानते हैं?',
    },
  },
  {
    id: 'pq_search',
    concept: 'Searching on Internet or Voice Search',
    prompts: {
      'ta-IN': 'இணையத்தில் கூகுள் அல்லது மைக் மூலம் தகவல் அல்லது பாடல்களைத் தேடத் தெரியுமா?',
      'en-IN': 'Do you know how to search for information or songs on the internet using Google or voice search?',
      'hi-IN': 'क्या आप गूगल या माइक से इंटरनेट पर जानकारी या गाने खोजना जानते हैं?',
    },
  },
  {
    id: 'pq_payments',
    concept: 'Using Digital Payments (UPI / GPay / PhonePe)',
    prompts: {
      'ta-IN': 'கூகுள் பே அல்லது போன்பே மூலம் கடைகளில் பணப் பரிவர்த்தனை செய்திருக்கிறீர்களா?',
      'en-IN': 'Have you ever made a payment in shops using Google Pay, PhonePe, or UPI?',
      'hi-IN': 'क्या आपने कभी दुकानों में गूगल पे, फोनपे या यूपीआई से पैसे भेजे हैं?',
    },
  },
  {
    id: 'pq_otp_pin',
    concept: 'Understanding OTP and PIN differences and safety',
    prompts: {
      'ta-IN': 'ஓடிபி மற்றும் ரகசிய பின் எண் என்றால் என்ன, அதை யாரிடமும் சொல்லக்கூடாது என்பது உங்களுக்குத் தெரியுமா?',
      'en-IN': 'Do you know what an OTP and secret PIN are, and that you must NEVER share them with anyone?',
      'hi-IN': 'क्या आप जानते हैं कि ओटीपी और गुप्त पिन क्या हैं, और इन्हें किसी को भी नहीं बताना चाहिए?',
    },
  },
  {
    id: 'pq_scams',
    concept: 'Identifying suspicious calls and lottery messages',
    prompts: {
      'ta-IN': 'பரிசு விழுந்தது என்று வரும் போலி அழைப்புகள் அல்லது சந்தேகத்திற்குரிய குறுஞ்செய்திகளை நீங்கள் அடையாளம் காண்கிறீர்களா?',
      'en-IN': 'Can you identify fake lottery calls or suspicious prize messages that scammers send?',
      'hi-IN': 'क्या आप लॉटरी या इनाम के फर्जी कॉल और संदिग्ध मैसेज को पहचान सकते हैं?',
    },
  },
];

export const LESSONS: Lesson[] = [
  {
    id: 'lesson_basics',
    title: {
      'ta-IN': 'கைப்பேசி அடிப்படைகள் & தொடுதிரை',
      'en-IN': 'Smartphone Basics & Touchscreen',
      'hi-IN': 'स्मार्टफोन बेसिक्स और टचस्क्रीन',
    },
    description: {
      'ta-IN': 'கைப்பேசியைப் பிடிப்பது, தொடுவது மற்றும் செயலிகளைத் திறப்பது எப்படி என்று கற்றுக் கொள்ளுங்கள்.',
      'en-IN': 'Learn how to hold, tap, and open applications on your smartphone.',
      'hi-IN': 'स्मार्टफोन पकड़ना, स्क्रीन छूना और ऐप्स खोलना सीखें।',
    },
    category: 'smartphone_basics',
    level: 'BEGINNER',
    steps: [
      {
        id: 'basics_step_1',
        title: {
          'ta-IN': 'தொடுதிரை (Tap)',
          'en-IN': 'Screen Tap',
          'hi-IN': 'स्क्रीन टैप',
        },
        characterSpeech: {
          'ta-IN': 'உங்கள் கைப்பேசியில் விரலை மெதுவாக ஒருமுறை தொட்டு எடுப்பதே "டேப்" (Tap) எனப்படும். திரையில் உள்ள பச்சை பட்டனைத் தொட்டுப் பாருங்கள்!',
          'en-IN': 'Gently touching the glass once with your finger is called a "Tap". Try tapping the green button on the screen!',
          'hi-IN': 'उंगली से स्क्रीन को हल्के से एक बार छूने को "टैप" कहते हैं। स्क्रीन पर हरे बटन को छूकर देखें!',
        },
        interactiveType: 'tap_target',
        instructionText: {
          'ta-IN': 'பச்சை நிற பொத்தானைத் தொடவும்',
          'en-IN': 'Tap the green button',
          'hi-IN': 'हरे बटन को टैप करें',
        },
      },
      {
        id: 'basics_step_2',
        title: {
          'ta-IN': 'செயலிகள் (Apps)',
          'en-IN': 'Applications (Apps)',
          'hi-IN': 'ऐप्स (Applications)',
        },
        characterSpeech: {
          'ta-IN': 'செயலிகள் என்பது நமது தேவைகளுக்கான சிறு கருவிகள். உதாரணமாக, வாட்ஸ்அப் என்பது செய்திகளை அனுப்பவும் பேசவும் உதவும். நீங்கள் வாட்ஸ்அப் பயன்படுத்த விரும்புகிறீர்களா? ஆம் அல்லது இல்லை என்று சொல்லுங்கள்.',
          'en-IN': 'Apps are small tools on your phone. For example, WhatsApp helps you chat and call. Would you like to use WhatsApp? Say yes or no.',
          'hi-IN': 'ऐप्स मोबाइल के छोटे उपकरण होते हैं। जैसे व्हाट्सएप बात करने में मदद करता है। क्या आप व्हाट्सएप का उपयोग करना चाहते हैं? हाँ या नहीं कहें।',
        },
        interactiveType: 'voice_confirm',
        instructionText: {
          'ta-IN': '"ஆம்" அல்லது "இல்லை" என்று சொல்லுங்கள்',
          'en-IN': 'Say "Yes" or "No"',
          'hi-IN': '"हाँ" या "नहीं" कहें',
        },
        expectedAnswer: 'any',
      },
      {
        id: 'basics_step_3',
        title: {
          'ta-IN': 'முகப்பு திரை (Home Screen)',
          'en-IN': 'Home Screen',
          'hi-IN': 'होम स्क्रीन',
        },
        characterSpeech: {
          'ta-IN': 'எந்த செயலியிலும் சிக்கிக்கொண்டால், கீழே உள்ள வட்ட பொத்தானைத் தொட்டால் நீங்கள் உங்கள் முகப்புப் பக்கத்திற்கு வந்துவிடலாம். பயப்படாமல் தொடர "அடுத்தது" என்று சொல்லுங்கள்.',
          'en-IN': 'If you ever get stuck inside an app, touching the middle home button brings you right back. Say "Next" to complete this lesson.',
          'hi-IN': 'अगर कभी किसी ऐप में अटक जाएं, तो नीचे का गोल बटन दबाकर सीधे होम स्क्रीन पर आ सकते हैं। आगे बढ़ने के लिए "अगला" कहें।',
        },
        interactiveType: 'info',
        instructionText: {
          'ta-IN': '"அடுத்தது" என்று சொல்லுங்கள் அல்லது தொடரவும்',
          'en-IN': 'Say "Next" or continue',
          'hi-IN': '"अगला" कहें',
        },
      },
    ],
  },
  {
    id: 'lesson_upi_safety',
    title: {
      'ta-IN': 'பாதுகாப்பான டிஜிட்டல் பரிவர்த்தனை & UPI',
      'en-IN': 'Safe Digital Payments & UPI',
      'hi-IN': 'सुरक्षित डिजिटल भुगतान और यूपीआई',
    },
    description: {
      'ta-IN': 'கியூஆர் குறியீடு (QR Code) மூலம் பணம் அனுப்புவது மற்றும் பின் எண்ணை பாதுகாப்பது.',
      'en-IN': 'Learn QR code payments and how to keep your secret PIN safe.',
      'hi-IN': 'क्यूआर कोड से पैसे भेजना और अपना गुप्त पिन सुरक्षित रखना सीखें।',
    },
    category: 'upi_payments',
    level: 'INTERMEDIATE',
    steps: [
      {
        id: 'upi_step_1',
        title: {
          'ta-IN': 'QR குறியீட்டை ஸ்கேன் செய்வது',
          'en-IN': 'Scanning a QR Code',
          'hi-IN': 'क्यूआर कोड स्कैन करना',
        },
        characterSpeech: {
          'ta-IN': 'கடைகளில் கருப்பு வெள்ளை சதுர படம் பார்த்திருப்பீர்கள், அதுதான் QR Code. கேமராவைக் காட்டினால் கடைக்காரரின் பெயர் திரையில் தெரியும். நீங்கள் கடைக்காரரின் பெயரைப் பார்த்து சரிபார்க்க வேண்டும். புரிகிறதா? "புரிகிறது" அல்லது "ஆம்" என்று சொல்லுங்கள்.',
          'en-IN': 'You must have seen the black and white square at shops; that is a QR Code. When your camera points to it, the shopkeeper name appears. You must always verify the name before paying. Understand? Say "Yes".',
          'hi-IN': 'दुकानों पर आपने काले-सफेद चौकोर चित्र देखे होंगे, इसे क्यूआर कोड कहते हैं। कैमरा दिखाने पर दुकानदार का नाम दिखता है। पैसे भेजने से पहले नाम जांचना ज़रूरी है। समझ आया? "हाँ" कहें।',
        },
        interactiveType: 'voice_confirm',
        instructionText: {
          'ta-IN': '"ஆம்" அல்லது "புரிகிறது" என்று சொல்லுங்கள்',
          'en-IN': 'Say "Yes" to confirm',
          'hi-IN': '"हाँ" कहें',
        },
        expectedAnswer: 'yes',
      },
      {
        id: 'upi_step_2',
        title: {
          'ta-IN': 'UPI PIN — மிக முக்கியமான ரகசியம்!',
          'en-IN': 'UPI PIN — Top Secret Rule!',
          'hi-IN': 'यूपीआई पिन — सबसे बड़ा गुप्त नियम!',
        },
        characterSpeech: {
          'ta-IN': 'கவனமாக கேளுங்கள்: நீங்கள் பணம் பிறருக்கு "அனுப்பும் போது மட்டுமே" உங்கள் UPI PIN அடிக்க வேண்டும். பணம் பெறவோ, பரிசு வாங்கவோ PIN தேவையில்லை! யாராவது பணம் பெற PIN கேட்டால் தருவீர்களா? ஆம் அல்லது இல்லை என்று சொல்லுங்கள்!',
          'en-IN': 'Listen carefully: You enter your UPI PIN ONLY when SENDING money. You NEVER need a PIN to receive money or lottery! If someone asks for your PIN to send you money, will you give it? Say yes or no!',
          'hi-IN': 'ध्यान से सुनें: यूपीआई पिन केवल पैसे "भेजते समय" डाला जाता है। पैसे प्राप्त करने या इनाम पाने के लिए पिन की कभी ज़रूरत नहीं होती! अगर कोई पैसे भेजने के लिए पिन माँगे, तो क्या आप देंगे? हाँ या नहीं कहें!',
        },
        interactiveType: 'voice_confirm',
        instructionText: {
          'ta-IN': '"இல்லை" என்று சொல்லுங்கள் (சரியான பாதுகாப்பு பதில்)',
          'en-IN': 'Say "No" (The safe safety answer)',
          'hi-IN': '"नहीं" कहें (सही और सुरक्षित उत्तर)',
        },
        expectedAnswer: 'no',
        safetyTip: {
          'ta-IN': 'விதி: பணம் பெற PIN தேவையில்லை. உங்கள் PIN யாருக்கும் தெரியக்கூடாது!',
          'en-IN': 'Golden Rule: Never enter PIN to receive money. Keep your PIN private!',
          'hi-IN': 'सुनहरा नियम: पैसे लेने के लिए कभी पिन न डालें। अपना पिन गुप्त रखें!',
        },
      },
      {
        id: 'upi_step_3',
        title: {
          'ta-IN': 'பணம் செலுத்தும் ஒத்திகை',
          'en-IN': 'Payment Simulation Check',
          'hi-IN': 'भुगतान का अभ्यास',
        },
        characterSpeech: {
          'ta-IN': 'மிக அருமை! நீங்கள் பாதுகாப்பின் மிக முக்கியமான விதியைப் புரிந்துகொண்டீர்கள். திரையில் உள்ள பச்சை பட்டனைத் தொட்டு ஒரு ரூபாய் அனுப்பும் மாதிரி பயிற்சியை நிறைவு செய்யுங்கள்.',
          'en-IN': 'Excellent! You understood the most crucial safety rule. Tap the green button to finish this practice payment.',
          'hi-IN': 'बहुत बढ़िया! आपने सुरक्षा का सबसे महत्वपूर्ण नियम समझ लिया। इस अभ्यास को पूरा करने के लिए स्क्रीन पर हरे बटन को टैप करें।',
        },
        interactiveType: 'tap_target',
        instructionText: {
          'ta-IN': 'மாதிரி பணப் பரிவர்த்தனையை முடிக்க பச்சை பட்டனைத் தொடவும்',
          'en-IN': 'Tap the green button to complete the simulation',
          'hi-IN': 'अभ्यास पूरा करने के लिए हरा बटन दबाएं',
        },
      },
    ],
  },
  {
    id: 'lesson_online_safety',
    title: {
      'ta-IN': 'OTP மற்றும் போலி அழைப்புகள் — சைபர் பாதுகாப்பு',
      'en-IN': 'OTP & Scam Calls — Cyber Safety',
      'hi-IN': 'ओटीपी और फर्जी कॉल — साइबर सुरक्षा',
    },
    description: {
      'ta-IN': 'வங்கி அதிகாரிகள் கூட OTP கேட்க மாட்டார்கள். ஏமாற்றுபவர்களிடமிருந்து பணத்தைப் பாதுகாப்பது எப்படி.',
      'en-IN': 'Even bank officials never ask for OTP. Learn how to protect your money from scammers.',
      'hi-IN': 'बैंक वाले भी कभी ओटीपी नहीं माँगते। धोखेबाज़ों से अपने पैसे बचाना सीखें।',
    },
    category: 'online_safety',
    level: 'SAFETY_READY',
    steps: [
      {
        id: 'safety_step_1',
        title: {
          'ta-IN': 'OTP என்றால் என்ன?',
          'en-IN': 'What is an OTP?',
          'hi-IN': 'ओटीपी क्या है?',
        },
        characterSpeech: {
          'ta-IN': 'OTP என்பது உங்கள் கைப்பேசிக்கு வரும் 4 அல்லது 6 இலக்க ரகசிய சாவி. இது உங்கள் வீட்டுப் பூட்டின் சாவி போன்றது. உங்கள் வீட்டுச் சாவியை யாராவது தெருவில் கேட்பவருக்குத் தருவீர்களா? மாட்டீர்கள் அல்லவா! அதேபோல் OTP-ஐ எவருக்கும் பகிரக்கூடாது.',
          'en-IN': 'An OTP is a 4 or 6 digit secret key sent to your phone. It is like the key to your front door. Would you hand your house key to a stranger on the road? Never! Similarly, never share your OTP with anyone.',
          'hi-IN': 'ओटीपी आपके फोन पर आने वाली 4 या 6 अंकों की गुप्त चाबी है। यह आपके घर के ताले की चाबी जैसी है। क्या आप सड़क पर किसी अनजान को चाबी देंगे? कभी नहीं! वैसे ही ओटीपी किसी से साझा न करें।',
        },
        interactiveType: 'info',
        instructionText: {
          'ta-IN': '"அடுத்தது" என்று சொல்லுங்கள்',
          'en-IN': 'Say "Next"',
          'hi-IN': '"अगला" कहें',
        },
      },
      {
        id: 'safety_step_2',
        title: {
          'ta-IN': 'போலி மேனேஜர் அழைப்பு பயிற்சி',
          'en-IN': 'Fake Bank Manager Call Challenge',
          'hi-IN': 'फर्जी बैंक मैनेजर कॉल चैलेंज',
        },
        characterSpeech: {
          'ta-IN': 'இப்போது ஒரு பயிற்சி: "வணக்கம், நான் உங்கள் வங்கி மேனேஜர் பேசுகிறேன். உங்கள் கணக்கு மூடப்படாமல் இருக்க உங்கள் OTP-ஐ உடனே சொல்லுங்கள்" என்று ஒருவர் போனில் மிரட்டினால், நீங்கள் OTP சொல்வீர்களா? ஆம் அல்லது இல்லை என்று சொல்லுங்கள்!',
          'en-IN': 'Now a challenge: "Hello, I am your bank manager calling. Tell me your OTP immediately or your account will be blocked!" If someone threatens like this, will you tell the OTP? Say yes or no!',
          'hi-IN': 'अब एक चुनौती: "नमस्ते, मैं आपका बैंक मैनेजर बोल रहा हूँ। अपना ओटीपी तुरंत बताइए वरना आपका खाता बंद हो जाएगा!" क्या आप ओटीपी बताएंगे? हाँ या नहीं कहें!',
        },
        interactiveType: 'voice_confirm',
        instructionText: {
          'ta-IN': '"இல்லை" என்று சொல்லுங்கள் (சரியான பதில்)',
          'en-IN': 'Say "No" (The correct answer)',
          'hi-IN': '"नहीं" कहें (सही उत्तर)',
        },
        expectedAnswer: 'no',
        safetyTip: {
          'ta-IN': 'எந்த வங்கியும், எந்த அதிகாரியும் ஒருபோதும் OTP கேட்க மாட்டார்கள்!',
          'en-IN': 'No bank or police officer will EVER ask for your OTP!',
          'hi-IN': 'कोई भी बैंक या पुलिस वाला कभी आपसे ओटीपी नहीं माँगेगा!',
        },
      },
    ],
  },
];

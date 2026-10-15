import { WhatsAppSegmentId } from '@/types';

export interface WhatsAppLessonMeta {
  id: WhatsAppSegmentId;
  code: string;
  number: number;
  title: {
    en: string;
    ta: string;
    hi: string;
  };
  subtitle: {
    en: string;
    ta: string;
    hi: string;
  };
  description: {
    en: string;
    ta: string;
    hi: string;
  };
  durationMin: number;
  skills: {
    en: string[];
    ta: string[];
    hi: string[];
  };
}

export const WHATSAPP_LESSONS_CATALOG: Record<WhatsAppSegmentId, WhatsAppLessonMeta> = {
  W0: {
    id: 'W0',
    code: 'W0',
    number: 0,
    title: {
      en: 'W0 — WhatsApp Home Page Tour',
      ta: 'W0 — வாட்ஸ்அப் முகப்பு பக்க அறிமுகம்',
      hi: 'W0 — व्हाट्सएप होम पेज परिचय',
    },
    subtitle: {
      en: 'WhatsApp Home Page Tour',
      ta: 'முகப்பு பக்க அறிமுகம்',
      hi: 'होम पेज परिचय',
    },
    description: {
      en: 'Get comfortable with the WhatsApp home screen, chat list, search, and navigation.',
      ta: 'அரட்டை பட்டியல், தேடல் மற்றும் புதிய அரட்டை பொத்தான் ஆகியவற்றின் பயன்பாட்டை அறிக.',
      hi: 'चैट सूची, सर्च बार और नए चैट बटन के साथ मुख्य स्क्रीन को समझें।',
    },
    durationMin: 2,
    skills: {
      en: ['Chat list', 'Search bar', 'New chat FAB'],
      ta: ['அரட்டை பட்டியல்', 'தேடல் வசதி', 'புதிய அரட்டை'],
      hi: ['चैट सूची', 'सर्च बार', 'नया चैट'],
    },
  },
  W1: {
    id: 'W1',
    code: 'W1',
    number: 1,
    title: {
      en: 'W1 — Save a Contact by Number',
      ta: 'W1 — புதிய தொடர்பைச் சேமித்தல்',
      hi: 'W1 — नया संपर्क नंबर सहेजना',
    },
    subtitle: {
      en: 'Save a Contact by Number',
      ta: 'புதிய தொடர்பைச் சேமித்தல்',
      hi: 'नया संपर्क नंबर सहेजना',
    },
    description: {
      en: 'Add a new phone number to your contact book so you can message them anytime.',
      ta: 'புதிய தொலைபேசி எண்ணை தொடர்புகளில் பாதுகாப்பாக சேமிக்க கற்றுக் கொள்ளுங்கள்.',
      hi: 'फोनबुक में नया मोबाइल नंबर और नाम सुरक्षित रूप से सहेजना सीखें।',
    },
    durationMin: 3,
    skills: {
      en: ['New Contact', 'Typing name & number', 'Saving to phonebook'],
      ta: ['புதிய தொடர்பு', 'பெயர் & எண் தட்டச்சு', 'சேமித்தல்'],
      hi: ['नया संपर्क', 'नाम और नंबर टाइप', 'सहेजना'],
    },
  },
  W2: {
    id: 'W2',
    code: 'W2',
    number: 2,
    title: {
      en: 'W2 — Send a Message in Chat',
      ta: 'W2 — செய்தி தட்டச்சு செய்து அனுப்புதல்',
      hi: 'W2 — संदेश टाइप करना और भेजना',
    },
    subtitle: {
      en: 'Send a Message in Chat',
      ta: 'செய்தி தட்டச்சு செய்து அனுப்புதல்',
      hi: 'संदेश टाइप करना और भेजना',
    },
    description: {
      en: 'Open a chat conversation, type a friendly greeting on the keyboard, and hit Send.',
      ta: 'அரட்டையைத் திறந்து விசைப்பலகை மூலம் செய்தி தட்டச்சு செய்து அனுப்பவும்.',
      hi: 'चैट खोलें, कीबोर्ड पर संदेश लिखें और सेंड बटन दबाएं।',
    },
    durationMin: 3,
    skills: {
      en: ['Open chat', 'On-screen typing', 'Send button', 'Read replies'],
      ta: ['அரட்டை திறத்தல்', 'தட்டச்சு செய்தல்', 'அனுப்புதல்', 'பதில் பார்த்தல்'],
      hi: ['चैट खोलना', 'कीबोर्ड टाइपिंग', 'सेंड बटन', 'जवाब देखना'],
    },
  },
  W3: {
    id: 'W3',
    code: 'W3',
    number: 3,
    title: {
      en: 'W3 — Send a Voice Note',
      ta: 'W3 — குரல் செய்தி அனுப்புதல்',
      hi: 'W3 — वॉइस संदेश भेजना',
    },
    subtitle: {
      en: 'Send a Voice Note',
      ta: 'குரல் செய்தி அனுப்புதல்',
      hi: 'वॉइस संदेश भेजना',
    },
    description: {
      en: 'Hold down the microphone button to record your voice and release to send easily.',
      ta: 'மைக் பொத்தானை அழுத்திப் பிடித்து உங்கள் குரலைப் பதிவு செய்து அனுப்பவும்.',
      hi: 'माइक बटन को दबाकर रखें, अपनी आवाज रिकॉर्ड करें और छोड़ते ही भेजें।',
    },
    durationMin: 2,
    skills: {
      en: ['Press & hold mic', '3-second recording', 'Voice playback'],
      ta: ['மைக் அழுத்திப் பிடித்தல்', '3 விநாடி பதிவு', 'குரல் கேட்பது'],
      hi: ['माइक दबाकर रखना', '3 सेकंड रिकॉर्डिंग', 'वॉइस सुनना'],
    },
  },
  W4: {
    id: 'W4',
    code: 'W4',
    number: 4,
    title: {
      en: 'W4 — Send a Photo from Gallery',
      ta: 'W4 — புகைப்படம் அனுப்புதல்',
      hi: 'W4 — फोटो भेजना',
    },
    subtitle: {
      en: 'Send a Photo from Gallery',
      ta: 'புகைப்படம் அனுப்புதல்',
      hi: 'फोटो भेजना',
    },
    description: {
      en: 'Tap the paperclip attachment, select a photo from your gallery, and send it.',
      ta: 'பேப்பர் கிளிப்பைத் தொட்டு கேலரியில் உள்ள படத்தை தேர்வு செய்து பகிரவும்.',
      hi: 'पेपरक्लिप आइकन दबाएं, गैलरी से फोटो चुनें और आसानी से साझा करें।',
    },
    durationMin: 3,
    skills: {
      en: ['Attachment paperclip', 'Gallery picker', 'Photo preview', 'Send image'],
      ta: ['இணைப்பு குறியீடு', 'கேலரி தேர்வு', 'முன்னோட்டம்', 'படம் அனுப்புதல்'],
      hi: ['अटैचमेंट पेपरक्लिप', 'गैलरी चयन', 'फोटो प्रीव्यू', 'फोटो भेजना'],
    },
  },
  W5: {
    id: 'W5',
    code: 'W5',
    number: 5,
    title: {
      en: 'W5 — Share Live Location Safely',
      ta: 'W5 — இருப்பிடம் பகிர்தல்',
      hi: 'W5 — लोकेशन भेजना',
    },
    subtitle: {
      en: 'Share Live Location Safely',
      ta: 'இருப்பிடம் பகிர்தல்',
      hi: 'लोकेशन भेजना',
    },
    description: {
      en: 'Share your real-time location safely and only with people and family you trust.',
      ta: 'நீங்கள் இருக்கும் இடத்தை நம்பகமான குடும்பத்தினர் மற்றும் நண்பர்களுக்கு பகிரவும்.',
      hi: 'सुरक्षित रूप से केवल विश्वसनीय परिवार और दोस्तों के साथ लोकेशन साझा करें।',
    },
    durationMin: 2,
    skills: {
      en: ['Location attachment', 'Safety caution', 'Trusted contacts only'],
      ta: ['இருப்பிடப் பகிர்வு', 'பாதுகாப்பு விழிப்புணர்வு', 'நம்பகமானவர்கள்'],
      hi: ['लोकेशन अटैचमेंट', 'सुरक्षा नियम', 'भरोसेमंद संपर्क'],
    },
  },
  W6: {
    id: 'W6',
    code: 'W6',
    number: 6,
    title: {
      en: 'W6 — Make, Accept, and Mute Calls',
      ta: 'W6 — அழைப்பு செய்தல் & கட்டுப்பாடுகள்',
      hi: 'W6 — कॉल करना और नियंत्रण',
    },
    subtitle: {
      en: 'Make, Accept, and Mute Calls',
      ta: 'அழைப்பு செய்தல் & கட்டுப்பாடுகள்',
      hi: 'कॉल करना और नियंत्रण',
    },
    description: {
      en: 'Start voice calls and master essential controls: mute, speaker, and hanging up.',
      ta: 'ஆடியோ அழைப்பைத் தொடங்கி மைக் மியூட், ஸ்பீக்கர் மற்றும் அழைப்பை முடிக்க அறிக.',
      hi: 'ऑडियो कॉल शुरू करें और म्यूट, स्पीकर व कॉल काटने के नियंत्रण सीखें।',
    },
    durationMin: 3,
    skills: {
      en: ['Audio call', 'Microphone mute', 'Speakerphone', 'End call'],
      ta: ['ஆடியோ அழைப்பு', 'மைக் மியூட்', 'ஸ்பீக்கர்', 'அழைப்பு முடித்தல்'],
      hi: ['ऑडियो कॉल', 'माइक म्यूट', 'लाउडस्पीकर', 'कॉल समाप्त'],
    },
  },
  W7: {
    id: 'W7',
    code: 'W7',
    number: 7,
    title: {
      en: 'W7 — Scam Call Safety Drill',
      ta: 'W7 — மோசடி அழைப்பு பாதுகாப்பு பயிற்சி',
      hi: 'W7 — कॉल उठाना और फ्रॉड से बचाव',
    },
    subtitle: {
      en: 'Scam Call Safety Drill',
      ta: 'மோசடி அழைப்பு பாதுகாப்பு பயிற்சி',
      hi: 'कॉल उठाना और फ्रॉड से बचाव',
    },
    description: {
      en: 'Identify suspicious callers asking for screen share and decline them immediately.',
      ta: 'திரைப் பகிர்வு கேட்கும் போலி மோசடி அழைப்புகளை உடனடியாக நிராகரிக்க பழகவும்.',
      hi: 'स्क्रीन शेयर मांगने वाले संदिग्ध कॉलर्स को पहचानें और तुरंत डिक्लाइन करें।',
    },
    durationMin: 3,
    skills: {
      en: ['Answer call', 'Scam alert recognition', 'Decline screen share', 'OTP safety'],
      ta: ['அழைப்பு ஏற்றல்', 'மோசடி எச்சரிக்கை', 'திரைப்பகிர்வு தவிர்த்தல்', 'OTP பாதுகாப்பு'],
      hi: ['कॉल उठाना', 'फ्रॉड अलर्ट पहचान', 'स्क्रीन शेयर डिक्लाइन', 'ओटीपी सुरक्षा'],
    },
  },
};

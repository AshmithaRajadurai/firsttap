// Chat App Lesson Track W0 to W7 (Segments with DEMO, PRACTICE, DONE)
// Tamil and Hindi lines: // REVIEW by native speaker

export interface ChatSegmentStep {
  id: string;
  say: {
    en: string;
    ta: string; // REVIEW by native speaker
    hi: string; // REVIEW by native speaker
  };
  do: 'point' | 'tap' | 'type' | 'hold';
  target: string;
  textToType?: string;
  duration?: number;
}

export interface ChatSegment {
  id: 'W0' | 'W1' | 'W2' | 'W3' | 'W4' | 'W5' | 'W6' | 'W7';
  code: string;
  title: {
    en: string;
    ta: string; // REVIEW by native speaker
    hi: string; // REVIEW by native speaker
  };
  doneTitle: {
    en: string;
    ta: string; // REVIEW by native speaker
    hi: string; // REVIEW by native speaker
  };
  steps: ChatSegmentStep[];
}

export const CHAT_SEGMENTS: ChatSegment[] = [
  // W0: Home page tour
  {
    id: 'W0',
    code: 'W0',
    title: {
      en: 'W0: Home Page Tour',
      ta: 'W0: முகப்பு பக்க அறிமுகம்', // REVIEW by native speaker
      hi: 'W0: होम पेज परिचय', // REVIEW by native speaker
    },
    doneTitle: {
      en: 'Well done, you learned the chat app home page.',
      ta: 'அருமை! அரட்டை செயலியின் முகப்பு பக்கத்தை அறிந்து கொண்டீர்கள்.', // REVIEW by native speaker
      hi: 'शाबाश! आपने चैट ऐप का होम पेज समझ लिया है।', // REVIEW by native speaker
    },
    steps: [
      {
        id: 'w0_step_1_intro',
        say: {
          en: 'This is the home page of the chat app. Here is the list of your chats.',
          ta: 'இது அரட்டை செயலியின் முகப்பு பக்கம். இங்கு உங்கள் அரட்டைகள் உள்ளன.', // REVIEW by native speaker
          hi: 'यह चैट ऐप का मुख्य पृष्ठ है। यहाँ आपकी चैट सूची है।', // REVIEW by native speaker
        },
        do: 'point',
        target: 'chat-list',
        duration: 3200,
      },
      {
        id: 'w0_step_2_chat_row',
        say: {
          en: 'Here is one chat row showing the name and last message.',
          ta: 'இங்கே ஒரு அரட்டை வரிசை உள்ளது, இதில் பெயரும் கடைசி செய்தியும் தெரியும்.', // REVIEW by native speaker
          hi: 'यहाँ एक चैट पंक्ति है जिसमें नाम और अंतिम संदेश दिखता है।', // REVIEW by native speaker
        },
        do: 'point',
        target: 'chat-row-first',
        duration: 2800,
      },
      {
        id: 'w0_step_3_search_icon',
        say: {
          en: 'Use this search icon to quickly find any contact by name or number.',
          ta: 'பெயர் அல்லது எண்ணை வைத்து எளிதில் தேட இந்த தேடல் குறியீட்டைப் பயன்படுத்தவும்.', // REVIEW by native speaker
          hi: 'किसी भी संपर्क को नाम या नंबर से खोजने के लिए इस सर्च आइकन का उपयोग करें।', // REVIEW by native speaker
        },
        do: 'point',
        target: 'search-icon',
        duration: 2600,
      },
      {
        id: 'w0_step_4_new_chat_btn',
        say: {
          en: 'Tap this green button to start a new chat or save a contact.',
          ta: 'புதிய அரட்டையைத் தொடங்க அல்லது தொடர்பு சேமிக்க இந்த பச்சை பொத்தானைத் தொடவும்.', // REVIEW by native speaker
          hi: 'नई चैट शुरू करने या संपर्क सहेजने के लिए इस हरे बटन पर टैप करें।', // REVIEW by native speaker
        },
        do: 'point',
        target: 'new-chat-btn',
        duration: 2800,
      },
    ],
  },

  // W1: Save a contact by number
  {
    id: 'W1',
    code: 'W1',
    title: {
      en: 'W1: Save a Contact by Number',
      ta: 'W1: புதிய தொடர்பைச் சேமித்தல்', // REVIEW by native speaker
      hi: 'W1: नया संपर्क नंबर सहेजना', // REVIEW by native speaker
    },
    doneTitle: {
      en: 'Now you have learned how to save a contact.',
      ta: 'இப்போது நீங்கள் புதிய தொடர்பைச் சேமிக்க கற்றுக் கொண்டீர்கள்.', // REVIEW by native speaker
      hi: 'अब आपने संपर्क सहेजना सीख लिया है।', // REVIEW by native speaker
    },
    steps: [
      {
        id: 'w1_step_1_new_chat',
        say: {
          en: 'First, tap the green new chat button at the bottom.',
          ta: 'முதலில் கீழே உள்ள பச்சை நிற புதிய அரட்டை பொத்தானைத் தொடவும்.', // REVIEW by native speaker
          hi: 'पहले नीचे दिए गए हरे नए चैट बटन पर टैप करें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'new-chat-btn',
        duration: 2000,
      },
      {
        id: 'w1_step_2_new_contact',
        say: {
          en: 'Tap New contact to add a person to your phonebook.',
          ta: 'புதிய நபரை சேர்க்க New contact என்பதைத் தொடவும்.', // REVIEW by native speaker
          hi: 'नया व्यक्ति जोड़ने के लिए New contact पर टैप करें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'new-contact-btn',
        duration: 2000,
      },
      {
        id: 'w1_step_3_type_name',
        say: {
          en: 'Type the contact name: Lakshmi.',
          ta: 'லக்ஷ்மி என்று பெயர் தட்டச்சு செய்யவும்.', // REVIEW by native speaker
          hi: 'संपर्क का नाम Lakshmi टाइप करें।', // REVIEW by native speaker
        },
        do: 'type',
        target: 'field-name',
        textToType: 'lakshmi',
        duration: 3000,
      },
      {
        id: 'w1_step_4_type_number',
        say: {
          en: 'Type the fictional number: 9000000001.',
          ta: 'மாதிரி எண் 9000000001 என தட்டச்சு செய்யவும்.', // REVIEW by native speaker
          hi: 'काल्पनिक नंबर 9000000001 टाइप करें।', // REVIEW by native speaker
        },
        do: 'type',
        target: 'field-number',
        textToType: '9000000001',
        duration: 3500,
      },
      {
        id: 'w1_step_5_save',
        say: {
          en: 'Now tap Save. The contact is saved and appears in your list.',
          ta: 'இப்போது Save என்பதைத் தொடவும். தொடர்பு சேமிக்கப்படும்.', // REVIEW by native speaker
          hi: 'अब Save दबाएं। संपर्क सहेज लिया जाएगा।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'save-contact',
        duration: 2400,
      },
    ],
  },

  // W2: Type a message
  {
    id: 'W2',
    code: 'W2',
    title: {
      en: 'W2: Type and Send a Message',
      ta: 'W2: செய்தி தட்டச்சு செய்து அனுப்புதல்', // REVIEW by native speaker
      hi: 'W2: संदेश टाइप करना और भेजना', // REVIEW by native speaker
    },
    doneTitle: {
      en: 'Well done, you learned how to type and send a message.',
      ta: 'அருமை! செய்தி தட்டச்சு செய்து அனுப்ப கற்றுக் கொண்டீர்கள்.', // REVIEW by native speaker
      hi: 'शाबाश! आपने संदेश लिखना और भेजना सीख लिया है।', // REVIEW by native speaker
    },
    steps: [
      {
        id: 'w2_step_1_open_chat',
        say: {
          en: 'Tap Lakshmi in the chat list to open the conversation.',
          ta: 'அரட்டையைத் திறக்க பட்டியலில் உள்ள லக்ஷ்மியைத் தொடவும்.', // REVIEW by native speaker
          hi: 'चैट खोलने के लिए सूची में Lakshmi पर टैप करें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'chat-row-lakshmi',
        duration: 2000,
      },
      {
        id: 'w2_step_2_tap_input',
        say: {
          en: 'Tap the message box at the bottom to start typing.',
          ta: 'செய்தி பெட்டியைத் தொட்டு தட்டச்சு செய்யத் தொடங்குங்கள்.', // REVIEW by native speaker
          hi: 'लिखना शुरू करने के लिए नीचे मैसेज बॉक्स पर टैप करें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'msg-input',
        duration: 1800,
      },
      {
        id: 'w2_step_3_type_msg',
        say: {
          en: 'Type on the keyboard: "hi, how are you doing?"',
          ta: 'விசைப்பலகையில் "hi, how are you doing?" என்று தட்டச்சு செய்கிறேன்.', // REVIEW by native speaker
          hi: 'कीबोर्ड पर "hi, how are you doing?" टाइप करें।', // REVIEW by native speaker
        },
        do: 'type',
        target: 'msg-input',
        textToType: 'hi, how are you doing?',
        duration: 5500,
      },
      {
        id: 'w2_step_4_send',
        say: {
          en: 'Now tap the Send button to send the message.',
          ta: 'செய்தியை அனுப்ப Send பொத்தானைத் தொடவும்.', // REVIEW by native speaker
          hi: 'संदेश भेजने के लिए Send बटन पर टैप करें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'send-btn',
        duration: 2200,
      },
    ],
  },

  // W3: Voice message
  {
    id: 'W3',
    code: 'W3',
    title: {
      en: 'W3: Voice Message',
      ta: 'W3: குரல் செய்தி அனுப்புதல்', // REVIEW by native speaker
      hi: 'W3: वॉइस संदेश भेजना', // REVIEW by native speaker
    },
    doneTitle: {
      en: 'Well done, you learned how to send a voice message.',
      ta: 'அருமை! குரல் செய்தி அனுப்ப கற்றுக் கொண்டீர்கள்.', // REVIEW by native speaker
      hi: 'शाबाश! आपने वॉइस संदेश भेजना सीख लिया है।', // REVIEW by native speaker
    },
    steps: [
      {
        id: 'w3_step_1_hold_mic',
        say: {
          en: 'Press and hold the microphone button for 3 seconds to record your voice.',
          ta: 'குரல் செய்தியைப் பதிவு செய்ய மைக் பொத்தானை 3 விநாடிகள் அழுத்திப் பிடிக்கவும்.', // REVIEW by native speaker
          hi: 'आवाज रिकॉर्ड करने के लिए माइक बटन को 3 सेकंड दबाकर रखें।', // REVIEW by native speaker
        },
        do: 'hold',
        target: 'mic-btn',
        duration: 3200,
      },
    ],
  },

  // W4: Send a photo
  {
    id: 'W4',
    code: 'W4',
    title: {
      en: 'W4: Send a Photo',
      ta: 'W4: புகைப்படம் அனுப்புதல்', // REVIEW by native speaker
      hi: 'W4: फोटो भेजना', // REVIEW by native speaker
    },
    doneTitle: {
      en: 'Well done, you learned how to send a photo.',
      ta: 'அருமை! புகைப்படம் அனுப்ப கற்றுக் கொண்டீர்கள்.', // REVIEW by native speaker
      hi: 'शाबाश! आपने फोटो भेजना सीख लिया है।', // REVIEW by native speaker
    },
    steps: [
      {
        id: 'w4_step_1_paperclip',
        say: {
          en: 'Tap the paperclip icon to open the sharing options.',
          ta: 'பகிர்வு விருப்பங்களைத் திறக்க பேப்பர் கிளிப்பைத் தொடவும்.', // REVIEW by native speaker
          hi: 'शेयरिंग विकल्प खोलने के लिए पेपरक्लिप पर टैप करें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'attach-btn',
        duration: 2000,
      },
      {
        id: 'w4_step_2_photo',
        say: {
          en: 'Tap Photo to choose an image from your gallery.',
          ta: 'கேலரியிலிருந்து படத்தைத் தேர்ந்தெடுக்க Photo என்பதைத் தொடவும்.', // REVIEW by native speaker
          hi: 'फोटो चुनने के लिए Photo पर टैप करें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'attach-photo',
        duration: 2000,
      },
      {
        id: 'w4_step_3_choose_sample',
        say: {
          en: 'Select the sample photo.',
          ta: 'மாதிரி புகைப்படத்தைத் தேர்ந்தெடுக்கவும்.', // REVIEW by native speaker
          hi: 'नमूना फोटो चुनें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'photo-sample-1',
        duration: 2200,
      },
      {
        id: 'w4_step_4_send_photo',
        say: {
          en: 'Tap Send to share the photo.',
          ta: 'படத்தை அனுப்ப Send என்பதைத் தொடவும்.', // REVIEW by native speaker
          hi: 'फोटो भेजने के लिए Send पर टैप करें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'send-photo-btn',
        duration: 2200,
      },
    ],
  },

  // W5: Send location
  {
    id: 'W5',
    code: 'W5',
    title: {
      en: 'W5: Send Location',
      ta: 'W5: இருப்பிடம் பகிர்தல்', // REVIEW by native speaker
      hi: 'W5: लोकेशन भेजना', // REVIEW by native speaker
    },
    doneTitle: {
      en: 'Well done, you learned how to share your location safely.',
      ta: 'அருமை! இருப்பிடத்தைப் பாதுகாப்பாகப் பகிர கற்றுக் கொண்டீர்கள்.', // REVIEW by native speaker
      hi: 'शाबाश! आपने लोकेशन सुरक्षित रूप से साझा करना सीख लिया है।', // REVIEW by native speaker
    },
    steps: [
      {
        id: 'w5_step_1_paperclip',
        say: {
          en: 'Tap the paperclip icon in the message bar.',
          ta: 'செய்தி பட்டியில் உள்ள பேப்பர் கிளிப் குறியீட்டைத் தொடவும்.', // REVIEW by native speaker
          hi: 'मैसेज बार में पेपरक्लिप आइकन पर टैप करें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'attach-btn',
        duration: 2000,
      },
      {
        id: 'w5_step_2_location',
        say: {
          en: 'Tap Location to open the map options.',
          ta: 'இருப்பிடப் பகிர்வுக்கு Location என்பதைத் தொடவும்.', // REVIEW by native speaker
          hi: 'लोकेशन विकल्प खोलने के लिए Location पर टैप करें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'attach-location',
        duration: 2000,
      },
      {
        id: 'w5_step_3_send_loc',
        say: {
          en: 'Share your location only with people you trust.',
          ta: 'நம்பகமானவர்களுக்கு மட்டுமே இருப்பிடத்தை பகிரவும்.', // REVIEW by native speaker
          hi: 'केवल विश्वसनीय लोगों के साथ ही लोकेशन साझा करें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'send-location',
        duration: 2600,
      },
    ],
  },

  // W6: Make a call
  {
    id: 'W6',
    code: 'W6',
    title: {
      en: 'W6: Make a Call',
      ta: 'W6: அழைப்பு செய்தல்', // REVIEW by native speaker
      hi: 'W6: कॉल करना', // REVIEW by native speaker
    },
    doneTitle: {
      en: 'Well done, you learned how to use call controls.',
      ta: 'அருமை! அழைப்பு கட்டுப்பாடுகளைப் பயன்படுத்த கற்றுக் கொண்டீர்கள்.', // REVIEW by native speaker
      hi: 'शाबाश! आपने कॉल नियंत्रण का उपयोग करना सीख लिया है।', // REVIEW by native speaker
    },
    steps: [
      {
        id: 'w6_step_1_call_icon',
        say: {
          en: 'Tap the call icon at the top to start an audio call.',
          ta: 'அழைப்பைத் தொடங்க மேலே உள்ள தொலைபேசி ஐகானைத் தொடவும்.', // REVIEW by native speaker
          hi: 'कॉल शुरू करने के लिए ऊपर फोन आइकन पर टैप करें।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'call-icon',
        duration: 2400,
      },
      {
        id: 'w6_step_2_mute',
        say: {
          en: 'Mute: When muted, others cannot hear your background sounds.',
          ta: 'மைக் மியூட்: இதை அழுத்தினால் உங்கள் பக்கத்து சத்தம் மற்றவர்களுக்கு கேட்காது.', // REVIEW by native speaker
          hi: 'म्यूट: म्यूट होने पर दूसरी तरफ आपकी आवाज नहीं जाएगी।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'call-mute',
        duration: 2600,
      },
      {
        id: 'w6_step_3_video',
        say: {
          en: 'Video: Tap to turn your camera preview on or off.',
          ta: 'வீடியோ: கேமராவை ஆன் அல்லது ஆப் செய்ய இதைத் தொடலாம்.', // REVIEW by native speaker
          hi: 'वीडियो: कैमरा चालू या बंद करने के लिए इसे दबाएं।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'call-video',
        duration: 2600,
      },
      {
        id: 'w6_step_4_speaker',
        say: {
          en: 'Speaker: Switches between loud speaker and earpiece.',
          ta: 'ஸ்பீக்கர்: சத்தமாக கேட்க ஸ்பீக்கரை ஆன் செய்யலாம்.', // REVIEW by native speaker
          hi: 'स्पीकर: लाउडस्पीकर के लिए स्पीकर चालू करें।', // REVIEW by native speaker
        },
        do: 'point',
        target: 'call-speaker',
        duration: 2200,
      },
      {
        id: 'w6_step_5_share_screen',
        say: {
          en: 'Never share your screen with a stranger or a caller.',
          ta: 'தெரியாதவர்களிடம் ஒருபோதும் திரையைப் பகிரக் கூடாது.', // REVIEW by native speaker
          hi: 'अजनबियों या कॉल करने वालों के साथ कभी स्क्रीन शेयर न करें।', // REVIEW by native speaker
        },
        do: 'point',
        target: 'call-share-screen',
        duration: 2600,
      },
      {
        id: 'w6_step_6_end_call',
        say: {
          en: 'Tap the red button to end the call cleanly.',
          ta: 'அழைப்பை முடிக்க சிவப்பு பொத்தானைத் தொடவும்.', // REVIEW by native speaker
          hi: 'कॉल समाप्त करने के लिए लाल बटन दबाएं।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'call-end',
        duration: 2400,
      },
    ],
  },

  // W7: Answer a call & Scam drill
  {
    id: 'W7',
    code: 'W7',
    title: {
      en: 'W7: Answer Call & Scam Drill',
      ta: 'W7: அழைப்பை ஏற்றல் & மோசடி விழிப்புணர்வு', // REVIEW by native speaker
      hi: 'W7: कॉल उठाना और फ्रॉड से बचाव', // REVIEW by native speaker
    },
    doneTitle: {
      en: 'Well done, you learned how to answer calls and avoid screen-share scams.',
      ta: 'அருமை! அழைப்பை ஏற்கவும் திரைப்பகிர்வு மோசடியைத் தவிர்க்கவும் கற்றுக் கொண்டீர்கள்.', // REVIEW by native speaker
      hi: 'शाबाश! आपने कॉल उठाना और स्क्रीन शेयर फ्रॉड से बचना सीख लिया है।', // REVIEW by native speaker
    },
    steps: [
      {
        id: 'w7_step_1_answer',
        say: {
          en: 'Incoming call from Lakshmi. Tap green Answer to talk.',
          ta: 'லக்ஷ்மியிடமிருந்து அழைப்பு! ஏற்க பச்சை பொத்தானைத் தொடவும்.', // REVIEW by native speaker
          hi: 'Lakshmi की कॉल आई है। उठाने के लिए हरा बटन दबाएं।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'call-answer',
        duration: 2400,
      },
      {
        id: 'w7_step_2_end',
        say: {
          en: 'Tap the red button to hang up after speaking.',
          ta: 'பேசி முடித்ததும் முடிக்க சிவப்பு பொத்தானைத் தொடவும்.', // REVIEW by native speaker
          hi: 'कॉल काटने के लिए लाल बटन दबाएं।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'call-end',
        duration: 2200,
      },
      {
        id: 'w7_step_3_scam_alert',
        say: {
          en: 'Warning: An unknown caller is asking you to share your screen. Never do this!',
          ta: 'எச்சரிக்கை: தெரியாத நபர் திரையைப் பகிர சொல்கிறார். ஒருபோதும் செய்யக்கூடாது!', // REVIEW by native speaker
          hi: 'सावधान: अनजान व्यक्ति स्क्रीन शेयर करने को कह रहा है। ऐसा कभी न करें!', // REVIEW by native speaker
        },
        do: 'point',
        target: 'scam-call-alert',
        duration: 3200,
      },
      {
        id: 'w7_step_4_decline',
        say: {
          en: 'Tap Decline. Sharing your screen can show OTPs and PINs.',
          ta: 'Decline தொடவும். திரையைப் பகிர்ந்தால் ரகசிய OTP மற்றும் PIN தெரிந்துவிடும்.', // REVIEW by native speaker
          hi: 'डिक्लाइन दबाएं। स्क्रीन शेयर करने से आपके ओटीपी और पिन दिख सकते हैं।', // REVIEW by native speaker
        },
        do: 'tap',
        target: 'call-decline',
        duration: 2600,
      },
    ],
  },
];

import { LessonDefinition, QuizQuestion } from './types';

export const SETTINGS_LESSONS: LessonDefinition[] = [
  // -------------------------------------------------------------
  // LESSON 1: MOBILE INTERNET ON/OFF
  // -------------------------------------------------------------
  {
    id: 1,
    number: 1,
    icon: '📶',
    title: {
      en: 'Mobile Internet (Data) ON/OFF',
      ta: 'மொபைல் இன்டர்நெட் (டேட்டா) ஆன் / ஆஃப்',
      hi: 'मोबाइल इंटरनेट (डेटा) चालू / बंद',
    },
    shortDescription: {
      en: 'Learn how to swipe down and turn internet data on or off anytime.',
      ta: 'மேலிருந்து கீழ் நோக்கி இழுத்து இன்டர்நெட் டேட்டாவை இயக்க அல்லது அணைக்க கற்றுக்கொள்ளுங்கள்.',
      hi: 'ऊपर से नीचे स्वाइप करके इंटरनेट डेटा चालू या बंद करना सीखें।',
    },
    learnSteps: [
      {
        id: 'l1_s1_swipe',
        title: {
          en: 'Swipe Down for Quick Settings',
          ta: 'விரைவு அமைப்புகளுக்கு கீழே இழுக்கவும்',
          hi: 'क्विक सेटिंग्स के लिए नीचे स्वाइप करें',
        },
        voicePrompt: {
          en: 'Welcome! To open quick settings, swipe down with your finger from the very top of your phone screen.',
          ta: 'நல்வரவு! விரைவு அமைப்புகளைத் திறக்க, உங்கள் போன் திரையின் உச்சிப் பகுதியிலிருந்து கீழே நோக்கி விரலால் இழுக்கவும்.',
          hi: 'नमस्ते! त्वरित सेटिंग्स खोलने के लिए, अपने फोन स्क्रीन के सबसे ऊपरी हिस्से से नीचे की ओर स्वाइप करें।',
        },
        subtitles: {
          en: 'Swipe down from the top status bar (or tap the pull handle) to open Quick Settings.',
          ta: 'திரையின் மேற்பகுதியிலிருந்து விரலால் கீழே இழுக்கவும் (அல்லது கைப்பிடியை தொடவும்).',
          hi: 'स्क्रीन के सबसे ऊपर से नीचे स्वाइप करें (या हैंडल पर टैप करें)।',
        },
        actionBadge: {
          en: 'Swipe Down From Top',
          ta: 'மேலிருந்து கீழே இழுக்கவும்',
          hi: 'ऊपर से नीचे खींचें',
        },
        tip: {
          en: 'Quick Settings gives you 1-tap shortcuts for Internet, Torch, Wi-Fi, and Sound without going into deep settings.',
          ta: 'குவிக் செட்டிங்ஸ் மூலம் போனின் முக்கிய அமைப்புகளை ஒரே தட்டலில் இயக்கலாம்.',
          hi: 'क्विक सेटिंग्स से आप बिना अंदर जाए इंटरनेट, टॉर्च और साउंड को तुरंत नियंत्रित कर सकते हैं।',
        },
        expectedAction: 'SWIPE_DOWN',
        targetElement: 'quick-settings-handle',
      },
      {
        id: 'l1_s2_tap_data',
        title: {
          en: 'Tap Mobile Data to Turn Internet ON',
          ta: 'இன்டர்நெட்டை இயக்க மொபைல் டேட்டாவைத் தொடவும்',
          hi: 'इंटरनेट चालू करने के लिए मोबाइल डेटा दबाएं',
        },
        voicePrompt: {
          en: 'Great! Now find and tap the Mobile Data icon with signal arrows to turn your internet on.',
          ta: 'அருமை! இப்போது சிக்னல் அம்புக்குறி உள்ள "மொபைல் டேட்டா" பொத்தானைத் தொட்டு இன்டர்நெட்டை இயக்கவும்.',
          hi: 'शाबाश! अब सिग्नल तीरों वाले "मोबाइल डेटा" आइकन पर टैप करके इंटरनेट चालू करें।',
        },
        subtitles: {
          en: 'Tap the Mobile Data button to turn mobile internet ON. Watch the 4G icon appear in the status bar!',
          ta: 'இன்டர்நெட்டை இயக்க "மொபைல் டேட்டா" பொத்தானைத் தொடவும். மேலே 4G குறியீடு தோன்றும்!',
          hi: '"मोबाइल डेटा" बटन दबाएं। ऊपर स्टेटस बार में 4G का चिह्न दिखाई देगा!',
        },
        actionBadge: {
          en: 'Tap "Mobile Data" Icon',
          ta: '"மொபைல் டேட்டா" ஐகானைத் தொடவும்',
          hi: '"Mobile Data" आइकन छुएं',
        },
        tip: {
          en: 'When Mobile Data is ON, the button turns vibrant blue and a 4G/LTE icon lights up next to battery.',
          ta: 'மொபைல் டேட்டா ஆன் ஆனதும் பொத்தான் நீல நிறமாக மாறும், மேலே 4G தோன்றும்.',
          hi: 'मोबाइल डेटा ऑन होने पर बटन नीला हो जाता है और 4G आइकन जल उठता है।',
        },
        expectedAction: 'TOGGLE_DATA',
        targetElement: 'tile-mobile-data',
      },
      {
        id: 'l1_s3_verify_data',
        title: {
          en: 'Internet is now Active!',
          ta: 'இன்டர்நெட் இப்போது இயங்குகிறது!',
          hi: 'इंटरनेट अब सक्रिय है!',
        },
        voicePrompt: {
          en: 'Superb! Notice the glowing 4G icon at the top. You can now use WhatsApp, YouTube, and send messages.',
          ta: 'அற்புதம்! திரையின் உச்சியில் 4G சின்னம் ஒளிர்வதைக் காணுங்கள். இப்போது நீங்கள் வாட்ஸ்அப், யூடியூப் பயன்படுத்தலாம்.',
          hi: 'बहुत बढ़िया! ऊपर 4G का चिह्न चमक रहा है। अब आप व्हाट्सएप, यूट्यूब और इंटरनेट चला सकते हैं।',
        },
        subtitles: {
          en: 'Your mobile internet is active. Tap Next Step for the hands-on practice challenge.',
          ta: 'உங்கள் மொபைல் இன்டர்நெட் தயார். பயிற்சி சோதனைக்கு அடுத்து செல்லவும்.',
          hi: 'आपका इंटरनेट चालू हो चुका है। अभ्यास के लिए "Next Step" दबाएं।',
        },
        actionBadge: {
          en: 'Tap "Next Step"',
          ta: '"அடுத்த படி" தொடரவும்',
          hi: '"Next Step" दबाएं',
        },
        tip: {
          en: 'Money-saving tip: Turn Mobile Data OFF when not using phone at night to save your daily internet limit and battery!',
          ta: 'பயனுள்ள குறிப்பு: இரவில் தேவையில்லாத போது மொபைல் டேட்டாவை அணைத்தால் தினசரி டேட்டாவும் பேட்டரியும் மிச்சமாகும்!',
          hi: 'बचत सलाह: रात को या जब जरूरत न हो तो डेटा बंद कर दें, इससे इंटरनेट और बैटरी दोनों बचेगी!',
        },
        expectedAction: 'NEXT',
      },
    ],
    practiceTask: {
      prompt: {
        en: 'Practice Task: Tap Mobile Data to turn your internet OFF to save data.',
        ta: 'பயிற்சி சோதனை: டேட்டாவை மிச்சப்படுத்த மொபைல் டேட்டாவைத் தொட்டு ஆஃப் (OFF) செய்யவும்.',
        hi: 'अभ्यास कार्य: डेटा बचाने के लिए मोबाइल डेटा को बंद (OFF) करें।',
      },
      successMessage: {
        en: 'Well done! You turned off Mobile Data. Notice the 4G icon turned off.',
        ta: 'அருமை! நீங்கள் மொபைல் டேட்டாவை அணைத்துவிட்டீர்கள். 4G சின்னம் மறைந்துவிட்டது.',
        hi: 'बहुत अच्छे! आपने मोबाइल डेटा बंद कर दिया। 4G चिह्न हट गया है।',
      },
      targetSetting: 'data',
      desiredValue: false,
    },
  },

  // -------------------------------------------------------------
  // LESSON 2: TORCH / FLASHLIGHT ON/OFF
  // -------------------------------------------------------------
  {
    id: 2,
    number: 2,
    icon: '🔦',
    title: {
      en: 'Torch / Flashlight ON/OFF',
      ta: 'டார்ச் லைட் (Flashlight) ஆன் / ஆஃப்',
      hi: 'टॉर्च / फ्लैशलाइट चालू / बंद',
    },
    shortDescription: {
      en: 'Learn how to turn on bright light during power cuts or walking in the dark.',
      ta: 'மின்தடை அல்லது இருட்டில் நடக்கும்போது டார்ச் லைட்டை எளிதாக ஆன் செய்ய கற்றுக்கொள்ளுங்கள்.',
      hi: 'बिजली जाने पर या अंधेरे में फोन की तेज टॉर्च जलाना सीखें।',
    },
    learnSteps: [
      {
        id: 'l2_s1_open',
        title: {
          en: 'Open Quick Settings',
          ta: 'விரைவு அமைப்புகளைத் திறக்கவும்',
          hi: 'क्विक सेटिंग्स खोलें',
        },
        voicePrompt: {
          en: 'Need a light in the dark? Swipe down from the top to open your Quick Settings.',
          ta: 'இருட்டில் வெளிச்சம் தேவையா? போனின் உச்சியிலிருந்து கீழே விரலால் இழுத்து விரைவு அமைப்புகளைத் திறக்கவும்.',
          hi: 'अंधेरे में रोशनी चाहिए? ऊपर से नीचे स्वाइप करके क्विक सेटिंग्स खोलें।',
        },
        subtitles: {
          en: 'Swipe down from the top to find the Torch icon.',
          ta: 'டார்ச் ஐகானைக் காண திரையின் மேலிருந்து கீழே இழுக்கவும்.',
          hi: 'टॉर्च आइकन खोजने के लिए ऊपर से नीचे खींचें।',
        },
        actionBadge: {
          en: 'Swipe Down From Top',
          ta: 'மேலிருந்து கீழே இழுக்கவும்',
          hi: 'नीचे स्वाइप करें',
        },
        tip: {
          en: 'The Torch uses the bright LED flash light beside your phone back camera.',
          ta: 'உங்கள் போனின் பின்பக்க கேமரா அருகே உள்ள எல்.இ.டி விளக்கை டார்ச் பயன்படுத்துகிறது.',
          hi: 'टॉर्च फोन के पीछे वाले कैमरे के पास लगी चमकदार एलईडी लाइट को जलाती है।',
        },
        expectedAction: 'SWIPE_DOWN',
        targetElement: 'quick-settings-handle',
      },
      {
        id: 'l2_s2_torch_on',
        title: {
          en: 'Tap Flashlight to Turn Torch ON',
          ta: 'டார்ச் வெளிச்சத்தை இயக்க தொடவும்',
          hi: 'टॉर्च जलाने के लिए फ्लैशलाइट दबाएं',
        },
        voicePrompt: {
          en: 'Now tap the Flashlight icon. Look at the bright golden beam of light illuminating your screen!',
          ta: 'இப்போது டார்ச் ஐகானைத் தொடவும். உங்கள் திரையில் பிரகாசமான ஒளிக்கற்றை பாய்வதைப் பாருங்கள்!',
          hi: 'अब टॉर्च वाले आइकन पर टैप करें। स्क्रीन पर तेज रोशनी की किरण चमकते हुए देखें!',
        },
        subtitles: {
          en: 'Tap the Torch / Flashlight icon. Notice the bright beam animation turn ON!',
          ta: 'டார்ச் பொத்தானைத் தொடவும். ஒளி பிரகாசமாக எரியும் அனிமேஷனைக் காணுங்கள்!',
          hi: 'टॉर्च आइकन दबाएं। चमकदार रोशनी का बीम चालू हो जाएगा!',
        },
        actionBadge: {
          en: 'Tap "Flashlight" Icon',
          ta: '"டார்ச்" ஐகானைத் தொடவும்',
          hi: '"Flashlight" दबाएं',
        },
        tip: {
          en: 'The torch is very bright and useful during night walks, finding dropped keys, or during power cuts.',
          ta: 'மின்சாரம் தடைபடும் போது அல்லது இரவில் சாவியைத் தேடும் போது டார்ச் மிக உதவியாக இருக்கும்.',
          hi: 'रात में चलने, गिरी हुई चाबियां ढूंढने या बिजली कटने पर टॉर्च बहुत काम आती है।',
        },
        expectedAction: 'TOGGLE_TORCH',
        targetElement: 'tile-torch',
      },
      {
        id: 'l2_s3_torch_verified',
        title: {
          en: 'Torch is Shining Bright!',
          ta: 'டார்ச் வெளிச்சம் பிரகாசிக்கிறது!',
          hi: 'टॉर्च पूरी रोशनी दे रही है!',
        },
        voicePrompt: {
          en: 'Excellent! Your phone is now a powerful flashlight. Tap Next Step for the practice drill.',
          ta: 'அருமை! உங்கள் போன் இப்போது பிரகாசமான டார்ச்சாக மாறிவிட்டது. பயிற்சி சோதனைக்கு அடுத்து செல்லவும்.',
          hi: 'शाबाश! आपका फोन अब टॉर्च बन चुका है। अभ्यास के लिए "Next Step" दबाएं।',
        },
        subtitles: {
          en: 'Torch is ON. Remember to turn it OFF after use so your phone battery does not drain fast.',
          ta: 'டார்ச் எரிகிறது. பேட்டரியை மிச்சப்படுத்த தேவை முடிந்தவுடன் அணைக்க நினைவில் கொள்ளுங்கள்.',
          hi: 'टॉर्च चालू है। बैटरी बचाने के लिए काम होने के बाद इसे बंद करना न भूलें।',
        },
        actionBadge: {
          en: 'Tap "Next Step"',
          ta: '"அடுத்த படி" தொடரவும்',
          hi: '"Next Step" दबाएं',
        },
        tip: {
          en: 'Keeping the torch on for hours heats up the phone and drains battery quickly.',
          ta: 'டார்ச்சை நீண்ட நேரம் ஆன் செய்து வைத்தால் பேட்டரி வேகமாக குறையும்.',
          hi: 'टॉर्च को देर तक चालू रखने से फोन गर्म हो सकता है और बैटरी जल्दी खत्म होती है।',
        },
        expectedAction: 'NEXT',
      },
    ],
    practiceTask: {
      prompt: {
        en: 'Practice Task: Tap the Torch icon to turn it OFF.',
        ta: 'பயிற்சி சோதனை: டார்ச் ஐகானைத் தொட்டு விளக்கை அணைக்கவும் (OFF).',
        hi: 'अभ्यास कार्य: टॉर्च आइकन को दबाकर रोशनी बंद (OFF) करें।',
      },
      successMessage: {
        en: 'Super! You safely switched OFF the torch.',
        ta: 'அற்புதம்! நீங்கள் டார்ச் விளக்கை வெற்றிகரமாக அணைத்துவிட்டீர்கள்.',
        hi: 'शानदार! आपने टॉर्च को सही तरीके से बंद कर दिया।',
      },
      targetSetting: 'torch',
      desiredValue: false,
    },
  },

  // -------------------------------------------------------------
  // LESSON 3: WI-FI ON/OFF & CONNECT
  // -------------------------------------------------------------
  {
    id: 3,
    number: 3,
    icon: '🛜',
    title: {
      en: 'Wi-Fi ON/OFF & Connection',
      ta: 'வைஃபை (Wi-Fi) ஆன் / ஆஃப் மற்றும் இணைப்பு',
      hi: 'वाई-फाई (Wi-Fi) चालू / बंद और कनेक्ट',
    },
    shortDescription: {
      en: 'Learn how to turn on Wi-Fi and connect to your home or shop broadband network.',
      ta: 'வைஃபை-யை இயக்கி உங்கள் வீடு அல்லது கடை பிராட்பேண்டுடன் இணைக்க கற்றுக்கொள்ளுங்கள்.',
      hi: 'वाई-फाई चालू करना और घर या दुकान के ब्रॉडबैंड से कनेक्ट करना सीखें।',
    },
    learnSteps: [
      {
        id: 'l3_s1_swipe',
        title: {
          en: 'Open Quick Settings',
          ta: 'விரைவு அமைப்புகளைத் திறக்கவும்',
          hi: 'क्विक सेटिंग्स खोलें',
        },
        voicePrompt: {
          en: 'To check available Wi-Fi networks, swipe down from the top of your phone screen.',
          ta: 'கிடைக்கும் வைஃபை இணைப்புகளைக் காண, திரையின் உச்சியிலிருந்து விரலால் கீழே இழுக்கவும்.',
          hi: 'उपलब्ध वाई-फाई देखने के लिए, स्क्रीन के ऊपर से नीचे स्वाइप करें।',
        },
        subtitles: {
          en: 'Swipe down from the top to reveal the Wi-Fi tile.',
          ta: 'வைஃபை பொத்தானைக் காண திரையின் மேலிருந்து கீழே இழுக்கவும்.',
          hi: 'वाई-फाई टाइल देखने के लिए ऊपर से नीचे खींचें।',
        },
        actionBadge: {
          en: 'Swipe Down From Top',
          ta: 'மேலிருந்து கீழே இழுக்கவும்',
          hi: 'नीचे स्वाइप करें',
        },
        tip: {
          en: 'Wi-Fi uses radio waves from your home router. It does not use your mobile SIM card data balance!',
          ta: 'வைஃபை உங்கள் வீட்டு ரூட்டரிலிருந்து செயல்படுகிறது. இது உங்கள் மொபைல் சிம் டேட்டா அளவை குறைக்காது!',
          hi: 'वाई-फाई घर के ब्रॉडबैंड से चलता है, इससे आपका सिम कार्ड का मोबाइल डेटा खर्च नहीं होता!',
        },
        expectedAction: 'SWIPE_DOWN',
        targetElement: 'quick-settings-handle',
      },
      {
        id: 'l3_s2_wifi_toggle',
        title: {
          en: 'Tap Wi-Fi to Turn it ON',
          ta: 'வைஃபை பொத்தானைத் தொட்டு இயக்கவும்',
          hi: 'वाई-फाई चालू करने के लिए टैप करें',
        },
        voicePrompt: {
          en: 'Tap the Wi-Fi icon with radial waves. It will turn on and search for nearby networks.',
          ta: 'அலைவரிசை சின்னம் உள்ள வைஃபை ஐகானைத் தொடவும். அது ஆன் ஆகி அருகிலுள்ள இணைப்புகளைத் தேடும்.',
          hi: 'रेडियो तरंगों वाले वाई-फाई आइकन को दबाएं। यह चालू होकर आस-पास के नेटवर्क खोजेगा।',
        },
        subtitles: {
          en: 'Tap the Wi-Fi button. A list of available fictional networks will appear below.',
          ta: '"வைஃபை" பொத்தானைத் தொடவும். அருகிலுள்ள இணைப்புகளின் பட்டியல் கீழே தோன்றும்.',
          hi: '"Wi-Fi" बटन दबाएं। उपलब्ध नेटवर्कों की सूची नीचे दिखेगी।',
        },
        actionBadge: {
          en: 'Tap "Wi-Fi" Icon',
          ta: '"Wi-Fi" ஐகானைத் தொடவும்',
          hi: '"Wi-Fi" आइकन छुएं',
        },
        tip: {
          en: 'When Wi-Fi is ON, your phone automatically detects Wi-Fi signals in your house or office.',
          ta: 'வைஃபை ஆன் ஆனதும், வீட்டில் உள்ள சிக்னல்களை போன் தானாகக் கண்டறியும்.',
          hi: 'वाई-फाई ऑन होने पर फोन आस-पास के सभी सिग्नलों को अपने आप ढूंढ लेता है।',
        },
        expectedAction: 'TOGGLE_WIFI',
        targetElement: 'tile-wifi',
      },
      {
        id: 'l3_s3_connect_network',
        title: {
          en: 'Select & Connect to Home_Fiber_5G',
          ta: '"Home_Fiber_5G" இணைப்பைத் தேர்ந்தெடுக்கவும்',
          hi: '"Home_Fiber_5G" नेटवर्क से कनेक्ट करें',
        },
        voicePrompt: {
          en: 'Now tap on Home_Fiber_5G to simulate connecting to your high-speed home network.',
          ta: 'இப்போது வீட்டு அதிவேக இணையத்தை இணைக்க "Home_Fiber_5G" என்பதைத் தொடவும்.',
          hi: 'अब अपने घर के तेज इंटरनेट से जुड़ने के लिए "Home_Fiber_5G" पर टैप करें।',
        },
        subtitles: {
          en: 'Tap "Home_Fiber_5G". Watch it show "Connected, Secured" with a green checkmark.',
          ta: '"Home_Fiber_5G" என்பதைத் தொடவும். "Connected" என பச்சை நிறத்தில் மாறும்.',
          hi: '"Home_Fiber_5G" पर टैप करें। यह "Connected" होकर हरा टिक दिखाएगा।',
        },
        actionBadge: {
          en: 'Tap "Home_Fiber_5G"',
          ta: '"Home_Fiber_5G" தொடவும்',
          hi: '"Home_Fiber_5G" छुएं',
        },
        tip: {
          en: 'Notice the Wi-Fi curved arc icon in the status bar! Your phone now enjoys fast internet without using SIM data.',
          ta: 'மேலே வைஃபை சின்னம் வந்துவிட்டது! இப்போது சிம் டேட்டா செலவாகாமல் இலவசமாக இன்டர்நெட் கிடைக்கும்.',
          hi: 'ऊपर स्टेटस बार में वाई-फाई का निशान आ गया है! अब बिना सिम डेटा खर्च किए तेज़ इंटरनेट चलेगा।',
        },
        expectedAction: 'CONNECT_WIFI',
        targetElement: 'network-home-fiber',
      },
    ],
    practiceTask: {
      prompt: {
        en: 'Practice Task: Tap the Wi-Fi icon to turn it OFF and switch back to mobile network.',
        ta: 'பயிற்சி சோதனை: வைஃபை ஐகானைத் தொட்டு வைஃபை-யை அணைக்கவும் (OFF).',
        hi: 'अभ्यास कार्य: वाई-फाई आइकन को दबाकर वाई-फाई बंद (OFF) करें।',
      },
      successMessage: {
        en: 'Great job! You turned OFF Wi-Fi.',
        ta: 'அருமை! நீங்கள் வைஃபை இணைப்பை அணைத்துவிட்டீர்கள்.',
        hi: 'बहुत बढ़िया! आपने वाई-फाई सफलतापूर्वक बंद कर दिया।',
      },
      targetSetting: 'wifi',
      desiredValue: false,
    },
  },

  // -------------------------------------------------------------
  // LESSON 4: PORTABLE HOTSPOT ON/OFF
  // -------------------------------------------------------------
  {
    id: 4,
    number: 4,
    icon: '📡',
    title: {
      en: 'Personal Hotspot ON/OFF',
      ta: 'தனிநபர் ஹாட்ஸ்பாட் (Hotspot) ஆன் / ஆஃப்',
      hi: 'पर्सनल हॉटस्पॉट (Hotspot) चालू / बंद',
    },
    shortDescription: {
      en: 'Share your phone internet with family members, tablets, or laptops safely.',
      ta: 'உங்கள் போன் இன்டர்நெட்டை குடும்ப உறுப்பினர்கள் மற்றும் மடிக்கணினியுடன் பகிர கற்றுக்கொள்ளுங்கள்.',
      hi: 'अपने फोन का इंटरनेट परिवार के फोन या टैबलेट के साथ सुरक्षित रूप से शेयर करना सीखें।',
    },
    learnSteps: [
      {
        id: 'l4_s1_swipe',
        title: {
          en: 'Open Quick Settings',
          ta: 'விரைவு அமைப்புகளைத் திறக்கவும்',
          hi: 'क्विक सेटिंग्स खोलें',
        },
        voicePrompt: {
          en: 'Want to share your internet with your child or spouse? Swipe down from the top to open Quick Settings.',
          ta: 'உங்கள் இன்டர்நெட்டை பிள்ளைகள் அல்லது குடும்பத்தினருக்கு பகிர வேண்டுமா? மேலிருந்து கீழே இழுத்து விரைவு அமைப்புகளைத் திறக்கவும்.',
          hi: 'क्या आप अपना इंटरनेट बच्चों या परिवार के साथ शेयर करना चाहते हैं? ऊपर से नीचे स्वाइप करें।',
        },
        subtitles: {
          en: 'Swipe down to find the Hotspot toggle.',
          ta: 'ஹாட்ஸ்பாட் பொத்தானைக் காண மேலிருந்து கீழே இழுக்கவும்.',
          hi: 'हॉटस्पॉट विकल्प खोजने के लिए नीचे खींचें।',
        },
        actionBadge: {
          en: 'Swipe Down From Top',
          ta: 'மேலிருந்து கீழே இழுக்கவும்',
          hi: 'नीचे स्वाइप करें',
        },
        tip: {
          en: 'Hotspot turns your phone into a mini Wi-Fi tower so nearby family members can connect using a password.',
          ta: 'ஹாட்ஸ்பாட் உங்கள் போனை ஒரு சிறிய வைஃபை கோபுரமாக மாற்றி மற்றவர்களுக்கு இணையம் வழங்கும்.',
          hi: 'हॉटस्पॉट आपके फोन को छोटा वाई-फाई टॉवर बना देता है जिससे परिवार के लोग पासवर्ड डालकर जुड़ सकते हैं।',
        },
        expectedAction: 'SWIPE_DOWN',
        targetElement: 'quick-settings-handle',
      },
      {
        id: 'l4_s2_hotspot_toggle',
        title: {
          en: 'Tap Hotspot to Turn it ON',
          ta: 'ஹாட்ஸ்பாட்டை ஆன் செய்ய தொடவும்',
          hi: 'हॉटस्पॉट चालू करने के लिए टैप करें',
        },
        voicePrompt: {
          en: 'Now tap the Hotspot icon with antenna broadcast waves. Your phone will start sharing internet.',
          ta: 'ஒலிபரப்பு சின்னம் உள்ள ஹாட்ஸ்பாட் ஐகானைத் தொடவும். உங்கள் போன் மற்றவர்களுக்கு இணையத்தை பகிரத் தொடங்கும்.',
          hi: 'एंटीना तरंगों वाले हॉटस्पॉट आइकन पर टैप करें। आपका फोन इंटरनेट शेयर करना शुरू कर देगा।',
        },
        subtitles: {
          en: 'Tap the Hotspot icon. See the simulated broadcast animation and connected device preview.',
          ta: '"ஹாட்ஸ்பாட்" ஐகானைத் தொடவும். பிற சாதனங்கள் இணையும் விபரம் கீழே தோன்றும்.',
          hi: '"Hotspot" आइकन दबाएं। जुड़े हुए डिवाइस और पासवर्ड की जानकारी नीचे दिखेगी।',
        },
        actionBadge: {
          en: 'Tap "Hotspot" Icon',
          ta: '"ஹாட்ஸ்பாட்" ஐகானைத் தொடவும்',
          hi: '"Hotspot" दबाएं',
        },
        tip: {
          en: 'Always set a strong password so unknown strangers cannot steal your mobile data balance!',
          ta: 'அறிமுகமில்லாதவர்கள் உங்கள் டேட்டாவை திருடாமல் இருக்க எப்போதும் ரகசிய கடவுச்சொல் (Password) வையுங்கள்!',
          hi: 'हमेशा पासवर्ड लगाएं ताकि कोई अजनबी आपका मोबाइल डेटा चुपके से इस्तेमाल न कर सके!',
        },
        expectedAction: 'TOGGLE_HOTSPOT',
        targetElement: 'tile-hotspot',
      },
      {
        id: 'l4_s3_hotspot_active',
        title: {
          en: 'Hotspot is Sharing Internet!',
          ta: 'ஹாட்ஸ்பாட் இணையத்தைப் பகிர்கிறது!',
          hi: 'हॉटस्पॉट इंटरनेट शेयर कर रहा है!',
        },
        voicePrompt: {
          en: 'Fantastic! Notice that Priyas Tablet has connected to your hotspot and is browsing internet safely.',
          ta: 'அருமை! பிரியாவின் டேப்லெட் உங்கள் போன் ஹாட்ஸ்பாட்டுடன் இணைந்து இணையத்தைப் பயன்படுத்துகிறது.',
          hi: 'शानदार! देखिए, "Priya\'s Tablet" आपके फोन से जुड़ चुका है और इंटरनेट चला रहा है।',
        },
        subtitles: {
          en: 'Hotspot is active • 1 device connected ("Priya\'s Tablet"). Tap Next Step for practice.',
          ta: 'ஹாட்ஸ்பாட் இயங்குகிறது • 1 சாதனம் இணைக்கப்பட்டுள்ளது ("Priya\'s Tablet"). பயிற்சிக்கு அடுத்து தொடரவும்.',
          hi: 'हॉटस्पॉट सक्रिय है • 1 डिवाइस जुड़ा हुआ है ("Priya\'s Tablet")। अभ्यास के लिए आगे बढ़ें।',
        },
        actionBadge: {
          en: 'Tap "Next Step"',
          ta: '"அடுத்த படி" தொடரவும்',
          hi: '"Next Step" दबाएं',
        },
        tip: {
          en: 'Turn off Hotspot when your family finishes browsing to save your mobile data and battery life.',
          ta: 'வேலை முடிந்ததும் ஹாட்ஸ்பாட்டை அணைத்தால் டேட்டாவும் பேட்டரியும் வீணாகாது.',
          hi: 'काम पूरा होने के बाद हॉटस्पॉट बंद कर दें ताकि आपका मोबाइल डेटा और बैटरी खत्म न हो।',
        },
        expectedAction: 'NEXT',
      },
    ],
    practiceTask: {
      prompt: {
        en: 'Practice Task: Tap the Hotspot icon to turn it OFF and stop sharing data.',
        ta: 'பயிற்சி சோதனை: இணையப் பகிர்வை நிறுத்த ஹாட்ஸ்பாட் ஐகானைத் தொட்டு ஆஃப் (OFF) செய்யவும்.',
        hi: 'अभ्यास कार्य: डेटा शेयरिंग रोकने के लिए हॉटस्पॉट आइकन दबाकर बंद (OFF) करें।',
      },
      successMessage: {
        en: 'Superb! You turned OFF Hotspot and saved your data.',
        ta: 'அற்புதம்! நீங்கள் ஹாட்ஸ்பாட்டை அணைத்துவிட்டீர்கள்.',
        hi: 'बहुत अच्छे! आपने हॉटस्पॉट बंद करके डेटा बचा लिया।',
      },
      targetSetting: 'hotspot',
      desiredValue: false,
    },
  },

  // -------------------------------------------------------------
  // LESSON 5: SOUND, VIBRATE, & SILENT MODE
  // -------------------------------------------------------------
  {
    id: 5,
    number: 5,
    icon: '🔇',
    title: {
      en: 'Sound, Vibrate & Silent Modes',
      ta: 'சத்தம், அதிர்வு மற்றும் அமைதி நிலை (Sound / Silent)',
      hi: 'साउंड, वाइब्रेट और साइलेंट मोड',
    },
    shortDescription: {
      en: 'Learn how to mute your phone in temples, hospitals, or meetings with one tap.',
      ta: 'கோவில், மருத்துவமனை அல்லது கூட்டங்களில் போனை ஒரே தட்டலில் அமைதிப்படுத்த கற்றுக்கொள்ளுங்கள்.',
      hi: 'मंदिर, अस्पताल या जरूरी बैठकों में फोन को एक टैप में साइलेंट करना सीखें।',
    },
    learnSteps: [
      {
        id: 'l5_s1_swipe',
        title: {
          en: 'Open Quick Settings',
          ta: 'விரைவு அமைப்புகளைத் திறக்கவும்',
          hi: 'क्विक सेटिंग्स खोलें',
        },
        voicePrompt: {
          en: 'Going inside a temple or hospital? Swipe down from the top to adjust your sound settings.',
          ta: 'கோவில் அல்லது மருத்துவமனைக்குச் செல்கிறீர்களா? போனின் உச்சியிலிருந்து கீழே விரலால் இழுத்து சத்த அமைப்புகளைத் திறக்கவும்.',
          hi: 'मंदिर या अस्पताल जा रहे हैं? स्क्रीन के ऊपर से नीचे स्वाइप करके साउंड सेटिंग्स खोलें।',
        },
        subtitles: {
          en: 'Swipe down to find the Sound / Speaker tile.',
          ta: 'ஸ்பீக்கர் ஒலி பொத்தானைக் காண மேலிருந்து கீழே இழுக்கவும்.',
          hi: 'स्पीकर और साउंड आइकन देखने के लिए नीचे खींचें।',
        },
        actionBadge: {
          en: 'Swipe Down From Top',
          ta: 'மேலிருந்து கீழே இழுக்கவும்',
          hi: 'नीचे स्वाइप करें',
        },
        tip: {
          en: 'Android phones have 3 modes: Sound (rings aloud), Vibrate (shakes silently), and Silent (zero sound).',
          ta: 'போனில் 3 நிலைகள் உள்ளன: Sound (ரிங்டோன் ஒலிக்கும்), Vibrate (அதிரும்), Silent (முற்றிலும் அமைதி).',
          hi: 'फोन में 3 मोड होते हैं: साउंड (रिंगटोन बजेगी), वाइब्रेट (फोन कांपेगा), और साइलेंट (पूरी तरह शांत)।',
        },
        expectedAction: 'SWIPE_DOWN',
        targetElement: 'quick-settings-handle',
      },
      {
        id: 'l5_s2_cycle_vibrate',
        title: {
          en: 'Tap Sound to Switch to Vibrate Mode',
          ta: 'அதிர்வு நிலைக்கு மாற்ற ஸ்பீக்கர் ஐகானைத் தொடவும்',
          hi: 'वाइब्रेट मोड के लिए स्पीकर आइकन दबाएं',
        },
        voicePrompt: {
          en: 'Tap the Sound icon once. Listen to the gentle haptic vibration! The phone will now shake without ringing aloud.',
          ta: 'ஸ்பீக்கர் ஐகானை ஒருமுறை தொடவும். அதிர்வு ஏற்படுவதைக் கவனியுங்கள்! இனி போன் சத்தமாக ஒலிக்காமல் அதிரும்.',
          hi: 'स्पीकर आइकन को एक बार दबाएं। फोन का कंपन सुनें! अब फोन बिना आवाज किए सिर्फ कांपेगा।',
        },
        subtitles: {
          en: 'Tap the Sound icon to switch to Vibrate mode (phone vibrates on calls).',
          ta: 'ஸ்பீக்கர் ஐகானைத் தொடவும். போன் வைப்ரேட் மோடுக்கு மாறும்.',
          hi: 'स्पीकर आइकन दबाएं। फोन वाइब्रेट मोड पर चला जाएगा।',
        },
        actionBadge: {
          en: 'Tap Sound -> Vibrate',
          ta: 'ஒலி -> அதிர்வு தொடவும்',
          hi: 'साउंड -> वाइब्रेट दबाएं',
        },
        tip: {
          en: 'Vibrate mode is ideal in noisy buses or markets where you cannot hear the ringtone but feel the vibration in your pocket.',
          ta: 'கூட்ட நெரிசலான பேருந்து அல்லது சந்தையில் பாக்கெட்டில் போன் அதிர்வதை எளிதாக உணரலாம்.',
          hi: 'वाइब्रेट मोड भीड़-भाड़ वाली जगहों के लिए बढ़िया है जहां जेब में फोन का कंपन आसानी से महसूस होता है।',
        },
        expectedAction: 'CYCLE_SOUND',
        targetElement: 'tile-sound',
      },
      {
        id: 'l5_s3_cycle_silent',
        title: {
          en: 'Tap Again to Switch to Silent Mode',
          ta: 'முழு அமைதி நிலைக்கு (Silent) மாற்ற மீண்டும் தொடவும்',
          hi: 'पूरी तरह साइलेंट करने के लिए फिर से दबाएं',
        },
        voicePrompt: {
          en: 'Tap it again to enter Silent mode. Look at the crossed-out speaker icon. Now incoming calls make zero sound.',
          ta: 'மீண்டும் ஒருமுறை தொடவும். வெட்டப்பட்ட ஸ்பீக்கர் சின்னம் தோன்றி போன் அமைதி நிலைக்கு (Silent) மாறும்.',
          hi: 'एक बार फिर दबाएं। कटे हुए स्पीकर का चिह्न दिखेगा और फोन पूरी तरह साइलेंट हो जाएगा।',
        },
        subtitles: {
          en: 'Tap to switch to Silent mode. The crossed speaker icon guarantees no disturbing ringtone.',
          ta: 'சைலண்ட் மோடுக்கு மாற்ற தொடவும். எந்த சத்தமும் வராது என உறுதி செய்கிறது.',
          hi: 'साइलेंट मोड में बदलें। कोई भी आवाज़ नहीं आएगी।',
        },
        actionBadge: {
          en: 'Tap Vibrate -> Silent',
          ta: 'அதிர்வு -> அமைதி தொடவும்',
          hi: 'वाइब्रेट -> साइलेंट दबाएं',
        },
        tip: {
          en: 'Use Silent mode in temples, prayer halls, cinemas, doctor clinics, and meetings.',
          ta: 'கோவில்கள், திரையரங்கம், மருத்துவர் அறை மற்றும் கூட்டங்களில் சைலண்ட் மோடை பயன்படுத்துங்கள்.',
          hi: 'मंदिर, सिनेमा हॉल, डॉक्टर के क्लीनिक और बैठकों में साइलेंट मोड का उपयोग करें।',
        },
        expectedAction: 'CYCLE_SOUND',
        targetElement: 'tile-sound',
      },
    ],
    practiceTask: {
      prompt: {
        en: 'Practice Task: Tap the Sound icon until it returns to normal Sound mode with ringtone.',
        ta: 'பயிற்சி சோதனை: மீண்டும் வழக்கமான ரிங்டோன் ஒலிக்கும் Sound மோடுக்கு மாற்ற தொடவும்.',
        hi: 'अभ्यास कार्य: स्पीकर आइकन को तब तक दबाएं जब तक वह सामान्य साउंड मोड पर न आ जाए।',
      },
      successMessage: {
        en: 'Excellent! Normal ringtone sound is restored.',
        ta: 'அருமை! இயல்பான ரிங்டோன் ஒலி நிலை மீட்டெடுக்கப்பட்டது.',
        hi: 'शानदार! सामान्य रिंगटोन मोड वापस चालू हो गया।',
      },
      targetSetting: 'sound',
      desiredValue: 'sound',
    },
  },
];

// -------------------------------------------------------------
// PRACTICE QUIZ QUESTIONS (5 Interactive Questions)
// -------------------------------------------------------------
export const SETTINGS_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: {
      en: '1. Which setting turns on your internet when away from home?',
      ta: '1. வீட்டை விட்டு வெளியே இருக்கும்போது இன்டர்நெட்டை இயக்க எந்த அமைப்பைப் பயன்படுத்த வேண்டும்?',
      hi: '1. घर से बाहर रहने पर इंटरनेट चलाने के लिए कौन सी सेटिंग चालू करनी चाहिए?',
    },
    options: {
      en: ['Mobile Data (4G/5G)', 'Torch / Flashlight', 'Airplane Mode', 'Silent Mode'],
      ta: ['மொபைல் டேட்டா (4G/5G)', 'டார்ச் லைட்', 'விமான நிலை (Airplane)', 'அமைதி நிலை (Silent)'],
      hi: ['मोबाइल डेटा (4G/5G)', 'टॉर्च', 'एरोप्लेन मोड', 'साइलेंट मोड'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Mobile Data connects your phone to your telecom SIM carrier internet anywhere outdoors.',
      ta: 'மொபைல் டேட்டா உங்கள் சிம் கார்டு மூலம் எங்கும் இன்டர்நெட்டை இணைக்கும்.',
      hi: 'मोबाइल डेटा आपके सिम कार्ड से कहीं भी बाहर इंटरनेट जोड़ता है।',
    },
  },
  {
    id: 2,
    question: {
      en: '2. How do you find light in the dark using your smartphone?',
      ta: '2. மின்சாரம் தடைபடும் போது இருட்டில் வெளிச்சம் பெற எதனை ஆன் செய்ய வேண்டும்?',
      hi: '2. अंधेरे में रोशनी पाने के लिए फोन में क्या चालू करेंगे?',
    },
    options: {
      en: ['Wi-Fi', 'Torch / Flashlight', 'Hotspot', 'Sound Mode'],
      ta: ['வைஃபை (Wi-Fi)', 'டார்ச் லைட் (Flashlight)', 'ஹாட்ஸ்பாட்', 'சவுண்ட் மோடு'],
      hi: ['वाई-फाई', 'टॉर्च / फ्लैशलाइट', 'हॉटस्पॉट', 'साउंड मोड'],
    },
    correctIndex: 1,
    explanation: {
      en: 'The Torch uses your rear camera LED flash to cast bright light in the dark.',
      ta: 'டார்ச் உங்கள் போன் கேமரா எல்.இ.டி விளக்கை இயக்கி வெளிச்சம் தரும்.',
      hi: 'टॉर्च कैमरे की एलईडी लाइट को जलाकर अंधेरे में रोशनी देती है।',
    },
  },
  {
    id: 3,
    question: {
      en: '3. Which setting lets your phone use free home broadband without SIM data?',
      ta: '3. சிம் டேட்டா செலவாகாமல் வீட்டு பிராட்பேண்ட் இணையத்தைப் பயன்படுத்த எது உதவும்?',
      hi: '3. बिना सिम डेटा खर्च किए घर के ब्रॉडबैंड से इंटरनेट चलाने के लिए क्या चालू करेंगे?',
    },
    options: {
      en: ['Torch', 'Wi-Fi', 'Bluetooth', 'Silent Mode'],
      ta: ['டார்ச்', 'வைஃபை (Wi-Fi)', 'புளூடூத்', 'சைலண்ட் மோடு'],
      hi: ['टॉर्च', 'वाई-फाई (Wi-Fi)', 'ब्लूटूथ', 'साइलेंट मोड'],
    },
    correctIndex: 1,
    explanation: {
      en: 'Wi-Fi connects to home fiber broadband routers without consuming mobile data limits.',
      ta: 'வைஃபை வீட்டு ரூட்டருடன் இணைந்து சிம் டேட்டாவை மிச்சப்படுத்தும்.',
      hi: 'वाई-फाई घर के वाई-फाई रूटर से जुड़कर सिम का डेटा बचाता है।',
    },
  },
  {
    id: 4,
    question: {
      en: '4. How can you share your mobile internet with your child tablet or spouse phone?',
      ta: '4. உங்கள் போன் இன்டர்நெட்டை குடும்பத்தினரின் போன் அல்லது டேப்லெட்டுடன் பகிர எது உதவும்?',
      hi: '4. अपने फोन का इंटरनेट बच्चों के टैबलेट या परिवार से शेयर करने के लिए क्या चालू करेंगे?',
    },
    options: {
      en: ['Personal Hotspot', 'Torch', 'Vibrate Mode', 'Auto-Rotate'],
      ta: ['தனிநபர் ஹாட்ஸ்பாட் (Hotspot)', 'டார்ச் லைட்', 'அதிர்வு நிலை (Vibrate)', 'திரை சுழற்சி'],
      hi: ['पर्सनल हॉटस्पॉट (Hotspot)', 'टॉर्च', 'वाइब्रेट मोड', 'ऑटो रोटेट'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Hotspot creates a secure wireless access point allowing other devices to use your data.',
      ta: 'ஹாட்ஸ்பாட் உங்கள் போன் மூலம் மற்ற சாதனங்களுக்கு பாதுகாப்பாக இணையத்தைப் பகிரும்.',
      hi: 'हॉटस्पॉट आपके फोन को वाई-फाई बनाकर दूसरों को इंटरनेट देता है।',
    },
  },
  {
    id: 5,
    question: {
      en: '5. Which mode prevents your phone from ringing aloud in temples or doctor clinics?',
      ta: '5. கோவில், மருத்துவமனை அல்லது கூட்டங்களில் போன் சத்தமாக ஒலிக்காமல் இருக்க எதனை வைக்க வேண்டும்?',
      hi: '5. मंदिर, अस्पताल या मीटिंग में फोन की घंटी बजने से रोकने के लिए कौन सा मोड चुनेंगे?',
    },
    options: {
      en: ['Silent or Vibrate Mode', 'Mobile Data ON', 'Torch ON', 'Wi-Fi ON'],
      ta: ['சைலண்ட் அல்லது வைப்ரேட் நிலை (Silent / Vibrate)', 'மொபைல் டேட்டா ஆன்', 'டார்ச் ஆன்', 'வைஃபை ஆன்'],
      hi: ['साइलेंट या वाइब्रेट मोड (Silent / Vibrate)', 'मोबाइल डेटा ऑन', 'टॉर्च ऑन', 'वाई-फाई ऑन'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Silent mode mutes all ringtones and notification sounds completely to avoid disturbance.',
      ta: 'சைலண்ட் மோடு அனைத்து அழைப்பு ஒலிகளையும் அமைதிப்படுத்தி இடையூறைத் தவிர்க்கும்.',
      hi: 'साइलेंट मोड घंटी की आवाज को पूरी तरह बंद कर देता है।',
    },
  },
];

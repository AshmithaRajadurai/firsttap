import { SimulationStepData } from './types';

export const MAPS_CATEGORIES = [
  { id: 'grocery', nameEn: 'Grocery Store / Kirana', nameTa: 'மளிகைக் கடை', nameHi: 'किराना दुकान' },
  { id: 'pharmacy', nameEn: 'Pharmacy / Medicals', nameTa: 'மருந்தகம்', nameHi: 'दवा दुकान' },
  { id: 'tea_stall', nameEn: 'Tea Stall / Cafe', nameTa: 'டீ கடை / உணவகம்', nameHi: 'चाय की दुकान / कैफ़े' },
  { id: 'clothing', nameEn: 'Clothing / Tailor', nameTa: 'துணிக்கடை / தையல்', nameHi: 'कपड़ों की दुकान / दर्जी' },
  { id: 'hardware', nameEn: 'Hardware & Electricals', nameTa: 'ஹார்டுவேர் கடை', nameHi: 'हार्डवेयर दुकान' },
  { id: 'bakery', nameEn: 'Bakery & Sweets', nameTa: 'பேக்கரி / இனிப்பகம்', nameHi: 'बेकरी व मिठाई' },
];

export const MAPS_STEPS: Record<string, SimulationStepData> = {
  // Step 1: Smartphone Home Screen
  step_phone_home: {
    id: 'step_phone_home',
    screen: 'PHONE_HOME',
    mode: 'CHOICE',
    stepNumber: 1,
    totalSteps: 8,
    title: {
      en: '1. Smartphone Home Screen',
      ta: '1. ஸ்மார்ட்போன் முகப்பு திரை',
      hi: '1. स्मार्टफ़ोन होम स्क्रीन',
    },
    instruction: {
      en: 'Find and tap the Google Maps app icon on your phone.',
      ta: 'உங்கள் போனில் உள்ள கூகுள் மேப்ஸ் (Google Maps) குறியீட்டைத் தொடவும்.',
      hi: 'अपने फ़ोन पर गूगल मैप्स (Google Maps) ऐप आइकन को ढूँढकर टैप करें।',
    },
    voiceScript: {
      en: 'Welcome. To add your place, first open the Google Maps app by tapping its icon on your home screen.',
      ta: 'வணக்கம். உங்கள் இடத்தை சேர்க்க, முதலில் உங்கள் திரையில் உள்ள கூகுள் மேப்ஸ் செயலியைத் தொடவும்.',
      hi: 'नमस्ते। अपनी जगह जोड़ने के लिए, सबसे पहले होम स्क्रीन पर गूगल मैप्स ऐप पर टैप करें।',
    },
    tip: {
      en: 'Google Maps has a colorful folded map pin icon.',
      ta: 'கூகுள் மேப்ஸ் வண்ணமயமான முள் (pin) போன்ற தோற்றத்தில் இருக்கும்.',
      hi: 'गूगल मैप्स रंग-बिरंगे मैप पिन जैसा दिखता है।',
    },
    targetId: 'app-icon-maps',
  },

  // Step 2 & 3: Map Main Screen with Contribute
  step_map_main: {
    id: 'step_map_main',
    screen: 'MAP_MAIN',
    mode: 'CHOICE',
    stepNumber: 2,
    totalSteps: 8,
    title: {
      en: '2. Google Maps Main Screen',
      ta: '2. கூகுள் மேப்ஸ் முதன்மை திரை',
      hi: '2. गूगल मैप्स मुख्य स्क्रीन',
    },
    instruction: {
      en: 'Tap the "+ Contribute" button at the bottom to add or manage a place.',
      ta: 'புதிய இடத்தை சேர்க்க கீழே உள்ள "+ Contribute" (பங்களிப்பு) பொத்தானைத் தொடவும்.',
      hi: 'नई जगह जोड़ने के लिए नीचे दिए गए "+ Contribute" बटन पर टैप करें।',
    },
    voiceScript: {
      en: 'This is the main map. At the bottom, tap the Contribute button with the plus sign.',
      ta: 'இது மேப் திரை. கீழே உள்ள Contribute பொத்தானைத் தொடவும்.',
      hi: 'यह मुख्य मैप है। नीचे दिए गए Contribute बटन पर टैप करें।',
    },
    tip: {
      en: 'The Contribute tab is where you add public shops or edit map details.',
      ta: 'Contribute பகுதியில் தான் கடைகள் மற்றும் இடங்களை சேர்க்கலாம்.',
      hi: 'Contribute विकल्प से आप नई दुकानें जोड़ सकते हैं।',
    },
    targetId: 'btn-contribute-tab',
  },

  // Step 4: Choose Shop vs Home
  step_choice: {
    id: 'step_choice',
    screen: 'CHOICE_MODAL',
    mode: 'CHOICE',
    stepNumber: 3,
    totalSteps: 8,
    title: {
      en: '3. Choose: Shop or Private Home?',
      ta: '3. தேர்வு: கடையா அல்லது உங்கள் வீடா?',
      hi: '3. चुनें: दुकान या निजी घर?',
    },
    instruction: {
      en: 'Choose whether you want to add a public shop or save your private home address.',
      ta: 'பொது கடையை சேர்க்க விரும்புகிறீர்களா அல்லது சொந்த வீட்டை ரகசியமாக சேமிக்க விரும்புகிறீர்களா என்று தேர்ந்தெடுக்கவும்.',
      hi: 'चुनें कि आप सार्वजनिक दुकान जोड़ना चाहते हैं या अपना निजी घर सुरक्षित रूप से सहेजना चाहते हैं।',
    },
    voiceScript: {
      en: 'Important: Public shops can be added for customers to find. But your private home should always be saved privately, never listed publicly.',
      ta: 'முக்கிய குறிப்பு: வாடிக்கையாளர்கள் அறிய கடையை பொதுவில் சேர்க்கலாம். ஆனால் வீட்டின் முகவரியை ரகசியமாக மட்டுமே சேமிக்க வேண்டும்.',
      hi: 'ध्यान दें: ग्राहकों के लिए दुकान को सार्वजनिक जोड़ें, लेकिन अपने घर को हमेशा निजी रूप से सहेजें।',
    },
    tip: {
      en: 'Never add your private family house as a public business place.',
      ta: 'சொந்த வீட்டை பொது வர்த்தக இடமாக ஒருபோதும் பதிவிடக் கூடாது.',
      hi: 'अपने निजी घर को सार्वजनिक व्यापार के रूप में कभी न जोड़ें।',
    },
  },

  // SHOP FLOW STEPS
  step_shop_name: {
    id: 'step_shop_name',
    screen: 'SHOP_FORM_NAME',
    mode: 'SHOP',
    stepNumber: 4,
    totalSteps: 8,
    title: {
      en: '4. Enter Shop Name',
      ta: '4. கடையின் பெயரை உள்ளிடவும்',
      hi: '4. दुकान का नाम दर्ज करें',
    },
    instruction: {
      en: 'Type your official shop or business name as seen on your sign board.',
      ta: 'உங்கள் கடையின் பெயர் பலகையில் உள்ள அதே பெயரை உள்ளிடவும்.',
      hi: 'अपने साइनबोर्ड पर लिखा अपनी दुकान का सही नाम टाइप करें।',
    },
    voiceScript: {
      en: 'Type the exact name of your shop so customers can easily find it.',
      ta: 'வாடிக்கையாளர்கள் எளிதில் அடையாளம் காண கடையின் சரியான பெயரை தட்டச்சு செய்யவும்.',
      hi: 'दुकान का सही नाम लिखें ताकि ग्राहक इसे आसानी से ढूँढ सकें।',
    },
    tip: {
      en: 'Example: "Sri Murugan Kirana Store" or "Lakshmi Tailoring"',
      ta: 'உதாரணம்: "ஸ்ரீ முருகன் மளிகை" அல்லது "லக்ஷ்மி டெய்லர்ஸ்"',
      hi: 'उदाहरण: "श्री मुरुगन किराना स्टोर" या "लक्ष्मी टेलर्स"',
    },
    targetId: 'input-shop-name',
  },

  step_shop_category: {
    id: 'step_shop_category',
    screen: 'SHOP_FORM_CATEGORY',
    mode: 'SHOP',
    stepNumber: 5,
    totalSteps: 8,
    title: {
      en: '5. Select Business Category',
      ta: '5. வணிக வகையைத் தேர்ந்தெடுக்கவும்',
      hi: '5. व्यापार की श्रेणी चुनें',
    },
    instruction: {
      en: 'Pick the category that best matches what you sell.',
      ta: 'உங்கள் கடைக்குரிய சரியான வகையைத் தேர்ந்தெடுக்கவும்.',
      hi: 'अपनी दुकान से मेल खाती सही श्रेणी चुनें।',
    },
    voiceScript: {
      en: 'Select the right business category, like Grocery, Pharmacy, or Clothing.',
      ta: 'மளிகை, மருந்தகம் போன்ற சரியான கடையின் வகையைத் தேர்வு செய்யவும்.',
      hi: 'सही श्रेणी चुनें जैसे किराना दुकान, दवा दुकान या कपड़ों की दुकान।',
    },
    tip: {
      en: 'Correct category helps nearby people find your shop when searching.',
      ta: 'சரியான வகை இருந்தால் மட்டுமே அருகிலுள்ளவர்களால் தேட முடியும்.',
      hi: 'सही श्रेणी चुनने से आस-पास के लोग आसानी से सर्च कर पाते हैं।',
    },
    targetId: 'category-options-list',
  },

  step_shop_pin: {
    id: 'step_shop_pin',
    screen: 'SHOP_PIN_CONFIRM',
    mode: 'SHOP',
    stepNumber: 6,
    totalSteps: 8,
    title: {
      en: '6. Position Map Location Pin',
      ta: '6. மேப் முள்ளை (Pin) சரியான இடத்தில் வைக்கவும்',
      hi: '6. मैप पिन को सही स्थान पर रखें',
    },
    instruction: {
      en: 'Move the red pin on the map so it points right at your shop entrance.',
      ta: 'சிவப்பு நிற முள்ளை உங்கள் கடை வாசல் இருக்கும் இடத்திற்கு சரியாக நகர்த்தவும்.',
      hi: 'लाल पिन को ठीक अपनी दुकान के प्रवेश द्वार पर रखें।',
    },
    voiceScript: {
      en: 'Drag the map to place the red pin exactly at your shop door, then tap Confirm.',
      ta: 'மேப்பை நகர்த்தி உங்கள் கடை வாசலில் முள்ளை வைத்து Confirm அழுத்தவும்.',
      hi: 'मैप को खिसकाकर लाल पिन को दुकान के गेट पर लाएँ और Confirm दबाएँ।',
    },
    tip: {
      en: 'Accurate pin ensures delivery riders and customers reach the exact building.',
      ta: 'துல்லியமான முள் இருந்தால் மட்டுமே வாடிக்கையாளர்கள் சரியாக வந்து சேர முடியும்.',
      hi: 'सटीक पिन लगाने से डिलीवरी वाले और ग्राहक सीधे आपकी दुकान तक पहुँचेंगे।',
    },
    targetId: 'btn-confirm-pin',
  },

  step_shop_extra: {
    id: 'step_shop_extra',
    screen: 'SHOP_EXTRA_DETAILS',
    mode: 'SHOP',
    stepNumber: 7,
    totalSteps: 8,
    title: {
      en: '7. Add Hours & Phone Number',
      ta: '7. வேலை நேரம் & தொலைபேசி எண்',
      hi: '7. खुलने का समय और फ़ोन नंबर',
    },
    instruction: {
      en: 'Add your shop opening hours and phone number so customers can call before visiting.',
      ta: 'கடை திறக்கும் நேரம் மற்றும் தொலைபேசி எண்ணை சேர்க்கவும்.',
      hi: 'दुकान खुलने का समय और फ़ोन नंबर जोड़ें ताकि ग्राहक कॉल कर सकें।',
    },
    voiceScript: {
      en: 'Adding your operating hours and phone number builds trust with your customers.',
      ta: 'நேரமும் தொலைபேசி எண்ணும் இருந்தால் வாடிக்கையாளர்களுக்கு நம்பிக்கை கூடும்.',
      hi: 'समय और फ़ोन नंबर जोड़ने से ग्राहकों का भरोसा बढ़ता है।',
    },
    tip: {
      en: 'Google uses the phone number to verify that you are the real owner.',
      ta: 'நீங்கள் தான் உண்மையான உரிமையாளர் என்பதை சரிபார்க்க இந்த எண் பயன்படும்.',
      hi: 'गूगल इस नंबर से पुष्टि करता है कि आप ही असली मालिक हैं।',
    },
    targetId: 'btn-submit-shop',
  },

  step_shop_success: {
    id: 'step_shop_success',
    screen: 'SHOP_SUCCESS',
    mode: 'SHOP',
    stepNumber: 8,
    totalSteps: 8,
    title: {
      en: '8. Submitted for Google Review',
      ta: '8. சரிபார்ப்புக்கு அனுப்பப்பட்டது',
      hi: '8. गूगल समीक्षा के लिए सबमिट हुआ',
    },
    instruction: {
      en: 'Your shop details have been submitted! Public places are reviewed by Google within 24–48 hours.',
      ta: 'உங்கள் கடை விவரங்கள் அனுப்பப்பட்டன! பொதுவாக 24 முதல் 48 மணி நேரத்தில் கூகுள் இதை சரிபார்த்து வெளியிடும்.',
      hi: 'आपकी दुकान की जानकारी सबमिट हो गई है! 24-48 घंटों में गूगल इसे सत्यापित करके मैप पर दिखाएगा।',
    },
    voiceScript: {
      en: 'Congratulations! Your shop submission is under review by Google. It will appear publicly on the map once verified.',
      ta: 'வாழ்த்துகள்! உங்கள் கடை விவரம் கூகுள் சரிபார்ப்பில் உள்ளது. சரிபார்த்த பின் மேப்பில் அனைவருக்கும் தெரியும்.',
      hi: 'बधाई हो! आपकी दुकान समीक्षा में है। सत्यापन के बाद यह मैप पर सबको दिखने लगेगी।',
    },
    tip: {
      en: 'You will receive an email confirmation once the place is approved and published.',
      ta: 'இடம் ஏற்கப்பட்டதும் உங்கள் மின்னஞ்சலுக்கு தகவல் வரும்.',
      hi: 'जगह स्वीकृत होने पर आपको ईमेल मिल जाएगा।',
    },
  },

  // HOME FLOW STEPS
  step_home_privacy: {
    id: 'step_home_privacy',
    screen: 'HOME_PRIVACY_EXPLANATION',
    mode: 'HOME',
    stepNumber: 4,
    totalSteps: 7,
    title: {
      en: '4. Why Homes Must Be Private',
      ta: '4. வீட்டின் முகவரி ஏன் ரகசியமாக இருக்க வேண்டும்?',
      hi: '4. घर का पता निजी क्यों होना चाहिए?',
    },
    instruction: {
      en: 'Learn the safety rule: Never add your personal residence as a public map place.',
      ta: 'பாதுகாப்பு விதி: சொந்த வீட்டை பொது மேப் இடமாக ஒருபோதும் சேர்க்கக் கூடாது.',
      hi: 'सुरक्षा नियम: अपने रहने के घर को कभी भी सार्वजनिक मैप स्थल न बनाएँ।',
    },
    voiceScript: {
      en: 'Safety first: A public place on Google Maps is visible to millions of strangers. For your home, always use the private Saved Home feature.',
      ta: 'பாதுகாப்பே முதன்மை! பொதுவில் சேர்த்தால் அறிமுகமில்லாதவர்கள் பார்க்கக்கூடும். எனவே பிரைவேட் Home அம்சத்தை மட்டுமே பயன்படுத்தவும்.',
      hi: 'सुरक्षा सर्वोपरि: सार्वजनिक जगह लाखों अनजान लोग देख सकते हैं। घर के लिए हमेशा निजी "Saved Home" का ही उपयोग करें।',
    },
    tip: {
      en: 'Private Home is visible ONLY on your phone when you are logged into your account.',
      ta: 'பிரைவேட் Home உங்கள் போனில் உங்களுக்கு மட்டுமே தெரியும்.',
      hi: 'निजी Home सिर्फ आपके फ़ोन में आपको ही दिखेगा।',
    },
    targetId: 'btn-proceed-private-home',
  },

  step_home_menu: {
    id: 'step_home_menu',
    screen: 'HOME_SAVED_MENU',
    mode: 'HOME',
    stepNumber: 5,
    totalSteps: 7,
    title: {
      en: '5. Open "Saved" -> "Home"',
      ta: '5. "Saved" -> "Home" பகுதியைத் திறக்கவும்',
      hi: '5. "Saved" -> "Home" विकल्प खोलें',
    },
    instruction: {
      en: 'Tap on "Saved" at the bottom, then choose "Home" to set your private address.',
      ta: 'கீழே உள்ள "Saved" என்பதைத் தொட்டு, "Home" என்ற பகுதியைத் தேர்ந்தெடுக்கவும்.',
      hi: 'नीचे "Saved" पर टैप करें और फिर "Home" विकल्प चुनें।',
    },
    voiceScript: {
      en: 'Tap Saved at the bottom, then tap Set Home to store your private address safely.',
      ta: 'கீழே Saved தொட்டு, பின்னர் Set Home என்பதைத் தொடவும்.',
      hi: 'नीचे Saved पर टैप करें, फिर सुरक्षित पते के लिए Set Home दबाएँ।',
    },
    tip: {
      en: 'This allows quick 1-tap navigation home without making your address public.',
      ta: 'முகவரி பொதுவில் தெரியாமல் 1-கிளிக்கில் நீங்கள் வீடு திரும்ப இது உதவும்.',
      hi: 'इससे आपका पता बिना सार्वजनिक हुए एक क्लिक में नेविगेशन मिल जाता है।',
    },
    targetId: 'btn-set-home-address',
  },

  step_home_pin: {
    id: 'step_home_pin',
    screen: 'HOME_SET_PIN',
    mode: 'HOME',
    stepNumber: 6,
    totalSteps: 7,
    title: {
      en: '6. Confirm Your Private Home Pin',
      ta: '6. உங்கள் வீட்டின் இடத்தை உறுதிப்படுத்தவும்',
      hi: '6. अपने निजी घर का स्थान निश्चित करें',
    },
    instruction: {
      en: 'Check the location pin on the map and tap "Save Home".',
      ta: 'வீட்டின் இருப்பிட முள்ளை சரிபார்த்து "Save Home" என்பதைத் தொடவும்.',
      hi: 'मैप पर घर का पिन जाँचें और "Save Home" पर टैप करें।',
    },
    voiceScript: {
      en: 'Position the pin over your house and tap Save Home.',
      ta: 'உங்கள் வீட்டின் மேல் முள்ளை வைத்து Save Home என்பதைத் தொடவும்.',
      hi: 'अपने मकान पर पिन रखें और Save Home दबाएँ।',
    },
    tip: {
      en: 'No review is needed for private addresses. It saves instantly.',
      ta: 'இதற்கு கூகுள் சரிபார்ப்பு தேவையில்லை, உடனடியாக சேமிக்கப்படும்.',
      hi: 'निजी पते के लिए किसी समीक्षा की जरूरत नहीं, तुरंत सहेज लिया जाता है।',
    },
    targetId: 'btn-save-private-home',
  },

  step_home_success: {
    id: 'step_home_success',
    screen: 'HOME_SUCCESS',
    mode: 'HOME',
    stepNumber: 7,
    totalSteps: 7,
    title: {
      en: '7. Home Saved Privately & Securely',
      ta: '7. வீடு பாதுகாப்பாக சேமிக்கப்பட்டது',
      hi: '7. घर सुरक्षित रूप से सहेज लिया गया',
    },
    instruction: {
      en: 'Your home is now saved privately! You can say "Hey Google, take me home" for instant directions.',
      ta: 'உங்கள் வீடு ரகசியமாக சேமிக்கப்பட்டது! "Take me home" என்று கூறினால் எளிதாக வழிகாட்டும்.',
      hi: 'आपका घर निजी तौर पर सहेज लिया गया है! अब आप आसानी से घर का रास्ता पा सकते हैं।',
    },
    voiceScript: {
      en: 'Great job! Your home location is saved privately to your account. No strangers can view it.',
      ta: 'அருமை! உங்கள் வீட்டின் முகவரி உங்கள் கணக்கில் பாதுகாப்பாக சேமிக்கப்பட்டது. மற்றவர்களால் பார்க்க முடியாது.',
      hi: 'बहुत बढ़िया! आपके घर का पता आपके खाते में सुरक्षित है। कोई अनजान व्यक्ति इसे नहीं देख सकता।',
    },
    tip: {
      en: 'Only you see your private home icon with a house symbol.',
      ta: 'வீட்டின் சின்னம் உங்களுக்கு மட்டுமே தெரியும்.',
      hi: 'घर का चिन्ह केवल आपकी स्क्रीन पर दिखेगा।',
    },
  },
};

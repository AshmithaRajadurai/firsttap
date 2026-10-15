import { CatalogueProduct, StepInstruction, LanguageCode } from './types';

export const SAMPLE_PRODUCTS: CatalogueProduct[] = [
  {
    id: 'prod-rice-1',
    name: 'Royal Ponni Boiled Rice (25kg)',
    price: 1350,
    description: 'Thanjavur premium quality aged Ponni boiled rice. Double polished, stone-free, best for daily family meals.',
    productCode: 'RICE-25KG',
    category: 'Groceries & Staples',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    inStock: true,
  },
  {
    id: 'prod-veg-2',
    name: 'Fresh Farm Vegetables Basket (5kg)',
    price: 240,
    description: 'Handpicked fresh morning harvest: Tomatoes (1kg), Country Onions (1kg), Potatoes (1kg), Green Beans & Carrots (1kg), Coriander.',
    productCode: 'VEG-BASKET-01',
    category: 'Fresh Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    inStock: true,
  },
  {
    id: 'prod-snack-3',
    name: 'Traditional Crunchy Banana Chips (500g)',
    price: 180,
    description: 'Crispy raw Nendran banana chips fried in 100% pure cold-pressed coconut oil. Lightly salted, zero preservatives.',
    productCode: 'SNACK-BANANA-500',
    category: 'Snacks & Savouries',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=600&q=80',
    inStock: true,
  },
  {
    id: 'prod-clothes-4',
    name: 'Pure Handloom Cotton Saree (Green & Gold)',
    price: 1650,
    description: 'Traditional 100% woven soft cotton saree with elegant zari border and matching blouse piece. Comfortable for all seasons.',
    productCode: 'SAR-COTTON-04',
    category: 'Clothing & Apparel',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    inStock: true,
  },
  {
    id: 'prod-craft-5',
    name: 'Handcrafted Terracotta Clay Flower Pot (Set of 2)',
    price: 450,
    description: 'Natural eco-friendly kiln-fired red clay pots painted with traditional motifs. Hand-shaped by village potters.',
    productCode: 'CRAFT-POT-02',
    category: 'Handmade & Crafts',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    inStock: true,
  },
];

export const SHOP_PRESETS = [
  {
    id: 'murugan_stores',
    name: 'Murugan Grocery & Maligai Store',
    category: 'Grocery Store',
    description: 'Fresh quality rice, pulses, cooking oils, vegetables and daily home needs. Fast free doorstep delivery in 30 mins!',
    address: '14, Market Road, Near Gandhi Statue, Madurai - 625001',
    photoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    phone: '+91 98401 23456',
  },
  {
    id: 'priya_textiles',
    name: 'Sri Priya Handlooms & Sarees',
    category: 'Apparel & Clothing',
    description: 'Authentic South Indian cotton sarees, dhotis, matching blouses and dress materials at direct weaver wholesale prices.',
    address: '88, Car Street, Kanchipuram - 631502',
    photoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
    phone: '+91 94440 98765',
  },
  {
    id: 'sharma_sweets',
    name: 'Sharma Ji Namkeen & Sweets',
    category: 'Food & Beverage',
    description: 'Delicious hot snacks, pure ghee laddoos, samosas, banana chips, and special homemade mixtures.',
    address: '22, Main Bazaar, Jaipur - 302001',
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    phone: '+91 98110 54321',
  },
];

export const PART1_STEPS: StepInstruction[] = [
  {
    id: 'p1_s1_home',
    title: {
      en: 'Step 1: Open WhatsApp Business',
      ta: 'படி 1: வாட்ஸ்அப் பிசினஸ் செயலியைத் திறக்கவும்',
      hi: 'चरण 1: व्हाट्सएप बिजनेस ऐप खोलें',
    },
    voiceText: {
      en: 'Welcome shopkeeper! Look at your phone home screen. Find and tap the green WhatsApp Business icon with the letter B.',
      ta: 'வணக்கம் வியாபாரி நண்பரே! உங்கள் போன் திரையில் உள்ள பிசினஸ் குறி உள்ள பச்சை நிற வாட்ஸ்அப் ஐகானை தொடவும்.',
      hi: 'नमस्ते दुकानदार साथी! अपने फोन स्क्रीन पर "B" लिखे हरे व्हाट्सएप बिजनेस ऐप पर टच करें।',
    },
    subtitles: {
      en: 'Find and tap the WhatsApp Business app icon (with letter "B") on your smartphone screen.',
      ta: 'உங்கள் ஸ்மார்ட்போன் திரையில் "B" எழுத்து உள்ள வாட்ஸ்அப் பிசினஸ் ஐகானைத் தொடவும்.',
      hi: 'अपने मोबाइल स्क्रीन पर "B" अक्षर वाले व्हाट्सएप बिजनेस ऐप को दबाएं।',
    },
    tip: {
      en: 'Notice the capital letter "B" in the logo. This signifies it is specially made for businesses!',
      ta: 'வாட்ஸ்அப் ஐகானில் உள்ள "B" குறி இது வியாபாரிகளுக்கான பிரத்யேக செயலி என்பதைக் காட்டுகிறது!',
      hi: 'लोगो पर "B" अक्षर का मतलब है कि यह विशेष रूप से व्यापार और दुकानों के लिए है!',
    },
    actionPrompt: {
      en: 'Tap the WA Business icon',
      ta: 'WA Business ஐகானைத் தொடவும்',
      hi: 'WA Business ऐप छुएं',
    },
    targetElementId: 'app-icon-wabusiness',
  },
  {
    id: 'p1_s2_welcome_lang',
    title: {
      en: 'Step 2: Choose Language & Agree',
      ta: 'படி 2: மொழியைத் தேர்ந்தெடுத்து தொடரவும்',
      hi: 'चरण 2: भाषा चुनें और आगे बढ़ें',
    },
    voiceText: {
      en: 'Great job! Now select your preferred language and tap the green Agree and Continue button to start setup.',
      ta: 'அருமை! இப்போது உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுத்து, கீழே உள்ள பச்சை நிற சம்மதம் தெரிவித்து தொடரவும் பொத்தானை அழுத்தவும்.',
      hi: 'शाबाश! अब अपनी भाषा चुनें और नीचे दिए गए हरे रंग के "स्वीकार करें और जारी रखें" बटन पर टैप करें।',
    },
    subtitles: {
      en: 'Select your preferred language, then tap the green "Agree and Continue" button.',
      ta: 'உங்கள் மொழியைத் தேர்ந்தெடுத்து, "சம்மதித்து தொடர்க" (Agree and Continue) பொத்தானைத் தொடவும்.',
      hi: 'भाषा चुनने के बाद "स्वीकार करें और आगे बढ़ें" बटन को दबाएं।',
    },
    tip: {
      en: 'You can change your app language anytime later in Settings.',
      ta: 'நீங்கள் விரும்பினால் எப்போது வேண்டுமானாலும் அமைப்புகளில் மொழியை மாற்றிக்கொள்ளலாம்.',
      hi: 'आप बाद में सेटिंग्स में जाकर कभी भी भाषा बदल सकते हैं।',
    },
    actionPrompt: {
      en: 'Tap "Agree and Continue"',
      ta: '"சம்மதித்து தொடர்க" பொத்தானைத் தொடவும்',
      hi: '"स्वीकार करें और जारी रखें" दबाएं',
    },
    targetElementId: 'btn-agree-continue',
  },
  {
    id: 'p1_s3_phone_input',
    title: {
      en: 'Step 3: Enter Business Phone Number',
      ta: 'படி 3: உங்கள் கடை தொலைபேசி எண்ணை உள்ளிடவும்',
      hi: 'चरण 3: अपनी दुकान का फोन नंबर दर्ज करें',
    },
    voiceText: {
      en: 'Now enter your business phone number. In this simulation, you can tap Auto-fill Fictional Number safely.',
      ta: 'இப்போது உங்கள் கடை தொலைபேசி எண்ணை பதிவு செய்ய வேண்டும். இந்த மாதிரி பயிற்சியில் மாதிரி எண்ணை எளிதாக உள்ளிடலாம்.',
      hi: 'अब अपनी दुकान का 10 अंकों का मोबाइल नंबर डालें। इस अभ्यास में आप सुरक्षित रूप से डेमो नंबर भर सकते हैं।',
    },
    subtitles: {
      en: 'Enter your 10-digit shop phone number. Tap Next to continue.',
      ta: 'உங்கள் 10 இலக்க கடை மொபைல் எண்ணை உள்ளிட்டு "அடுத்து" (Next) தொடவும்.',
      hi: 'अपनी दुकान का 10 अंकों का फोन नंबर भरें और "आगे बढ़ें" (Next) पर टैप करें।',
    },
    tip: {
      en: 'Use your dedicated business SIM card so customer chats stay separate from personal family chats.',
      ta: 'குடும்ப உரையாடல்களும் கடை வாடிக்கையாளர் உரையாடல்களும் கலக்காமல் இருக்க கடைக்கான தனி சிம்மை பயன்படுத்துவது சிறந்தது.',
      hi: 'व्यक्तिगत और व्यापारिक संदेश अलग रखने के लिए दुकान का अलग नंबर इस्तेमाल करना बेहतर है।',
    },
    actionPrompt: {
      en: 'Fill number and tap Next',
      ta: 'எண்ணை பூர்த்தி செய்து "அடுத்து" தொடவும்',
      hi: 'नंबर भरकर "Next" दबाएं',
    },
    targetElementId: 'btn-submit-phone',
  },
  {
    id: 'p1_s4_otp_verify',
    title: {
      en: 'Step 4: Verify with Simulated OTP',
      ta: 'படி 4: மாதிரி ரகசிய குறியீட்டை சரிபார்க்கவும் (OTP)',
      hi: 'चरण 4: नकली ओटीपी (OTP) डालकर नंबर सत्यापित करें',
    },
    voiceText: {
      en: 'WhatsApp sends a six-digit verification code by SMS. In our safe simulation, tap Auto-fill Code to verify!',
      ta: 'வாட்ஸ்அப் உங்கள் எண்ணை சரிபார்க்க ஆறு இலக்க குறுஞ்செய்தி குறியீட்டை அனுப்பும். இந்த பயிற்சியில் தானாக குறியீட்டை நிரப்பலாம்.',
      hi: 'व्हाट्सएप आपके नंबर पर 6 अंकों का एसएमएस कोड भेजता है। अभ्यास के लिए "Auto-fill Code" दबाएं।',
    },
    subtitles: {
      en: 'Enter the 6-digit verification code. (Simulated code: 482-196).',
      ta: '6 இலக்க சரிபார்ப்பு குறியீட்டை உள்ளிடவும். (மாதிரி குறியீடு: 482-196).',
      hi: '6 अंकों का सत्यापन कोड दर्ज करें। (अभ्यास कोड: 482-196).',
    },
    tip: {
      en: 'Security rule: Never share your real OTP with anyone over phone calls, even if they claim to be from bank or police!',
      ta: 'பாதுகாப்பு குறிப்பு: வங்கி அல்லது அதிகாரிகளென யாரேனும் போனில் கேட்டாலும் உண்மையான OTP-யை யாரிடமும் கூறாதீர்கள்!',
      hi: 'सुरक्षा नियम: कभी भी अपना असली ओटीपी किसी को फोन पर न बताएं!',
    },
    actionPrompt: {
      en: 'Tap "Auto-fill Simulated Code" or enter 482196',
      ta: '"மாதிரி குறியீட்டை நிரப்புக" அல்லது 482196 உள்ளிடவும்',
      hi: '"Auto-fill Code" दबाएं या 482196 भरें',
    },
    targetElementId: 'btn-autofill-otp',
  },
  {
    id: 'p1_s5_profile_setup',
    title: {
      en: 'Step 5: Fill Business Profile Details',
      ta: 'படி 5: கடை பெயர் மற்றும் விபரங்களை உள்ளிடவும்',
      hi: 'चरण 5: दुकान का नाम और व्यापार की जानकारी भरें',
    },
    voiceText: {
      en: 'Now enter your shop name, choose a business category, select a storefront picture, address and description.',
      ta: 'இப்போது உங்கள் கடையின் பெயர், வணிக வகை, கடை முகப்பு புகைப்படம், முகவரி மற்றும் சிறு அறிமுக விபரங்களை நிரப்புங்கள்.',
      hi: 'अब अपनी दुकान का नाम लिखें, व्यापार की श्रेणी चुनें, दुकान का फोटो लगाएं, और पता व विवरण भरें।',
    },
    subtitles: {
      en: 'Enter Shop Name, Category, Photo, Address, and Description. Then tap Next.',
      ta: 'கடை பெயர், வகை, புகைப்படம், முகவரி ஆகியவற்றை உள்ளிட்டு "அடுத்து" தொடவும்.',
      hi: 'दुकान का नाम, श्रेणी, फोटो, पता और विवरण भरकर "Next" दबाएं।',
    },
    tip: {
      en: 'Clear shop names and friendly descriptions build instant trust with local customers on WhatsApp.',
      ta: 'தெளிவான கடை பெயரும் உண்மை முகவரியும் வாடிக்கையாளர் நம்பிக்கையை பல மடங்கு உயர்த்தும்.',
      hi: 'साफ नाम और सही पता ग्राहकों का भरोसा जीतने में मदद करता है।',
    },
    actionPrompt: {
      en: 'Fill details and tap Next',
      ta: 'விபரங்களை பூர்த்தி செய்து "அடுத்து" தொடவும்',
      hi: 'जानकारी भरकर "Next" दबाएं',
    },
    targetElementId: 'btn-save-profile',
  },
  {
    id: 'p1_s6_profile_card',
    title: {
      en: 'Step 6: Completed Business Profile',
      ta: 'படி 6: உங்கள் கடை சுயவிவரம் தயாராகிவிட்டது!',
      hi: 'चरण 6: आपकी दुकान की प्रोफाइल पूरी हो गई!',
    },
    voiceText: {
      en: 'Congratulations! Your official WhatsApp Business profile is ready. Customers will see this professional profile when they message you.',
      ta: 'வாழ்த்துகள்! உங்கள் கடைக்கான அதிகாரப்பூர்வ வாட்ஸ்அப் பிசினஸ் சுயவிவரம் தயாராகிவிட்டது. வாடிக்கையாளர்கள் இதை நேரடியாகப் பார்ப்பார்கள்.',
      hi: 'बधाई हो! आपकी दुकान का आधिकारिक व्हाट्सएप बिजनेस प्रोफाइल तैयार है। अब ग्राहक आपकी दुकान का यह कार्ड देख सकेंगे।',
    },
    subtitles: {
      en: 'View your completed WhatsApp Business card. Tap "Proceed to Catalogue" to learn adding products!',
      ta: 'தயாரான கடை சுயவிவரத்தைக் காணுங்கள். அடுத்து "பொருட்கள் பட்டியல்" பகுதிக்குச் செல்லவும்.',
      hi: 'अपनी पूरी प्रोफाइल देखें। अब उत्पाद जोड़ने के लिए "कैटलॉग पर जाएं" दबाएं।',
    },
    tip: {
      en: 'A green Verified Business badge gives customers confidence that your shop is legitimate.',
      ta: 'பச்சை நிற சரிபார்க்கப்பட்ட குறியீடு உங்கள் கடை நம்பகமானது என வாடிக்கையாளர்களுக்கு உறுதி அளிக்கும்.',
      hi: 'वेरिफाइड बिजनेस बैज ग्राहकों को आपकी दुकान की प्रामाणिकता का विश्वास दिलाता है।',
    },
    actionPrompt: {
      en: 'Tap "Proceed to Part 2: Catalogue"',
      ta: '"பகுதி 2: பொருட்கள் பட்டியல்" தொடரவும்',
      hi: '"भाग 2: कैटलॉग पर जाएं" दबाएं',
    },
    targetElementId: 'btn-go-catalogue',
  },
];

export const PART2_STEPS: StepInstruction[] = [
  {
    id: 'p2_s1_home_tools',
    title: {
      en: 'Step 1: Open Business Tools',
      ta: 'படி 1: வணிக கருவிகள் (Business Tools) பகுதிக்குச் செல்லவும்',
      hi: 'चरण 1: बिजनेस टूल्स (Business Tools) खोलें',
    },
    voiceText: {
      en: 'Welcome to your WhatsApp Business home! At the top left, tap the storefront icon to open Business Tools.',
      ta: 'உங்கள் வாட்ஸ்அப் முகப்பு பக்கத்திற்கு நல்வரவு! மேலே உள்ள கடை ஐகானைத் தொட்டு வணிக கருவிகளை (Business Tools) திறக்கவும்.',
      hi: 'अपने व्हाट्सएप बिजनेस होम में आपका स्वागत है! ऊपर दुकान वाले आइकन पर टैप करके "बिजनेस टूल्स" खोलें।',
    },
    subtitles: {
      en: 'Tap the Business Tools tab (storefront icon) at the top of the WhatsApp screen.',
      ta: 'வாட்ஸ்அப் திரையின் மேற்பகுதியில் உள்ள கடை ஐகானை (Business Tools) தொடவும்.',
      hi: 'व्हाट्सएप स्क्रीन के ऊपर दुकान वाले "Business Tools" आइकन को दबाएं।',
    },
    tip: {
      en: 'Business Tools is where you manage your Catalogue, Auto-greetings, and Quick Replies.',
      ta: 'பிசினஸ் டூல்ஸ் பகுதியில் தான் பொருட்கள் பட்டியல், தானியங்கி வரவேற்பு செய்திகள் போன்றவற்றை இயக்கலாம்.',
      hi: 'बिजनेस टूल्स में आप अपना कैटलॉग, स्वागत संदेश और त्वरित उत्तर सेट कर सकते हैं।',
    },
    actionPrompt: {
      en: 'Tap Business Tools tab',
      ta: 'பிசினஸ் டூல்ஸ் பகுதியைத் தொடவும்',
      hi: 'बिजनेस टूल्स टैब दबाएं',
    },
    targetElementId: 'tab-business-tools',
  },
  {
    id: 'p2_s2_select_catalogue',
    title: {
      en: 'Step 2: Select "Catalogue"',
      ta: 'படி 2: "கேட்லாக்" (Catalogue) என்பதைத் தேர்ந்தெடுக்கவும்',
      hi: 'चरण 2: "कैटलॉग" (Catalogue) विकल्प चुनें',
    },
    voiceText: {
      en: 'Here are your shop tools. Tap on Catalogue to showcase your products and prices to buyers.',
      ta: 'இங்கு உங்கள் கடை கருவிகள் உள்ளன. உங்கள் பொருட்களையும் விலைகளையும் காட்ட "கேட்லாக்" (Catalogue) என்பதைத் தொடவும்.',
      hi: 'यहां आपके दुकान के उपकरण हैं। अपने सामान और कीमतें दिखाने के लिए "कैटलॉग" (Catalogue) पर टैप करें।',
    },
    subtitles: {
      en: 'Tap on "Catalogue - Showcase your products and services".',
      ta: '"கேட்லாக் - உங்கள் பொருட்களை வாடிக்கையாளர்களுக்கு காட்டுங்கள்" என்பதைத் தொடவும்.',
      hi: '"कैटलॉग - अपने सामान और सेवाओं को दिखाएं" पर टैप करें।',
    },
    tip: {
      en: 'Your catalogue works like a 24/7 digital mini-shop window on your customers phones!',
      ta: 'உங்கள் கேட்லாக் ஒரு 24 மணி நேர டிஜிட்டல் கடை ஜன்னல் போல வாடிக்கையாளர் மொபைலில் இயங்கும்!',
      hi: 'कैटलॉग आपके ग्राहकों के फोन में आपकी 24 घंटे खुली रहने वाली डिजिटल दुकान की तरह है!',
    },
    actionPrompt: {
      en: 'Tap "Catalogue"',
      ta: '"கேட்லாக்" என்பதைத் தொடவும்',
      hi: '"Catalogue" छुएं',
    },
    targetElementId: 'item-tool-catalogue',
  },
  {
    id: 'p2_s3_add_new_item',
    title: {
      en: 'Step 3: Tap "Add new item"',
      ta: 'படி 3: "புதிய பொருளைச் சேர்" (Add new item) பொத்தானைத் தொடவும்',
      hi: 'चरण 3: "नया आइटम जोड़ें" (Add new item) दबाएं',
    },
    voiceText: {
      en: 'Your catalogue is empty right now. Tap the green Add new item button to list your first product.',
      ta: 'தற்போது உங்கள் பட்டியல் காலியாக உள்ளது. முதல் பொருளைச் சேர்க்க பச்சை நிற "Add new item" பொத்தானைத் தொடவும்.',
      hi: 'अभी आपका कैटलॉग खाली है। पहला सामान जोड़ने के लिए हरे "Add new item" बटन पर टैप करें।',
    },
    subtitles: {
      en: 'Tap the green "+ Add new item" button to start creating a product listing.',
      ta: 'பொருளைச் சேர்க்க பச்சை நிற "+ Add new item" பொத்தானைத் தொடவும்.',
      hi: 'सामान जोड़ने के लिए हरे रंग का "+ Add new item" बटन दबाएं।',
    },
    tip: {
      en: 'You can add up to 500 items in your WhatsApp Business catalogue with photos and descriptions.',
      ta: 'உங்கள் வாட்ஸ்அப் பட்டியலில் 500 பொருட்கள் வரை புகைப்படத்துடன் இலவசமாக சேர்க்கலாம்.',
      hi: 'आप अपने व्हाट्सएप कैटलॉग में 500 तक उत्पाद फोटो और विवरण के साथ जोड़ सकते हैं।',
    },
    actionPrompt: {
      en: 'Tap "Add new item"',
      ta: '"Add new item" தொடவும்',
      hi: '"Add new item" दबाएं',
    },
    targetElementId: 'btn-add-new-item',
  },
  {
    id: 'p2_s4_enter_product',
    title: {
      en: 'Step 4: Fill Product Details',
      ta: 'படி 4: பொருளின் புகைப்படம், பெயர் மற்றும் விலையை உள்ளிடவும்',
      hi: 'चरण 4: सामान की फोटो, नाम और कीमत भरें',
    },
    voiceText: {
      en: 'Now pick a product photo, write its name, enter the price in rupees, and add a helpful description.',
      ta: 'இப்போது பொருளின் புகைப்படத்தை தேர்வு செய்து, பெயர், ரூபாய் விலை மற்றும் விபரங்களை உள்ளிடுங்கள்.',
      hi: 'अब सामान की फोटो लगाएं, नाम लिखें, रुपये में कीमत डालें और आसान विवरण भरें।',
    },
    subtitles: {
      en: 'Fill Photo, Product Name (e.g. Ponni Rice), Price (₹), and Description.',
      ta: 'புகைப்படம், பொருளின் பெயர் (எ.கா: பொன்னி அரிசி), விலை (₹), விபரங்களை நிரப்பவும்.',
      hi: 'फोटो, उत्पाद का नाम (जैसे: पोन्नी चावल), कीमत (₹) और विवरण भरें।',
    },
    tip: {
      en: 'Always mention quantity or weight (like 1kg, 25kg, or Pack of 2) in the item name so buyers know exactly what they get.',
      ta: 'பொருளின் பெயரிலேயே எடை அல்லது எண்ணிக்கையை (எ.கா: 1 கிலோ, 25 கிலோ) தெளிவாகக் குறிப்பிடுங்கள்.',
      hi: 'सामान के नाम में मात्रा या वजन (जैसे 1 किलो, 25 किलो) जरूर लिखें ताकि खरीदार को साफ समझ आए।',
    },
    actionPrompt: {
      en: 'Select sample product or type, then tap Save',
      ta: 'மாதிரி பொருளைத் தேர்ந்தெடுத்து "சேமி" (Save) தொடவும்',
      hi: 'सामान चुनें या टाइप करें, फिर "Save" दबाएं',
    },
    targetElementId: 'btn-save-catalogue-item',
  },
  {
    id: 'p2_s5_product_saved',
    title: {
      en: 'Step 5: View Saved Item with Approval Badge',
      ta: 'படி 5: பட்டியலில் சேர்க்கப்பட்ட பொருளைக் காணுங்கள்',
      hi: 'चरण 5: कैटलॉग में जुड़ा हुआ सामान देखें',
    },
    voiceText: {
      en: 'Well done! Your product is saved and verified in your catalogue. Notice the green approved badge.',
      ta: 'அருமை! உங்கள் பொருள் வெற்றிகரமாக பட்டியலில் சேர்க்கப்பட்டுவிட்டது. பச்சை நிற சரிபார்ப்பு குறியீட்டைக் காணுங்கள்.',
      hi: 'बहुत बढ़िया! आपका सामान कैटलॉग में सुरक्षित हो गया है और व्हाट्सएप द्वारा स्वीकृत हो चुका है।',
    },
    subtitles: {
      en: 'Your product is now listed with photo, price, and green approval checkmark.',
      ta: 'உங்கள் பொருள் புகைப்படம், விலை மற்றும் பச்சை நிற அங்கீகார குறியீட்டுடன் தயாராக உள்ளது.',
      hi: 'आपका सामान फोटो, कीमत और हरे अप्रूवल टिक के साथ तैयार है।',
    },
    tip: {
      en: 'WhatsApp automatically reviews catalogue items to ensure safe commerce for customers.',
      ta: 'வாடிக்கையாளர் பாதுகாப்பிற்காக வாட்ஸ்அப் இந்த பொருட்களை தானாக சரிபார்க்கிறது.',
      hi: 'व्हाट्सएप ग्राहकों की सुरक्षा के लिए कैटलॉग सामान की तुरंत समीक्षा करता है।',
    },
    actionPrompt: {
      en: 'Tap "Add More Sample Products"',
      ta: '"கூடுதல் மாதிரி பொருட்களைச் சேர்" என்பதைத் தொடவும்',
      hi: '"और सामान जोड़ें" पर टैप करें',
    },
    targetElementId: 'btn-add-more-products',
  },
  {
    id: 'p2_s6_finished_catalogue',
    title: {
      en: 'Step 6: Completed Multi-Item Catalogue & Sharing',
      ta: 'படி 6: முழுமையான கடை கேட்லாக் மற்றும் பகிர்வு',
      hi: 'चरण 6: पूरा कैटलॉग और ग्राहकों को शेयर करना',
    },
    voiceText: {
      en: 'Superb! You now have a rich catalogue with rice, fresh vegetables, snacks, and clothes. You can share this link directly with customers!',
      ta: 'அற்புதம்! இப்போது அரிசி, காய்கறிகள், தின்பண்டங்கள் என பல பொருட்கள் உங்கள் பட்டியலில் உள்ளன. இந்த லிங்கை வாடிக்கையாளர்களுக்கு அனுப்பலாம்.',
      hi: 'शानदार! अब आपके कैटलॉग में चावल, सब्जियां, स्नैक्स और कपड़े जुड़ चुके हैं। आप यह लिंक सीधे ग्राहकों को भेज सकते हैं!',
    },
    subtitles: {
      en: 'Explore the full customer-facing view. Tap "Share Link" or test ordering as a customer.',
      ta: 'வாடிக்கையாளர் பார்க்கும் முழு கேட்லாக்கை பார்வையிடுங்கள். "Share Link" மூலம் பகிரலாம்.',
      hi: 'ग्राहक को दिखने वाला पूरा कैटलॉग देखें। "शेयर लिंक" दबाकर अभ्यास करें।',
    },
    tip: {
      en: 'Customers can browse your catalogue and click "Message Business about this item" to order instantly!',
      ta: 'வாடிக்கையாளர்கள் உங்கள் பொருட்களைப் பார்த்து ஒரே தட்டலில் ஆர்டர் செய்ய வாட்ஸ்அப் செய்தி அனுப்பலாம்!',
      hi: 'ग्राहक कैटलॉग देखकर तुरंत "Message Business" बटन से ऑर्डर भेज सकते हैं!',
    },
    actionPrompt: {
      en: 'Tap "Proceed to Practice Activity"',
      ta: '"பயிற்சி சோதனைக்குச் செல்லவும்" (Practice) தொடவும்',
      hi: '"अभ्यास गतिविधि पर जाएं" दबाएं',
    },
    targetElementId: 'btn-go-practice',
  },
];

import { SpamCallLesson, PracticeTask, PracticeStep, ChallengeScenario, SpamLessonMeta, SpamStepId } from './types';

export const ALL_FRAUD_LESSONS: SpamCallLesson[] = [
  // ================= LESSON 1: Fake Bank Call (ATM PIN Scam) =================
  {
    id: 1,
    code: 'S1',
    type: 'CALL',
    title: {
      en: '1. Fake Bank Call & ATM PIN Scam',
      ta: '1. போலி வங்கி அழைப்பு & ஏடிஎம் பின் மோசடி',
      hi: '1. फर्जी बैंक कॉल और एटीएम पिन घोटाला',
    },
    shortTitle: {
      en: 'ATM PIN Scam',
      ta: 'ஏடிஎம் பின் மோசடி',
      hi: 'एटीएम पिन घोटाला',
    },
    description: {
      en: 'Learn to recognize a fake bank caller demanding your ATM PIN, hang up, and block.',
      ta: 'வங்கியில் இருந்து பேசுவதாக ஏடிஎம் பின் கேட்கும் போலி அழைப்பை நிராகரித்து பிளாக் செய்யப் பழகுங்கள்.',
      hi: 'फर्जी बैंक अधिकारी द्वारा एटीएम पिन मांगने की पहचान करें, कॉल काटें और नंबर ब्लॉक करें।',
    },
    callerName: 'SBI Card Security / Verification',
    callerNumber: '+91 91234 56789',
    callerOrg: {
      en: 'State Bank of India (Claimed)',
      ta: 'ஸ்டேட் பாங்க் ஆப் இந்தியா (போலி)',
      hi: 'भारतीय स्टेट बैंक (दावा किया)',
    },
    fraudType: 'ATM_PIN',
    scammerSpeech: {
      en: 'Hello Sir! I am calling from State Bank Head Office. Your ATM debit card has been BLOCKED due to pending KYC! To unblock it right now, please verify your 4-digit ATM PIN number immediately!',
      ta: 'வணக்கம்! நான் ஸ்டேட் பாங்க் தலைமை அலுவலகத்திலிருந்து பேசுகிறேன். உங்கள் ஏடிஎம் கார்டு முடக்கப்பட்டுள்ளது! உடனே செயல்படுத்த உங்கள் 4 இலக்க ஏடிஎம் பின் (PIN) எண்ணைச் சொல்லுங்கள்!',
      hi: 'नमस्ते! मैं स्टेट बैंक मुख्यालय से बोल रहा हूँ। आपका एटीएम कार्ड ब्लॉक हो गया है! तुरंत चालू करने के लिए अपना 4 अंकों का एटीएम पिन बताएं!',
    },
    redFlagNote: {
      en: 'RED FLAG: Real banks will NEVER ask for your ATM PIN, CVV, or NetBanking password over phone call!',
      ta: 'ஆபத்து எச்சரிக்கை: உண்மையான வங்கி அதிகாரிகள் ஒருபோதும் தொலைபேசியில் ஏடிஎம் பின் (PIN) கேட்க மாட்டார்கள்!',
      hi: 'खतरे की घंटी: असली बैंक कभी भी फोन पर आपका एटीएम पिन, सीवीवी या पासवर्ड नहीं मांगते!',
    },
    goldenRule: {
      en: 'Banks NEVER ask for your 4-digit ATM PIN or CVV. Never share it with any caller!',
      ta: 'வங்கிகள் ஒருபோதும் உங்கள் 4 இலக்க ஏடிஎம் பின் கேட்காது. யாரிடமும் கூறாதீர்கள்!',
      hi: 'बैंक कभी भी 4 अंकों का एटीएम पिन नहीं मांगते। किसी को भी यह न बताएं!',
    },
    successMessage: {
      en: 'Outstanding! You identified the fake bank call, refused to enter your ATM PIN, and safely blocked the scammer!',
      ta: 'அருமை! நீங்கள் போலி வங்கி அழைப்பைக் கண்டறிந்து, ஏடிஎம் பின் எண்ணைத் தராமல் இணைப்பைத் துண்டித்து பிளாக் செய்துள்ளீர்கள்!',
      hi: 'बहुत बढ़िया! आपने फर्जी बैंक कॉल को पहचाना, एटीएम पिन नहीं दिया और नंबर ब्लॉक कर दिया!',
    },
    steps: [
      {
        id: 's1_step_1_incoming',
        caption: {
          en: 'An unknown call is arriving claiming to be from Bank Card Security.',
          ta: 'வங்கி அட்டைப் பாதுகாப்புப் பிரிவிலிருந்து அழைப்பதாக ஒரு போலி அழைப்பு வருகிறது.',
          hi: 'बैंक सुरक्षा विभाग से होने का दावा करने वाली एक अनजान कॉल आ रही है।',
        },
        targetId: '',
        action: 'wait',
        guideText: { en: 'Listen to phone', ta: 'அழைப்பைக் கவனியுங்கள்', hi: 'कॉल पर ध्यान दें' },
        screen: 'SPAM_INCOMING',
        waitMs: 2500,
      },
      {
        id: 's1_step_2_answer',
        caption: {
          en: 'Tap the green Answer button to hear what this caller claims.',
          ta: 'அழைப்பாளர் என்ன கூறுகிறார் என்பதைக் கேட்க பச்சை நிற Answer பொத்தானைத் தொடவும்.',
          hi: 'कॉलर क्या कहता है यह सुनने के लिए हरा Answer बटन दबाएं।',
        },
        targetId: 'spam-answer-call-btn',
        action: 'tap',
        guideText: { en: 'Tap Answer (Green)', ta: 'பச்சை Answer தொடவும்', hi: 'हरा Answer दबाएं' },
        screen: 'SPAM_INCOMING',
      },
      {
        id: 's1_step_3_scam_speech',
        caption: {
          en: 'The caller says your card is blocked and demands your 4-digit ATM PIN to unblock it.',
          ta: 'கார்டு முடக்கப்பட்டதாகக் கூறி அதைச் செயல்படுத்த உங்கள் 4 இலக்க ஏடிஎம் பின் கேட்கிறார்.',
          hi: 'कॉलर कार्ड ब्लॉक होने का डर दिखाकर 4 अंकों का एटीएम पिन मांग रहा है।',
        },
        targetId: 'spam-scam-dialogue-box',
        action: 'point',
        guideText: { en: 'Caller asking for PIN', ta: 'பின் எண் கேட்கிறார்', hi: 'पिन मांगा जा रहा है' },
        screen: 'SPAM_CALL_ACTIVE',
        waitMs: 3200,
      },
      {
        id: 's1_step_4_warning',
        caption: {
          en: 'RED FLAG ALERT! Real banks will NEVER ask for your ATM PIN or OTP over phone call.',
          ta: 'ஆபத்து எச்சரிக்கை! உண்மையான வங்கிகள் ஒருபோதும் தொலைபேசியில் ஏடிஎம் பின் அல்லது OTP கேட்காது.',
          hi: 'चेतावनी! असली बैंक फोन पर कभी भी एटीएम पिन या ओटीपी नहीं मांगते।',
        },
        targetId: 'spam-alert-badge',
        action: 'point',
        guideText: { en: 'Banks never ask PIN', ta: 'வங்கி பின் கேட்காது', hi: 'बैंक पिन नहीं मांगते' },
        screen: 'SPAM_CALL_ACTIVE',
        waitMs: 3000,
      },
      {
        id: 's1_step_5_hangup',
        caption: {
          en: 'Always tap the red Hang Up button immediately when anyone asks for your PIN.',
          ta: 'யாராவது பின் கேட்டால் உடனடியாக சிவப்பு Hang Up பொத்தானைத் தொட்டு அழைப்பைத் துண்டிக்கவும்.',
          hi: 'पिन मांगने पर तुरंत लाल Hang Up बटन दबाकर कॉल काट दें।',
        },
        targetId: 'spam-hangup-btn',
        action: 'tap',
        guideText: { en: 'Tap red Hang Up', ta: 'சிவப்பு Hang Up தொடவும்', hi: 'लाल Hang Up दबाएं' },
        screen: 'SPAM_CALL_ACTIVE',
      },
      {
        id: 's1_step_6_block',
        caption: {
          en: 'Now tap Block & Report Spam so this scammer cannot call you again.',
          ta: 'இப்போது இந்த மோசடி எண் மீண்டும் அழைக்காமல் இருக்க "Block & Report" தொடவும்.',
          hi: 'अब इस नंबर को ब्लॉक करने के लिए "Block & Report" बटन दबाएं।',
        },
        targetId: 'spam-block-report-btn',
        action: 'tap',
        guideText: { en: 'Tap Block & Report', ta: 'Block & Report தொடவும்', hi: 'Block & Report दबाएं' },
        screen: 'SPAM_BLOCKED',
      },
      {
        id: 's1_step_7_summary',
        caption: {
          en: 'Your money is safe! Remember: Never share your ATM PIN with anyone.',
          ta: 'உங்கள் பணம் பாதுகாப்பானது! நினைவில் கொள்ளுங்கள்: உங்கள் ஏடிஎம் பின் யாரிடமும் பகிராதீர்கள்.',
          hi: 'आपका पैसा सुरक्षित है! याद रखें: अपना एटीएम पिन कभी किसी को न बताएं।',
        },
        targetId: '',
        action: 'wait',
        guideText: { en: 'Protection complete', ta: 'பாதுகாப்பு முடிந்தது', hi: 'सुरक्षा पूर्ण' },
        screen: 'SPAM_BLOCKED',
        waitMs: 2600,
      },
    ],
  },

  // ================= LESSON 2: Urgent KYC & OTP Theft =================
  {
    id: 2,
    code: 'S2',
    type: 'CALL',
    title: {
      en: '2. Urgent KYC & OTP Theft Scam Call',
      ta: '2. அவசர KYC & OTP திருட்டு மோசடி அழைப்பு',
      hi: '2. तत्काल केवाईसी और ओटीपी चोरी कॉल',
    },
    shortTitle: {
      en: 'OTP Theft Call',
      ta: 'OTP திருட்டு அழைப்பு',
      hi: 'ओटीपी चोरी कॉल',
    },
    description: {
      en: 'Recognize fake account-freeze threats, never share an OTP, hang up, and block.',
      ta: 'கணக்கு முடங்கும் அச்சுறுத்தல்களுக்கு அஞ்சாமல், OTP-ஐ யாரிடமும் தராமல் அழைப்பைத் துண்டிக்கப் பழகுங்கள்.',
      hi: 'खाता ब्लॉक होने के डर में ओटीपी न दें, तुरंत कॉल काटें और नंबर ब्लॉक करें।',
    },
    callerName: 'Central Bank KYC Verification Dept',
    callerNumber: '+91 98111 22334',
    callerOrg: {
      en: 'KYC Operations Center (Claimed)',
      ta: 'மத்திய வங்கி KYC பிரிவு (போலி)',
      hi: 'केवाईसी सत्यापन केंद्र (दावा किया)',
    },
    fraudType: 'OTP',
    scammerSpeech: {
      en: 'Urgent Notice: Your savings bank account is scheduled for total freeze by 6 PM today! We just sent a 6-digit confirmation OTP to your mobile. Read it to me now to stop the account freeze!',
      ta: 'முக்கிய அறிவிப்பு: உங்கள் சேமிப்புக் கணக்கு இன்று மாலை 6 மணிக்கு முடக்கப்பட உள்ளது! உங்கள் மொபைலுக்கு 6 இலக்க OTP வந்துள்ளது. அதை உடனே என்னிடம் கூறுங்கள்!',
      hi: 'अति आवश्यक सूचना: आपका बैंक खाता आज शाम 6 बजे फ्रीज हो जाएगा! आपके फोन पर 6 अंकों का ओटीपी भेजा गया है। खाता चालू रखने के लिए तुरंत बताएं!',
    },
    redFlagNote: {
      en: 'RED FLAG: OTP is your One-Time Password to authorize withdrawals. Never read or forward it to callers!',
      ta: 'ஆபத்து எச்சரிக்கை: OTP என்பது உங்கள் கணக்கிலிருந்து பணத்தை எடுப்பதற்கான ரகசிய குறியீடு. ஒருபோதும் பகிராதீர்கள்!',
      hi: 'खतरे की घंटी: ओटीपी से आपके खाते से पैसे कटते हैं। इसे फोन पर कभी न बताएं!',
    },
    goldenRule: {
      en: 'OTP is as private as cash in your wallet. Never read or forward an SMS OTP to any caller.',
      ta: 'OTP பணத்திற்கு சமமானது. ஒருபோதும் எந்த அழைப்பாளரிடமும் OTP-ஐ படிக்கவோ பகிரவோ கூடாது.',
      hi: 'ओटीपी आपके बैंक की चाबी है। फोन पर किसी को भी एसएमएस ओटीपी न बताएं।',
    },
    successMessage: {
      en: 'Well done! You refused to share your OTP and prevented an unauthorized bank withdrawal.',
      ta: 'அருமையான விழிப்புணர்வு! OTP பகிர மறுத்து பண இழப்பைத் தடுத்துவிட்டீர்கள்.',
      hi: 'शानदार! आपने ओटीपी साझा करने से इनकार कर बैंक फ्रॉड रोक दिया।',
    },
    steps: [
      {
        id: 's2_step_1_incoming',
        caption: {
          en: 'A call is ringing from an unknown number threatening KYC account freeze.',
          ta: 'KYC கணக்கு முடக்கம் குறித்து அச்சுறுத்தும் ஒரு போலி அழைப்பு ஒலிக்கிறது.',
          hi: 'केवाईसी खाता ब्लॉक होने की धमकी देने वाली एक अनजान कॉल आ रही है।',
        },
        targetId: '',
        action: 'wait',
        guideText: { en: 'Listen to call', ta: 'அழைப்பைக் கவனியுங்கள்', hi: 'कॉल पर ध्यान दें' },
        screen: 'SPAM_INCOMING',
        waitMs: 2500,
      },
      {
        id: 's2_step_2_answer',
        caption: {
          en: 'Tap the green Answer button to see how scammers create fake panic.',
          ta: 'மோசடிக்காரர்கள் எவ்வாறு பீதியை ஏற்படுத்துகிறார்கள் என்பதைக் காண Answer பொத்தானைத் தொடவும்.',
          hi: 'ठग कैसे डर पैदा करते हैं यह देखने के लिए Answer बटन दबाएं।',
        },
        targetId: 'spam-answer-call-btn',
        action: 'tap',
        guideText: { en: 'Tap Answer (Green)', ta: 'பச்சை Answer தொடவும்', hi: 'हरा Answer दबाएं' },
        screen: 'SPAM_INCOMING',
      },
      {
        id: 's2_step_3_scam_speech',
        caption: {
          en: 'The caller creates fake urgency and demands your 6-digit SMS OTP!',
          ta: 'அழைப்பாளர் அவசரப்படுத்தி உங்கள் 6 இலக்க SMS OTP-ஐ கேட்கிறார்!',
          hi: 'कॉलर जल्दबाजी दिखाकर आपके 6 अंकों का एसएमएस ओटीपी मांग रहा है!',
        },
        targetId: 'spam-scam-dialogue-box',
        action: 'point',
        guideText: { en: 'Caller asking for OTP', ta: 'OTP எண் கேட்கிறார்', hi: 'ओटीपी मांगा जा रहा है' },
        screen: 'SPAM_CALL_ACTIVE',
        waitMs: 3200,
      },
      {
        id: 's2_step_4_warning',
        caption: {
          en: 'NEVER SHARE AN OTP! Sharing an OTP allows thieves to drain your bank balance.',
          ta: 'ஒருபோதும் OTP பகிராதீர்கள்! OTP பகிர்ந்தால் உங்கள் வங்கிக் கணக்கில் உள்ள பணம் திருடப்படும்.',
          hi: 'ओटीपी कभी न बताएं! ओटीपी देने से आपका बैंक खाता खाली हो सकता है।',
        },
        targetId: 'spam-alert-badge',
        action: 'point',
        guideText: { en: 'Never share OTP', ta: 'OTP பகிராதீர்கள்', hi: 'ओटीपी न दें' },
        screen: 'SPAM_CALL_ACTIVE',
        waitMs: 3000,
      },
      {
        id: 's2_step_5_hangup',
        caption: {
          en: 'Hang up immediately! Real bank officials never call to ask for SMS OTPs.',
          ta: 'உடனே இணைப்பைத் துண்டிக்கவும்! உண்மையான வங்கி அதிகாரிகள் ஒருபோதும் OTP கேட்க மாட்டார்கள்.',
          hi: 'तुरंत कॉल काटें! असली बैंक अधिकारी कभी फोन पर ओटीपी नहीं मांगते।',
        },
        targetId: 'spam-hangup-btn',
        action: 'tap',
        guideText: { en: 'Tap red Hang Up', ta: 'சிவப்பு Hang Up தொடவும்', hi: 'लाल Hang Up दबाएं' },
        screen: 'SPAM_CALL_ACTIVE',
      },
      {
        id: 's2_step_6_block',
        caption: {
          en: 'Tap Block & Report Spam to prevent repeat fraud attempts.',
          ta: 'மீண்டும் இந்த எண் அழைக்காமல் இருக்க Block & Report தொடவும்.',
          hi: 'दोबारा कॉल रोकने के लिए Block & Report दबाएं।',
        },
        targetId: 'spam-block-report-btn',
        action: 'tap',
        guideText: { en: 'Tap Block & Report', ta: 'Block & Report தொடவும்', hi: 'Block & Report दबाएं' },
        screen: 'SPAM_BLOCKED',
      },
      {
        id: 's2_step_7_summary',
        caption: {
          en: 'Great vigilance! Treat every OTP like a private cash locker key.',
          ta: 'சிறந்த விழிப்புணர்வு! உங்கள் பணப்பெட்டி சாவி போல OTP-ஐ ரகசியமாக வையுங்கள்.',
          hi: 'शानदार सतर्कता! हर ओटीपी को अपने लॉकर की चाबी की तरह गुप्त रखें।',
        },
        targetId: '',
        action: 'wait',
        guideText: { en: 'Money secured', ta: 'பணம் பாதுகாப்பானது', hi: 'पैसा सुरक्षित' },
        screen: 'SPAM_BLOCKED',
        waitMs: 2600,
      },
    ],
  },

  // ================= LESSON 3: Fake Lottery & Prize Scam =================
  {
    id: 3,
    code: 'S3',
    type: 'CALL',
    title: {
      en: '3. Fake Lottery & ₹25 Lakh Prize Scam Call',
      ta: '3. போலி லாட்டரி & ₹25 லட்சம் பரிசு மோசடி அழைப்பு',
      hi: '3. फर्जी लॉटरी और ₹25 लाख इनाम कॉल',
    },
    shortTitle: {
      en: 'Lottery Prize Scam',
      ta: 'லாட்டரி பரிசு மோசடி',
      hi: 'लॉटरी इनाम कॉल',
    },
    description: {
      en: 'Recognize unexpected prize claims, refuse advance payments or PINs, and disengage safely.',
      ta: 'சீட்டு வாங்காத லாட்டரி பரிசுகளை நம்பாமல், அட்டை விபரம் தராமல் அழைப்பைத் துண்டிக்கப் பழகுங்கள்.',
      hi: 'अचानक लॉटरी जीतने के दावों को पहचानें, पिन या अग्रिम शुल्क न दें और सुरक्षित रहें।',
    },
    callerName: 'National Mega Lucky Draw Cell',
    callerNumber: '+91 97000 88990',
    callerOrg: {
      en: 'Prize Distribution Unit (Claimed)',
      ta: 'பரிசு வழங்கல் பிரிவு (போலி)',
      hi: 'पुरस्कार वितरण सेल (दावा किया)',
    },
    fraudType: 'LOTTERY',
    scammerSpeech: {
      en: 'Congratulations! Your mobile number won the 1st prize of ₹25,00,000 cash! To deposit your prize money today, tell us your bank card number and ATM PIN right away!',
      ta: 'வாழ்த்துகள்! உங்கள் மொபைல் எண்ணுக்கு ₹25 லட்சம் மெகா பரிசு கிடைத்துள்ளது! பணத்தை உங்கள் வங்கிக் கணக்கில் அனுப்ப உங்கள் கார்டு எண் மற்றும் ஏடிஎம் பின் சொல்லுங்கள்!',
      hi: 'बधाई हो! आपके मोबाइल नंबर ने ₹25 लाख का पहला इनाम जीता है! पैसे खाते में जमा करने के लिए अपना कार्ड नंबर और एटीएम पिन तुरंत दें!',
    },
    redFlagNote: {
      en: 'RED FLAG: You cannot win a lottery you never bought tickets for! Receiving money NEVER requires an ATM PIN.',
      ta: 'ஆபத்து எச்சரிக்கை: டிக்கெட் வாங்காத லாட்டரியில் பரிசு விழாது! பணம் பெற ஏடிஎம் பின் தேவையில்லை.',
      hi: 'खतरे की घंटी: जिस लॉटरी का टिकट नहीं खरीदा, वह कभी नहीं जीत सकते! पैसे पाने के लिए पिन नहीं चाहिए।',
    },
    goldenRule: {
      en: 'Receiving money NEVER requires entering an ATM PIN or UPI PIN. If they ask for a PIN, it is 100% fraud.',
      ta: 'பணம் பெற ஒருபோதும் ஏடிஎம் பின் அல்லது UPI பின் தேவையில்லை. பின் கேட்டால் அது மோசடி!',
      hi: 'पैसे प्राप्त करने के लिए कभी भी पिन नहीं लगता। अगर कोई पिन मांगे तो वह पूरी तरह फ्रॉड है।',
    },
    successMessage: {
      en: 'Brilliant! You saw through the fake lottery trap and kept your card credentials safe.',
      ta: 'அற்புதம்! போலி லாட்டரி வலையில் சிக்காமல் உங்கள் வங்கி விவரங்களைப் பாதுகாத்துவிட்டீர்கள்.',
      hi: 'शानदार! आपने फर्जी लॉटरी का सच जाना और अपने बैंक विवरण सुरक्षित रखे।',
    },
    steps: [
      {
        id: 's3_step_1_incoming',
        caption: {
          en: 'An unverified caller promises an unexpected cash prize.',
          ta: 'எதிர்பாராத ரொக்கப் பரிசு தருவதாகக் கூறி ஒரு அழைப்பு வருகிறது.',
          hi: 'अचानक नकद इनाम देने का दावा करने वाली कॉल आ रही है।',
        },
        targetId: '',
        action: 'wait',
        guideText: { en: 'Listen to call', ta: 'அழைப்பைக் கவனியுங்கள்', hi: 'कॉल सुनें' },
        screen: 'SPAM_INCOMING',
        waitMs: 2500,
      },
      {
        id: 's3_step_2_answer',
        caption: {
          en: 'Tap Answer to evaluate the prize claim.',
          ta: 'பரிசு அறிவிப்பைக் கேட்க Answer தொடவும்.',
          hi: 'इनाम का दावा सुनने के लिए Answer दबाएं।',
        },
        targetId: 'spam-answer-call-btn',
        action: 'tap',
        guideText: { en: 'Tap Answer', ta: 'Answer தொடவும்', hi: 'Answer दबाएं' },
        screen: 'SPAM_INCOMING',
      },
      {
        id: 's3_step_3_scam_speech',
        caption: {
          en: 'The caller asks for card numbers and PIN under the guise of transferring prize money.',
          ta: 'பரிசுப் பணத்தை அனுப்புவதாகக் கூறி அட்டை எண் மற்றும் ஏடிஎம் பின் கேட்கிறார்.',
          hi: 'इनाम भेजने के नाम पर कॉलर कार्ड नंबर और पिन मांग रहा है।',
        },
        targetId: 'spam-scam-dialogue-box',
        action: 'point',
        guideText: { en: 'Fake prize trap', ta: 'போலி பரிசு வலை', hi: 'फर्जी इनाम जाल' },
        screen: 'SPAM_CALL_ACTIVE',
        waitMs: 3200,
      },
      {
        id: 's3_step_4_warning',
        caption: {
          en: 'You NEVER need to give an ATM PIN to receive money! Demanding a PIN is 100% fraud.',
          ta: 'பணம் பெற ஒருபோதும் ஏடிஎம் பின் தர வேண்டியதில்லை! பின் கேட்டாலே அது மோசடிதான்.',
          hi: 'पैसे प्राप्त करने के लिए एटीएम पिन कभी नहीं देना होता! यह शत-प्रतिशत धोखा है।',
        },
        targetId: 'spam-alert-badge',
        action: 'point',
        guideText: { en: 'No PIN to receive', ta: 'பணம் பெற பின் தேவையில்லை', hi: 'पैसे पाने हेतु पिन नहीं' },
        screen: 'SPAM_CALL_ACTIVE',
        waitMs: 3000,
      },
      {
        id: 's3_step_5_hangup',
        caption: {
          en: 'Hang up right now. It is a fake prize designed to steal your life savings.',
          ta: 'உடனே அழைப்பைத் துண்டிக்கவும். இது உங்கள் பணத்தைத் திருட வைக்கப்பட்ட பொறி.',
          hi: 'तुरंत कॉल काटें। यह आपकी बचत चुराने का षड्यंत्र है।',
        },
        targetId: 'spam-hangup-btn',
        action: 'tap',
        guideText: { en: 'Tap red Hang Up', ta: 'சிவப்பு Hang Up தொடவும்', hi: 'लाल Hang Up दबाएं' },
        screen: 'SPAM_CALL_ACTIVE',
      },
      {
        id: 's3_step_6_block',
        caption: {
          en: 'Tap Block & Report Spam.',
          ta: 'Block & Report Spam பொத்தானைத் தொடவும்.',
          hi: 'Block & Report Spam बटन दबाएं।',
        },
        targetId: 'spam-block-report-btn',
        action: 'tap',
        guideText: { en: 'Tap Block & Report', ta: 'Block & Report தொடவும்', hi: 'Block & Report दबाएं' },
        screen: 'SPAM_BLOCKED',
      },
      {
        id: 's3_step_7_summary',
        caption: {
          en: 'Safety rule: If it sounds too good to be true, it is always a scam!',
          ta: 'பாதுகாப்பு விதி: உழைக்காமல் வரும் பேராசைப் பரிசுகள் அனைத்தும் ஆபத்தான மோசடியே!',
          hi: 'सुरक्षा नियम: बिना खरीदे लॉटरी जीतने का हर दावा फ्रॉड होता है!',
        },
        targetId: '',
        action: 'wait',
        guideText: { en: 'Safety rule', ta: 'பாதுகாப்பு விதி', hi: 'सुरक्षा नियम' },
        screen: 'SPAM_BLOCKED',
        waitMs: 2600,
      },
    ],
  },

  // ================= LESSON 4: Screen Share App Trap =================
  {
    id: 4,
    code: 'S4',
    type: 'CALL',
    title: {
      en: '4. Screen Share & Remote Access App Trap',
      ta: '4. ஸ்கிரீன் ஷேர் & ரிமோட் ஆப் மோசடி அழைப்பு',
      hi: '4. स्क्रीन शेयर और रिमोट ऐप फ्रॉड कॉल',
    },
    shortTitle: {
      en: 'Screen Share Scam',
      ta: 'ஸ்கிரீன் ஷேர் மோசடி',
      hi: 'स्क्रीन शेयर फ्रॉड',
    },
    description: {
      en: 'Recognize suspicious requests to install AnyDesk/QuickSupport, refuse, and protect phone privacy.',
      ta: 'AnyDesk போன்ற ஆபத்தான திரைப் பகிர்வு செயலிகளைப் பதிவிறக்கச் சொல்லும் அழைப்புகளைத் துண்டிக்கப் பழகுங்கள்.',
      hi: 'AnyDesk या रिमोट ऐप डाउनलोड कराने की कोशिश पहचानें, मना करें और कॉल काटें।',
    },
    callerName: 'Customer Support Help Desk',
    callerNumber: '+91 93333 44556',
    callerOrg: {
      en: 'Technical Support (Claimed)',
      ta: 'தொழில்நுட்ப உதவி பிரிவு (போலி)',
      hi: 'तकनीकी सहायता केंद्र (दावा किया)',
    },
    fraudType: 'SCREEN_SHARE',
    scammerSpeech: {
      en: 'Madam, your banking app has an error! Please download the QuickSupport or AnyDesk app from Play Store right now so our technician can see your screen and fix it!',
      ta: 'வணக்கம்! உங்கள் வங்கி செயலியில் பிழை ஏற்பட்டுள்ளது. பிளே ஸ்டோரிலிருந்து AnyDesk அல்லது QuickSupport செயலியைப் பதிவிறக்குங்கள், எங்கள் ஊழியர் உங்கள் திரையைப் பார்த்து சரிசெய்வார்!',
      hi: 'मैडम, आपके बैंकिंग ऐप में समस्या आई है। प्ले स्टोर से तुरंत AnyDesk या QuickSupport ऐप डाउनलोड करें ताकि हमारी टीम आपकी स्क्रीन देखकर मदद कर सके!',
    },
    redFlagNote: {
      en: 'RED FLAG: Sharing your mobile screen lets fraudsters watch your phone live as you type PINs and passwords!',
      ta: 'ஆபத்து எச்சரிக்கை: திரையைப் பகிர்ந்தால் நீங்கள் தட்டச்சு செய்யும் பின் மற்றும் கடவுச்சொற்களை திருடர்கள் நேரடியாகப் பார்த்துவிடுவர்!',
      hi: 'खतरे की घंटी: स्क्रीन शेयर करने से ठग आपका फोन लाइव देख सकते हैं और पिन चुरा सकते हैं!',
    },
    goldenRule: {
      en: 'NEVER install AnyDesk, TeamViewer, or QuickSupport on the advice of any unknown caller.',
      ta: 'அறிமுகமில்லாத அழைப்பாளர்கள் கூறினால் ஒருபோதும் AnyDesk போன்ற ஸ்கிரீன் ஷேர் செயலிகளைப் பதிவிறக்காதீர்கள்.',
      hi: 'किसी अनजान कॉलर के कहने पर कभी भी AnyDesk या स्क्रीन शेयरिंग ऐप डाउनलोड न करें।',
    },
    successMessage: {
      en: 'Awesome protection! You refused to share your screen and protected your device privacy.',
      ta: 'அருமையான பாதுகாப்பு! உங்கள் செல்போன் திரையைப் பகிர மறுத்து உங்கள் ரகசியங்களைப் பாதுகாத்துவிட்டீர்கள்.',
      hi: 'बेहतरीन सुरक्षा! आपने स्क्रीन शेयर करने से मना कर फोन को सुरक्षित रखा।',
    },
    steps: [
      {
        id: 's4_step_1_incoming',
        caption: {
          en: 'A stranger is calling claiming to be technical support.',
          ta: 'தொழில்நுட்ப உதவி அளிப்பதாகக் கூறி ஒரு போலி அழைப்பு வருகிறது.',
          hi: 'तकनीकी सहायता के नाम पर अनजान कॉल आ रही है।',
        },
        targetId: '',
        action: 'wait',
        guideText: { en: 'Listen to call', ta: 'அழைப்பைக் கவனியுங்கள்', hi: 'कॉल सुनें' },
        screen: 'SPAM_INCOMING',
        waitMs: 2500,
      },
      {
        id: 's4_step_2_answer',
        caption: {
          en: 'Tap Answer to hear the support request.',
          ta: 'அழைப்பை ஏற்க Answer தொடவும்.',
          hi: 'कॉल स्वीकारने हेतु Answer दबाएं।',
        },
        targetId: 'spam-answer-call-btn',
        action: 'tap',
        guideText: { en: 'Tap Answer', ta: 'Answer தொடவும்', hi: 'Answer दबाएं' },
        screen: 'SPAM_INCOMING',
      },
      {
        id: 's4_step_3_scam_speech',
        caption: {
          en: 'The caller asks you to install a remote screen sharing application.',
          ta: 'அழைப்பாளர் ரிமோட் ஸ்கிரீன் ஷேர் செயலியைப் பதிவிறக்கக் கட்டாயப்படுத்துகிறார்.',
          hi: 'कॉलर स्क्रीन शेयरिंग ऐप डाउनलोड करने का दबाव बना रहा है।',
        },
        targetId: 'spam-scam-dialogue-box',
        action: 'point',
        guideText: { en: 'Asking for screen share', ta: 'திரைப் பகிர்வு கேட்கிறார்', hi: 'स्क्रीन शेयर की मांग' },
        screen: 'SPAM_CALL_ACTIVE',
        waitMs: 3200,
      },
      {
        id: 's4_step_4_warning',
        caption: {
          en: 'NEVER SHARE YOUR SCREEN with unknown callers! They will view your bank PINs and passwords in real-time.',
          ta: 'அந்நியர்களுடன் ஒருபோதும் திரையைப் பகிராதீர்கள்! நீங்கள் போடும் பாஸ்வேர்டுகள் அவர்களுக்குத் தெரிந்துவிடும்.',
          hi: 'अनजान लोगों से कभी स्क्रीन शेयर न करें! वे आपके पासवर्ड लाइव देख लेंगे।',
        },
        targetId: 'spam-alert-badge',
        action: 'point',
        guideText: { en: 'Never share screen', ta: 'திரையைப் பகிராதீர்கள்', hi: 'स्क्रीन शेयर न करें' },
        screen: 'SPAM_CALL_ACTIVE',
        waitMs: 3000,
      },
      {
        id: 's4_step_5_hangup',
        caption: {
          en: 'Tap the red Hang Up button immediately.',
          ta: 'உடனடியாக சிவப்பு Hang Up பொத்தானைத் தொட்டு துண்டிக்கவும்.',
          hi: 'तुरंत लाल Hang Up बटन दबाकर कॉल काटें।',
        },
        targetId: 'spam-hangup-btn',
        action: 'tap',
        guideText: { en: 'Tap red Hang Up', ta: 'சிவப்பு Hang Up தொடவும்', hi: 'लाल Hang Up दबाएं' },
        screen: 'SPAM_CALL_ACTIVE',
      },
      {
        id: 's4_step_6_block',
        caption: {
          en: 'Tap Block & Report Spam.',
          ta: 'Block & Report Spam பொத்தானைத் தொடவும்.',
          hi: 'Block & Report Spam दबाएं।',
        },
        targetId: 'spam-block-report-btn',
        action: 'tap',
        guideText: { en: 'Tap Block & Report', ta: 'Block & Report தொடவும்', hi: 'Block & Report दबाएं' },
        screen: 'SPAM_BLOCKED',
      },
      {
        id: 's4_step_7_summary',
        caption: {
          en: 'Complete protection! You denied remote access to your smartphone.',
          ta: 'முழுமையான பாதுகாப்பு! உங்கள் செல்போனை அந்நியர் கட்டுப்படுத்துவதைத் தடுத்துவிட்டீர்கள்.',
          hi: 'पूरी सुरक्षा! आपने अपने स्मार्टफोन का नियंत्रण दूसरों को देने से बचा लिया।',
        },
        targetId: '',
        action: 'wait',
        guideText: { en: 'Remote access denied', ta: 'அணுகல் தடுக்கப்பட்டது', hi: 'नियंत्रण अस्वीकृत' },
        screen: 'SPAM_BLOCKED',
        waitMs: 2600,
      },
    ],
  },

  // ================= LESSON 5: Suspicious SMS & WhatsApp Messages =================
  {
    id: 5,
    code: 'S5',
    type: 'MESSAGE',
    title: {
      en: '5. Suspicious SMS & WhatsApp Messages',
      ta: '5. போலி எஸ்.எம்.எஸ் & வாட்ஸ்அப் செய்திகள்',
      hi: '5. संदिग्ध एसएमएस और व्हाट्सएप संदेश',
    },
    shortTitle: {
      en: 'Fake SMS & Links',
      ta: 'போலி எஸ்.எம்.எஸ் & லிங்க்',
      hi: 'फर्जी एसएमएस व लिंक',
    },
    description: {
      en: 'Identify fake delivery/bank SMS, spot suspicious links, avoid clicking, and report.',
      ta: 'பார்சல் மற்றும் வங்கி பெயரில் வரும் போலி குறுஞ்செய்தி லிங்குகளைக் கிளிக் செய்யாமல் பிளாக் செய்யப் பழகுங்கள்.',
      hi: 'फर्जी पार्सल व बैंक मैसेज पहचानें, अनजान लिंक पर क्लिक करने से बचें और रिपोर्ट करें।',
    },
    callerName: 'IndiaPost Notification Desk',
    callerNumber: '+91 98765 43210',
    callerOrg: {
      en: 'Fake Delivery Service',
      ta: 'போலி பார்சல் சேவை',
      hi: 'फर्जी डिलीवरी सेवा',
    },
    fraudType: 'SMS_LINK',
    scammerSpeech: {
      en: 'IndiaPost Notice: Your parcel package #IN84920 could not be delivered due to incomplete home address. Update address within 12 hours or package will be returned: http://indiapost-parcel-update.xyz/login',
      ta: 'இந்தியா போஸ்ட் அறிவிப்பு: உங்கள் பார்சல் முகவரி முழுமையடையாததால் டெலிவரி செய்ய முடியவில்லை. 12 மணி நேரத்திற்குள் முகவரியைப் புதுப்பிக்கவும்: http://indiapost-parcel-update.xyz/login',
      hi: 'इंडिया पोस्ट सूचना: पता अधूरा होने के कारण आपका पार्सल #IN84920 डिलीवर नहीं हो सका। 12 घंटे में पता अपडेट करें: http://indiapost-parcel-update.xyz/login',
    },
    redFlagNote: {
      en: 'RED FLAGS: 10-digit mobile sender (not official header), fake urgency ("12 hours"), and suspicious .xyz domain link!',
      ta: 'ஆபத்து அடையாளங்கள்: சாதாரண 10 இலக்க மொபைல் எண், 12 மணி நேர அவசர மிரட்டல், மற்றும் போலி .xyz லிங்க்!',
      hi: 'खतरे के संकेत: 10 अंकों का निजी नंबर, 12 घंटे की झूठी जल्दबाजी और फर्जी .xyz वेबसाइट लिंक!',
    },
    goldenRule: {
      en: 'NEVER click unknown links in SMS or WhatsApp. Official government portals end with .gov.in or .nic.in.',
      ta: 'எஸ்.எம்.எஸ் அல்லது வாட்ஸ்அப்பில் வரும் அறிமுகமில்லாத லிங்குகளை ஒருபோதும் தொடாதீர்கள்.',
      hi: 'एसएमएस या व्हाट्सएप पर आए अनजान लिंक पर कभी क्लिक न करें।',
    },
    successMessage: {
      en: 'Brilliant detection! You spotted the fake parcel link, refused to click, and safely blocked the spammer.',
      ta: 'அருமையான விழிப்புணர்வு! போலி பார்சல் லிங்கைத் தொடாமல் தவிர்த்து எண்ணை பிளாக் செய்துவிட்டீர்கள்.',
      hi: 'शानदार सूझबूझ! आपने फर्जी पार्सल लिंक को पहचाना, क्लिक नहीं किया और नंबर ब्लॉक किया।',
    },
    steps: [
      {
        id: 's5_step_1_incoming',
        caption: {
          en: 'A new text message arrives claiming your parcel delivery failed.',
          ta: 'பார்சல் டெலிவரி ஆகவில்லை எனக்கூறி புதிய எஸ்.எம்.எஸ் செய்தி வந்துள்ளது.',
          hi: 'पार्सल डिलीवरी फेल होने का दावा करने वाला एक नया एसएमएस आया है।',
        },
        targetId: '',
        action: 'wait',
        guideText: { en: 'Read SMS alert', ta: 'செய்தியைக் கவனியுங்கள்', hi: 'मैसेज देखें' },
        screen: 'SPAM_SMS',
        waitMs: 2500,
      },
      {
        id: 's5_step_2_inspect_sender',
        caption: {
          en: 'Notice the sender: it is an unverified 10-digit phone number, NOT an official India Post header.',
          ta: 'அனுப்பியவரைக் கவனியுங்கள்: இது சாதாரண 10 இலக்க எண், அதிகாரப்பூர்வ தபால் துறை தலைப்பு அல்ல.',
          hi: 'भेजने वाले को देखें: यह 10 अंकों का निजी नंबर है, आधिकारिक इंडिया पोस्ट का नाम नहीं।',
        },
        targetId: 'sms-sender-header',
        action: 'point',
        guideText: { en: 'Unverified sender', ta: 'போலி அனுப்புநர்', hi: 'अनजान नंबर' },
        screen: 'SPAM_SMS',
        waitMs: 2800,
      },
      {
        id: 's5_step_3_inspect_link',
        caption: {
          en: 'Look at the link: it uses a strange ".xyz" domain designed to steal your bank passwords.',
          ta: 'லிங்கைக் கவனியுங்கள்: இது வங்கி பாஸ்வேர்டுகளைத் திருட உருவாக்கப்பட்ட ஆபத்தான ".xyz" வலைத்தளம்.',
          hi: 'लिंक देखें: यह पासवर्ड चुराने के लिए बनाई गई अजीब ".xyz" वेबसाइट है।',
        },
        targetId: 'sms-link-preview',
        action: 'point',
        guideText: { en: 'Dangerous link', ta: 'ஆபத்தான லிங்க்', hi: 'खतरनाक लिंक' },
        screen: 'SPAM_SMS',
        waitMs: 3000,
      },
      {
        id: 's5_step_4_block_msg',
        caption: {
          en: 'Tap "Block & Report Spam" to stop further phishing attempts.',
          ta: 'இத்தகைய ஏமாற்றுச் செய்திகளைத் தடுக்க "Block & Report" பொத்தானைத் தொடவும்.',
          hi: 'फिशिंग से बचने के लिए "Block & Report" दबाएं।',
        },
        targetId: 'sms-block-btn',
        action: 'tap',
        guideText: { en: 'Tap Block & Report', ta: 'Block & Report தொடவும்', hi: 'Block & Report दबाएं' },
        screen: 'SPAM_SMS',
      },
    ],
  },

  // ================= LESSON 6: UPI Payment & QR Code Scams =================
  {
    id: 6,
    code: 'S6',
    type: 'UPI',
    title: {
      en: '6. UPI Payment & QR Code Scams',
      ta: '6. யுபிஐ (UPI) & க்யூஆர் கோடு மோசடி',
      hi: '6. यूपीआई भुगतान और क्यूआर कोड फ्रॉड',
    },
    shortTitle: {
      en: 'UPI QR Scam',
      ta: 'யுபிஐ க்யூஆர் மோசடி',
      hi: 'यूपीआई क्यूआर फ्रॉड',
    },
    description: {
      en: 'Learn the golden rule: You NEVER enter UPI PIN to receive money. Decline fake collect requests.',
      ta: 'பணம் பெற ஒருபோதும் யுபிஐ பின் தேவையில்லை என்ற தங்க விதியைக் கற்றுக்கொண்டு மோசடி கோரிக்கையை நிராகரியுங்கள்.',
      hi: 'सोने जैसा नियम सीखें: पैसे पाने के लिए कभी यूपीआई पिन नहीं डाला जाता। फर्जी रिक्वेस्ट खारिज करें।',
    },
    callerName: 'Ramesh Buyer (Online Marketplace)',
    callerNumber: '+91 97777 12345',
    callerOrg: {
      en: 'Marketplace Buyer (Scammer)',
      ta: 'ஆன்லைன் வாங்குபவர் (மோசடி)',
      hi: 'ऑनलाइन खरीदार (धोखेबाज)',
    },
    fraudType: 'UPI_QR',
    scammerSpeech: {
      en: 'Sir, I am sending you ₹4,500 for your product. I just sent a collect request on PhonePe/GPay. Scan QR and enter your UPI PIN right now to receive your money!',
      ta: 'வணக்கம்! உங்கள் பொருளுக்கு ₹4,500 அனுப்பியுள்ளேன். PhonePe/GPay செயலியில் கோரிக்கை வந்துள்ளது. க்யூஆர் ஸ்கேன் செய்து உங்கள் யுபிஐ பின் (UPI PIN) போட்டு பணத்தைப் பெற்றுக்கொள்ளுங்கள்!',
      hi: 'नमस्ते! मैंने आपके सामान के ₹4,500 भेज दिए हैं। Google Pay पर रिक्वेस्ट भेजी है। तुरंत अपना यूपीआई पिन डालकर पैसे प्राप्त करें!',
    },
    redFlagNote: {
      en: 'GOLDEN RULE: You ONLY enter UPI PIN to SEND money, NEVER to receive! Entering PIN deducts money.',
      ta: 'தங்க விதி: பணம் அனுப்ப மட்டுமே யுபிஐ பின் போட வேண்டும்! பணம் பெற ஒருபோதும் பின் போடக் கூடாது.',
      hi: 'अहम नियम: यूपीआई पिन केवल पैसे भेजने के लिए डाला जाता है, पाने के लिए कभी नहीं!',
    },
    goldenRule: {
      en: 'Entering UPI PIN ALWAYS debits money from your account. Receiving money requires NO PIN.',
      ta: 'யுபிஐ பின் போட்டால் உங்கள் கணக்கிலிருந்து பணம் சென்றுவிடும். பணம் வர பின் தேவையில்லை.',
      hi: 'यूपीआई पिन डालने से हमेशा आपके खाते से पैसे कटते हैं। पैसे आने के लिए पिन नहीं लगता।',
    },
    successMessage: {
      en: 'Masterful! You recognized the UPI collect trap, refused to enter your PIN, and rejected the fraudulent request.',
      ta: 'அற்புதம்! யுபிஐ பணம் பெறும் வலையைக் கண்டறிந்து, பின் போடாமல் மோசடிக் கோரிக்கையை நிராகரித்துவிட்டீர்கள்.',
      hi: 'लाजवाब! आपने यूपीआई फ्रॉड रिक्वेस्ट को समझा, पिन नहीं डाला और फ्रॉड खारिज किया।',
    },
    steps: [
      {
        id: 's6_step_1_incoming',
        caption: {
          en: 'A stranger claims they sent you money and asks you to enter your UPI PIN to claim it.',
          ta: 'பணம் அனுப்பியதாகக் கூறி அதை வாங்க உங்கள் யுபிஐ பின் போடுமாறு ஒருவர் கூறுகிறார்.',
          hi: 'सामने वाला कह रहा है कि पैसे लेने के लिए अपना यूपीआई पिन डालें।',
        },
        targetId: '',
        action: 'wait',
        guideText: { en: 'Inspect request', ta: 'கோரிக்கையைக் கவனியுங்கள்', hi: 'रिक्वेस्ट देखें' },
        screen: 'SPAM_UPI',
        waitMs: 2500,
      },
      {
        id: 's6_step_2_check_details',
        caption: {
          en: 'Look closely at the screen: it says "PAY ₹4,500", NOT receive! Entering PIN will DEDUCT your money.',
          ta: 'திரையை உற்றுப் பாருங்கள்: "PAY ₹4,500" என்றுள்ளது! பின் போட்டால் உங்கள் பணம் பறிபோகும்.',
          hi: 'स्क्रीन ध्यान से देखें: यहां "PAY ₹4,500" लिखा है! पिन डालने पर आपके पैसे कट जाएंगे।',
        },
        targetId: 'upi-request-card',
        action: 'point',
        guideText: { en: 'It says PAY ₹4,500', ta: 'PAY என்றுள்ளது', hi: 'PAY लिखा है' },
        screen: 'SPAM_UPI',
        waitMs: 3000,
      },
      {
        id: 's6_step_3_decline',
        caption: {
          en: 'Tap the red "Decline Request" button immediately to reject the fraudulent deduction.',
          ta: 'மோசடிக் கோரிக்கையை நிராகரிக்க உடனடியாக "Decline Request" பொத்தானைத் தொடவும்.',
          hi: 'पैसे कटने से बचाने के लिए तुरंत लाल "Decline Request" बटन दबाएं।',
        },
        targetId: 'upi-decline-btn',
        action: 'tap',
        guideText: { en: 'Tap Decline', ta: 'Decline தொடவும்', hi: 'Decline दबाएं' },
        screen: 'SPAM_UPI',
      },
    ],
  },

  // ================= LESSON 7: Fake Customer Care & Impersonation =================
  {
    id: 7,
    code: 'S7',
    type: 'CALL',
    title: {
      en: '7. Fake Customer Care & Impersonation Scam',
      ta: '7. போலி வாடிக்கையாளர் சேவை & மின்சார துண்டிப்பு மிரட்டல்',
      hi: '7. फर्जी कस्टमर केयर और बिजली बिल कटौती कॉल',
    },
    shortTitle: {
      en: 'Customer Care Scam',
      ta: 'வாடிக்கையாளர் சேவை மோசடி',
      hi: 'कस्टमर केयर फ्रॉड',
    },
    description: {
      en: 'Recognize panic threats (electricity cutoff/service suspension), hang up, and verify independently.',
      ta: 'மின்சாரம் துண்டிக்கப்படும் என மிரட்டும் போலி அழைப்புகளைத் துண்டித்து அதிகாரப்பூர்வமாக சரிபார்க்கப் பழகுங்கள்.',
      hi: 'बिजली या सिम कटने की फर्जी धमकी से डरें नहीं, कॉल काटें और असली ऑफिस से संपर्क करें।',
    },
    callerName: 'Electricity Board / EB Urgency Desk',
    callerNumber: '+91 94444 77889',
    callerOrg: {
      en: 'TNEB / Discom Dept (Claimed)',
      ta: 'மின்சார வாரியம் (போலி)',
      hi: 'बिजली विभाग (दावा किया)',
    },
    fraudType: 'CUSTOMER_CARE',
    scammerSpeech: {
      en: 'Dear consumer, your electricity power connection will be DISCONNECTED tonight at 9:30 PM due to unpaid bill of ₹120! Call this officer immediately at 9876543210 or install our bill update app to avoid power cut!',
      ta: 'வணக்கம்! கடந்த மாத மின்சாரக் கட்டணம் செலுத்தப்படாததால், உங்கள் வீட்டு மின்சாரம் இன்று இரவு 9:30 மணிக்கு துண்டிக்கப்படும்! மின்சாரம் துண்டிக்கப்படாமல் இருக்க உடனே இந்த எண்ணை அழைக்கவும் அல்லது எங்கள் செயலியைப் பதிவிறக்கவும்!',
      hi: 'बिजली उपभोक्ता ध्यान दें! पिछले महीने का बिल जमा न होने के कारण आपकी बिजली आज रात 9:30 बजे काट दी जाएगी! तुरंत इस नंबर पर संपर्क करें या ऐप डाउनलोड करें!',
    },
    redFlagNote: {
      en: 'RED FLAG: Government utility departments never threaten immediate power cut over personal mobile calls!',
      ta: 'ஆபத்து எச்சரிக்கை: அரசு மின்சார வாரியம் ஒருபோதும் சாதாரண போன் காலில் உடனடியாக மின்சாரம் துண்டிக்கப்படும் என மிரட்டாது!',
      hi: 'खतरे की घंटी: सरकारी बिजली विभाग कभी निजी फोन नंबर से तुरंत बिजली काटने की धमकी नहीं देता!',
    },
    goldenRule: {
      en: 'Never pay bills on numbers sent by unknown callers. Always check your official physical bill or government portal.',
      ta: 'போன் காலில் வரும் எண்களுக்கு பணம் செலுத்தாதீர்கள். அதிகாரப்பூர்வ மின்சார அலுவலகத்தில் நேரடியாக சரிபாருங்கள்.',
      hi: 'फोन पर बताए गए नंबर पर बिल न भरें। हमेशा बिजली ऑफिस जाकर या आधिकारिक ऐप से जांचें।',
    },
    successMessage: {
      en: 'Outstanding vigilance! You ignored the fake power cutoff panic, hung up, and chose official verification.',
      ta: 'அருமையான விழிப்புணர்வு! மின்சார துண்டிப்பு மிரட்டலுக்கு அஞ்சாமல் அழைப்பைத் துண்டித்து பாதுகாத்துவிட்டீர்கள்.',
      hi: 'बहुत बढ़िया! आपने बिजली कटने के डर को नजरअंदाज किया और कॉल काटकर सही रास्ता चुना।',
    },
    steps: [
      {
        id: 's7_step_1_incoming',
        caption: {
          en: 'An incoming call threatens that your home electricity will be cut off tonight.',
          ta: 'இன்று இரவு உங்கள் வீட்டு மின்சாரம் துண்டிக்கப்படும் என மிரட்டும் ஒரு அழைப்பு வருகிறது.',
          hi: 'आज रात घर की बिजली काटने की धमकी देने वाली कॉल आ रही है।',
        },
        targetId: '',
        action: 'wait',
        guideText: { en: 'Listen to call', ta: 'அழைப்பைக் கவனியுங்கள்', hi: 'कॉल सुनें' },
        screen: 'SPAM_INCOMING',
        waitMs: 2500,
      },
      {
        id: 's7_step_2_answer',
        caption: {
          en: 'Tap Answer to evaluate the electricity threat.',
          ta: 'அழைப்பாளர் என்ன கூறுகிறார் என்பதைக் கேட்க Answer தொடவும்.',
          hi: 'धमकी सुनने के लिए Answer दबाएं।',
        },
        targetId: 'spam-answer-call-btn',
        action: 'tap',
        guideText: { en: 'Tap Answer', ta: 'Answer தொடவும்', hi: 'Answer दबाएं' },
        screen: 'SPAM_INCOMING',
      },
      {
        id: 's7_step_3_threat_dialogue',
        caption: {
          en: 'Notice the panic tactic: the caller threatens a power cut at 9:30 PM to force hasty action.',
          ta: 'பயமுறுத்தும் உத்தியைக் கவனியுங்கள்: யோசிக்க நேரம் தராமல் இரவு 9:30 மணிக்கு மின்சாரம் துண்டிக்கப்படும் என மிரட்டுகிறார்.',
          hi: 'डर की चाल समझें: सोचने का समय दिए बिना तुरंत रात 9:30 बजे बिजली काटने का डर दिखाया जा रहा है।',
        },
        targetId: 'spam-scam-dialogue-box',
        action: 'point',
        guideText: { en: 'Panic threat', ta: 'பயமுறுத்தும் மிரட்டல்', hi: 'डर का माहौल' },
        screen: 'SPAM_CALL_ACTIVE',
        waitMs: 3200,
      },
      {
        id: 's7_step_4_hangup',
        caption: {
          en: 'Hang up immediately! Never call back on the personal mobile number given by the caller.',
          ta: 'உடனடியாக அழைப்பைத் துண்டிக்கவும்! அவர் கூறிய செல்போன் எண்ணை ஒருபோதும் திரும்ப அழைக்காதீர்கள்.',
          hi: 'तुरंत कॉल काटें! कॉलर द्वारा दिए गए नंबर पर कभी वापस फोन न करें।',
        },
        targetId: 'spam-hangup-btn',
        action: 'tap',
        guideText: { en: 'Tap red Hang Up', ta: 'சிவப்பு Hang Up தொடவும்', hi: 'लाल Hang Up दबाएं' },
        screen: 'SPAM_CALL_ACTIVE',
      },
      {
        id: 's7_step_5_block',
        caption: {
          en: 'Tap Block & Report Spam, then verify your bill at the official electricity office.',
          ta: 'Block & Report Spam கொடுத்துவிட்டு, உங்கள் மின்சார ரசீதை அதிகாரப்பூர்வ அலுவலகத்தில் சரிபாருங்கள்.',
          hi: 'Block & Report Spam दबाएं और बिजली विभाग के असली ऑफिस जाकर बिल जांचें।',
        },
        targetId: 'spam-block-report-btn',
        action: 'tap',
        guideText: { en: 'Tap Block & Report', ta: 'Block & Report தொடவும்', hi: 'Block & Report दबाएं' },
        screen: 'SPAM_BLOCKED',
      },
    ],
  },

  // ================= LESSON 8: Final Fraud-Safety Challenge =================
  {
    id: 8,
    code: 'S8',
    type: 'CHALLENGE',
    title: {
      en: '8. Final Fraud-Safety Challenge',
      ta: '8. இறுதி சைபர் மோசடி பாதுகாப்பு சவால்',
      hi: '8. अंतिम साइबर सुरक्षा महा-चुनौती',
    },
    shortTitle: {
      en: 'Fraud Challenge',
      ta: 'பாதுகாப்பு சவால்',
      hi: 'सुरक्षा चुनौती',
    },
    description: {
      en: 'Put your digital safety skills to the test with real-world scenarios across Calls, SMS, UPI & Support.',
      ta: 'அழைப்பு, எஸ்.எம்.எஸ், யுபிஐ மற்றும் உதவி எண்கள் தொடர்பான நிஜ சவால்களை எதிர்கொண்டு வெற்றி பெறுங்கள்.',
      hi: 'कॉल, एसएमएस, यूपीआई और कस्टमर केयर के असली मामलों में अपनी सुरक्षा क्षमता परखें।',
    },
    callerName: 'Cyber Security Exam Cell',
    callerNumber: 'Govt Helpline: 1930',
    callerOrg: {
      en: 'FirstTap Cyber Defense Academy',
      ta: 'FirstTap சைபர் பாதுகாப்பு கழகம்',
      hi: 'FirstTap साइबर सुरक्षा अकादमी',
    },
    fraudType: 'CHALLENGE',
    scammerSpeech: {
      en: 'Welcome to your Final Fraud-Safety Challenge! Complete all 4 scenarios to earn your Digital Safety Badge.',
      ta: 'உங்கள் இறுதி பாதுகாப்பு சவாலுக்கு நல்வரவு! 4 சவால்களையும் முடித்து உங்கள் டிஜிட்டல் பாதுகாப்பு பேட்ஜைப் பெறுங்கள்.',
      hi: 'आपकी अंतिम सुरक्षा चुनौती में स्वागत है! चारों मामलों को हल कर अपना डिजिटल सुरक्षा बैज प्राप्त करें।',
    },
    redFlagNote: {
      en: 'Review what you learned: Never share PIN/OTP, never click unknown links, never enter PIN to receive money, never share screen!',
      ta: 'நினைவு கூருங்கள்: பின்/OTP பகிராதீர், லிங்க் தொடாதீர், பணம் பெற பின் போடாதீர், ஸ்கிரீன் ஷேர் செய்யாதீர்!',
      hi: 'याद रखें: पिन/ओटीपी न दें, अनजान लिंक न छुएं, पैसे पाने हेतु पिन न डालें, स्क्रीन शेयर न करें!',
    },
    goldenRule: {
      en: 'Stay vigilant: Think twice before reacting to any urgent phone threat, link, or prize claim.',
      ta: 'எப்போதும் விழிப்புடன் இருங்கள்: அவசர மிரட்டல்கள் மற்றும் பேராசை பரிசுகளை ஒருபோதும் நம்பாதீர்கள்.',
      hi: 'सदा सतर्क रहें: किसी भी धमकी, लिंक या इनाम के झांसे में बिना सोचे न आएं।',
    },
    successMessage: {
      en: '🎉 Congratulations! You have successfully mastered all 8 Spam & Digital Fraud Safety lessons!',
      ta: '🎉 வாழ்த்துகள்! 8 சைபர் மோசடி பாதுகாப்புப் பாடங்களையும் நீங்கள் வெற்றிகரமாக முடித்துவிட்டீர்கள்!',
      hi: '🎉 बधाई हो! आपने सभी 8 डिजिटल सुरक्षा पाठ सफलतापूर्वक पूरे कर लिए हैं!',
    },
    steps: [],
  },
];

// Practice tasks for lessons 1 to 7
export const FRAUD_PRACTICE_TASKS: Record<number, { task: PracticeTask; steps: PracticeStep[] }> = {
  1: {
    task: {
      lessonId: 1,
      title: {
        en: 'ATM PIN Scam Defense',
        ta: 'ஏடிஎம் பின் மோசடி பாதுகாப்பு பயிற்சி',
        hi: 'एटीएम पिन सुरक्षा अभ्यास',
      },
      description: {
        en: 'A fake bank caller claims your card is blocked and demands your 4-digit ATM PIN. Answer, identify fraud, refuse PIN, hang up, and block.',
        ta: 'கார்டு முடக்கப்பட்டதாகக் கூறி ஏடிஎம் பின் கேட்கும் போலி அழைப்பை ஏற்று, பின் தராமல் இணைப்பைத் துண்டித்து பிளாக் செய்யுங்கள்.',
        hi: 'फर्जी बैंक कॉलर एटीएम पिन मांग रहा है। कॉल उठाएं, फ्रॉड समझें, पिन न दें, कॉल काटें और ब्लॉक करें।',
      },
    },
    steps: [
      {
        id: 'p1_s1',
        targetId: 'spam-answer-call-btn',
        instruction: {
          en: 'Answer the incoming call to hear what this unverified caller claims.',
          ta: 'அழைப்பாளர் என்ன கூறுகிறார் என்பதைக் கேட்க பச்சை நிற Answer பொத்தானைத் தொடவும்.',
          hi: 'कॉलर की बात सुनने के लिए हरा Answer बटन दबाएं।',
        },
        guideText: { en: 'Tap Answer (Green)', ta: 'பச்சை Answer தொடவும்', hi: 'हरा Answer दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_INCOMING',
      },
      {
        id: 'p1_s2',
        targetId: 'spam-hangup-btn',
        instruction: {
          en: 'DANGER! The caller is asking for your 4-digit ATM PIN! Never share your PIN. Tap the red Hang Up button immediately.',
          ta: 'ஆபத்து! அழைப்பாளர் உங்கள் ஏடிஎம் பின் கேட்கிறார்! ஒருபோதும் தராதீர்கள். சிவப்பு Hang Up பொத்தானைத் தொடவும்.',
          hi: 'खतरा! कॉलर एटीएम पिन मांग रहा है! पिन कभी न दें। तुरंत लाल Hang Up बटन दबाएं।',
        },
        guideText: { en: 'Tap red Hang Up', ta: 'சிவப்பு Hang Up தொடவும்', hi: 'लाल Hang Up दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_CALL_ACTIVE',
      },
      {
        id: 'p1_s3',
        targetId: 'spam-block-report-btn',
        instruction: {
          en: 'Now tap "Block & Report Spam" to protect yourself and stop future scam attempts.',
          ta: 'இப்போது மீண்டும் அழைப்பு வராமல் தடுக்க "Block & Report Spam" தொடவும்.',
          hi: 'अब दोबारा कॉल रोकने के लिए "Block & Report Spam" दबाएं।',
        },
        guideText: { en: 'Tap Block & Report', ta: 'Block & Report தொடவும்', hi: 'Block & Report दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_BLOCKED',
      },
    ],
  },
  2: {
    task: {
      lessonId: 2,
      title: {
        en: 'OTP Theft Defense',
        ta: 'OTP திருட்டு பாதுகாப்பு பயிற்சி',
        hi: 'ओटीपी चोरी सुरक्षा अभ्यास',
      },
      description: {
        en: 'A caller threatens to freeze your account unless you share an SMS OTP. Answer the call, refuse to read the OTP, hang up, and block.',
        ta: 'கணக்கு முடங்கும் என மிரட்டி OTP கேட்கும் அழைப்பை ஏற்று, OTP தராமல் இணைப்பைத் துண்டித்து பிளாக் செய்யுங்கள்.',
        hi: 'खाता बंद होने का डर दिखाकर ओटीपी मांगा जा रहा है। कॉल उठाएं, ओटीपी न दें, कॉल काटें और ब्लॉक करें।',
      },
    },
    steps: [
      {
        id: 'p2_s1',
        targetId: 'spam-answer-call-btn',
        instruction: {
          en: 'Answer the incoming call to evaluate the KYC threat.',
          ta: 'KYC அச்சுறுத்தலைக் கேட்க Answer தொடவும்.',
          hi: 'केवाईसी धमकी सुनने हेतु Answer दबाएं।',
        },
        guideText: { en: 'Tap Answer (Green)', ta: 'Answer தொடவும்', hi: 'Answer दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_INCOMING',
      },
      {
        id: 'p2_s2',
        targetId: 'spam-hangup-btn',
        instruction: {
          en: 'NEVER SHARE AN OTP! Tap the red Hang Up button immediately.',
          ta: 'ஒருபோதும் OTP பகிராதீர்கள்! உடனடியாக சிவப்பு Hang Up பொத்தானைத் தொடவும்.',
          hi: 'ओटीपी कभी न बताएं! तुरंत लाल Hang Up बटन दबाकर कॉल काटें।',
        },
        guideText: { en: 'Tap red Hang Up', ta: 'சிவப்பு Hang Up தொடவும்', hi: 'लाल Hang Up दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_CALL_ACTIVE',
      },
      {
        id: 'p2_s3',
        targetId: 'spam-block-report-btn',
        instruction: {
          en: 'Tap "Block & Report Spam" to report this fraudulent KYC number.',
          ta: '"Block & Report Spam" தொட்டு இந்த மோசடி எண்ணைப் புகாரளிக்கவும்.',
          hi: '"Block & Report Spam" दबाकर नंबर ब्लॉक करें।',
        },
        guideText: { en: 'Tap Block & Report', ta: 'Block & Report தொடவும்', hi: 'Block & Report दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_BLOCKED',
      },
    ],
  },
  3: {
    task: {
      lessonId: 3,
      title: {
        en: 'Lottery Prize Defense',
        ta: 'லாட்டரி பரிசு பாதுகாப்பு பயிற்சி',
        hi: 'लॉटरी फ्रॉड सुरक्षा अभ्यास',
      },
      description: {
        en: 'Evaluate the fake ₹25 Lakh lottery claim, refuse requests for sensitive card details or PINs, hang up, and block.',
        ta: 'போலி பரிசு அழைப்பை ஏற்று, அட்டை விவரங்கள் தராமல் இணைப்பைத் துண்டித்து பிளாக் செய்யுங்கள்.',
        hi: 'फर्जी ₹25 लाख इनाम कॉल को पहचानें, पिन या कार्ड विवरण न दें और ब्लॉक करें।',
      },
    },
    steps: [
      {
        id: 'p3_s1',
        targetId: 'spam-answer-call-btn',
        instruction: {
          en: 'Answer the incoming call to hear the prize claim.',
          ta: 'அழைப்பை ஏற்க Answer தொடவும்.',
          hi: 'कॉल सुनने के लिए Answer दबाएं।',
        },
        guideText: { en: 'Tap Answer', ta: 'Answer தொடவும்', hi: 'Answer दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_INCOMING',
      },
      {
        id: 'p3_s2',
        targetId: 'spam-hangup-btn',
        instruction: {
          en: 'This is an illegal scam! Receiving money never requires an ATM PIN. Tap the red Hang Up button immediately.',
          ta: 'இது ஏமாற்று வேலை! பணம் பெற ஏடிஎம் பின் தேவையில்லை. உடனே சிவப்பு Hang Up தொடவும்.',
          hi: 'यह धोखा है! पैसे पाने के लिए पिन नहीं लगता। तुरंत लाल Hang Up दबाएं।',
        },
        guideText: { en: 'Tap red Hang Up', ta: 'சிவப்பு Hang Up தொடவும்', hi: 'लाल Hang Up दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_CALL_ACTIVE',
      },
      {
        id: 'p3_s3',
        targetId: 'spam-block-report-btn',
        instruction: {
          en: 'Now tap "Block & Report Spam" to secure your device.',
          ta: '"Block & Report Spam" தொட்டு எண்ணை பிளாக் செய்யவும்.',
          hi: 'अब "Block & Report Spam" दबाकर सुरक्षित रहें।',
        },
        guideText: { en: 'Tap Block & Report', ta: 'Block & Report தொடவும்', hi: 'Block & Report दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_BLOCKED',
      },
    ],
  },
  4: {
    task: {
      lessonId: 4,
      title: {
        en: 'Screen Share App Defense',
        ta: 'ஸ்கிரீன் ஷேர் ஆப் பாதுகாப்பு பயிற்சி',
        hi: 'स्क्रीन शेयर ऐप सुरक्षा अभ्यास',
      },
      description: {
        en: 'A fake technician demands you install AnyDesk. Refuse remote access, hang up immediately, and block.',
        ta: 'AnyDesk செயலியைப் போடச் சொல்லும் போலி அழைப்பை நிராகரித்து, இணைப்பைத் துண்டித்து பிளாக் செய்யுங்கள்.',
        hi: 'रिमोट ऐप डाउनलोड करने की मांग को खारिज करें, कॉल काटें और नंबर ब्लॉक करें।',
      },
    },
    steps: [
      {
        id: 'p4_s1',
        targetId: 'spam-answer-call-btn',
        instruction: {
          en: 'Answer the incoming call to evaluate the technical support request.',
          ta: 'அழைப்பாளர் பேச்சைக் கேட்க Answer தொடவும்.',
          hi: 'कॉल सुनने के लिए Answer दबाएं।',
        },
        guideText: { en: 'Tap Answer', ta: 'Answer தொடவும்', hi: 'Answer दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_INCOMING',
      },
      {
        id: 'p4_s2',
        targetId: 'spam-hangup-btn',
        instruction: {
          en: 'DANGER! Never download AnyDesk or share your screen. Tap red Hang Up immediately.',
          ta: 'ஆபத்து! ஒருபோதும் AnyDesk பதிவிறக்காதீர்கள். உடனே சிவப்பு Hang Up தொடவும்.',
          hi: 'खतरा! AnyDesk डाउनलोड न करें। तुरंत लाल Hang Up बटन दबाएं।',
        },
        guideText: { en: 'Tap red Hang Up', ta: 'சிவப்பு Hang Up தொடவும்', hi: 'लाल Hang Up दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_CALL_ACTIVE',
      },
      {
        id: 'p4_s3',
        targetId: 'spam-block-report-btn',
        instruction: {
          en: 'Tap "Block & Report Spam" to protect your phone.',
          ta: '"Block & Report Spam" தொட்டு போலி எண்ணை பிளாக் செய்யவும்.',
          hi: '"Block & Report Spam" दबाकर नंबर ब्लॉक करें।',
        },
        guideText: { en: 'Tap Block & Report', ta: 'Block & Report தொடவும்', hi: 'Block & Report दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_BLOCKED',
      },
    ],
  },
  5: {
    task: {
      lessonId: 5,
      title: {
        en: 'SMS Link Defense',
        ta: 'போலி எஸ்.எம்.எஸ் லிங்க் பாதுகாப்பு பயிற்சி',
        hi: 'एसएमएस लिंक सुरक्षा अभ्यास',
      },
      description: {
        en: 'A fake parcel delivery SMS contains an urgent threat and a malicious link. Inspect red flags, refuse to tap link, and block.',
        ta: 'போலி பார்சல் லிங்க் உள்ள குறுஞ்செய்தியை ஆய்வு செய்து, லிங்கைத் தொடாமல் பிளாக் செய்யுங்கள்.',
        hi: 'फर्जी पार्सल लिंक वाले मैसेज की पहचान करें, लिंक पर क्लिक न करें और ब्लॉक करें।',
      },
    },
    steps: [
      {
        id: 'p5_s1',
        targetId: 'sms-link-preview',
        instruction: {
          en: 'Do NOT tap the suspicious link! Notice the fake ".xyz" domain.',
          ta: 'ஆபத்தான லிங்கைத் தொடாதீர்கள்! ".xyz" என்ற போலி முகவரியைக் கவனியுங்கள்.',
          hi: 'संदिग्ध लिंक पर क्लिक न करें! फर्जी ".xyz" वेबसाइट पहचानें।',
        },
        guideText: { en: 'Do not tap link', ta: 'லிங்கைத் தொடாதீர்', hi: 'लिंक न छुएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_SMS',
      },
      {
        id: 'p5_s2',
        targetId: 'sms-block-btn',
        instruction: {
          en: 'Tap "Block & Report Spam" to permanently block this sender.',
          ta: 'இந்த அனுப்புநரை நிரந்தரமாகத் தடுக்க "Block & Report Spam" தொடவும்.',
          hi: 'इस सेंडर को ब्लॉक करने के लिए "Block & Report Spam" दबाएं।',
        },
        guideText: { en: 'Tap Block & Report', ta: 'Block & Report தொடவும்', hi: 'Block & Report दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_SMS',
      },
    ],
  },
  6: {
    task: {
      lessonId: 6,
      title: {
        en: 'UPI PIN Safety Defense',
        ta: 'யுபிஐ பின் பாதுகாப்பு பயிற்சி',
        hi: 'यूपीआई पिन सुरक्षा अभ्यास',
      },
      description: {
        en: 'A scammer sends a ₹4,500 collect request claiming you will receive money by entering your UPI PIN. Reject the request.',
        ta: 'பணம் பெற யுபிஐ பின் போடுமாறு வரும் ₹4,500 பணக் கோரிக்கையை நிராகரித்துப் பழகுங்கள்.',
        hi: 'पैसे पाने के बहाने ₹4,500 की यूपीआई पेमेंट रिक्वेस्ट आई है। रिक्वेस्ट खारिज करें।',
      },
    },
    steps: [
      {
        id: 'p6_s1',
        targetId: 'upi-decline-btn',
        instruction: {
          en: 'You NEVER enter a UPI PIN to receive money! Tap the red "Decline Request" button immediately.',
          ta: 'பணம் பெற ஒருபோதும் யுபிஐ பின் தேவையில்லை! உடனே சிவப்பு "Decline Request" பொத்தானைத் தொடவும்.',
          hi: 'पैसे पाने हेतु कभी यूपीआई पिन नहीं लगता! तुरंत लाल "Decline Request" दबाएं।',
        },
        guideText: { en: 'Tap Decline Request', ta: 'Decline Request தொடவும்', hi: 'Decline Request दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_UPI',
      },
    ],
  },
  7: {
    task: {
      lessonId: 7,
      title: {
        en: 'Fake Electricity Cutoff Defense',
        ta: 'மின்சார துண்டிப்பு மிரட்டல் பாதுகாப்பு பயிற்சி',
        hi: 'बिजली बिल फ्रॉड सुरक्षा अभ्यास',
      },
      description: {
        en: 'A caller threatens electricity disconnection in 30 minutes. Hang up, refuse to pay on phone, and verify at the EB office.',
        ta: 'மின்சாரம் துண்டிக்கப்படும் என மிரட்டும் அழைப்பைத் துண்டித்து, அரசு அலுவலகத்தில் சரிபார்க்கப் பழகுங்கள்.',
        hi: 'बिजली काटने की धमकी वाली कॉल काटें, फोन पर भुगतान न करें और असली दफ्तर से जांचें।',
      },
    },
    steps: [
      {
        id: 'p7_s1',
        targetId: 'spam-answer-call-btn',
        instruction: {
          en: 'Answer the call to hear the electricity disconnection threat.',
          ta: 'அழைப்பாளர் மிரட்டலைக் கேட்க Answer தொடவும்.',
          hi: 'कॉल सुनने के लिए Answer दबाएं।',
        },
        guideText: { en: 'Tap Answer', ta: 'Answer தொடவும்', hi: 'Answer दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_INCOMING',
      },
      {
        id: 'p7_s2',
        targetId: 'spam-hangup-btn',
        instruction: {
          en: 'Fake urgency alert! Hang up immediately and never call back on the personal mobile number.',
          ta: 'போலி அவசர மிரட்டல்! உடனே சிவப்பு Hang Up தொட்டு துண்டிக்கவும்.',
          hi: 'झूठी धमकी! तुरंत लाल Hang Up दबाकर कॉल काटें।',
        },
        guideText: { en: 'Tap red Hang Up', ta: 'சிவப்பு Hang Up தொடவும்', hi: 'लाल Hang Up दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_CALL_ACTIVE',
      },
      {
        id: 'p7_s3',
        targetId: 'spam-block-report-btn',
        instruction: {
          en: 'Tap "Block & Report Spam", then verify your bill independently.',
          ta: '"Block & Report Spam" கொடுத்துவிட்டு மின்சார வாரியத்தில் நேரடியாக சரிபாருங்கள்.',
          hi: '"Block & Report Spam" दबाएं और बिजली विभाग से जांचें।',
        },
        guideText: { en: 'Tap Block & Report', ta: 'Block & Report தொடவும்', hi: 'Block & Report दबाएं' },
        actionType: 'tap',
        expectedScreen: 'SPAM_BLOCKED',
      },
    ],
  },
};

// 4 Comprehensive Scenarios for Lesson 8 Final Challenge
export const FINAL_CHALLENGE_SCENARIOS: ChallengeScenario[] = [
  {
    id: 1,
    type: 'CALL',
    title: {
      en: 'Scenario 1: Debit Card Block & OTP Demand Call',
      ta: 'சூழ்நிலை 1: டெபிட் கார்டு முடக்கம் & OTP கேட்கும் அழைப்பு',
      hi: 'केस 1: डेबिट कार्ड ब्लॉक और ओटीपी मांगने वाली कॉल',
    },
    scenarioPrompt: {
      en: 'An unknown caller claiming to be your bank manager says: "Your ATM card is expiring today. Read the 6-digit OTP just sent to your phone to renew it, or your card will stop working." What should you do?',
      ta: 'வங்கி மேலாளர் எனக்கூறும் ஒருவர் அழைக்கிறார்: "உங்கள் ஏடிஎம் கார்டு இன்றுடன் முடிவடைகிறது. அதைப் புதுப்பிக்க உங்கள் போனுக்கு வந்த 6 இலக்க OTP-ஐ சொல்லுங்கள், இல்லாவிட்டால் கார்டு முடங்கிவிடும்." நீங்கள் என்ன செய்ய வேண்டும்?',
      hi: 'बैंक मैनेजर बनकर एक कॉलर कहता है: "आपका एटीएम कार्ड आज खत्म हो रहा है। कार्ड चालू रखने हेतु फोन पर आया 6 अंकों का ओटीपी बताएं।" आपको क्या करना चाहिए?',
    },
    senderOrCaller: 'Claimed: Bank Card Operations (+91 91234 99887)',
    badge: {
      en: 'Incoming Call',
      ta: 'அழைப்பு',
      hi: 'इनकमिंग कॉल',
    },
    contentPreview: {
      en: '"Sir, tell me your OTP quickly. I am verifying your account right now."',
      ta: '"சார், உங்கள் போனில் வந்த OTP-ஐ சீக்கிரம் சொல்லுங்கள். நான் உடனே கார்டை சரிசெய்கிறேன்."',
      hi: '"सर, जल्दी ओटीपी बताइए ताकि मैं आपका कार्ड तुरंत रिन्यू कर सकूं।"',
    },
    options: [
      {
        id: 'A',
        text: {
          en: 'Read the OTP to the caller so your card does not get blocked.',
          ta: 'கார்டு முடங்காமல் இருக்க அழைப்பாளரிடம் OTP-ஐ கூறிவிடலாம்.',
          hi: 'कॉलर को ओटीपी बता दें ताकि कार्ड बंद न हो।',
        },
        isSafe: false,
        explanation: {
          en: 'DANGEROUS! Sharing an OTP allows scammers to withdraw money from your account instantly. Real banks never ask for OTPs!',
          ta: 'மிகவும் ஆபத்தானது! OTP பகிர்ந்தால் திருடர்கள் உங்கள் வங்கிக் கணக்கில் உள்ள பணத்தை உடனடியாக எடுத்துவிடுவார்கள்!',
          hi: 'अत्यंत खतरनाक! ओटीपी देने से ठग आपके खाते से तुरंत पैसे निकाल लेंगे। असली बैंक कभी ओटीपी नहीं मांगते!',
        },
      },
      {
        id: 'B',
        text: {
          en: 'Hang up immediately and never share the OTP. Contact your bank branch directly.',
          ta: 'உடனடியாக அழைப்பைத் துண்டிக்கவும். OTP பகிராமல் உங்கள் வங்கிக் கிளையை நேரடியாக அணுகவும்.',
          hi: 'तुरंत कॉल काट दें और ओटीपी कभी न बताएं। सीधे बैंक शाखा से संपर्क करें।',
        },
        isSafe: true,
        explanation: {
          en: 'CORRECT & SAFE! Real banks NEVER ask for OTP over phone calls. Hanging up protected your hard-earned money.',
          ta: 'சரியான மற்றும் பாதுகாப்பான முடிவு! உண்மையான வங்கி அதிகாரிகள் ஒருபோதும் போனில் OTP கேட்க மாட்டார்கள்.',
          hi: 'बिल्कुल सही व सुरक्षित! असली बैंक कभी फोन पर ओटीपी नहीं मांगते। कॉल काटकर आपने अपना पैसा बचा लिया।',
        },
      },
    ],
  },
  {
    id: 2,
    type: 'SMS',
    title: {
      en: 'Scenario 2: WhatsApp Lottery Winner Photo Message',
      ta: 'சூழ்நிலை 2: வாட்ஸ்அப் லாட்டரி பரிசு அறிவிப்பு செய்தி',
      hi: 'केस 2: व्हाट्सएप पर लॉटरी इनाम का मैसेज',
    },
    scenarioPrompt: {
      en: 'You receive a WhatsApp message from an unknown number with a certificate picture: "Congratulations! You won ₹25 Lakhs in KBC Lucky Draw. Click this link to register your bank account: http://kbc-winner-reward.xyz". What should you do?',
      ta: 'அறிமுகமில்லாத எண்ணிலிருந்து ஒரு வாட்ஸ்அப் செய்தி வருகிறது: "வாழ்த்துகள்! KBC லக்கி டிரா மூலம் நீங்கள் ₹25 லட்சம் வென்றுள்ளீர்கள். பணத்தைப் பெற இந்த லிங்கைத் தொடுங்கள்: http://kbc-winner-reward.xyz". நீங்கள் என்ன செய்ய வேண்டும்?',
      hi: 'व्हाट्सएप पर अनजान नंबर से मैसेज आया: "बधाई हो! आपने केबीसी लकी ड्रा में ₹25 लाख जीते हैं। बैंक खाते में राशि पाने हेतु इस लिंक पर क्लिक करें: http://kbc-winner-reward.xyz"। आपको क्या करना चाहिए?',
    },
    senderOrCaller: 'WhatsApp Message (+92 301 5551234)',
    badge: {
      en: 'WhatsApp Message',
      ta: 'வாட்ஸ்அப் செய்தி',
      hi: 'व्हाट्सएप संदेश',
    },
    contentPreview: {
      en: '"KBC Winner Certificate ₹25,00,000. Click http://kbc-winner-reward.xyz to claim."',
      ta: '"KBC பரிசு சான்றிதழ் ₹25,00,000. பெற http://kbc-winner-reward.xyz தொடவும்."',
      hi: '"केबीसी इनाम प्रमाण-पत्र ₹25,00,000. पाने हेतु http://kbc-winner-reward.xyz पर जाएं।"',
    },
    options: [
      {
        id: 'A',
        text: {
          en: 'Click the link and fill in your bank details to claim the ₹25 Lakhs.',
          ta: 'பரிசைப் பெறுவதற்காக லிங்கைத் தொட்டு உங்கள் வங்கி விவரங்களை உள்ளிடலாம்.',
          hi: 'लिंक पर क्लिक करें और ₹25 लाख पाने के लिए अपने बैंक का विवरण भरें।',
        },
        isSafe: false,
        explanation: {
          en: 'DANGEROUS TRAP! You never bought this lottery. Fake links steal your passwords and banking credentials.',
          ta: 'ஆபத்தான வலை! டிக்கெட் வாங்காத லாட்டரியில் பரிசு விழாது. இத்தகைய போலி லிங்குகள் உங்கள் பாஸ்வேர்டுகளைத் திருடும்.',
          hi: 'खतरनाक जाल! बिना टिकट लॉटरी नहीं मिलती। ऐसे लिंक बैंक विवरण और पासवर्ड चुराने के लिए बनाए जाते हैं।',
        },
      },
      {
        id: 'B',
        text: {
          en: 'Do not click the link. Delete the message and block the sender immediately.',
          ta: 'லிங்கைத் தொடாதீர்கள். செய்தியை நீக்கிவிட்டு அனுப்பிய எண்ணை உடனே பிளாக் செய்யவும்.',
          hi: 'लिंक पर बिल्कुल क्लिक न करें। मैसेज डिलीट करें और सेंडर को तुरंत ब्लॉक करें।',
        },
        isSafe: true,
        explanation: {
          en: 'CORRECT & SAFE! Golden rule: If you did not enter a contest, you cannot win a prize. Never click unknown links.',
          ta: 'சரியான முடிவு! தங்க விதி: போட்டியில் பங்கேற்காமல் பரிசு வராது. அறிமுகமில்லாத லிங்குகளை ஒருபோதும் தொடாதீர்கள்.',
          hi: 'बिल्कुल सही! नियम: जिस प्रतियोगिता में भाग नहीं लिया, उसका इनाम नहीं मिलता। अनजान लिंक कभी न छुएं।',
        },
      },
    ],
  },
  {
    id: 3,
    type: 'UPI',
    title: {
      en: 'Scenario 3: "Scan QR Code to Receive Refund" Request',
      ta: 'சூழ்நிலை 3: "பணம் பெற க்யூஆர் ஸ்கேன் செய்து பின் போடுங்கள்" கோரிக்கை',
      hi: 'केस 3: "पैसे पाने हेतु क्यूआर स्कैन व पिन डालें" की मांग',
    },
    scenarioPrompt: {
      en: 'A caller claiming to be an online shopping representative says: "We are refunding ₹3,000 to your Google Pay. Scan this QR code and enter your UPI PIN to receive the ₹3,000 refund into your account." What should you do?',
      ta: 'ஆன்லைன் ஷாப்பிங் ஊழியர் எனக்கூறும் ஒருவர் அழைக்கிறார்: "உங்கள் கூகுள் பே கணக்கிற்கு ₹3,000 திரும்ப அனுப்புகிறோம். இந்த க்யூஆர் கோடை ஸ்கேன் செய்து உங்கள் யுபிஐ பின்னைப் போடுங்கள்." நீங்கள் என்ன செய்ய வேண்டும்?',
      hi: 'ऑनलाइन शॉपिंग प्रतिनिधि बनकर कॉलर कहता है: "हम आपके गूगल पे पर ₹3,000 का रिफंड भेज रहे हैं। क्यूआर कोड स्कैन करके अपना यूपीआई पिन डालें ताकि रिफंड खाते में आ सके।" आपको क्या करना चाहिए?',
    },
    senderOrCaller: 'UPI Collect Alert (Google Pay / PhonePe)',
    badge: {
      en: 'Payment Request',
      ta: 'பணக் கோரிக்கை',
      hi: 'भुगतान रिक्वेस्ट',
    },
    contentPreview: {
      en: '"Collect Request: Pay ₹3,000 to OnlineRefund. Note: Enter UPI PIN to claim money."',
      ta: '"பணக் கோரிக்கை: Pay ₹3,000. குறிப்பு: பணம் பெற யுபிஐ பின் உள்ளிடவும்."',
      hi: '"पेमेंट रिक्वेस्ट: Pay ₹3,000. नोट: पैसे पाने के लिए यूपीआई पिन डालें।"',
    },
    options: [
      {
        id: 'A',
        text: {
          en: 'Scan the QR and enter your UPI PIN because the caller said it will credit money.',
          ta: 'பணம் வரும் என்று அழைப்பாளர் கூறியதால் க்யூஆர் ஸ்கேன் செய்து யுபிஐ பின் போடலாம்.',
          hi: 'क्यूआर स्कैन करके यूपीआई पिन डालें क्योंकि कॉलर ने पैसे आने की बात कही है।',
        },
        isSafe: false,
        explanation: {
          en: 'DANGEROUS! Entering your UPI PIN will DEDUCT ₹3,000 from your account! You NEVER enter a PIN to receive money.',
          ta: 'மிகப் பெரிய தவறு! யுபிஐ பின் போட்டால் உங்கள் கணக்கிலிருந்து ₹3,000 பறிபோகும்! பணம் பெற பின் தேவையில்லை.',
          hi: 'बड़ी भूल! यूपीआई पिन डालते ही आपके खाते से ₹3,000 कट जाएंगे! पैसे आने के लिए पिन कभी नहीं लगता।',
        },
      },
      {
        id: 'B',
        text: {
          en: 'Reject the request immediately. Remember: UPI PIN is ONLY entered to SEND money, NEVER to receive!',
          ta: 'கோரிக்கையை உடனடியாக நிராகரிக்கவும். யுபிஐ பின் பணம் அனுப்ப மட்டுமே, பணம் பெற ஒருபோதும் இல்லை!',
          hi: 'रिक्वेस्ट तुरंत रिजेक्ट करें। याद रखें: यूपीआई पिन केवल पैसे भेजने के लिए होता है, पाने के लिए नहीं!',
        },
        isSafe: true,
        explanation: {
          en: 'CORRECT & SAFE! Golden Rule: Receiving money requires NO PIN. You saved ₹3,000 from being stolen.',
          ta: 'மிகச் சரியான முடிவு! தங்க விதி: பணம் பெற பின் தேவையில்லை. உங்கள் ₹3,000 பணத்தைப் பாதுகாத்துவிட்டீர்கள்.',
          hi: 'एकदम सही! सोने जैसा नियम: पैसे प्राप्त करने के लिए पिन नहीं लगता। आपने ₹3,000 बचा लिए।',
        },
      },
    ],
  },
  {
    id: 4,
    type: 'REMOTE',
    title: {
      en: 'Scenario 4: Electricity Disconnection & AnyDesk App Trap',
      ta: 'சூழ்நிலை 4: மின்சார துண்டிப்பு மிரட்டல் & AnyDesk ஆப் வலை',
      hi: 'केस 4: बिजली बिल बकाया और AnyDesk रिमोट ऐप जाल',
    },
    scenarioPrompt: {
      en: 'A caller shouts: "Your electricity connection will be CUT OFF in 30 minutes due to unpaid bill! Download the QuickSupport / AnyDesk app right now so our officer can update your payment receipt." What should you do?',
      ta: 'ஒருவர் கோபமாக அழைக்கிறார்: "கட்டணம் செலுத்தாததால் இன்னும் 30 நிமிடங்களில் உங்கள் வீட்டு மின்சாரம் துண்டிக்கப்படும்! எங்கள் ஊழியர் சரிபார்க்க உடனே AnyDesk செயலியைப் பதிவிறக்குங்கள்." நீங்கள் என்ன செய்ய வேண்டும்?',
      hi: 'कॉलर कहता है: "बिल न भरने पर 30 मिनट में आपकी बिजली कट जाएगी! तुरंत AnyDesk ऐप डाउनलोड करें ताकि अधिकारी बिल अपडेट कर सके।" आपको क्या करना चाहिए?',
    },
    senderOrCaller: 'Urgent Caller (+91 94444 88776)',
    badge: {
      en: 'Emergency Threat Call',
      ta: 'அவசர மிரட்டல் அழைப்பு',
      hi: 'धमकी भरी कॉल',
    },
    contentPreview: {
      en: '"Sir, install AnyDesk app now or sit in darkness tonight!"',
      ta: '"சார், உடனே AnyDesk போடுங்கள், இல்லாவிட்டால் இன்று இரவு இருட்டில்தான் இருக்க வேண்டும்!"',
      hi: '"सर, तुरंत AnyDesk ऐप डालें वरना आज रात अंधेरे में रहना पड़ेगा!"',
    },
    options: [
      {
        id: 'A',
        text: {
          en: 'Download the AnyDesk app quickly so the technician can fix the power bill.',
          ta: 'மின்சாரம் துண்டிக்கப்படாமல் இருக்க AnyDesk செயலியைப் பதிவிறக்கி திரையைக் காட்டலாம்.',
          hi: 'बिजली कटने से बचने के लिए AnyDesk ऐप डाउनलोड कर लें।',
        },
        isSafe: false,
        explanation: {
          en: 'DANGEROUS! AnyDesk lets thieves view your smartphone screen live and steal bank passwords and PINs!',
          ta: 'மிகவும் ஆபத்தானது! AnyDesk செயலி உங்கள் செல்போன் திரையைத் திருடர்களுக்குக் காட்டி பாஸ்வேர்டுகளைத் திருடிவிடும்!',
          hi: 'खतरनाक! AnyDesk से ठग आपके फोन की स्क्रीन देखकर बैंक पासवर्ड और पिन चुरा लेते हैं!',
        },
      },
      {
        id: 'B',
        text: {
          en: 'Hang up immediately. Never install remote-access apps. Check your bill at the official electricity office.',
          ta: 'உடனே அழைப்பைத் துண்டிக்கவும். ரிமோட் செயலிகளைப் பதிவிறக்காமல் அதிகாரப்பூர்வ மின்சார வாரியத்தில் சரிபார்க்கவும்.',
          hi: 'तुरंत कॉल काटें। रिमोट ऐप कभी डाउनलोड न करें और असली बिजली दफ्तर से जांच करें।',
        },
        isSafe: true,
        explanation: {
          en: 'CORRECT & SAFE! Government utilities never demand AnyDesk downloads. You completely protected your device.',
          ta: 'மிகச் சிறந்த முடிவு! அரசுத் துறைகள் ஒருபோதும் AnyDesk கேட்காது. உங்கள் செல்போன் பாதுகாப்பானது.',
          hi: 'बिल्कुल सही! सरकारी विभाग कभी AnyDesk डाउनलोड नहीं कराते। आपका फोन सुरक्षित रहा।',
        },
      },
    ],
  },
];

// Metadata for the 8-node Duolingo-style learning path
export const SPAM_PATH_LESSON_METAS: Record<SpamStepId, SpamLessonMeta> = {
  1: {
    id: 1,
    code: 'S1',
    type: 'CALL',
    title: {
      en: 'Fake Bank Call & ATM PIN Scam',
      ta: 'போலி வங்கி அழைப்பு & ஏடிஎம் பின் மோசடி',
      hi: 'फर्जी बैंक कॉल और एटीएम पिन घोटाला',
    },
    shortTitle: {
      en: 'ATM PIN Scam',
      ta: 'ஏடிஎம் பின் மோசடி',
      hi: 'एटीएम पिन घोटाला',
    },
    description: {
      en: 'Recognize unverified bank callers asking for 4-digit ATM PIN, refuse, hang up, and block.',
      ta: 'வங்கியில் இருந்து பேசுவதாக ஏடிஎம் பின் கேட்கும் போலி அழைப்பை நிராகரித்து பிளாக் செய்யப் பழகுங்கள்.',
      hi: 'फर्जी बैंक अधिकारी द्वारा एटीएम पिन मांगने की पहचान करें, कॉल काटें और नंबर ब्लॉक करें।',
    },
    badge: {
      en: 'Call Safety Drill',
      ta: 'அழைப்பு பாதுகாப்பு',
      hi: 'कॉल सुरक्षा ड्रिल',
    },
    estimatedMinutes: 3,
    iconName: 'PhoneOff',
    goldenRule: {
      en: 'Banks NEVER ask for your 4-digit ATM PIN over phone.',
      ta: 'வங்கிகள் ஒருபோதும் போனில் ஏடிஎம் பின் கேட்காது.',
      hi: 'बैंक कभी भी फोन पर एटीएम पिन नहीं मांगते।',
    },
  },
  2: {
    id: 2,
    code: 'S2',
    type: 'CALL',
    title: {
      en: 'KYC Threat & OTP Theft Scam',
      ta: 'KYC மிரட்டல் & OTP திருட்டு மோசடி',
      hi: 'केवाईसी धमकी और ओटीपी चोरी कॉल',
    },
    shortTitle: {
      en: 'OTP Theft Call',
      ta: 'OTP திருட்டு அழைப்பு',
      hi: 'ओटीपी चोरी कॉल',
    },
    description: {
      en: 'Recognize urgent account-freeze panic tactics, never reveal SMS OTP, and disengage.',
      ta: 'கணக்கு முடங்கும் அச்சுறுத்தல்களுக்கு அஞ்சாமல், OTP-ஐ யாரிடமும் தராமல் அழைப்பைத் துண்டிக்கப் பழகுங்கள்.',
      hi: 'खाता ब्लॉक होने के डर में ओटीपी न दें, तुरंत कॉल काटें और नंबर ब्लॉक करें।',
    },
    badge: {
      en: 'OTP Security',
      ta: 'OTP பாதுகாப்பு',
      hi: 'ओटीपी सुरक्षा',
    },
    estimatedMinutes: 3,
    iconName: 'ShieldAlert',
    goldenRule: {
      en: 'Treat every SMS OTP like a private cash locker key.',
      ta: 'OTP பணப்பெட்டி சாவி போன்றது; ஒருபோதும் பகிராதீர்கள்.',
      hi: 'ओटीपी लॉकर की चाबी की तरह गुप्त रखें।',
    },
  },
  3: {
    id: 3,
    code: 'S3',
    type: 'CALL',
    title: {
      en: 'Fake Lottery & Prize Scam',
      ta: 'போலி லாட்டரி & பரிசு மோசடி',
      hi: 'फर्जी लॉटरी और इनाम कॉल',
    },
    shortTitle: {
      en: 'Lottery Prize Scam',
      ta: 'லாட்டரி பரிசு மோசடி',
      hi: 'लॉटरी इनाम कॉल',
    },
    description: {
      en: 'Spot fake ₹25 Lakh cash prize claims and refuse card details or PIN requests.',
      ta: 'சீட்டு வாங்காத லாட்டரி பரிசுகளை நம்பாமல், அட்டை விபரம் தராமல் அழைப்பைத் துண்டிக்கப் பழகுங்கள்.',
      hi: 'अचानक लॉटरी जीतने के दावों को पहचानें, पिन या अग्रिम शुल्क न दें और सुरक्षित रहें।',
    },
    badge: {
      en: 'Prize Traps',
      ta: 'பரிசு பொறிகள்',
      hi: 'इनाम के जाल',
    },
    estimatedMinutes: 3,
    iconName: 'Trophy',
    goldenRule: {
      en: 'Receiving money NEVER requires an ATM PIN.',
      ta: 'பணம் பெற ஒருபோதும் ஏடிஎம் பின் தேவையில்லை.',
      hi: 'पैसे पाने हेतु एटीएम पिन कभी नहीं लगता।',
    },
  },
  4: {
    id: 4,
    code: 'S4',
    type: 'CALL',
    title: {
      en: 'Screen-Sharing & Remote App Trap',
      ta: 'ஸ்கிரீன் ஷேரிங் & ரிமோட் ஆப் மோசடி',
      hi: 'स्क्रीन शेयर और रिमोट ऐप फ्रॉड',
    },
    shortTitle: {
      en: 'Screen Share Scam',
      ta: 'ஸ்கிரீன் ஷேர் மோசடி',
      hi: 'स्क्रीन शेयर फ्रॉड',
    },
    description: {
      en: 'Recognize requests to install AnyDesk or QuickSupport and deny remote phone access.',
      ta: 'AnyDesk போன்ற ஆபத்தான திரைப் பகிர்வு செயலிகளைப் பதிவிறக்கச் சொல்லும் அழைப்புகளைத் துண்டிக்கப் பழகுங்கள்.',
      hi: 'AnyDesk या रिमोट ऐप डाउनलोड कराने की कोशिश पहचानें, मना करें और कॉल काटें।',
    },
    badge: {
      en: 'Device Privacy',
      ta: 'சாதன பாதுகாப்பு',
      hi: 'डिवाइस सुरक्षा',
    },
    estimatedMinutes: 3,
    iconName: 'Smartphone',
    goldenRule: {
      en: 'NEVER install screen share apps on calls.',
      ta: 'போன் காலில் திரைப் பகிர்வு செயலிகளைப் போடாதீர்கள்.',
      hi: 'कॉल पर कभी स्क्रीन शेयर ऐप डाउनलोड न करें।',
    },
  },
  5: {
    id: 5,
    code: 'S5',
    type: 'MESSAGE',
    title: {
      en: 'Suspicious SMS & WhatsApp Messages',
      ta: 'போலி எஸ்.எம்.எஸ் & வாட்ஸ்அப் செய்திகள்',
      hi: 'संदिग्ध एसएमएस और व्हाट्सएप संदेश',
    },
    shortTitle: {
      en: 'Fake SMS & Links',
      ta: 'போலி எஸ்.எம்.எஸ் & லிங்க்',
      hi: 'फर्जी एसएमएस व लिंक',
    },
    description: {
      en: 'Spot fake delivery and banking SMS, identify dangerous links, avoid clicking, and report.',
      ta: 'பார்சல் மற்றும் வங்கி பெயரில் வரும் போலி குறுஞ்செய்தி லிங்குகளைக் கிளிக் செய்யாமல் பிளாக் செய்யப் பழகுங்கள்.',
      hi: 'फर्जी पार्सल व बैंक मैसेज पहचानें, अनजान लिंक पर क्लिक करने से बचें और रिपोर्ट करें।',
    },
    badge: {
      en: 'Link Safety',
      ta: 'லிங்க் பாதுகாப்பு',
      hi: 'लिंक सुरक्षा',
    },
    estimatedMinutes: 3,
    iconName: 'MessageSquare',
    goldenRule: {
      en: 'Never click unverified links in text messages.',
      ta: 'குறுஞ்செய்திகளில் வரும் அறியப்படாத லிங்குகளைத் தொடாதீர்கள்.',
      hi: 'मैसेज में आए अनजान लिंक पर कभी क्लिक न करें।',
    },
  },
  6: {
    id: 6,
    code: 'S6',
    type: 'UPI',
    title: {
      en: 'UPI Payment & QR-Code Scams',
      ta: 'யுபிஐ (UPI) & க்யூஆர் கோடு மோசடி',
      hi: 'यूपीआई भुगतान और क्यूआर कोड फ्रॉड',
    },
    shortTitle: {
      en: 'UPI QR Scam',
      ta: 'யுபிஐ க்யூஆர் மோசடி',
      hi: 'यूपीआई क्यूआर फ्रॉड',
    },
    description: {
      en: 'Learn that receiving money NEVER requires entering a UPI PIN. Decline fake collect requests.',
      ta: 'பணம் பெற ஒருபோதும் யுபிஐ பின் தேவையில்லை என்ற தங்க விதியைக் கற்றுக்கொண்டு மோசடி கோரிக்கையை நிராகரியுங்கள்.',
      hi: 'सोने जैसा नियम सीखें: पैसे पाने के लिए कभी यूपीआई पिन नहीं डाला जाता। फर्जी रिक्वेस्ट खारिज करें।',
    },
    badge: {
      en: 'UPI PIN Rule',
      ta: 'யுபிஐ விதி',
      hi: 'यूपीआई नियम',
    },
    estimatedMinutes: 3,
    iconName: 'KeyRound',
    goldenRule: {
      en: 'UPI PIN is ONLY entered to SEND money, NEVER to receive.',
      ta: 'பணம் அனுப்ப மட்டுமே யுபிஐ பின்; பணம் பெற ஒருபோதும் இல்லை.',
      hi: 'यूपीआई पिन सिर्फ पैसे भेजने के लिए होता है, पाने के लिए नहीं।',
    },
  },
  7: {
    id: 7,
    code: 'S7',
    type: 'CALL',
    title: {
      en: 'Fake Customer Care & Impersonation',
      ta: 'போலி வாடிக்கையாளர் சேவை & மின்சார துண்டிப்பு மிரட்டல்',
      hi: 'फर्जी कस्टमर केयर और बिजली बिल कटौती कॉल',
    },
    shortTitle: {
      en: 'Customer Care Scam',
      ta: 'வாடிக்கையாளர் சேவை மோசடி',
      hi: 'कस्टमर केयर फ्रॉड',
    },
    description: {
      en: 'End panic calls claiming power cutoff, avoid numbers given by callers, and verify officially.',
      ta: 'மின்சாரம் துண்டிக்கப்படும் என மிரட்டும் போலி அழைப்புகளைத் துண்டித்து அதிகாரப்பூர்வமாக சரிபார்க்கப் பழகுங்கள்.',
      hi: 'बिजली या सिम कटने की फर्जी धमकी से डरें नहीं, कॉल काटें और असली ऑफिस से संपर्क करें।',
    },
    badge: {
      en: 'Impersonation Defense',
      ta: 'ஆள்மாறாட்ட பாதுகாப்பு',
      hi: 'पहचान चोरी बचाव',
    },
    estimatedMinutes: 3,
    iconName: 'ShieldAlert',
    goldenRule: {
      en: 'Always verify bills through official offices or receipts.',
      ta: 'அரசு ரசீது அல்லது நேரடி அலுவலகத்தில் மட்டுமே சரிபாருங்கள்.',
      hi: 'हमेशा आधिकारिक रसीद या ऑफिस जाकर बिल जांचें।',
    },
  },
  8: {
    id: 8,
    code: 'S8',
    type: 'CHALLENGE',
    title: {
      en: 'Final Fraud-Safety Challenge',
      ta: 'இறுதி சைபர் மோசடி பாதுகாப்பு சவால்',
      hi: 'अंतिम साइबर सुरक्षा महा-चुनौती',
    },
    shortTitle: {
      en: 'Fraud Challenge',
      ta: 'பாதுகாப்பு சவால்',
      hi: 'सुरक्षा चुनौती',
    },
    description: {
      en: 'Test your digital defense skills across Calls, SMS, UPI & Customer Care scenarios.',
      ta: 'அழைப்பு, எஸ்.எம்.எஸ், யுபிஐ மற்றும் உதவி எண்கள் தொடர்பான நிஜ சவால்களை எதிர்கொண்டு வெற்றி பெறுங்கள்.',
      hi: 'कॉल, एसएमएस, यूपीआई और कस्टमर केयर के असली मामलों में अपनी सुरक्षा क्षमता परखें।',
    },
    badge: {
      en: 'Final Milestone',
      ta: 'இறுதி மைல்கல்',
      hi: 'अंतिम मील का पत्थर',
    },
    estimatedMinutes: 5,
    iconName: 'Award',
    goldenRule: {
      en: 'Think before reacting: Never share PIN, OTP, screen, or click links.',
      ta: 'யோசித்து செயல்படுங்கள்: பின், OTP, ஸ்கிரீன் பகிராதீர்; லிங்க் தொடாதீர்.',
      hi: 'सोच-समझकर कदम उठाएं: पिन, ओटीपी, स्क्रीन शेयर न करें और लिंक न छुएं।',
    },
  },
};

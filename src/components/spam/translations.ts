import { AppTranslation, SpamLanguageCode } from './types';

export const TRANSLATIONS: Record<SpamLanguageCode, AppTranslation> = {
  en: {
    appTitle: 'Spam Message Safety',
    appSubtitle: 'Mobile Safety for Beginners',
    instructorName: 'Selvi',
    instructorRole: 'Digital Safety Guide',

    steps: {
      home: 'Home Screen & SMS',
      demo: '4 Red Flag Signs',
      practice: 'Safety Practice Drill',
      quiz: 'Safety Quiz & Golden Rules',
    },

    nav: {
      previous: 'Previous',
      next: 'Next',
      replay: 'Replay Voice',
      play: 'Play Voice',
      pause: 'Pause',
      mute: 'Mute',
      unmute: 'Unmute',
      startPractice: 'Start Practice',
      takeQuiz: 'Take Quiz',
      stepCounter: 'Step',
      subtitlesLabel: 'Subtitles',
      tryAgain: 'Try Again',
      checkAnswer: 'Check Answer',
      restartLesson: 'Restart Lesson',
      openMessages: 'Open Messages App',
      correct: 'Correct!',
      incorrect: 'Be Careful!',
      score: 'Your Score',
      skip: 'Skip Lesson',
      exit: 'Exit to Path',
      menu: 'Lessons',
    },

    step1Home: {
      title: 'Simulated Smartphone Home Screen',
      subtitle: 'Look at the phone screen. A new SMS notification has just arrived.',
      speech: 'Welcome! Look at the smartphone screen on your right. You are on the phone home screen. Notice the notification banner appearing at the top. A new text message has arrived in the normal Messages app. Tap the notification or the Messages icon to open it.',
      instructorText: 'Welcome! Look at the smartphone home screen. An SMS notification has just arrived at the top. Tap it or tap the Messages app icon to view the message.',
      phoneInstruction: 'Tap the notification banner or Messages app icon to begin.',
      notificationTitle: 'Messages · New SMS',
      notificationBody: 'Congratulations! You have won ₹1 crore. Click this link to claim your prize...',
      openPrompt: 'Tap Messages app to view the SMS',
    },

    step2Demo: {
      title: 'SMS Spam Demonstration',
      subtitle: 'Learn why unexpected prize messages are dangerous',
      speech: 'This message may be a scam. You should not click the link. Do not share your personal or banking information. If the message looks suspicious, ignore it and report or block the sender when appropriate.',
      instructorText: 'This message may be a scam. You should not click the link. Do not share your personal or banking information. If the message looks suspicious, ignore it and report or block the sender when appropriate.',
      smsSender: 'VM-WINBIG',
      smsBody: 'Congratulations! You have won ₹1 crore. Click this link to claim your prize immediately:',
      smsLink: 'http://claim-free-crorepati-win.xyz/redeem',
      suspiciousBadge: 'Suspicious Fake Prize SMS',
      fourSignsTitle: 'Why this message is suspicious:',
      fourSigns: [
        {
          id: 'prize',
          title: 'The prize is unexpected',
          desc: 'You did not enter any contest or lottery. Genuine money is never given out for free.',
        },
        {
          id: 'sender',
          title: 'The sender may be unknown',
          desc: 'The message arrives from an unfamiliar code or random number rather than a verified official source.',
        },
        {
          id: 'link',
          title: 'The link may lead to a fake website',
          desc: 'The link ends in strange letters like .xyz. It is designed to capture your private information.',
        },
        {
          id: 'urgency',
          title: 'The message pressures you to act quickly',
          desc: 'Phrases like "immediately" create panic so you click before asking anyone for advice.',
        },
      ],
    },

    step3Practice: {
      title: 'Interactive Practice Session',
      subtitle: 'A second suspicious message has arrived. Practice handling it safely!',
      speech: 'Now it is your turn to practice! A new message has arrived claiming your bank account will be blocked today and asking for your OTP. Try interacting with the phone. Never click the link! Instead, choose a safe action such as blocking or ignoring.',
      instructorText: 'A second message arrived claiming your bank account will be blocked today! Try handling it on the simulated phone.',
      taskPrompt: 'What should you do with this urgent bank message?',
      practiceSender: '+91 98765 43210',
      practiceSmsBody: 'Your bank account will be blocked today! Click this link and enter your OTP immediately:',
      practiceSmsLink: 'http://bank-kyc-verify-portal.in/login',
      unsafeAttemptWarning: '⚠️ Unsafe Action! You tapped the link. Fraudulent links can steal your passwords, banking access, or install harmful apps. Never tap links in strange SMS messages. Try a safe action instead!',
      safeActionSuccess: '🎉 Excellent Choice! You blocked and reported the sender without clicking the link. Your bank account and personal details remain safe.',
      safeActionTip: 'Remember: Real banks never ask for your confidential OTP over SMS or phone calls.',
      tapLinkActionLabel: 'Tap Link (Unsafe Test)',
      blockActionLabel: 'Block & Report Sender (Safe)',
      ignoreActionLabel: 'Ignore & Delete Message (Safe)',
      tryAgainLabel: 'Try Again',
    },

    step4Quiz: {
      title: 'Safety Quiz',
      subtitle: 'Answer 5 simple questions to test your spam SMS knowledge',
      speech: 'Great work! Let us finish with a quick 5 question quiz on spam SMS safety. Take your time and select the safest choice for each question.',
      instructorText: 'Answer these 5 simple questions to see how well you can protect your phone from fraudulent SMS.',
      quizCompletedTitle: 'Well Done! You Completed the Module',
      quizCompletedDesc: 'You now know how to spot suspicious links, unexpected prizes, urgent threats, and protect your secret OTP.',
      questions: [
        {
          id: 1,
          question: 'What should you do if an SMS from an unknown sender contains a blue web link?',
          options: [
            { id: 'a', text: 'Click the link immediately to see what it is.', isCorrect: false },
            { id: 'b', text: 'Do not click the link. Ignore, delete, or block the sender.', isCorrect: true },
            { id: 'c', text: 'Forward it to all your friends.', isCorrect: false },
          ],
          explanation: 'Never tap suspicious links. They can steal private data or access your bank accounts.',
        },
        {
          id: 2,
          question: 'An SMS says: "Congratulations! You have won ₹1 Crore lottery!" Is this genuine?',
          options: [
            { id: 'a', text: 'Yes, it is a real cash reward from the government.', isCorrect: false },
            { id: 'b', text: 'No, it is a scam. You cannot win a contest you never entered.', isCorrect: true },
            { id: 'c', text: 'It is a special bonus from the mobile operator.', isCorrect: false },
          ],
          explanation: 'No lottery awards prizes without an official ticket or entry. This is always a scam lure.',
        },
        {
          id: 3,
          question: 'Will a genuine bank manager ever send an SMS asking you to enter your confidential OTP via a link?',
          options: [
            { id: 'a', text: 'Yes, to verify customer identity.', isCorrect: false },
            { id: 'b', text: 'No, never. OTPs are 100% confidential and for you alone.', isCorrect: true },
            { id: 'c', text: 'Only when updating KYC details.', isCorrect: false },
          ],
          explanation: 'Your OTP is secret. Banks explicitly train their staff never to ask for your OTP.',
        },
        {
          id: 4,
          question: 'Why do scam SMS messages often say: "Act immediately or your account will be suspended today!"?',
          options: [
            { id: 'a', text: 'To create panic so you click quickly without thinking or asking for help.', isCorrect: true },
            { id: 'b', text: 'Because the bank office is closing early.', isCorrect: false },
            { id: 'c', text: 'Because mobile networks shut down at night.', isCorrect: false },
          ],
          explanation: 'Scammers use false urgency and fear to stop you from pausing to think or consulting others.',
        },
        {
          id: 5,
          question: 'If you are worried an urgent bank SMS might be real, what is the safest action?',
          options: [
            { id: 'a', text: 'Tap the link inside the SMS to check.', isCorrect: false },
            { id: 'b', text: 'Call the official customer care number on your passbook or visit the bank branch.', isCorrect: true },
            { id: 'c', text: 'Send your debit card PIN by SMS to confirm.', isCorrect: false },
          ],
          explanation: 'Always verify through official channels: the phone number printed on your bank passbook or in person.',
        },
      ],
      goldenRules: [
        {
          title: 'Never Tap Unknown Links',
          desc: 'Avoid clicking blue web links sent in unexpected prize or threat messages.',
        },
        {
          title: 'Keep Your OTP 100% Secret',
          desc: 'Never share your OTP with anyone, even someone claiming to be a bank official.',
        },
        {
          title: 'Verify via Your Passbook',
          desc: 'Check banking queries only through the helpline printed on your official passbook.',
        },
        {
          title: 'Block and Report',
          desc: 'Use the 3 dots on your phone messages to block suspicious numbers.',
        },
      ],
    },
  },

  ta: {
    appTitle: 'சதர்க் எஸ்.எம்.எஸ்',
    appSubtitle: 'புதிய பயனர்களுக்கான மொபைல் பாதுகாப்பு',
    instructorName: 'செல்வி',
    instructorRole: 'டிஜிட்டல் பாதுகாப்பு வழிகாட்டி',

    steps: {
      home: 'முகப்புத் திரை & எஸ்.எம்.எஸ்',
      demo: '4 எச்சரிக்கை அறிகுறிகள்',
      practice: 'பாதுகாப்புப் பயிற்சி அரங்கம்',
      quiz: 'வினாடி வினா & பொன்விதிகள்',
    },

    nav: {
      previous: 'முந்தையது',
      next: 'அடுத்தது',
      replay: 'மீண்டும் கேட்க',
      play: 'குரல் இயக்கு',
      pause: 'நிறுத்து',
      mute: 'குரலை அணை',
      unmute: 'குரலை இயக்கு',
      startPractice: 'பயிற்சியைத் தொடங்கு',
      takeQuiz: 'வினாடி வினா தொடங்கு',
      stepCounter: 'படி',
      subtitlesLabel: 'வசனங்கள்',
      tryAgain: 'மீண்டும் முயற்சி செய்க',
      checkAnswer: 'பதிலை சரிபார்க்க',
      restartLesson: 'பாடத்தை மீண்டும் தொடங்கு',
      openMessages: 'மெசேஜஸ் செயலியைத் திறக்க',
      correct: 'சரியான பதில்!',
      incorrect: 'கவனமாக இருங்கள்!',
      score: 'உங்கள் மதிப்பெண்',
      skip: 'பாடத்தைத் தவிர்',
      exit: 'வெளியேறு',
      menu: 'பாடங்கள்',
    },

    step1Home: {
      title: 'மாதிரி ஸ்மார்ட்போன் முகப்புத் திரை',
      subtitle: 'போன் திரையைப் பாருங்கள். ஒரு புதிய எஸ்.எம்.எஸ் அறிவிப்பு வந்துள்ளது.',
      speech: 'வணக்கம்! நான் உங்கள் செல்வி. உங்கள் ஸ்மார்ட்போன் முகப்புத் திரையைக் கவனியுங்கள். மேலே ஒரு புதிய எஸ்.எம்.எஸ் அறிவிப்பு வந்துள்ளது. உங்கள் போனின் சாதாரண மெசேஜஸ் செயலியில் வந்துள்ள அந்தச் செய்தியைப் பார்க்க, அறிவிப்பை அல்லது மெசேஜஸ் ஐகானைத் தொடுங்கள்.',
      instructorText: 'வணக்கம்! நான் உங்கள் செல்வி. உங்கள் ஸ்மார்ட்போன் முகப்புத் திரையைக் கவனியுங்கள். மேலே ஒரு புதிய எஸ்.எம்.எஸ் அறிவிப்பு வந்துள்ளது. அதைத் தொட்டு மெசேஜஸ் செயலியைத் திறக்கவும்.',
      phoneInstruction: 'செய்தியைப் பார்க்க மேலே உள்ள அறிவிப்பை அல்லது மெசேஜஸ் ஐகானைத் தொடவும்.',
      notificationTitle: 'Messages · புதிய செய்தி',
      notificationBody: 'வாழ்த்துகள்! நீங்கள் ₹1 கோடி வென்றுள்ளீர்கள். பரிசைப் பெற லிங்கை கிளிக் செய்க...',
      openPrompt: 'செய்தியைப் பார்க்க Messages ஐகானைத் தொடவும்',
    },

    step2Demo: {
      title: 'போலி எஸ்.எம்.எஸ் செயல்முறை விளக்கம்',
      subtitle: 'எதிர்பாராத பரிசு குறுஞ்செய்திகள் ஏன் ஆபத்தானவை என்பதை அறிந்துகொள்ளுங்கள்',
      speech: 'இந்த செய்தி ஒரு மோசடியாக இருக்கலாம். நீங்கள் இந்த இணைப்பை ஒருபோதும் கிளிக் செய்யக்கூடாது. உங்கள் தனிப்பட்ட அல்லது வங்கி விவரங்களை யாருடனும் பகிராதீர்கள். செய்தி சந்தேகத்திற்கிடமாகத் தெரிந்தால், அதைப் புறக்கணித்துவிட்டு, அனுப்பிய எண்ணை உடனே பிளாக் செய்யுங்கள்.',
      instructorText: 'இந்த செய்தி ஒரு மோசடியாக இருக்கலாம். நீங்கள் இந்த இணைப்பை ஒருபோதும் கிளிக் செய்யக்கூடாது. உங்கள் தனிப்பட்ட அல்லது வங்கி விவரங்களை யாருடனும் பகிராதீர்கள். செய்தி சந்தேகத்திற்கிடமாகத் தெரிந்தால், அதைப் புறக்கணித்துவிட்டு, அனுப்பிய எண்ணை உடனே பிளாக் செய்யுங்கள்.',
      smsSender: 'VM-WINBIG',
      smsBody: 'வாழ்த்துகள்! நீங்கள் ₹1 கோடி வென்றுள்ளீர்கள். உங்கள் பரிசை உடனடியாகப் பெற இந்த இணைப்பைக் கிளிக் செய்யவும்:',
      smsLink: 'http://claim-free-crorepati-win.xyz/redeem',
      suspiciousBadge: 'சந்தேகத்திற்குரிய போலி பரிசு எஸ்.எம்.எஸ்',
      fourSignsTitle: 'இந்த செய்தி ஏன் சந்தேகத்திற்குரியது:',
      fourSigns: [
        {
          id: 'prize',
          title: 'பரிசு முற்றிலும் எதிர்பாராதது',
          desc: 'நீங்கள் எந்த போட்டியிலும் பங்கேற்கவில்லை. இலவசமாக யாருக்கும் ஒரு கோடி ரூபாய் கிடைக்காது.',
        },
        {
          id: 'sender',
          title: 'அனுப்புநர் தெரியாத நபராக இருக்கலாம்',
          desc: 'அரசு அல்லது வங்கியின் அதிகாரப்பூர்வ பெயருக்குப் பதிலாக அடையாளம் தெரியாத குறியீட்டிலிருந்து வந்துள்ளது.',
        },
        {
          id: 'link',
          title: 'இணைப்பு போலி வலைத்தளத்திற்கு இட்டுச் செல்லலாம்',
          desc: 'லிங்க் .xyz போன்ற விசித்திரமான முடிவைக் கொண்டுள்ளது. இது உங்கள் தகவலைத் திருட உருவாக்கப்பட்ட தளம்.',
        },
        {
          id: 'urgency',
          title: 'உடனடியாக செயல்பட அழுத்தம் தருகிறது',
          desc: '"உடனடியாக" போன்ற வார்த்தைகள் உங்களை யோசிக்க விடாமல் அவசரமாக கிளிக் செய்ய வைக்கின்றன.',
        },
      ],
    },

    step3Practice: {
      title: 'ஊடாடும் பயிற்சி அரங்கம்',
      subtitle: 'இரண்டாவது போலி செய்தி வந்துள்ளது. பாதுகாப்பாக கையாண்டு பழகுங்கள்!',
      speech: 'இப்போது நீங்கள் பயிற்சி செய்து பாருங்கள்! உங்கள் வங்கிக் கணக்கு இன்று முடக்கப்படும் என்றும், உடனே OTP-ஐ உள்ளிடுமாறும் ஒரு போலி செய்தி வந்துள்ளது. மாதிரி போனில் சரியான வழியைப் பின்பற்றிப் பழகுங்கள். லிங்கை தொடவே கூடாது! மாறாக, பிளாக் அல்லது நிராகரிக்கும் பாதுகாப்பான முடிவை எடுங்கள்.',
      instructorText: 'உங்கள் வங்கி கணக்கு முடக்கப்படும் என அச்சுறுத்தும் செய்தி வந்துள்ளது! மாதிரி போனில் பாதுகாப்பான வழியைப் பின்பற்றிப் பழகுங்கள்.',
      taskPrompt: 'இந்த அவசர வங்கி செய்திக்கு நீங்கள் என்ன செய்ய வேண்டும்?',
      practiceSender: '+91 98765 43210',
      practiceSmsBody: 'உங்கள் வங்கிக் கணக்கு இன்று முடக்கப்படும்! உடனடியாக இந்த லிங்க்கை கிளிக் செய்து உங்கள் OTP-ஐ உள்ளிடவும்:',
      practiceSmsLink: 'http://bank-kyc-verify-portal.in/login',
      unsafeAttemptWarning: 'எச்சரிக்கை! நீங்கள் லிங்கைத் தொட்டுவிட்டீர்கள். தெரியாத லிங்கைத் தொட்டால் உங்கள் வங்கி கடவுச்சொல் திருடப்படலாம். எனவே தெரியாத லிங்கை ஒருபோதும் தொடாதீர்கள். மீண்டும் முயற்சி செய்து, பாதுகாப்பான முடிவைத் தேர்ந்தெடுக்கவும்!',
      safeActionSuccess: 'மிகச் சிறப்பு! நீங்கள் ஆபத்தான லிங்கைத் தொடாமல் அனுப்புநரை பிளாக் செய்துவிட்டீர்கள். உங்கள் வங்கி கணக்கும் பணமும் இப்போது முற்றிலும் பாதுகாப்பாக உள்ளது.',
      safeActionTip: 'நினைவில் வையுங்கள்: உண்மையான வங்கிகள் ஒருபோதும் எஸ்.எம்.எஸ் மூலம் ரகசிய OTP-ஐ கேட்காது.',
      tapLinkActionLabel: 'லிங்கைத் தொடு (ஆபத்து சோதனை)',
      blockActionLabel: 'பிளாக் செய்து புகார் செய் (பாதுகாப்பானது)',
      ignoreActionLabel: 'செய்தியைப் புறக்கணித்து நீக்கு (பாதுகாப்பானது)',
      tryAgainLabel: 'மீண்டும் முயற்சி செய்க',
    },

    step4Quiz: {
      title: 'பாதுகாப்பு வினாடி வினா',
      subtitle: 'உங்கள் அறிவைச் சோதிக்க 5 எளிய கேள்விகளுக்குப் பதிலளிக்கவும்',
      speech: 'அருமை! இப்போது 5 எளிய கேள்விகள் கொண்ட பாதுகாப்பு வினாடி வினாவை முடிப்போம். நிதானமாக யோசித்து பாதுகாப்பான விடையைத் தேர்ந்தெடுங்கள்.',
      instructorText: 'எஸ்.எம்.எஸ் மோசடியிலிருந்து தற்காத்துக் கொள்ளும் 5 எளிய கேள்விகளுக்குப் பதிலளியுங்கள்.',
      quizCompletedTitle: 'சிறப்பு! நீங்கள் பயிற்சியை முடித்துவிட்டீர்கள்',
      quizCompletedDesc: 'போலி லிங்குகளைத் தவிர்க்கவும், எதிர்பாராத பரிசுகளை நிராகரிக்கவும், உங்கள் ரகசிய OTP-ஐ பாதுகாக்கவும் இப்போது நீங்கள் முழுமையாக அறிவீர்கள்.',
      questions: [
        {
          id: 1,
          question: 'தெரியாத எண்ணிலிருந்து நீல நிற இணைய இணைப்புடன் (Link) எஸ்.எம்.எஸ் வந்தால் என்ன செய்ய வேண்டும்?',
          options: [
            { id: 'a', text: 'என்னவென்று பார்க்க உடனே கிளிக் செய்ய வேண்டும்.', isCorrect: false },
            { id: 'b', text: 'லிங்கைத் தொடக்கூடாது. செய்தியைப் புறக்கணிக்க அல்லது பிளாக் செய்ய வேண்டும்.', isCorrect: true },
            { id: 'c', text: 'எல்லா நண்பர்களுக்கும் ஃபார்வர்டு செய்ய வேண்டும்.', isCorrect: false },
          ],
          explanation: 'சந்தேகத்திற்குரிய லிங்குகளைத் தொடாதீர்கள். அது போனில் உள்ள தகவல்களையோ அல்லது பணத்தையோ திருடலாம்.',
        },
        {
          id: 2,
          question: '"வாழ்த்துகள்! நீங்கள் ₹1 கோடி லாட்டரி வென்றுள்ளீர்கள்" என்ற எஸ்.எம்.எஸ் உண்மையா?',
          options: [
            { id: 'a', text: 'ஆம், அரசு தரும் உண்மையான ரொக்கப் பரிசு.', isCorrect: false },
            { id: 'b', text: 'இல்லை, இது மோசடி. நீங்கள் சேராத போட்டியில் பரிசு கிடைக்காது.', isCorrect: true },
            { id: 'c', text: 'மொபைல் கம்பெனியின் பரிசு.', isCorrect: false },
          ],
          explanation: 'நீங்கள் நேரில் சீட்டு வாங்காதவரை எந்த லாட்டரியிலும் பரிசு கிடைக்காது. இது ஒரு ஏமாற்று வேலை.',
        },
        {
          id: 3,
          question: 'உண்மையான வங்கி அதிகாரி எஸ்.எம்.எஸ் லிங்க் வழியே உங்கள் ரகசிய OTP-ஐ உள்ளிடும்படி கேட்பாரா?',
          options: [
            { id: 'a', text: 'ஆம், அடையாளத்தை உறுதிப்படுத்த கேட்பார்கள்.', isCorrect: false },
            { id: 'b', text: 'இல்லை, ஒருபோதும் கேட்க மாட்டார்கள். OTP எப்போதும் ரகசியமானது.', isCorrect: true },
            { id: 'c', text: 'கேஒய்சி புதுப்பிக்கும் போது மட்டும்.', isCorrect: false },
          ],
          explanation: 'உங்கள் OTP முற்றிலும் ரகசியமானது. வங்கி ஒருபோதும் இணையதளத்தில் OTP-ஐ பதிவிடச் சொல்லாது.',
        },
        {
          id: 4,
          question: '"இன்றே முடிக்காவிட்டால் கணக்கு முடங்கும்" என்று மோசடி செய்திகள் ஏன் அவசரப்படுத்துகின்றன?',
          options: [
            { id: 'a', text: 'நீங்கள் யோசிக்காமல், பிறரிடம் கேட்காமல் உடனே கிளிக் செய்ய வேண்டும் என்பதற்காக.', isCorrect: true },
            { id: 'b', text: 'அவர்கள் அலுவலகம் சீக்கிரம் மூடப்படுவதால்.', isCorrect: false },
            { id: 'c', text: 'போன் பேட்டரி குறைந்துவிட்டதால்.', isCorrect: false },
          ],
          explanation: 'பொய் பயம் மோசடிக்காரர்களின் உத்தி. அவசரம் காட்டினால் உடனே எச்சரிக்கையாக இருங்கள்.',
        },
        {
          id: 5,
          question: 'வங்கி பற்றிய எஸ்.எம்.எஸ் உண்மையா என்று சந்தேகம் வந்தால் என்ன செய்ய வேண்டும்?',
          options: [
            { id: 'a', text: 'அந்த எஸ்.எம்.எஸ்-ல் உள்ள லிங்கை உடனே கிளிக் செய்ய வேண்டும்.', isCorrect: false },
            { id: 'b', text: 'வங்கி கிளைக்குச் செல்ல வேண்டும் அல்லது பாஸ்புக்கில் உள்ள எண்ணில் விசாரிக்க வேண்டும்.', isCorrect: true },
            { id: 'c', text: 'ஏடிஎம் கார்டு பின்னை எஸ்.எம்.எஸ்-ல் அனுப்ப வேண்டும்.', isCorrect: false },
          ],
          explanation: 'எப்போதும் அதிகாரப்பூர்வ வழியில் மட்டுமே சரிபார்க்கவும்: உங்கள் வங்கி பாஸ்புக் அல்லது நேரில் வங்கி.',
        },
      ],
      goldenRules: [
        {
          title: 'தெரியாத லிங்குகளைத் தொடாதீர்கள்',
          desc: 'பரிசு அல்லது பயமுறுத்தும் செய்திகளில் வரும் நீல நிற இணைய இணைப்புகளைத் தொடக்கூடாது.',
        },
        {
          title: 'OTP-ஐ யாரிடமும் கூறாதீர்கள்',
          desc: 'வங்கி மேலாளர் கேட்டாலும் உங்கள் ரகசிய OTP-ஐ ஒருபோதும் சொல்லாதீர்கள்.',
        },
        {
          title: 'பாஸ்புக் வழியே சரிபாருங்கள்',
          desc: 'வங்கி தொடர்பான சந்தேகங்களை பாஸ்புக்கில் உள்ள எண்ணில் மட்டுமே கேட்கவும்.',
        },
        {
          title: 'பிளாக் செய்து புகார் செய்யுங்கள்',
          desc: 'சந்தேகத்திற்குரிய எண்களை போனின் 3 புள்ளிகளைத் தொட்டு பிளாக் செய்யுங்கள்.',
        },
      ],
    },
  },

  hi: {
    appTitle: 'सतर्क एसएमएस',
    appSubtitle: 'नए उपयोगकर्ताओं के लिए मोबाइल सुरक्षा',
    instructorName: 'सेल्वी',
    instructorRole: 'डिजिटल सुरक्षा गाइड',

    steps: {
      home: 'होम स्क्रीन व एसएमएस',
      demo: '4 खतरे के संकेत',
      practice: 'सुरक्षा अभ्यास सत्र',
      quiz: 'सुरक्षा क्विज़ व सुनहरे नियम',
    },

    nav: {
      previous: 'पिछला',
      next: 'अगला',
      replay: 'फिर से सुनें',
      play: 'आवाज़ चालू करें',
      pause: 'रोकें',
      mute: 'आवाज़ बंद करें',
      unmute: 'आवाज़ चालू करें',
      startPractice: 'अभ्यास शुरू करें',
      takeQuiz: 'क्विज़ शुरू करें',
      stepCounter: 'चरण',
      subtitlesLabel: 'उपशीर्षक',
      tryAgain: 'पुनः प्रयास करें',
      checkAnswer: 'उत्तर जांचें',
      restartLesson: 'पाठ पुनः आरंभ करें',
      openMessages: 'मैसेज ऐप खोलें',
      correct: 'सही जवाब!',
      incorrect: 'सावधान रहें!',
      score: 'आपका स्कोर',
      skip: 'पाठ छोड़ें',
      exit: 'बाहर निकलें',
      menu: 'पाठ सूची',
    },

    step1Home: {
      title: 'सिम्युलेटेड स्मार्टफोन होम स्क्रीन',
      subtitle: 'फोन स्क्रीन पर ध्यान दें। एक नया एसएमएस संदेश आया है।',
      speech: 'नमस्ते! मैं आपकी सेल्वी हूँ। दाईं ओर दिख रही स्मार्टफोन होम स्क्रीन को देखें। ऊपर एक नया एसएमएस नोटिफिकेशन आया है। आपके फोन के सामान्य मैसेज ऐप में एक संदेश आया है। उस नोटिफिकेशन या मैसेज ऐप के आइकन पर टैप करके संदेश को खोलें।',
      instructorText: 'नमस्ते! स्मार्टफोन की होम स्क्रीन देखें। ऊपर एक नया एसएमएस संदेश आया है। नोटिफिकेशन या मैसेज ऐप आइकन पर टैप करके संदेश खोलें।',
      phoneInstruction: 'संदेश देखने के लिए ऊपर नोटिफिकेशन या मैसेज ऐप आइकन पर टैप करें।',
      notificationTitle: 'Messages · नया संदेश',
      notificationBody: 'बधाई हो! आपने ₹1 करोड़ जीते हैं। इनाम पाने के लिए लिंक पर क्लिक करें...',
      openPrompt: 'मैसेज देखने के लिए Messages आइकन दबाएं',
    },

    step2Demo: {
      title: 'फर्जी एसएमएस का प्रदर्शन (डेमो)',
      subtitle: 'जानें कि अप्रत्याशित इनाम के संदेश खतरनाक क्यों होते हैं',
      speech: 'यह संदेश एक धोखाधड़ी (स्कैम) हो सकता है। आपको इस लिंक पर क्लिक नहीं करना चाहिए। अपनी व्यक्तिगत या बैंक जानकारी कभी साझा न करें। यदि संदेश संदिग्ध लगे, तो उसे अनदेखा करें और उचित होने पर भेजने वाले को रिपोर्ट या ब्लॉक करें।',
      instructorText: 'यह संदेश एक धोखाधड़ी (स्कैम) हो सकता है। आपको इस लिंक पर क्लिक नहीं करना चाहिए। अपनी व्यक्तिगत या बैंक जानकारी कभी साझा न करें। यदि संदेश संदिग्ध लगे, तो उसे अनदेखा करें और उचित होने पर भेजने वाले को रिपोर्ट या ब्लॉक करें।',
      smsSender: 'VM-WINBIG',
      smsBody: 'बधाई हो! आपने ₹1 करोड़ जीते हैं। तुरंत अपना इनाम पाने के लिए इस लिंक पर क्लिक करें:',
      smsLink: 'http://claim-free-crorepati-win.xyz/redeem',
      suspiciousBadge: 'संदिग्ध फर्जी इनाम संदेश',
      fourSignsTitle: 'यह संदेश संदिग्ध क्यों है:',
      fourSigns: [
        {
          id: 'prize',
          title: 'इनाम पूरी तरह अप्रत्याशित है',
          desc: 'आपने किसी लॉटरी या प्रतियोगिता में भाग नहीं लिया था। बिना टिकट कोई भी मुफ्त में एक करोड़ रुपये नहीं देता।',
        },
        {
          id: 'sender',
          title: 'भेजने वाला अनजान हो सकता है',
          desc: 'संदेश किसी आधिकारिक बैंक या सरकारी नाम के बजाय अज्ञात कोड से आया है।',
        },
        {
          id: 'link',
          title: 'लिंक किसी फर्जी वेबसाइट पर ले जा सकता है',
          desc: 'लिंक .xyz जैसे अजीब शब्दों पर समाप्त होता है। यह आपकी गुप्त जानकारी चुराने के लिए बनाया गया है।',
        },
        {
          id: 'urgency',
          title: 'संदेश तुरंत फैसला लेने का दबाव बनाता है',
          desc: '"तुरंत" जैसे शब्द डर पैदा करते हैं ताकि आप बिना सोचे या किसी से पूछे सीधे क्लिक कर दें।',
        },
      ],
    },

    step3Practice: {
      title: 'इंटरैक्टिव अभ्यास सत्र',
      subtitle: 'एक दूसरा संदिग्ध संदेश आया है। सुरक्षित कदम उठाकर अभ्यास करें!',
      speech: 'अब आपकी बारी है! एक नया संदेश आया है जिसमें दावा है कि आपका बैंक खाता आज बंद हो जाएगा और ओटीपी मांगा गया है। फोन पर अभ्यास करें। लिंक पर कभी क्लिक न करें! इसके बजाय ब्लॉक या अनदेखा करने का सुरक्षित विकल्प चुनें।',
      instructorText: 'बैंक खाता बंद होने की धमकी देने वाला दूसरा मैसेज आया है! सिम्युलेटेड फोन पर सही कदम चुनकर अभ्यास करें।',
      taskPrompt: 'इस आपातकालीन बैंक संदेश के साथ आपको क्या करना चाहिए?',
      practiceSender: '+91 98765 43210',
      practiceSmsBody: 'आपका बैंक खाता आज ब्लॉक कर दिया जाएगा! तुरंत इस लिंक पर क्लिक करें और अपना ओटीपी (OTP) दर्ज करें:',
      practiceSmsLink: 'http://bank-kyc-verify-portal.in/login',
      unsafeAttemptWarning: '⚠️ असुरक्षित कदम! आपने लिंक पर टैप कर दिया। फर्जी लिंक पर क्लिक करने से आपके पासवर्ड चोरी हो सकते हैं या फोन में जासूसी ऐप डाउनलोड हो सकता है। अनजान लिंक कभी न छुएं। सुरक्षित कदम चुनें!',
      safeActionSuccess: '🎉 बहुत बढ़िया! आपने लिंक पर क्लिक किए बिना भेजने वाले को ब्लॉक और रिपोर्ट कर दिया। आपका बैंक खाता और व्यक्तिगत जानकारी पूरी तरह सुरक्षित है।',
      safeActionTip: 'याद रखें: असली बैंक कभी भी एसएमएस या फोन पर आपका गुप्त ओटीपी नहीं मांगते।',
      tapLinkActionLabel: 'लिंक पर टैप करें (परीक्षण)',
      blockActionLabel: 'ब्लॉक और रिपोर्ट करें (सुरक्षित)',
      ignoreActionLabel: 'अनदेखा व डिलीट करें (सुरक्षित)',
      tryAgainLabel: 'पुनः प्रयास करें',
    },

    step4Quiz: {
      title: 'सुरक्षा क्विज़ (5 सवाल)',
      subtitle: 'स्पैम एसएमएस की पहचान करने के लिए 5 आसान सवालों के जवाब दें',
      speech: 'शानदार! आइए अब 5 आसान सवालों की क्विज़ पूरी करें। आराम से सोचें और हर सवाल के लिए सबसे सुरक्षित विकल्प चुनें।',
      instructorText: 'स्पैम संदेशों से बचाव की समझ परखने के लिए 5 आसान सवालों के उत्तर दें।',
      quizCompletedTitle: 'बधाई हो! आपने पाठ पूरा कर लिया',
      quizCompletedDesc: 'अब आप संदिग्ध लिंक से बचना, फर्जी इनाम को ठुकराना, झूठी जल्दबाजी को पहचानना और अपना ओटीपी सुरक्षित रखना जानते हैं।',
      questions: [
        {
          id: 1,
          question: 'यदि किसी अज्ञात नंबर से आए एसएमएस में नीला वेब लिंक हो, तो क्या करना चाहिए?',
          options: [
            { id: 'a', text: 'देखने के लिए तुरंत लिंक पर क्लिक करें।', isCorrect: false },
            { id: 'b', text: 'लिंक पर क्लिक न करें। अनदेखा करें, डिलीट करें या ब्लॉक कर दें।', isCorrect: true },
            { id: 'c', text: 'अपने सभी दोस्तों को फॉरवर्ड कर दें।', isCorrect: false },
          ],
          explanation: 'संदिग्ध लिंक को कभी न छुएं। यह आपके फोन से गोपनीय पासवर्ड या पैसे चुरा सकता है।',
        },
        {
          id: 2,
          question: 'एसएमएस में लिखा है: "बधाई! आपने ₹1 करोड़ की लॉटरी जीती है!" क्या यह सच है?',
          options: [
            { id: 'a', text: 'हाँ, यह सरकार की तरफ से असली नकद पुरस्कार है।', isCorrect: false },
            { id: 'b', text: 'नहीं, यह धोखा है। अगर आपने लॉटरी नहीं ली, तो आप जीत नहीं सकते।', isCorrect: true },
            { id: 'c', text: 'मोबाइल कंपनी का इनाम है।', isCorrect: false },
          ],
          explanation: 'बिना आवेदन या टिकट के कोई इनाम नहीं मिलता। ऐसे सभी संदेश धोखेबाजों का जाल होते हैं।',
        },
        {
          id: 3,
          question: 'क्या कोई असली बैंक अधिकारी एसएमएस लिंक के जरिए आपका गुप्त ओटीपी (OTP) मांगता है?',
          options: [
            { id: 'a', text: 'हाँ, पहचान पक्की करने के लिए मांग सकते हैं।', isCorrect: false },
            { id: 'b', text: 'नहीं, कभी नहीं। ओटीपी हमेशा 100% गोपनीय होता है।', isCorrect: true },
            { id: 'c', text: 'केवल केवाईसी के समय।', isCorrect: false },
          ],
          explanation: 'ओटीपी केवल आपके लिए है। कोई भी असली बैंक कभी भी लिंक भेजकर आपका ओटीपी नहीं मांगता।',
        },
        {
          id: 4,
          question: 'धोखेबाज़ अक्सर यह क्यों कहते हैं कि "तुरंत करो वरना खाता आज ही बंद हो जाएगा"?',
          options: [
            { id: 'a', text: 'ताकि आप घबराकर बिना सोचे या किसी से पूछे तुरंत लिंक दबा दें।', isCorrect: true },
            { id: 'b', text: 'क्योंकि बैंक का समय खत्म होने वाला है।', isCorrect: false },
            { id: 'c', text: 'क्योंकि इंटरनेट धीमा है।', isCorrect: false },
          ],
          explanation: 'झूठी जल्दबाजी और डर दिखाना धोखेबाजों की चाल है ताकि आप सतर्क न हो सकें।',
        },
        {
          id: 5,
          question: 'अगर आपको शक हो कि बैंक का कोई जरूरी मैसेज सच हो सकता है, तो सबसे सुरक्षित तरीका क्या है?',
          options: [
            { id: 'a', text: 'एसएमएस में दिए गए लिंक पर तुरंत क्लिक करें।', isCorrect: false },
            { id: 'b', text: 'अपनी बैंक पासबुक में छपे नंबर पर कॉल करें या सीधे बैंक शाखा जाएं।', isCorrect: true },
            { id: 'c', text: 'एसएमएस में अपने एटीएम कार्ड का पिन भेजें।', isCorrect: false },
          ],
          explanation: 'हमेशा आधिकारिक माध्यम से ही पुष्टि करें: अपनी पासबुक, कार्ड के पीछे लिखा नंबर या सीधे बैंक शाखा।',
        },
      ],
      goldenRules: [
        {
          title: 'अनजान लिंक कभी न छुएं',
          desc: 'अज्ञात संदेशों में आए नीले लिंक पर कभी क्लिक न करें।',
        },
        {
          title: 'गुप्त ओटीपी किसी को न दें',
          desc: 'बैंक अधिकारी भी मांगे तो अपना ओटीपी कभी न बताएं।',
        },
        {
          title: 'पासबुक से पुष्टि करें',
          desc: 'बैंक संबंधी किसी भी सूचना की जांच अपनी बैंक पासबुक से करें।',
        },
        {
          title: 'ब्लॉक और रिपोर्ट करें',
          desc: 'संदिग्ध नंबर को फोन के 3 डॉट्स मेनू से ब्लॉक करें।',
        },
      ],
    },
  },
};

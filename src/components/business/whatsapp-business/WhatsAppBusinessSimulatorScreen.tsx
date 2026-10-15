import React, { useState, useEffect, useRef } from 'react';
import {
  Store,
  ShoppingBag,
  Plus,
  CheckCircle2,
  Phone,
  ArrowLeft,
  Search,
  MoreVertical,
  Share2,
  Sparkles,
  AlertCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  ChevronRight,
  ShieldCheck,
  Camera,
  MapPin,
  Clock,
  Info,
  ExternalLink,
  MessageSquare,
  Award,
  Play,
  HelpCircle,
  Layers,
  ArrowRight,
  Eye,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';
import {
  LanguageCode,
  SimulatorPart,
  BusinessProfileData,
  CatalogueProduct,
} from './types';
import {
  SAMPLE_PRODUCTS,
  SHOP_PRESETS,
  PART1_STEPS,
  PART2_STEPS,
} from './sampleData';
import { waVoice } from './voice';

export interface WhatsAppBusinessSimulatorProps {
  language?: LanguageCode;
  onBackToMainMenu?: () => void;
  onSwitchToMaps?: () => void;
  onSwitchToSpamCall?: () => void;
  onComplete?: () => void;
}

export const WhatsAppBusinessSimulatorScreen: React.FC<WhatsAppBusinessSimulatorProps> = ({
  language: initialLanguage = 'ta',
  onBackToMainMenu,
  onSwitchToMaps,
  onSwitchToSpamCall,
  onComplete,
}) => {
  // Navigation & Settings
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [currentPart, setCurrentPart] = useState<SimulatorPart>('PART1_ACCOUNT');
  const [part1StepIndex, setPart1StepIndex] = useState<number>(0);
  const [part2StepIndex, setPart2StepIndex] = useState<number>(0);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    if (initialLanguage) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  // Business Profile Setup Form State (Part 1)
  const [businessProfile, setBusinessProfile] = useState<BusinessProfileData>({
    shopName: 'Murugan Grocery & Maligai Store',
    category: 'Grocery Store',
    photoUrl: SHOP_PRESETS[0].photoUrl,
    description: SHOP_PRESETS[0].description,
    address: SHOP_PRESETS[0].address,
    phone: '+91 98401 23456',
    isVerified: true,
  });

  const [enteredPhone, setEnteredPhone] = useState<string>('9840123456');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [isInitializingProfile, setIsInitializingProfile] = useState<boolean>(false);

  // Catalogue Setup State (Part 2)
  const [catalogueList, setCatalogueList] = useState<CatalogueProduct[]>([SAMPLE_PRODUCTS[0]]);
  const [editingItem, setEditingItem] = useState<CatalogueProduct>({
    id: 'prod-item-new',
    name: SAMPLE_PRODUCTS[0].name,
    price: SAMPLE_PRODUCTS[0].price,
    description: SAMPLE_PRODUCTS[0].description,
    productCode: SAMPLE_PRODUCTS[0].productCode,
    imageUrl: SAMPLE_PRODUCTS[0].imageUrl,
    category: SAMPLE_PRODUCTS[0].category,
    inStock: true,
  });
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState<boolean>(false);
  const [customerPreviewOpen, setCustomerPreviewOpen] = useState<boolean>(false);
  const [showShareNotification, setShowShareNotification] = useState<boolean>(false);

  // Practice Sandbox State (Part 3)
  const [practiceStep, setPracticeStep] = useState<'PROFILE_BUILD' | 'PRODUCT_ADD' | 'EVALUATION'>('PROFILE_BUILD');
  const [practiceProfile, setPracticeProfile] = useState<BusinessProfileData>({
    shopName: '',
    category: 'Grocery Store',
    photoUrl: SHOP_PRESETS[0].photoUrl,
    description: '',
    address: '',
    phone: '+91 90000 12345',
  });
  const [practiceProduct, setPracticeProduct] = useState<{
    name: string;
    price: string;
    description: string;
    imageUrl: string;
  }>({
    name: '',
    price: '',
    description: '',
    imageUrl: SAMPLE_PRODUCTS[0].imageUrl,
  });
  const [practiceFeedback, setPracticeFeedback] = useState<{
    type: 'success' | 'error' | null;
    title: string;
    message: string;
  } | null>(null);

  // Sync voice speaking state
  useEffect(() => {
    const unsubscribe = waVoice.onSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsubscribe();
      waVoice.stop();
    };
  }, []);

  // Voice narration triggers on step or language change
  useEffect(() => {
    speakCurrentStep();
  }, [currentPart, part1StepIndex, part2StepIndex, language, practiceStep]);

  const speakCurrentStep = () => {
    if (isVoiceMuted) return;

    if (currentPart === 'PART1_ACCOUNT') {
      const step = PART1_STEPS[part1StepIndex];
      if (step) {
        waVoice.speak(step.voiceText[language], language);
      }
    } else if (currentPart === 'PART2_CATALOGUE') {
      const step = PART2_STEPS[part2StepIndex];
      if (step) {
        waVoice.speak(step.voiceText[language], language);
      }
    } else if (currentPart === 'PART3_PRACTICE') {
      if (practiceStep === 'PROFILE_BUILD') {
        const text =
          language === 'ta'
            ? 'பயிற்சி சோதனை: உங்கள் சொந்த கடையின் பெயரை எழுதி, வகையைத் தேர்ந்தெடுத்து அடுத்து செல்லுங்கள்.'
            : language === 'hi'
            ? 'अभ्यास गतिविधि: अपनी खुद की दुकान का नाम लिखें, श्रेणी चुनें और आगे बढ़ें।'
            : 'Practice Activity: Enter your own shop name, pick a category, and tap Next.';
        waVoice.speak(text, language);
      } else if (practiceStep === 'PRODUCT_ADD') {
        const text =
          language === 'ta'
            ? 'இப்போது உங்கள் பட்டியலில் சேர்க்க ஒரு பொருளின் பெயர், விலை மற்றும் விபரங்களை எழுதி சேமிக்கவும்.'
            : language === 'hi'
            ? 'अब कैटलॉग में जोड़ने के लिए सामान का नाम, कीमत और विवरण लिखकर सहेजें।'
            : 'Now enter a product name, price, and description, then tap Save to test your skill.';
        waVoice.speak(text, language);
      }
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isVoiceMuted;
    setIsVoiceMuted(nextMute);
    waVoice.setMuted(nextMute);
    if (!nextMute) {
      speakCurrentStep();
    }
  };

  const handleReplayVoice = () => {
    waVoice.playChime('ding');
    speakCurrentStep();
  };

  // Helper for UI text in 3 languages
  const t = (enText: string, taText: string, hiText: string) => {
    if (language === 'ta') return taText;
    if (language === 'hi') return hiText;
    return enText;
  };

  // Switch between parts
  const handleSelectPart = (part: SimulatorPart) => {
    waVoice.playChime('tap');
    setCurrentPart(part);
    if (part === 'PART1_ACCOUNT') setPart1StepIndex(0);
    if (part === 'PART2_CATALOGUE') setPart2StepIndex(0);
    if (part === 'PART3_PRACTICE') {
      setPracticeStep('PROFILE_BUILD');
      setPracticeFeedback(null);
    }
  };

  // Auto-fill OTP in Part 1 Step 4
  const handleAutoFillOtp = () => {
    waVoice.playChime('success');
    setOtpDigits(['4', '8', '2', '1', '9', '6']);
    setIsOtpVerified(true);
    setTimeout(() => {
      setPart1StepIndex(4); // Move to profile setup
    }, 1200);
  };

  // Finish Profile Creation
  const handleCompleteProfileCreation = () => {
    waVoice.playChime('tap');
    setIsInitializingProfile(true);
    setTimeout(() => {
      setIsInitializingProfile(false);
      setPart1StepIndex(5); // Show completed profile
      waVoice.playChime('success');
    }, 1500);
  };

  // Save product in Part 2 Step 4
  const handleSaveProduct = () => {
    waVoice.playChime('success');
    const existing = catalogueList.find((p) => p.name === editingItem.name);
    if (!existing) {
      setCatalogueList((prev) => [editingItem, ...prev]);
    }
    setPart2StepIndex(4); // Step 5: Product saved
  };

  // Add more sample products in Part 2 Step 5
  const handleAddMoreSampleProducts = () => {
    waVoice.playChime('success');
    // Load all 5 sample products into catalogue
    setCatalogueList(SAMPLE_PRODUCTS);
    setPart2StepIndex(5); // Step 6: Finished catalogue showcase
  };

  // Practice Activity Validations
  const handlePracticeProfileSubmit = () => {
    if (!practiceProfile.shopName.trim() || practiceProfile.shopName.trim().length < 2) {
      waVoice.playChime('alert');
      setPracticeFeedback({
        type: 'error',
        title: t('Shop Name Required', 'கடை பெயர் தேவை', 'दुकान का नाम आवश्यक है'),
        message: t(
          'Please type a shop name (at least 2 letters) before continuing.',
          'தொடர்வதற்கு முன் உங்கள் கடையின் பெயரை குறைந்தபட்சம் 2 எழுத்துக்களில் உள்ளிடவும்.',
          'आगे बढ़ने से पहले कृपया कम से कम 2 अक्षरों में दुकान का नाम दर्ज करें।'
        ),
      });
      return;
    }

    waVoice.playChime('success');
    setPracticeFeedback(null);
    setPracticeStep('PRODUCT_ADD');
  };

  const handlePracticeProductSubmit = () => {
    if (!practiceProduct.name.trim()) {
      waVoice.playChime('alert');
      setPracticeFeedback({
        type: 'error',
        title: t('Product Name Missing', 'பொருளின் பெயர் இல்லை', 'सामान का नाम गायब है'),
        message: t(
          'Please enter what item you are selling (e.g., Rice, Saree, Chips).',
          'தயவுசெய்து நீங்கள் விற்கும் பொருளின் பெயரை உள்ளிடவும் (எ.கா: அரிசி, புடவை).',
          'कृपया लिखें कि आप कौन सा सामान बेच रहे हैं (जैसे: चावल, साड़ी, चिप्स)।'
        ),
      });
      return;
    }

    const priceNum = parseFloat(practiceProduct.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      waVoice.playChime('alert');
      setPracticeFeedback({
        type: 'error',
        title: t('Enter Valid Price', 'சரியான விலையை உள்ளிடவும்', 'सही कीमत डालें'),
        message: t(
          'Please enter a valid price in rupees (e.g., ₹150).',
          'தயவுசெய்து ரூபாயில் சரியான விலையை குறிப்பிடவும் (எ.கா: ₹150).',
          'कृपया रुपये में वैध कीमत लिखें (जैसे: ₹150)।'
        ),
      });
      return;
    }

    waVoice.playChime('success');
    setPracticeStep('EVALUATION');
    onComplete?.();
  };

  // Reset current step / try again
  const handleTryAgain = () => {
    waVoice.playChime('tap');
    if (currentPart === 'PART1_ACCOUNT') {
      if (part1StepIndex === 3) {
        setOtpDigits(['', '', '', '', '', '']);
        setIsOtpVerified(false);
      } else if (part1StepIndex === 4) {
        setBusinessProfile({
          ...businessProfile,
          shopName: '',
          description: '',
        });
      }
    } else if (currentPart === 'PART2_CATALOGUE') {
      if (part2StepIndex === 3) {
        setEditingItem({
          ...SAMPLE_PRODUCTS[0],
          name: '',
          price: 0,
        });
      }
    } else if (currentPart === 'PART3_PRACTICE') {
      setPracticeStep('PROFILE_BUILD');
      setPracticeProfile({
        shopName: '',
        category: 'Grocery Store',
        photoUrl: SHOP_PRESETS[0].photoUrl,
        description: '',
        address: '',
        phone: '+91 90000 12345',
      });
      setPracticeProduct({
        name: '',
        price: '',
        description: '',
        imageUrl: SAMPLE_PRODUCTS[0].imageUrl,
      });
      setPracticeFeedback(null);
    }
  };

  // Current active step instruction object
  const currentInstruction =
    currentPart === 'PART1_ACCOUNT'
      ? PART1_STEPS[part1StepIndex]
      : currentPart === 'PART2_CATALOGUE'
      ? PART2_STEPS[part2StepIndex]
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-3 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          {onBackToMainMenu && (
            <button
              data-demo-id="wa-business-back-btn"
              onClick={() => {
                waVoice.stop();
                onBackToMainMenu();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-black shadow-md border border-teal-500 cursor-pointer transition min-h-[44px] active:scale-95"
              title="Return to Business Path"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>{t('← Back to Path', '← பாதைக்கு திரும்பு', '← पाथ पर वापस')}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-500/20">
              <span className="font-extrabold tracking-tight">B</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>WhatsApp Business Training</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Interactive
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                {t(
                  'Account Setup & Product Catalogue Simulator',
                  'கணக்கு தொடங்குதல் & பொருட்கள் பட்டியல் மாதிரி பயிற்சி',
                  'खाता निर्माण और उत्पाद कैटलॉग सिम्युलेटर'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right side controls: Language switcher & Audio buttons */}
        <div className="flex items-center gap-2">
          {/* Quick other simulators dropdown/switcher */}
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-400 mr-2 border-r border-slate-800 pr-3">
            {onSwitchToMaps && (
              <button
                onClick={onSwitchToMaps}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                🗺️ Maps
              </button>
            )}
            {onSwitchToSpamCall && (
              <button
                onClick={onSwitchToSpamCall}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                🛡️ Scam Call
              </button>
            )}
          </div>

          {/* Voice Narration Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              isVoiceMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
            title={isVoiceMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            <span className="hidden sm:inline">{isVoiceMuted ? 'Muted' : 'Voice On'}</span>
          </button>

          {/* Language Toggle: EN / தமிழ் / हिंदी */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            {(['ta', 'hi', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  language === lang
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'ta' ? 'தமிழ்' : lang === 'hi' ? 'हिंदी' : 'English'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Part Navigation Tabs & Progress Ribbon */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5">
          <button
            onClick={() => handleSelectPart('PART1_ACCOUNT')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              currentPart === 'PART1_ACCOUNT'
                ? 'bg-[#128C7E] text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{t('Part 1: Create Account', 'பகுதி 1: கணக்கு தொடங்குதல்', 'भाग 1: खाता बनाएं')}</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full">
              {part1StepIndex + 1}/6
            </span>
          </button>

          <button
            onClick={() => handleSelectPart('PART2_CATALOGUE')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              currentPart === 'PART2_CATALOGUE'
                ? 'bg-[#128C7E] text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('Part 2: Add Catalogue', 'பகுதி 2: பொருட்கள் பட்டியல்', 'भाग 2: कैटलॉग जोड़ें')}</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full">
              {part2StepIndex + 1}/6
            </span>
          </button>

          <button
            onClick={() => handleSelectPart('PART3_PRACTICE')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              currentPart === 'PART3_PRACTICE'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('Part 3: Practice Sandbox', 'பகுதி 3: பயிற்சி சோதனை', 'भाग 3: अभ्यास गतिविधि')}</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full">DIY</span>
          </button>
        </div>

        {/* Replay speech button */}
        <button
          onClick={handleReplayVoice}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
          title="Replay Voice Audio"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('Replay Voice', 'குரலை மீண்டும் கேள்', 'आवाज़ दोबारा सुनें')}</span>
        </button>
      </div>

      {/* Main Guided Simulation Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-2 sm:p-4 gap-4 max-w-6xl mx-auto w-full">
        {/* Left Column: AI Mentor Voice, Subtitles, Instructions & Shopkeeper Tips */}
        <div className="w-full lg:w-96 flex flex-col gap-3 order-2 lg:order-1">
          {/* AI Mentor Card (Selvi) */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

            <div className="flex items-center gap-3 mb-2.5">
              <div className="relative">
                <img
                  src="/selvi_avatar.jpg"
                  alt="Mentor Selvi"
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                  onError={(e) => {
                    // Fallback to avatar_mentor
                    (e.target as HTMLImageElement).src = '/avatar_mentor.png';
                  }}
                />
                {isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 items-center justify-center">
                      <Volume2 className="w-2.5 h-2.5 text-white" />
                    </span>
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-sm">
                    {t('AI Mentor Selvi', 'ஆசிரியை செல்வி', 'मार्गदर्शक सेलवी')}
                  </h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-md font-semibold">
                    {t('Shop Guide', 'வழிகாட்டி', 'दुकान गाइड')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {t(
                    'Simple step-by-step digital shopkeeper training',
                    'வியாபாரிகளுக்கான எளிமையான டிஜிட்டல் பயிற்சி',
                    'व्यापारियों के लिए आसान डिजिटल प्रशिक्षण'
                  )}
                </p>
              </div>
            </div>

            {/* Large Multilingual Subtitle Display */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 mb-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400 mb-1">
                <span>{t('VOICE GUIDANCE & SUBTITLE', 'குரல் வழிகாட்டுதல் & வாசகம்', 'आवाज़ और उपशीर्षक')}</span>
                {isSpeaking && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 animate-pulse">
                    <span>●</span> {t('Speaking...', 'பேசுகிறது...', 'बोल रहा है...')}
                  </span>
                )}
              </div>
              <p className="text-white text-sm sm:text-base font-medium leading-snug">
                {currentPart === 'PART1_ACCOUNT' && PART1_STEPS[part1StepIndex]?.subtitles[language]}
                {currentPart === 'PART2_CATALOGUE' && PART2_STEPS[part2StepIndex]?.subtitles[language]}
                {currentPart === 'PART3_PRACTICE' &&
                  (practiceStep === 'PROFILE_BUILD'
                    ? t(
                        'Practice: Type your shop name and pick a category. Tap Next to verify.',
                        'பயிற்சி: உங்கள் கடையின் பெயரை எழுதி வகையைத் தேர்ந்தெடுக்கவும். பின்னர் அடுத்து தொடவும்.',
                        'अभ्यास: अपनी दुकान का नाम लिखें और श्रेणी चुनें। फिर Next दबाएं।'
                      )
                    : practiceStep === 'PRODUCT_ADD'
                    ? t(
                        'Practice: Enter a product name, price in rupees (₹), photo, and description. Tap Save.',
                        'பயிற்சி: பொருளின் பெயர், ரூபாய் விலை (₹), புகைப்படம் மற்றும் விபரம் உள்ளிட்டு சேமிக்கவும்.',
                        'अभ्यास: सामान का नाम, रुपये में कीमत (₹), फोटो और विवरण डालकर Save दबाएं।'
                      )
                    : t(
                        'Evaluation: Review your created shop profile and catalogue item!',
                        'மதிப்பீடு: உங்கள் கடை சுயவிவரம் மற்றும் பொருளின் பட்டியலை பாருங்கள்!',
                        'मूल्यांकन: अपनी बनाई गई दुकान और कैटलॉग देखें!'
                      ))}
              </p>
            </div>

            {/* Pro Tip Box for Digital Literacy */}
            {currentInstruction?.tip && (
              <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-xs text-amber-200">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">
                    {t('Shopkeeper Tip: ', 'முக்கிய குறிப்பு: ', 'दुकानदार सलाह: ')}
                  </span>
                  <span>{currentInstruction.tip[language]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Step Roadmap List */}
          <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800 text-xs hidden sm:block">
            <h4 className="font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span>{t('Step Progress', 'பயிற்சி நிலைகள்', 'कदम प्रगति')}</span>
              <span className="text-emerald-400 font-semibold">
                {currentPart === 'PART1_ACCOUNT'
                  ? `${part1StepIndex + 1} / 6`
                  : currentPart === 'PART2_CATALOGUE'
                  ? `${part2StepIndex + 1} / 6`
                  : 'DIY Test'}
              </span>
            </h4>

            {currentPart === 'PART1_ACCOUNT' && (
              <div className="space-y-1">
                {PART1_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      waVoice.playChime('tap');
                      setPart1StepIndex(idx);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition cursor-pointer ${
                      part1StepIndex === idx
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : idx < part1StepIndex
                        ? 'text-slate-400 hover:bg-slate-800 line-through'
                        : 'text-slate-500 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="truncate">{step.title[language]}</span>
                    {idx < part1StepIndex ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] text-slate-500 shrink-0">{idx + 1}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {currentPart === 'PART2_CATALOGUE' && (
              <div className="space-y-1">
                {PART2_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      waVoice.playChime('tap');
                      setPart2StepIndex(idx);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition cursor-pointer ${
                      part2StepIndex === idx
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : idx < part2StepIndex
                        ? 'text-slate-400 hover:bg-slate-800 line-through'
                        : 'text-slate-500 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="truncate">{step.title[language]}</span>
                    {idx < part2StepIndex ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] text-slate-500 shrink-0">{idx + 1}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {currentPart === 'PART3_PRACTICE' && (
              <div className="space-y-2 p-1">
                <div
                  className={`p-2 rounded-lg border ${
                    practiceStep === 'PROFILE_BUILD'
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400'
                  }`}
                >
                  <p className="font-bold text-xs">1. {t('Build Store Profile', 'கடை விவரம் அமைத்தல்', 'दुकान प्रोफाइल बनाएं')}</p>
                </div>
                <div
                  className={`p-2 rounded-lg border ${
                    practiceStep === 'PRODUCT_ADD'
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400'
                  }`}
                >
                  <p className="font-bold text-xs">2. {t('Add Item with Photo & Price', 'புகைப்படம் & விலையுடன் பொருள் சேர்த்தல்', 'फोटो और कीमत के साथ सामान जोड़ें')}</p>
                </div>
                <div
                  className={`p-2 rounded-lg border ${
                    practiceStep === 'EVALUATION'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400'
                  }`}
                >
                  <p className="font-bold text-xs">3. {t('Score & Certification', 'மதிப்பெண் & சான்றிதழ்', 'अंक और प्रमाण पत्र')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Controller Step Buttons: Back, Try Again, Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                waVoice.playChime('tap');
                if (currentPart === 'PART1_ACCOUNT' && part1StepIndex > 0) {
                  setPart1StepIndex(part1StepIndex - 1);
                } else if (currentPart === 'PART2_CATALOGUE' && part2StepIndex > 0) {
                  setPart2StepIndex(part2StepIndex - 1);
                } else if (currentPart === 'PART3_PRACTICE') {
                  if (practiceStep === 'PRODUCT_ADD') setPracticeStep('PROFILE_BUILD');
                  if (practiceStep === 'EVALUATION') setPracticeStep('PRODUCT_ADD');
                }
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('Back', 'பின்செல்', 'पीछे')}</span>
            </button>

            <button
              onClick={handleTryAgain}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              title="Reset current step"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('Try Again', 'மீண்டும் செய்', 'दोबारा')}</span>
            </button>

            <button
              onClick={() => {
                waVoice.playChime('tap');
                if (currentPart === 'PART1_ACCOUNT') {
                  if (part1StepIndex < 5) setPart1StepIndex(part1StepIndex + 1);
                  else handleSelectPart('PART2_CATALOGUE');
                } else if (currentPart === 'PART2_CATALOGUE') {
                  if (part2StepIndex < 5) setPart2StepIndex(part2StepIndex + 1);
                  else handleSelectPart('PART3_PRACTICE');
                } else if (currentPart === 'PART3_PRACTICE') {
                  if (practiceStep === 'PROFILE_BUILD') handlePracticeProfileSubmit();
                  else if (practiceStep === 'PRODUCT_ADD') handlePracticeProductSubmit();
                }
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-700/30 cursor-pointer"
            >
              <span>{t('Next Step', 'அடுத்த படி', 'आगे बढ़ें')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Column: Realistic Smartphone Mockup */}
        <div className="w-full max-w-[390px] h-[720px] max-h-[85vh] bg-black rounded-[42px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col relative select-none order-1 lg:order-2">
          {/* Phone Shell Top Speaker & Punch Hole */}
          <div className="w-full flex items-center justify-between px-6 py-1 shrink-0 z-30">
            <span className="text-[11px] font-semibold text-slate-300">10:30</span>
            <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700" />
            <div className="flex items-center gap-1 text-[10px] text-slate-300">
              <span>4G</span>
              <div className="w-4 h-2 border border-slate-400 rounded-xs relative">
                <div className="h-full bg-emerald-400 w-3/4 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Smartphone Screen Viewport */}
          <div className="flex-1 bg-slate-100 rounded-[32px] overflow-hidden flex flex-col relative shadow-inner text-slate-900">
            {/* ----------------- PART 1: ACCOUNT SETUP SCREENS ----------------- */}
            {currentPart === 'PART1_ACCOUNT' && (
              <>
                {/* Step 1.1: Phone Home Screen */}
                {part1StepIndex === 0 && (
                  <div className="flex-1 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 p-4 flex flex-col justify-between text-white relative">
                    {/* Widget Clock & Date */}
                    <div className="pt-8 text-center">
                      <div className="text-4xl font-light tracking-tight">10:30</div>
                      <div className="text-xs text-slate-300 mt-1">Wednesday, October 14</div>
                    </div>

                    {/* Google Search Pill Mock */}
                    <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 flex items-center justify-between text-xs text-slate-300 mx-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400">G</span>
                        <span>{t('Search apps & web', 'செயலிகளைத் தேடவும்', 'ऐप्स खोजें')}</span>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    {/* App Grid on Smartphone Home Screen */}
                    <div className="grid grid-cols-4 gap-4 pb-6 px-1">
                      {/* App 1: Phone */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-13 h-13 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md">
                          <Phone className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] text-slate-300">{t('Phone', 'போன்', 'फोन')}</span>
                      </div>

                      {/* App 2: Standard SMS Messages */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-13 h-13 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] text-slate-300">{t('Messages', 'செய்திகள்', 'मैसेज')}</span>
                      </div>

                      {/* App 3: Camera */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-13 h-13 rounded-2xl bg-slate-700 text-white flex items-center justify-center shadow-md">
                          <Camera className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] text-slate-300">{t('Camera', 'கேமரா', 'कैमरा')}</span>
                      </div>

                      {/* App 4: TARGET -> WhatsApp Business Icon */}
                      <div className="flex flex-col items-center gap-1 relative">
                        {/* Pulsing Target Ring & Pointer */}
                        <div className="absolute -top-10 flex flex-col items-center animate-bounce z-20 pointer-events-none">
                          <span className="bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                            👉 {t('TAP HERE', 'இங்கே தொடவும்', 'यहाँ छुएं')}
                          </span>
                          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-emerald-500" />
                        </div>

                        <button
                          id="app-icon-wabusiness"
                          onClick={() => {
                            waVoice.playChime('success');
                            setPart1StepIndex(1);
                          }}
                          className="w-13 h-13 rounded-2xl bg-[#25D366] text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-emerald-500/40 relative cursor-pointer ring-4 ring-emerald-400/80 animate-pulse hover:scale-105 transition"
                        >
                          <span>B</span>
                          <span className="absolute -bottom-1 -right-1 bg-emerald-950 text-[9px] px-1 rounded-sm border border-emerald-400 font-bold">
                            WA
                          </span>
                        </button>
                        <span className="text-[11px] font-bold text-emerald-300">WA Business</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1.2: WhatsApp Business Welcome & Language Screen */}
                {part1StepIndex === 1 && (
                  <div className="flex-1 bg-white p-5 flex flex-col justify-between items-center text-center">
                    <div className="w-full flex justify-end">
                      <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                        <span>🌐</span>
                        <span>{language === 'ta' ? 'தமிழ்' : language === 'hi' ? 'हिंदी' : 'English'}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                        <span className="text-4xl font-black">B</span>
                      </div>

                      <h2 className="text-xl font-bold text-slate-800">
                        {t('Welcome to WhatsApp Business', 'வாட்ஸ்அப் பிசினஸுக்கு நல்வரவு', 'व्हाट्सएप बिजनेस में स्वागत है')}
                      </h2>

                      <p className="text-xs text-slate-500 mt-2 px-2 leading-relaxed">
                        {t(
                          'A simple, secure, and reliable way for small businesses to connect with customers everywhere.',
                          'வியாபாரிகள் வாடிக்கையாளர்களோடு எளிதாகவும் பாதுகாப்பாகவும் தொடர்பு கொள்ளும் சிறந்த செயலி.',
                          'छोटे व्यवसायों के लिए ग्राहकों से जुड़ने का एक सरल, सुरक्षित और भरोसेमंद तरीका।'
                        )}
                      </p>

                      {/* Language Choice Selector */}
                      <div className="mt-5 w-full bg-slate-50 border border-slate-200 rounded-xl p-2">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                          {t('Select App Language', 'செயலி மொழியைத் தேர்ந்தெடுக்கவும்', 'ऐप की भाषा चुनें')}
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(['ta', 'hi', 'en'] as const).map((l) => (
                            <button
                              key={l}
                              onClick={() => {
                                setLanguage(l);
                                waVoice.playChime('tap');
                              }}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                                language === l
                                  ? 'bg-[#128C7E] text-white shadow-sm'
                                  : 'bg-white text-slate-700 border border-slate-200'
                              }`}
                            >
                              {l === 'ta' ? 'தமிழ்' : l === 'hi' ? 'हिंदी' : 'English'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <p className="text-[10px] text-slate-400 mb-3 px-4">
                        {t(
                          'Read our Privacy Policy. Tap Agree and continue to accept the Terms of Service.',
                          'எங்கள் தனியுரிமைக் கொள்கையை வாசியுங்கள். விதிமுறைகளை ஏற்க "சம்மதித்து தொடர்க" தொடவும்.',
                          'हमारी प्राइवेसी पॉलिसी पढ़ें। शर्तों को स्वीकार करने के लिए "स्वीकार करें" दबाएं।'
                        )}
                      </p>

                      <button
                        id="btn-agree-continue"
                        onClick={() => {
                          waVoice.playChime('success');
                          setPart1StepIndex(2);
                        }}
                        className="w-full py-3 rounded-full bg-[#25D366] hover:bg-emerald-600 text-white font-extrabold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2 ring-4 ring-emerald-300/40 animate-pulse"
                      >
                        <span>{t('AGREE AND CONTINUE', 'சம்மதித்து தொடர்க', 'स्वीकार करें और जारी रखें')}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 1.3: Enter Business Phone Number */}
                {part1StepIndex === 2 && (
                  <div className="flex-1 bg-white p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-center mb-6">
                        <h2 className="text-base font-bold text-slate-800">
                          {t('Enter your business phone number', 'கடை மொபைல் எண்ணை உள்ளிடவும்', 'दुकान का फोन नंबर डालें')}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          {t(
                            'WhatsApp will need to verify your phone number via SMS.',
                            'வாட்ஸ்அப் உங்கள் எண்ணை சரிபார்க்க ஒரு எஸ்எம்எஸ் அனுப்பும்.',
                            'व्हाट्सएप एसएमएस भेजकर आपके नंबर को सत्यापित करेगा।'
                          )}
                        </p>
                      </div>

                      {/* Country code & phone input */}
                      <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 mb-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2 text-xs font-semibold text-slate-700">
                          <span>India (இந்தியா / भारत)</span>
                          <span className="text-slate-400">▼</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-700 bg-slate-200 px-2 py-1 rounded-md">
                            +91
                          </span>
                          <input
                            type="tel"
                            value={enteredPhone}
                            onChange={(e) => setEnteredPhone(e.target.value)}
                            className="flex-1 bg-transparent border-b-2 border-emerald-500 py-1 text-base font-bold tracking-wider text-slate-800 focus:outline-none"
                            placeholder="98401 23456"
                          />
                        </div>
                      </div>

                      {/* Quick Auto-fill button for simulation */}
                      <button
                        onClick={() => {
                          waVoice.playChime('tap');
                          setEnteredPhone('9840123456');
                        }}
                        className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('Auto-fill Fictional Shop SIM (+91 98401 23456)', 'மாதிரி கடை எண்ணை நிரப்புக (+91 98401 23456)', 'डेमो नंबर भरें (+91 98401 23456)')}</span>
                      </button>
                    </div>

                    <div>
                      <p className="text-[11px] text-slate-400 text-center mb-3">
                        {t('Carrier SMS charges may apply in real setup.', 'உண்மையான அமைப்பில் எஸ்எம்எஸ் கட்டணம் பொருந்தலாம்.', 'वास्तविक उपयोग में एसएमएस शुल्क लग सकता है।')}
                      </p>

                      <button
                        id="btn-submit-phone"
                        onClick={() => {
                          waVoice.playChime('success');
                          setPart1StepIndex(3);
                        }}
                        className="w-full py-3 rounded-full bg-[#128C7E] hover:bg-teal-700 text-white font-extrabold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2 ring-4 ring-emerald-300/40"
                      >
                        <span>{t('NEXT', 'அடுத்து', 'आगे बढ़ें')}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 1.4: Simulated OTP Verification */}
                {part1StepIndex === 3 && (
                  <div className="flex-1 bg-white p-4 flex flex-col justify-between relative overflow-hidden">
                    {/* Simulated incoming SMS banner sliding from top */}
                    <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-pulse">
                      <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center text-white shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>SMS from <b>VK-WABUSINESS</b></span>
                          <span>Now</span>
                        </div>
                        <p className="text-xs font-bold text-amber-300">
                          &lt;#&gt; 482-196 is your WhatsApp Business code.
                        </p>
                      </div>
                    </div>

                    <div className="text-center my-auto">
                      <h2 className="text-base font-bold text-slate-800">
                        {t('Verifying +91 98401 23456', '+91 98401 23456 எண்ணை சரிபார்க்கிறது', '+91 98401 23456 का सत्यापन')}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 mb-4">
                        {t(
                          'Waiting to automatically detect SMS sent to your phone.',
                          'உங்கள் போனுக்கு அனுப்பப்பட்ட எஸ்எம்எஸ்-ஐ தானாகக் கண்டறிய காத்திருக்கிறது.',
                          'आपके फोन पर भेजे गए एसएमएस को स्वतः पहचानने की प्रतीक्षा कर रहे हैं।'
                        )}
                      </p>

                      {/* 6 Digit OTP input boxes */}
                      <div className="flex justify-center gap-2 mb-4">
                        {otpDigits.map((digit, idx) => (
                          <div
                            key={idx}
                            className={`w-9 h-11 rounded-lg border-2 flex items-center justify-center font-bold text-lg ${
                              digit
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                                : 'border-slate-300 bg-white text-slate-400'
                            }`}
                          >
                            {digit || '•'}
                          </div>
                        ))}
                      </div>

                      {/* Prominent Auto-fill OTP CTA button */}
                      <button
                        id="btn-autofill-otp"
                        onClick={handleAutoFillOtp}
                        className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 transition cursor-pointer ring-4 ring-emerald-300/50"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-200" />
                        <span>{t('Auto-fill Simulated Code (482-196)', 'மாதிரி குறியீட்டை நிரப்புக (482-196)', 'डेमो कोड भरें (482-196)')}</span>
                      </button>

                      {isOtpVerified && (
                        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{t('Verification Successful!', 'சரிபார்ப்பு முடிந்தது!', 'सत्यापन सफल रहा!')}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-2 text-center text-xs text-slate-400">
                      <span>{t('Didn\'t receive code? Resend SMS in 30s', 'குறியீடு வரவில்லையா? 30 விநாடிகளில் மீண்டும் அனுப்பு', 'कोड नहीं मिला? 30 सेकंड में दोबारा भेजें')}</span>
                    </div>
                  </div>
                )}

                {/* Step 1.5: Fill Business Profile Details */}
                {part1StepIndex === 4 && (
                  <div className="flex-1 bg-white p-4 flex flex-col justify-between overflow-y-auto">
                    {isInitializingProfile ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                        <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <h3 className="text-base font-bold text-slate-800">
                          {t('Initializing your profile...', 'சுயவிவரம் கட்டமைக்கப்படுகிறது...', 'प्रोफाइल तैयार की जा रही है...')}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {t('Setting up business tools & shop details', 'வணிக கருவிகள் தயாராகின்றன', 'बिजनेस टूल्स तैयार हो रहे हैं')}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div className="text-center mb-4">
                            <h2 className="text-base font-bold text-slate-800">
                              {t('Create your Business Profile', 'உங்கள் கடை சுயவிவரத்தை உருவாக்கவும்', 'दुकान की प्रोफाइल बनाएं')}
                            </h2>
                            <p className="text-[11px] text-slate-500">
                              {t(
                                'Customers will see this info when they chat with you.',
                                'வாடிக்கையாளர்கள் உங்களுடன் உரையாடும் போது இந்த விபரங்களை காண்பார்கள்.',
                                'ग्राहक आपसे बात करते समय यह जानकारी देखेंगे।'
                              )}
                            </p>
                          </div>

                          {/* Profile Picture & Preset picker */}
                          <div className="flex flex-col items-center mb-3">
                            <div className="relative mb-2">
                              <img
                                src={businessProfile.photoUrl}
                                alt="Shop Profile"
                                className="w-18 h-18 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                              />
                              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white">
                                <Camera className="w-3.5 h-3.5" />
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500 mb-1">
                              {t('Choose shop preset photo:', 'மாதிரி புகைப்படத்தை தேர்வு செய்:', 'दुकान का फोटो चुनें:')}
                            </span>
                            <div className="flex gap-1.5">
                              {SHOP_PRESETS.map((preset, pIdx) => (
                                <button
                                  key={preset.id}
                                  onClick={() => {
                                    waVoice.playChime('tap');
                                    setBusinessProfile({
                                      ...businessProfile,
                                      shopName: preset.name,
                                      category: preset.category,
                                      description: preset.description,
                                      address: preset.address,
                                      photoUrl: preset.photoUrl,
                                    });
                                  }}
                                  className={`px-2 py-0.5 text-[10px] rounded-md font-semibold border transition cursor-pointer ${
                                    businessProfile.shopName === preset.name
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'bg-slate-100 text-slate-700 border-slate-300'
                                  }`}
                                >
                                  {pIdx === 0 ? '🥬 Grocery' : pIdx === 1 ? '👗 Clothes' : '🍬 Sweets'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Form Fields: Business Name */}
                          <div className="space-y-2.5 text-xs text-left">
                            <div>
                              <label className="font-bold text-slate-700 block mb-0.5">
                                {t('Shop / Business Name *', 'கடை / வணிக பெயர் *', 'दुकान का नाम *')}
                              </label>
                              <input
                                type="text"
                                value={businessProfile.shopName}
                                onChange={(e) =>
                                  setBusinessProfile({ ...businessProfile, shopName: e.target.value })
                                }
                                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                                placeholder="e.g. Murugan Maligai Store"
                              />
                            </div>

                            {/* Category Dropdown */}
                            <div>
                              <label className="font-bold text-slate-700 block mb-0.5">
                                {t('Business Category *', 'வணிக வகை *', 'व्यापार श्रेणी *')}
                              </label>
                              <select
                                value={businessProfile.category}
                                onChange={(e) =>
                                  setBusinessProfile({ ...businessProfile, category: e.target.value })
                                }
                                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-600 bg-white"
                              >
                                <option value="Grocery Store">Grocery Store (மளிகை கடை / किराना)</option>
                                <option value="Apparel & Clothing">Apparel & Clothing (துணிக்கடை / कपड़े)</option>
                                <option value="Food & Beverage">Food & Beverage (உணவு & தின்பண்டம் / मिठाई)</option>
                                <option value="Handmade & Crafts">Arts & Crafts (கைவினைப் பொருட்கள் / हस्तशिल्प)</option>
                                <option value="Restaurant">Restaurant (உணவகம் / ढाबा)</option>
                                <option value="Other">Other Business (மற்றவை / अन्य)</option>
                              </select>
                            </div>

                            {/* Address field (optional) */}
                            <div>
                              <label className="font-bold text-slate-700 block mb-0.5">
                                {t('Shop Address', 'கடை முகவரி', 'दुकान का पता')}
                              </label>
                              <input
                                type="text"
                                value={businessProfile.address}
                                onChange={(e) =>
                                  setBusinessProfile({ ...businessProfile, address: e.target.value })
                                }
                                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 text-[11px] focus:outline-none focus:border-emerald-600"
                                placeholder="Street, Market, City"
                              />
                            </div>

                            {/* Description field */}
                            <div>
                              <label className="font-bold text-slate-700 block mb-0.5">
                                {t('Description', 'கடை விபரம்', 'दुकान का विवरण')}
                              </label>
                              <textarea
                                rows={2}
                                value={businessProfile.description}
                                onChange={(e) =>
                                  setBusinessProfile({ ...businessProfile, description: e.target.value })
                                }
                                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 text-[11px] focus:outline-none focus:border-emerald-600 resize-none"
                                placeholder="Tell customers what you sell and delivery options"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-3">
                          <button
                            id="btn-save-profile"
                            onClick={handleCompleteProfileCreation}
                            className="w-full py-2.5 rounded-full bg-[#128C7E] hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 ring-4 ring-emerald-300/40"
                          >
                            <span>{t('SAVE & INITIALIZE PROFILE', 'சேமித்து சுயவிவரத்தை துவக்கு', 'प्रोफाइल सहेजें')}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 1.6: Completed Business Profile Card */}
                {part1StepIndex === 5 && (
                  <div className="flex-1 bg-slate-50 p-4 flex flex-col justify-between overflow-y-auto">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                        <span className="font-bold text-xs text-slate-700">
                          {t('Business Profile Ready', 'வணிக சுயவிவரம் தயார்', 'व्यापार प्रोफाइल तैयार')}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{t('Verified Business', 'சரிபார்க்கப்பட்டது', 'वेरिफाइड बिजनेस')}</span>
                        </span>
                      </div>

                      {/* Official WhatsApp Business Card */}
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-center">
                        <img
                          src={businessProfile.photoUrl}
                          alt="Shop Profile"
                          className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-emerald-500 shadow-md mb-2"
                        />
                        <div className="flex items-center justify-center gap-1">
                          <h3 className="font-extrabold text-slate-800 text-sm">
                            {businessProfile.shopName}
                          </h3>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        </div>
                        <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-1">
                          {businessProfile.category}
                        </span>

                        <p className="text-xs text-slate-600 mt-2.5 px-2 italic">
                          "{businessProfile.description}"
                        </p>

                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-left text-xs text-slate-600">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="text-[11px]">{businessProfile.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-[11px] font-semibold">{businessProfile.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="text-[11px] text-emerald-700 font-medium">
                              Open now (8:00 AM - 9:30 PM)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        id="btn-go-catalogue"
                        onClick={() => handleSelectPart('PART2_CATALOGUE')}
                        className="w-full py-3 rounded-full bg-[#25D366] hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 ring-4 ring-emerald-300/40 animate-pulse"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{t('PROCEED TO PART 2: ADD CATALOGUE', 'பகுதி 2: பொருட்கள் பட்டியல் சேர்க்கவும்', 'भाग 2: कैटलॉग में सामान जोड़ें')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ----------------- PART 2: ADD PRODUCTS TO CATALOGUE SCREENS ----------------- */}
            {currentPart === 'PART2_CATALOGUE' && (
              <>
                {/* Step 2.1: WhatsApp Business Home Screen */}
                {part2StepIndex === 0 && (
                  <div className="flex-1 bg-white flex flex-col justify-between">
                    {/* Top WA Business Header */}
                    <div className="bg-[#128C7E] text-white px-3 py-2 flex items-center justify-between">
                      <span className="font-bold text-sm tracking-wide">WhatsApp Business</span>
                      <div className="flex items-center gap-3">
                        <Camera className="w-4 h-4" />
                        <Search className="w-4 h-4" />
                        <MoreVertical className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Top Tabs: Business Tools, Chats, Updates, Calls */}
                    <div className="bg-[#128C7E] text-emerald-100 flex items-center text-xs font-bold border-t border-emerald-600/50">
                      {/* Highlighted Business Tools Tab */}
                      <button
                        id="tab-business-tools"
                        onClick={() => {
                          waVoice.playChime('success');
                          setPart2StepIndex(1);
                        }}
                        className="flex-1 py-2.5 flex items-center justify-center gap-1 text-white border-b-2 border-white bg-teal-800/40 transition cursor-pointer relative"
                      >
                        <Store className="w-4 h-4 text-amber-300" />
                        <span className="text-[11px] font-extrabold text-amber-200">
                          {t('Tools', 'கருவிகள்', 'टूल्स')}
                        </span>
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
                      </button>

                      <div className="flex-1 py-2.5 text-center text-slate-300 opacity-70">
                        {t('Chats', 'உரையாடல்', 'चैट्स')} (3)
                      </div>
                      <div className="flex-1 py-2.5 text-center text-slate-300 opacity-70">
                        {t('Updates', 'நிலவரம்', 'स्टेटस')}
                      </div>
                      <div className="flex-1 py-2.5 text-center text-slate-300 opacity-70">
                        {t('Calls', 'அழைப்பு', 'कॉल्स')}
                      </div>
                    </div>

                    {/* Chats List Preview */}
                    <div className="flex-1 bg-white p-2 divide-y divide-slate-100 overflow-y-auto">
                      <div className="p-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          L
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-800">Lakshmi (வாடிக்கையாளர்)</span>
                            <span className="text-[10px] text-emerald-600">10:15 AM</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {t('Do you have fresh Ponni rice 25kg?', '25 கிலோ பொன்னி அரிசி உள்ளதா?', 'क्या 25 किलो चावल उपलब्ध है?')}
                          </p>
                        </div>
                      </div>

                      <div className="p-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                          G
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-800">Gopi (வாடிக்கையாளர்)</span>
                            <span className="text-[10px] text-slate-400">Yesterday</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {t('Please send your price catalogue', 'உங்கள் கடை விலை பட்டியலை அனுப்பவும்', 'कृपया अपना कैटलॉग भेजें')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Floating Hint */}
                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
                      <button
                        onClick={() => {
                          waVoice.playChime('success');
                          setPart2StepIndex(1);
                        }}
                        className="w-full py-2 bg-[#128C7E] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Store className="w-4 h-4 text-amber-300" />
                        <span>{t('Tap "Tools" tab at top left', 'மேலே உள்ள "கருவிகள்" (Tools) தொடவும்', 'ऊपर "टूल्स" पर टैप करें')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2.2: Business Tools Menu Screen */}
                {part2StepIndex === 1 && (
                  <div className="flex-1 bg-slate-100 flex flex-col justify-between overflow-y-auto">
                    {/* Header */}
                    <div className="bg-[#128C7E] text-white px-3 py-2.5 flex items-center gap-2">
                      <button
                        onClick={() => setPart2StepIndex(0)}
                        className="p-1 rounded-md text-white hover:bg-teal-700"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-sm">
                        {t('Business Tools', 'வணிகக் கருவிகள்', 'बिजनेस टूल्स')}
                      </span>
                    </div>

                    <div className="p-3 space-y-3">
                      {/* Business Profile tile */}
                      <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center gap-3 shadow-xs">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                          <Store className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-bold text-xs text-slate-800">
                            {t('Business Profile', 'கடை சுயவிவரம்', 'दुकान प्रोफाइल')}
                          </h4>
                          <p className="text-[10px] text-slate-500">
                            {businessProfile.shopName}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>

                      {/* TARGET: Catalogue Item with Pulsing Spotlight */}
                      <div className="relative">
                        <button
                          id="item-tool-catalogue"
                          onClick={() => {
                            waVoice.playChime('success');
                            setPart2StepIndex(2);
                          }}
                          className="w-full bg-white hover:bg-emerald-50/70 rounded-xl p-3.5 border-2 border-emerald-500 flex items-center gap-3 shadow-md transition cursor-pointer text-left ring-4 ring-emerald-300/40"
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-sm text-slate-900">
                                {t('Catalogue', 'பொருட்கள் பட்டியல் (Catalogue)', 'कैटलॉग (Catalogue)')}
                              </h4>
                              <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                                {t('Key Tool', 'முக்கியம்', 'ज़रूरी')}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              {t(
                                'Showcase and share your products and services',
                                'உங்கள் பொருட்கள் மற்றும் விலைகளை காட்சிப்படுத்துங்கள்',
                                'अपने सामान और सेवाओं को दिखाएं और शेयर करें'
                              )}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-emerald-600 shrink-0" />
                        </button>
                      </div>

                      {/* Other WA Business Tools (Messaging) */}
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-left divide-y divide-slate-100 text-xs">
                        <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block p-1">
                          {t('Messaging Tools', 'செய்தி கருவிகள்', 'मैसेजिंग टूल्स')}
                        </span>
                        <div className="p-2 flex items-center justify-between text-slate-700">
                          <span>{t('Greeting message', 'வரவேற்பு செய்தி', 'स्वागत संदेश')}</span>
                          <span className="text-[10px] text-slate-400">Off</span>
                        </div>
                        <div className="p-2 flex items-center justify-between text-slate-700">
                          <span>{t('Away message', 'வெளியில் இருக்கும் செய்தி', 'अवे मैसेज')}</span>
                          <span className="text-[10px] text-slate-400">Off</span>
                        </div>
                        <div className="p-2 flex items-center justify-between text-slate-700">
                          <span>{t('Quick replies', 'விரைவு பதில்கள்', 'त्वरित उत्तर')}</span>
                          <span className="text-[10px] text-slate-400">1 reply</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white border-t border-slate-200">
                      <button
                        onClick={() => {
                          waVoice.playChime('success');
                          setPart2StepIndex(2);
                        }}
                        className="w-full py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <span>{t('Tap "Catalogue" to continue', '"கேட்லாக்" என்பதைத் தொடவும்', '"कैटलॉग" पर टैप करें')}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2.3: Catalogue Hub -> Tap "Add new item" */}
                {part2StepIndex === 2 && (
                  <div className="flex-1 bg-white flex flex-col justify-between">
                    {/* Header */}
                    <div className="bg-[#128C7E] text-white px-3 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPart2StepIndex(1)}
                          className="p-1 rounded-md text-white hover:bg-teal-700"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm">
                          {t('Catalogue Manager', 'கேட்லாக் நிர்வாகம்', 'कैटलॉग मैनेजर')}
                        </span>
                      </div>
                      <Share2 className="w-4 h-4 text-white" />
                    </div>

                    {/* Catalogue Empty State or Add CTA */}
                    <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 mb-3 shadow-inner">
                        <ShoppingBag className="w-10 h-10" />
                      </div>

                      <h3 className="font-extrabold text-base text-slate-800">
                        {t('Build your Product Catalogue', 'பொருட்கள் பட்டியலை உருவாக்குங்கள்', 'उत्पाद कैटलॉग बनाएं')}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1.5 px-4 leading-relaxed">
                        {t(
                          'Add items with clear photos, prices in rupees, and descriptions so customers can browse and order easily!',
                          'தெளிவான புகைப்படங்கள் மற்றும் விலையுடன் பொருட்களைச் சேர்த்து வாடிக்கையாளர்களை எளிதில் ஆர்டர் செய்ய வையுங்கள்!',
                          'साफ फोटो और कीमतों के साथ सामान जोड़ें ताकि ग्राहक आसानी से देखकर ऑर्डर कर सकें!'
                        )}
                      </p>

                      {/* TARGET: Big Green "Add new item" Button */}
                      <div className="mt-6 w-full px-2">
                        <button
                          id="btn-add-new-item"
                          onClick={() => {
                            waVoice.playChime('success');
                            setPart2StepIndex(3);
                          }}
                          className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition cursor-pointer ring-4 ring-emerald-300/50 animate-pulse hover:scale-102"
                        >
                          <Plus className="w-5 h-5 stroke-[3]" />
                          <span>{t('ADD NEW ITEM', 'புதிய பொருளைச் சேர் (Add new item)', 'नया सामान जोड़ें')}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
                      <span>{t('Free: Add up to 500 items in your catalogue', 'இலவசம்: 500 பொருட்கள் வரை சேர்க்கலாம்', 'मुफ़्त: 500 सामान तक जोड़ सकते हैं')}</span>
                    </div>
                  </div>
                )}

                {/* Step 2.4: Fill Product Details Form */}
                {part2StepIndex === 3 && (
                  <div className="flex-1 bg-white flex flex-col justify-between overflow-y-auto">
                    {/* Header */}
                    <div className="bg-[#128C7E] text-white px-3 py-2 flex items-center justify-between sticky top-0 z-20">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPart2StepIndex(2)}
                          className="p-1 rounded-md text-white hover:bg-teal-700"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm">
                          {t('Add Item', 'பொருளைச் சேர்', 'सामान जोड़ें')}
                        </span>
                      </div>
                      <button
                        onClick={handleSaveProduct}
                        className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-full cursor-pointer"
                      >
                        {t('SAVE', 'சேமி', 'सहेजें')}
                      </button>
                    </div>

                    <div className="p-3.5 space-y-3 text-left">
                      {/* Image Picker Box */}
                      <div>
                        <span className="font-bold text-xs text-slate-700 block mb-1">
                          {t('Product Images (Up to 10 photos)', 'பொருளின் புகைப்படங்கள் (10 வரை)', 'सामान का फोटो (10 तक)')}
                        </span>

                        <div className="flex items-center gap-2">
                          <img
                            src={editingItem.imageUrl}
                            alt="Selected Item"
                            className="w-18 h-18 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                          />

                          <button
                            onClick={() => setIsPhotoPickerOpen(true)}
                            className="h-18 px-3 rounded-xl border-2 border-dashed border-emerald-500 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-800 text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <Camera className="w-5 h-5 text-emerald-600" />
                            <span>{t('Change Photo', 'மாற்று', 'फोटो बदलें')}</span>
                          </button>
                        </div>

                        {/* Quick Presets for small shopkeepers */}
                        <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                          <span className="text-[10px] font-bold text-slate-600 block mb-1">
                            {t('Quick Sample Item Presets (Tap to load):', 'மாதிரி பொருட்கள் (தேர்வு செய்ய தட்டவும்):', 'नमूना सामान (चुनने के लिए टैप करें):')}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {SAMPLE_PRODUCTS.map((prod, pIdx) => (
                              <button
                                key={prod.id}
                                onClick={() => {
                                  waVoice.playChime('tap');
                                  setSelectedSampleIndex(pIdx);
                                  setEditingItem({
                                    ...prod,
                                    id: `prod-item-${Date.now()}`,
                                  });
                                }}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                                  editingItem.name === prod.name
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-white text-slate-700 border border-slate-300'
                                }`}
                              >
                                {pIdx === 0 && '🍚 Rice 25kg'}
                                {pIdx === 1 && '🥬 Veggies 5kg'}
                                {pIdx === 2 && '🍌 Chips 500g'}
                                {pIdx === 3 && '👗 Saree'}
                                {pIdx === 4 && '🏺 Clay Pots'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Item Name */}
                      <div>
                        <label className="font-bold text-xs text-slate-700 block mb-1">
                          {t('Item name *', 'பொருளின் பெயர் *', 'सामान का नाम *')}
                        </label>
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                          placeholder="e.g. Royal Ponni Boiled Rice (25kg)"
                        />
                      </div>

                      {/* Price in INR */}
                      <div>
                        <label className="font-bold text-xs text-slate-700 block mb-1">
                          {t('Price (INR ₹) *', 'விலை (ரூபாய் ₹) *', 'कीमत (रुपये ₹) *')}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-sm font-bold text-slate-500">₹</span>
                          <input
                            type="number"
                            value={editingItem.price || ''}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                            placeholder="1350"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="font-bold text-xs text-slate-700 block mb-1">
                          {t('Description', 'பொருள் விபரம்', 'विवरण')}
                        </label>
                        <textarea
                          rows={2}
                          value={editingItem.description}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, description: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 resize-none"
                          placeholder="Enter details like quality, weight, freshness"
                        />
                      </div>

                      {/* Optional Product Code */}
                      <div>
                        <label className="font-bold text-xs text-slate-500 block mb-1">
                          {t('Item code (Optional)', 'பொருள் குறியீடு (விருப்பம்)', 'सामान कोड (वैकल्पिक)')}
                        </label>
                        <input
                          type="text"
                          value={editingItem.productCode}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, productCode: e.target.value })
                          }
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
                          placeholder="e.g. RICE-25KG"
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="p-3 bg-white border-t border-slate-200">
                      <button
                        id="btn-save-catalogue-item"
                        onClick={handleSaveProduct}
                        className="w-full py-3 rounded-full bg-[#128C7E] hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 ring-4 ring-emerald-300/40"
                      >
                        <Check className="w-4 h-4" />
                        <span>{t('SAVE TO CATALOGUE', 'கேட்லாக்கில் சேமி (Save)', 'कैटलॉग में सहेजें')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2.5: Product Saved with WhatsApp Approval Badge */}
                {part2StepIndex === 4 && (
                  <div className="flex-1 bg-slate-50 flex flex-col justify-between overflow-y-auto">
                    {/* Header */}
                    <div className="bg-[#128C7E] text-white px-3 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPart2StepIndex(3)}
                          className="p-1 rounded-md text-white hover:bg-teal-700"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm">
                          {t('Catalogue Item Added', 'பொருள் சேர்க்கப்பட்டது', 'सामान जुड़ गया')}
                        </span>
                      </div>
                      <span className="text-xs bg-emerald-700 px-2 py-0.5 rounded-full font-bold">
                        1 item
                      </span>
                    </div>

                    {/* Success Toast */}
                    <div className="mx-3 mt-3 bg-emerald-600 text-white p-2.5 rounded-xl shadow-md flex items-center gap-2 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{t('Item successfully added to catalogue!', 'பொருள் கேட்லாக்கில் வெற்றிகரமாக சேர்க்கப்பட்டது!', 'सामान कैटलॉग में सफलतापूर्वक जुड़ गया!')}</span>
                    </div>

                    {/* Product Card Details */}
                    <div className="p-3">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                        <div className="h-44 relative overflow-hidden bg-slate-100">
                          <img
                            src={editingItem.imageUrl}
                            alt={editingItem.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>{t('Approved', 'அங்கீகரிக்கப்பட்டது', 'स्वीकृत')}</span>
                          </div>
                        </div>

                        <div className="p-3.5 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-extrabold text-sm text-slate-900">
                              {editingItem.name}
                            </h3>
                            <span className="text-base font-extrabold text-emerald-700">
                              ₹{editingItem.price}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-1 leading-snug">
                            {editingItem.description}
                          </p>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Code: <b>{editingItem.productCode || 'N/A'}</b></span>
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> In stock
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Action: Add More Products CTA */}
                    <div className="p-3 bg-white border-t border-slate-200 space-y-2">
                      <button
                        id="btn-add-more-products"
                        onClick={handleAddMoreSampleProducts}
                        className="w-full py-3 rounded-full bg-[#25D366] hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 ring-4 ring-emerald-300/40 animate-pulse"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{t('ADD 2-3 MORE SAMPLE PRODUCTS', 'கூடுதல் மாதிரி பொருட்களைச் சேர்', '2-3 और उत्पाद जोड़ें')}</span>
                      </button>

                      <button
                        onClick={() => setPart2StepIndex(5)}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition cursor-pointer"
                      >
                        {t('View Finished Catalogue', 'முழு கேட்லாக்கை பார்க்க', 'पूरा कैटलॉग देखें')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2.6: Finished Multi-Item Catalogue & Customer Showcase */}
                {part2StepIndex === 5 && (
                  <div className="flex-1 bg-slate-50 flex flex-col justify-between overflow-y-auto">
                    {/* Header with Share Button */}
                    <div className="bg-[#128C7E] text-white px-3 py-2.5 flex items-center justify-between sticky top-0 z-20">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPart2StepIndex(4)}
                          className="p-1 rounded-md text-white hover:bg-teal-700"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm">
                          {t('Store Catalogue', 'கடை கேட்லாக்', 'दुकान कैटलॉग')}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          waVoice.playChime('ding');
                          setShowShareNotification(true);
                          setTimeout(() => setShowShareNotification(false), 2500);
                        }}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer shadow-xs"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{t('Share Link', 'பகிர்', 'शेयर')}</span>
                      </button>
                    </div>

                    {showShareNotification && (
                      <div className="bg-emerald-700 text-white p-2 text-center text-xs font-bold animate-bounce">
                        🔗 {t('Catalogue link copied! Ready to share on WhatsApp chats.', 'கேட்லாக் இணைப்பு நகலெடுக்கப்பட்டது!', 'कैटलॉग लिंक कॉपी हो गया!')}
                      </div>
                    )}

                    {/* Shop Header Banner */}
                    <div className="bg-white p-3 border-b border-slate-200 flex items-center gap-3">
                      <img
                        src={businessProfile.photoUrl}
                        alt="Shop"
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                      />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-1">
                          <h4 className="font-extrabold text-xs text-slate-800">
                            {businessProfile.shopName}
                          </h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-[10px] text-slate-500">{businessProfile.category}</span>
                        <p className="text-[10px] text-emerald-700 font-semibold">
                          {catalogueList.length} {t('Items in catalogue', 'பொருட்கள் பட்டியலில் உள்ளன', 'सामान कैटलॉग में')}
                        </p>
                      </div>

                      <button
                        onClick={() => setCustomerPreviewOpen(!customerPreviewOpen)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded-lg border border-slate-300 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span>{customerPreviewOpen ? 'Admin' : 'Customer View'}</span>
                      </button>
                    </div>

                    {/* Multi-item Catalogue Grid / List */}
                    <div className="p-2.5 space-y-2 overflow-y-auto">
                      {catalogueList.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-xs flex items-center gap-3 text-left"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-extrabold text-xs text-emerald-700">
                                ₹{item.price}
                              </span>
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                                ✓ Approved
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom CTA: Proceed to Practice Sandbox */}
                    <div className="p-3 bg-white border-t border-slate-200">
                      <button
                        id="btn-go-practice"
                        onClick={() => handleSelectPart('PART3_PRACTICE')}
                        className="w-full py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 ring-4 ring-amber-300/40 animate-pulse"
                      >
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>{t('PROCEED TO PART 3: PRACTICE ACTIVITY', 'பகுதி 3: பயிற்சி சோதனைக்குச் செல்லவும்', 'भाग 3: अभ्यास गतिविधि पर जाएं')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ----------------- PART 3: PRACTICE ACTIVITY SANDBOX ----------------- */}
            {currentPart === 'PART3_PRACTICE' && (
              <div className="flex-1 bg-slate-50 flex flex-col justify-between overflow-y-auto">
                {/* Practice Top Header */}
                <div className="bg-amber-600 text-white px-3 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span className="font-bold text-sm">
                      {t('Practice Challenge', 'பயிற்சி சோதனை', 'अभ्यास चुनौती')}
                    </span>
                  </div>
                  <span className="text-xs bg-amber-700 font-bold px-2 py-0.5 rounded-full">
                    {practiceStep === 'PROFILE_BUILD'
                      ? 'Step 1/2'
                      : practiceStep === 'PRODUCT_ADD'
                      ? 'Step 2/2'
                      : 'Evaluation'}
                  </span>
                </div>

                {/* Instant Feedback Error Banner */}
                {practiceFeedback && (
                  <div className="mx-3 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs shadow-md flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-left flex-1">
                      <h4 className="font-bold text-rose-900">{practiceFeedback.title}</h4>
                      <p className="mt-0.5 text-[11px] leading-snug">{practiceFeedback.message}</p>
                    </div>
                  </div>
                )}

                {/* Challenge Step 1: Create Shop Profile */}
                {practiceStep === 'PROFILE_BUILD' && (
                  <div className="p-4 text-left space-y-3">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                      <h3 className="font-extrabold text-xs text-slate-800 mb-1 flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-amber-600" />
                        <span>{t('Challenge 1: Create your own shop profile', 'சவால் 1: உங்கள் கடையின் சுயவிவரத்தை அமைக்கவும்', 'चुनौती 1: अपनी दुकान की प्रोफाइल बनाएं')}</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {t(
                          'Type your real or sample shop name and choose a business category.',
                          'உங்கள் கடை பெயரை எழுதி வணிக வகையைத் தேர்வு செய்யுங்கள்.',
                          'अपनी दुकान का नाम लिखें और श्रेणी चुनें।'
                        )}
                      </p>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                      <div>
                        <label className="font-bold text-xs text-slate-700 block mb-1">
                          {t('Your Shop Name *', 'உங்கள் கடை பெயர் *', 'आपकी दुकान का नाम *')}
                        </label>
                        <input
                          type="text"
                          value={practiceProfile.shopName}
                          onChange={(e) =>
                            setPracticeProfile({ ...practiceProfile, shopName: e.target.value })
                          }
                          placeholder={t('e.g. Annai Supermarket', 'எ.கா: அன்னை சூப்பர் மார்க்கெட்', 'जैसे: अन्नपूर्णा किराना स्टोर')}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-xs text-slate-700 block mb-1">
                          {t('Category *', 'வணிக வகை *', 'व्यापार श्रेणी *')}
                        </label>
                        <select
                          value={practiceProfile.category}
                          onChange={(e) =>
                            setPracticeProfile({ ...practiceProfile, category: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-600 bg-white"
                        >
                          <option value="Grocery Store">Grocery Store (மளிகை கடை)</option>
                          <option value="Apparel & Clothing">Apparel & Clothing (துணிக்கடை)</option>
                          <option value="Food & Beverage">Food & Snacks (தின்பண்டங்கள்)</option>
                          <option value="Handmade & Crafts">Arts & Crafts (கைவினைப் பொருட்கள்)</option>
                          <option value="Other">Other Business (மற்றவை)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-xs text-slate-700 block mb-1">
                          {t('Short Shop Description', 'கடை பற்றிய சிறு அறிமுகம்', 'दुकान का विवरण')}
                        </label>
                        <input
                          type="text"
                          value={practiceProfile.description}
                          onChange={(e) =>
                            setPracticeProfile({ ...practiceProfile, description: e.target.value })
                          }
                          placeholder={t('e.g. Quality products, fast delivery', 'எ.கா: தரமான பொருட்கள், விரைவு விநியோகம்', 'जैसे: उत्तम गुणवत्ता, तेज़ डिलीवरी')}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-amber-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Challenge Step 2: Add Product to Catalogue */}
                {practiceStep === 'PRODUCT_ADD' && (
                  <div className="p-4 text-left space-y-3">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                      <h3 className="font-extrabold text-xs text-slate-800 mb-1 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-amber-600" />
                        <span>{t('Challenge 2: Add a product to your catalogue', 'சவால் 2: உங்கள் கேட்லாக்கில் ஒரு பொருளைச் சேர்க்கவும்', 'चुनौती 2: कैटलॉग में एक उत्पाद जोड़ें')}</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {t(
                          'Provide product name, price in rupees, and pick a sample photo.',
                          'பொருளின் பெயர், ரூபாய் விலை மற்றும் புகைப்படத்தை தேர்வு செய்யவும்.',
                          'सामान का नाम, रुपये में कीमत और फोटो भरें।'
                        )}
                      </p>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                      {/* Pick sample photo */}
                      <div>
                        <label className="font-bold text-xs text-slate-700 block mb-1">
                          {t('Product Photo', 'பொருளின் புகைப்படம்', 'सामान का फोटो')}
                        </label>
                        <div className="flex gap-2">
                          <img
                            src={practiceProduct.imageUrl}
                            alt="Practice Item"
                            className="w-14 h-14 rounded-xl object-cover border-2 border-amber-500"
                          />
                          <div className="flex-1 flex flex-wrap gap-1">
                            {SAMPLE_PRODUCTS.map((prod) => (
                              <button
                                key={prod.id}
                                onClick={() => {
                                  waVoice.playChime('tap');
                                  setPracticeProduct({
                                    ...practiceProduct,
                                    imageUrl: prod.imageUrl,
                                    name: practiceProduct.name || prod.name,
                                    price: practiceProduct.price || String(prod.price),
                                    description: practiceProduct.description || prod.description,
                                  });
                                }}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 border border-slate-200"
                              >
                                {prod.category.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-xs text-slate-700 block mb-1">
                          {t('Item Name *', 'பொருளின் பெயர் *', 'सामान का नाम *')}
                        </label>
                        <input
                          type="text"
                          value={practiceProduct.name}
                          onChange={(e) =>
                            setPracticeProduct({ ...practiceProduct, name: e.target.value })
                          }
                          placeholder={t('e.g. Masala Tea Powder 500g', 'எ.கா: மசாலா டீ தூள் 500g', 'जैसे: मसाला चाय पत्ती 500g')}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-xs text-slate-700 block mb-1">
                          {t('Price (INR ₹) *', 'விலை (ரூபாய் ₹) *', 'कीमत (रुपये ₹) *')}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₹</span>
                          <input
                            type="number"
                            value={practiceProduct.price}
                            onChange={(e) =>
                              setPracticeProduct({ ...practiceProduct, price: e.target.value })
                            }
                            placeholder="150"
                            className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-xs text-slate-700 block mb-1">
                          {t('Description', 'விபரம்', 'विवरण')}
                        </label>
                        <textarea
                          rows={2}
                          value={practiceProduct.description}
                          onChange={(e) =>
                            setPracticeProduct({ ...practiceProduct, description: e.target.value })
                          }
                          placeholder={t('Fresh authentic product', 'தரமான பொருள்', 'ताजा और शुद्ध')}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-amber-600 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Challenge Evaluation & Certification Badge */}
                {practiceStep === 'EVALUATION' && (
                  <div className="p-4 text-center space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-600 mx-auto mb-2 shadow-md">
                        <Award className="w-8 h-8" />
                      </div>

                      <h3 className="font-black text-lg text-slate-800">
                        {t('Practice Test Passed!', 'பயிற்சி தேர்வில் வெற்றி!', 'अभ्यास परीक्षा सफल!')}
                      </h3>

                      <p className="text-xs text-slate-600 mt-1">
                        {t(
                          'You successfully created a store profile and added a catalogue product with valid price!',
                          'உங்கள் கடையின் சுயவிவரத்தையும் கேட்லாக் பொருளையும் சரியாக உருவாக்கியுள்ளீர்கள்!',
                          'आपने सफलतापूर्वक दुकान प्रोफाइल बनाई और कैटलॉग में सही कीमत के साथ सामान जोड़ा!'
                        )}
                      </p>

                      {/* Certificate Card */}
                      <div className="mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-3.5 shadow-sm text-left">
                        <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-2">
                          <span className="font-extrabold text-[11px] text-amber-900 uppercase tracking-wider">
                            FirstTap Digital Certificate
                          </span>
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                            100% Score
                          </span>
                        </div>

                        <p className="text-xs text-slate-700">
                          {t('Shop Name: ', 'கடை பெயர்: ', 'दुकान का नाम: ')}
                          <b>{practiceProfile.shopName || 'Murugan Store'}</b>
                        </p>
                        <p className="text-xs text-slate-700">
                          {t('Category: ', 'வகை: ', 'श्रेणी: ')}
                          <b>{practiceProfile.category}</b>
                        </p>
                        <p className="text-xs text-slate-700">
                          {t('Added Product: ', 'சேர்க்கப்பட்ட பொருள்: ', 'जोड़ा गया सामान: ')}
                          <b>{practiceProduct.name} (₹{practiceProduct.price})</b>
                        </p>

                        <div className="mt-2 pt-2 border-t border-amber-200 flex items-center justify-between text-[10px] text-amber-800 font-semibold">
                          <span>WhatsApp Business Ready</span>
                          <span>Verified Skill ✓</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => {
                          waVoice.stop();
                          onComplete?.();
                          onBackToMainMenu?.();
                        }}
                        className="w-full py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-900/30 transition cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/40 active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>{t('Finish Lesson & Return to Path', 'பாடத்தை முடித்து பாதைக்கு திரும்பு', 'पाठ पूरा करें और पाथ पर वापस')}</span>
                      </button>

                      <button
                        onClick={handleTryAgain}
                        className="w-full py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{t('Retry Practice Activity', 'பயிற்சியை மீண்டும் செய்', 'अभ्यास दोबारा करें')}</span>
                      </button>

                      <button
                        onClick={() => handleSelectPart('PART1_ACCOUNT')}
                        className="w-full py-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition cursor-pointer"
                      >
                        <span>{t('Restart Full Tutorial', 'முழு பயிற்சியை மீண்டும் தொடங்குக', 'शुरू से ट्यूटोरियल देखें')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Submit Buttons for Practice */}
                {practiceStep !== 'EVALUATION' && (
                  <div className="p-3 bg-white border-t border-slate-200">
                    <button
                      onClick={() => {
                        if (practiceStep === 'PROFILE_BUILD') handlePracticeProfileSubmit();
                        else if (practiceStep === 'PRODUCT_ADD') handlePracticeProductSubmit();
                      }}
                      className="w-full py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 ring-4 ring-amber-300/40"
                    >
                      <span>
                        {practiceStep === 'PROFILE_BUILD'
                          ? t('VERIFY & CONTINUE TO PRODUCT', 'சரிபார்த்து பொருளைச் சேர்க்கவும்', 'सत्यापित करें और सामान जोड़ें')
                          : t('SAVE PRODUCT & GET SCORE', 'பொருளை சேமித்து மதிப்பெண் பெறு', 'सामान सहेजें और परिणाम देखें')}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Android Navigation Bar (Back, Home, Recent) */}
          <div className="h-6 flex items-center justify-around px-12 shrink-0 z-30 pt-1">
            <button
              onClick={() => {
                waVoice.playChime('tap');
                if (currentPart === 'PART1_ACCOUNT' && part1StepIndex > 0) {
                  setPart1StepIndex(part1StepIndex - 1);
                } else if (currentPart === 'PART2_CATALOGUE' && part2StepIndex > 0) {
                  setPart2StepIndex(part2StepIndex - 1);
                }
              }}
              className="text-slate-400 hover:text-white"
            >
              ◀
            </button>
            <button
              onClick={() => {
                waVoice.playChime('tap');
                setPart1StepIndex(0);
              }}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ●
            </button>
            <button
              onClick={() => {
                waVoice.playChime('tap');
              }}
              className="text-slate-400 hover:text-white"
            >
              ■
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Photo Picker for Products */}
      {isPhotoPickerOpen && (
        <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="font-bold text-sm text-white">
                {t('Choose Product Image', 'பொருளின் புகைப்படத்தை தேர்வு செய்', 'सामान का फोटो चुनें')}
              </h3>
              <button
                onClick={() => setIsPhotoPickerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1">
              {SAMPLE_PRODUCTS.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => {
                    waVoice.playChime('tap');
                    setEditingItem({
                      ...editingItem,
                      imageUrl: prod.imageUrl,
                      name: editingItem.name || prod.name,
                      price: editingItem.price || prod.price,
                      description: editingItem.description || prod.description,
                    });
                    setIsPhotoPickerOpen(false);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 rounded-xl overflow-hidden border border-slate-700 p-1 flex flex-col items-center gap-1 cursor-pointer transition"
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <span className="text-[10px] font-bold text-slate-200 truncate w-full px-1">
                    {prod.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-extrabold">
                    ₹{prod.price}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

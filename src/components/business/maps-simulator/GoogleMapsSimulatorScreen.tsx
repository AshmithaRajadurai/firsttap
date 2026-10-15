import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  Compass,
  Layers,
  Plus,
  Bookmark,
  Home,
  Store,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Volume2,
  MicOff,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Phone,
  HelpCircle,
  Sparkles,
  Info,
  Building2,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { LanguageCode, MapMode, SimulationScreen, SimulationStepData } from './types';
import { MAPS_CATEGORIES, MAPS_STEPS } from './mapsSimulatorLessons';
import { mapsVoiceManager } from './voice';

export interface GoogleMapsSimulatorScreenProps {
  language?: LanguageCode;
  onBackToMainMenu?: () => void;
  onSwitchToWhatsApp?: () => void;
  onSwitchToSpamCall?: () => void;
  initialMode?: MapMode;
  onComplete?: () => void;
}

export const GoogleMapsSimulatorScreen: React.FC<GoogleMapsSimulatorScreenProps> = ({
  language: initialLanguage = 'en',
  onBackToMainMenu,
  onSwitchToWhatsApp,
  onSwitchToSpamCall,
  initialMode = 'CHOICE',
  onComplete,
}) => {
  // Global simulator states
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [mode, setMode] = useState<MapMode>(initialMode);
  const [screen, setScreen] = useState<SimulationScreen>('PHONE_HOME');
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [history, setHistory] = useState<SimulationScreen[]>(['PHONE_HOME']);

  useEffect(() => {
    if (initialLanguage) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  // Shop form states (Fictional data for training)
  const [shopName, setShopName] = useState<string>('Sri Murugan Kirana Store');
  const [selectedCategory, setSelectedCategory] = useState<string>('grocery');
  const [shopAddress, setShopAddress] = useState<string>('14, Gandhi Road, Main Market');
  const [shopPhone, setShopPhone] = useState<string>('+91 98401 23456');
  const [shopHours, setShopHours] = useState<string>('9:00 AM - 9:00 PM (All days)');
  const [pinPosition, setPinPosition] = useState<{ x: number; y: number }>({ x: 50, y: 48 });

  // Home private address states
  const [homeAddress, setHomeAddress] = useState<string>('Flat 2B, Green Palms, Lake View Street');

  // Interactive guidance highlight state
  const [highlightTarget, setHighlightTarget] = useState<string | null>('app-icon-maps');

  // Compute current step data
  const getCurrentStepData = (): SimulationStepData => {
    switch (screen) {
      case 'PHONE_HOME':
        return MAPS_STEPS.step_phone_home;
      case 'MAP_MAIN':
        return MAPS_STEPS.step_map_main;
      case 'CHOICE_MODAL':
        return MAPS_STEPS.step_choice;
      // Shop flow
      case 'SHOP_FORM_NAME':
        return MAPS_STEPS.step_shop_name;
      case 'SHOP_FORM_CATEGORY':
        return MAPS_STEPS.step_shop_category;
      case 'SHOP_PIN_CONFIRM':
        return MAPS_STEPS.step_shop_pin;
      case 'SHOP_EXTRA_DETAILS':
        return MAPS_STEPS.step_shop_extra;
      case 'SHOP_SUCCESS':
        return MAPS_STEPS.step_shop_success;
      // Home flow
      case 'HOME_PRIVACY_EXPLANATION':
        return MAPS_STEPS.step_home_privacy;
      case 'HOME_SAVED_MENU':
        return MAPS_STEPS.step_home_menu;
      case 'HOME_SET_PIN':
        return MAPS_STEPS.step_home_pin;
      case 'HOME_SUCCESS':
        return MAPS_STEPS.step_home_success;
      default:
        return MAPS_STEPS.step_phone_home;
    }
  };

  const currentStep = getCurrentStepData();

  // Voice narration helper
  const speakCurrentStep = useCallback(async () => {
    if (isVoiceMuted) return;
    const textToSpeak = currentStep.voiceScript[language];
    await mapsVoiceManager.speakAsync(textToSpeak, language);
  }, [currentStep, language, isVoiceMuted]);

  // Subscribe to speaking state
  useEffect(() => {
    const unsub = mapsVoiceManager.onSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsub();
      mapsVoiceManager.stop();
    };
  }, []);

  // Auto-speak on step or language change
  useEffect(() => {
    speakCurrentStep();
  }, [screen, language, speakCurrentStep]);

  // Navigation handlers
  const navigateTo = (nextScreen: SimulationScreen, newMode?: MapMode) => {
    setHistory((prev) => [...prev, nextScreen]);
    setScreen(nextScreen);
    if (newMode) setMode(newMode);
    if (nextScreen === 'SHOP_SUCCESS' || nextScreen === 'HOME_SUCCESS') {
      onComplete?.();
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const prevScreen = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setScreen(prevScreen);
    } else {
      setScreen('PHONE_HOME');
    }
  };

  const handleNext = () => {
    switch (screen) {
      case 'PHONE_HOME':
        navigateTo('MAP_MAIN');
        break;
      case 'MAP_MAIN':
        navigateTo('CHOICE_MODAL');
        break;
      case 'CHOICE_MODAL':
        if (mode === 'SHOP') navigateTo('SHOP_FORM_NAME');
        else if (mode === 'HOME') navigateTo('HOME_PRIVACY_EXPLANATION');
        else navigateTo('SHOP_FORM_NAME', 'SHOP');
        break;
      // Shop steps
      case 'SHOP_FORM_NAME':
        navigateTo('SHOP_FORM_CATEGORY');
        break;
      case 'SHOP_FORM_CATEGORY':
        navigateTo('SHOP_PIN_CONFIRM');
        break;
      case 'SHOP_PIN_CONFIRM':
        navigateTo('SHOP_EXTRA_DETAILS');
        break;
      case 'SHOP_EXTRA_DETAILS':
        navigateTo('SHOP_SUCCESS');
        break;
      // Home steps
      case 'HOME_PRIVACY_EXPLANATION':
        navigateTo('HOME_SAVED_MENU');
        break;
      case 'HOME_SAVED_MENU':
        navigateTo('HOME_SET_PIN');
        break;
      case 'HOME_SET_PIN':
        navigateTo('HOME_SUCCESS');
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    mapsVoiceManager.stop();
    setScreen('PHONE_HOME');
    setMode('CHOICE');
    setHistory(['PHONE_HOME']);
    setPinPosition({ x: 50, y: 48 });
  };

  const handleReplayVoice = () => {
    mapsVoiceManager.stop();
    speakCurrentStep();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between items-center py-3 px-3 sm:px-6 font-sans select-none">
      {/* 1. TOP CONTROL BAR */}
      <header className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 mb-2.5 bg-slate-900/90 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3">
          {onBackToMainMenu && (
            <button
              data-demo-id="maps-simulator-back-btn"
              onClick={() => {
                mapsVoiceManager.stop();
                onBackToMainMenu();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-black shadow-md border border-blue-500 transition cursor-pointer min-h-[44px] active:scale-95"
              title="Return to Business Path"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'ta'
                  ? '← பாதைக்கு திரும்பு'
                  : language === 'hi'
                  ? '← पाथ पर वापस'
                  : '← Back to Path'}
              </span>
            </button>
          )}

          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8] animate-pulse" />
              Google Maps Location Training Simulator
            </h1>
            <p className="text-xs text-slate-400">
              {language === 'ta'
                ? 'கூகுள் மேப்ஸில் கடை அல்லது வீட்டு முகவரி சேர்க்கும் பயிற்சி'
                : language === 'hi'
                ? 'गूगल मैप्स पर दुकान या घर का पता जोड़ने का अभ्यास'
                : 'Learn to add a public shop or save your private home address safely'}
            </p>
          </div>
        </div>

        {/* Trilingual Language Selector & Audio Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Quick Module Switchers */}
          {onSwitchToWhatsApp && (
            <button
              onClick={onSwitchToWhatsApp}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-[11px] font-bold border border-emerald-800/80 transition cursor-pointer min-h-[38px] flex items-center gap-1"
              title="Switch to WhatsApp Tutorial"
            >
              <span>WhatsApp</span>
            </button>
          )}

          {onSwitchToSpamCall && (
            <button
              onClick={onSwitchToSpamCall}
              className="px-2.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-[11px] font-bold border border-red-800/80 transition cursor-pointer min-h-[38px] flex items-center gap-1"
              title="Switch to Spam Call Drill"
            >
              <span>Spam Call</span>
            </button>
          )}

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer min-h-[36px] ${
                language === 'en' ? 'bg-[#1A73E8] text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer min-h-[36px] ${
                language === 'ta' ? 'bg-[#1A73E8] text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer min-h-[36px] ${
                language === 'hi' ? 'bg-[#1A73E8] text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Voice Mute Toggle */}
          <button
            onClick={() => setIsVoiceMuted(!isVoiceMuted)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border min-h-[44px] ${
              isVoiceMuted
                ? 'bg-red-950/60 text-red-300 border-red-800'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
            }`}
            title={isVoiceMuted ? 'Unmute voice narration' : 'Mute voice narration'}
          >
            {isVoiceMuted ? <MicOff className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isVoiceMuted ? 'Muted' : 'Voice On'}</span>
          </button>
        </div>
      </header>

      {/* 2. LIVE VOICE SUBTITLES & AUDIO BANNER */}
      <div className="w-full max-w-4xl mx-auto mb-2 bg-slate-900/95 border border-slate-800 rounded-2xl p-3 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-xl border shrink-0 transition-colors ${
              isSpeaking
                ? 'bg-blue-600/30 text-blue-300 border-blue-400'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isSpeaking ? (
              <span className="flex items-end gap-0.5 h-4">
                <span className="w-1 bg-[#1A73E8] rounded-full animate-bounce [animation-delay:0ms] h-3" />
                <span className="w-1 bg-[#1A73E8] rounded-full animate-bounce [animation-delay:150ms] h-4" />
                <span className="w-1 bg-[#1A73E8] rounded-full animate-bounce [animation-delay:300ms] h-2" />
              </span>
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#1A73E8]">
                {language === 'ta'
                  ? 'குரல் உரை (Subtitles)'
                  : language === 'hi'
                  ? 'आवाज़ उपशीर्षक (Subtitles)'
                  : 'Voice Subtitles'}
              </span>
              {isSpeaking && (
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-semibold animate-pulse">
                  Speaking...
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
              "{currentStep.voiceScript[language]}"
            </p>
          </div>
        </div>
        <button
          onClick={handleReplayVoice}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition cursor-pointer min-h-[38px] active:scale-95"
          title="Replay Voice Guidance"
        >
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Listen</span>
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="w-full max-w-4xl mx-auto mb-2 bg-amber-950/60 border border-amber-600/50 rounded-xl px-3 py-1.5 text-xs text-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Training Sandbox:</strong> Fictional data only. Real public shops undergo Google verification; private homes must be saved privately.
          </span>
        </div>
        <span className="text-[10px] font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
          No Real Data Published
        </span>
      </div>

      {/* 2. CENTERED PHONE FRAME & SIMULATED MOBILE UI */}
      <main className="flex-1 flex flex-col items-center justify-center w-full my-auto">
        <div className="relative w-full max-w-[390px] h-[780px] bg-white rounded-[44px] shadow-2xl overflow-hidden border-[10px] border-slate-900 flex flex-col select-none ring-1 ring-slate-800">
          {/* Top Phone Speaker Cutout */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-slate-900 z-50 flex items-center justify-center">
            <div className="w-24 h-4 bg-black rounded-b-xl flex items-center justify-center">
              <div className="w-10 h-1 bg-slate-800 rounded-full" />
            </div>
          </div>

          {/* Practice Simulation Watermark Banner */}
          <div className="bg-[#E8F0FE] border-b border-[#D2E3FC] px-3 py-1 flex items-center justify-center text-[11px] font-semibold text-[#1A73E8] z-40 mt-6 shrink-0">
            <span>Google Maps Training Simulator · Step {currentStep.stepNumber} of {currentStep.totalSteps}</span>
          </div>

          {/* ================= SCREEN 1: PHONE HOME SCREEN ================= */}
          {screen === 'PHONE_HOME' && (
            <div
              className="flex-1 flex flex-col justify-between p-5 relative bg-cover bg-center"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 20%, #1e3a8a, #0f172a 70%)',
              }}
            >
              {/* Phone Clock & Date */}
              <div className="text-center pt-8 text-white space-y-1">
                <span className="text-4xl font-light tracking-tight font-mono">09:41</span>
                <span className="text-xs text-slate-300 block font-medium">Monday, 14 October</span>
              </div>

              {/* Home Screen App Grid */}
              <div className="my-auto grid grid-cols-4 gap-4 max-w-[320px] mx-auto text-center">
                {/* 1. Phone App */}
                <div className="flex flex-col items-center gap-1 opacity-80">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                    <Phone className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] text-white font-medium">Phone</span>
                </div>

                {/* 2. GOOGLE MAPS APP (TARGET OF STEP 1) */}
                <button
                  data-demo-id="app-icon-maps"
                  onClick={() => navigateTo('MAP_MAIN')}
                  className="flex flex-col items-center gap-1 cursor-pointer group focus:outline-none relative active:scale-95 transition"
                >
                  {/* Bouncing Guide Indicator */}
                  <div className="absolute -top-3 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-2xl flex items-center justify-center border-2 border-red-500 group-hover:scale-105 transition ring-4 ring-red-400/50 animate-pulse">
                    <div className="w-full h-full relative flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-[#EA4335] fill-[#EA4335]/20" />
                    </div>
                  </div>
                  <span className="text-[11px] text-white font-bold tracking-tight">Maps</span>
                </button>

                {/* 3. Photos */}
                <div className="flex flex-col items-center gap-1 opacity-80">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center shadow-lg">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] text-white font-medium">Photos</span>
                </div>

                {/* 4. Chrome */}
                <div className="flex flex-col items-center gap-1 opacity-80">
                  <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-lg">
                    <Compass className="w-7 h-7 text-blue-600" />
                  </div>
                  <span className="text-[10px] text-white font-medium">Chrome</span>
                </div>
              </div>

              {/* Step 1 Guide Bubble */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-slate-200 text-slate-800 text-left mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A73E8] mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>STEP 1: OPEN GOOGLE MAPS</span>
                </div>
                <p className="text-xs font-semibold leading-snug">
                  {currentStep.instruction[language]}
                </p>
              </div>
            </div>
          )}

          {/* ================= SCREEN 2: MAP MAIN SCREEN ================= */}
          {screen === 'MAP_MAIN' && (
            <div className="flex-1 flex flex-col justify-between bg-[#F8F9FA] relative overflow-hidden">
              {/* Top Search Bar */}
              <div className="p-3 z-20 shrink-0">
                <div className="bg-white rounded-full px-4 py-2.5 flex items-center justify-between shadow-md border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Search className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400">Search here...</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#1A73E8] text-white text-xs font-bold flex items-center justify-center">
                    R
                  </div>
                </div>
              </div>

              {/* Simulated Map Canvas */}
              <div className="flex-1 relative bg-[#E5E3DF] overflow-hidden flex items-center justify-center">
                {/* SVG Roads & Blocks Layout */}
                <svg className="w-full h-full absolute inset-0 opacity-80" xmlns="http://www.w3.org/2000/svg">
                  {/* Parks / Green areas */}
                  <rect x="20" y="80" width="120" height="90" fill="#C5E8C5" rx="10" />
                  <rect x="240" y="220" width="130" height="110" fill="#C5E8C5" rx="10" />
                  {/* Water Canal */}
                  <path d="M-20,380 C100,360 200,420 400,390" fill="none" stroke="#AADAFF" strokeWidth="20" />
                  {/* Main Roads */}
                  <line x1="-10" y1="200" x2="400" y2="200" stroke="#FFFFFF" strokeWidth="24" />
                  <line x1="-10" y1="200" x2="400" y2="200" stroke="#FEEA8C" strokeWidth="12" />
                  <line x1="180" y1="0" x2="180" y2="600" stroke="#FFFFFF" strokeWidth="20" />
                  <line x1="180" y1="0" x2="180" y2="600" stroke="#FEEA8C" strokeWidth="10" />
                  {/* Secondary Streets */}
                  <line x1="0" y1="90" x2="390" y2="90" stroke="#FFFFFF" strokeWidth="10" />
                  <line x1="0" y1="320" x2="390" y2="320" stroke="#FFFFFF" strokeWidth="12" />
                  <line x1="280" y1="0" x2="280" y2="600" stroke="#FFFFFF" strokeWidth="10" />
                </svg>

                {/* Landmarks on Simulated Map */}
                <div className="absolute top-28 left-8 bg-white/90 px-2 py-0.5 rounded shadow-xs text-[9px] font-bold text-slate-700 flex items-center gap-1 border border-slate-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Gandhi Park</span>
                </div>
                <div className="absolute top-44 right-8 bg-white/90 px-2 py-0.5 rounded shadow-xs text-[9px] font-bold text-slate-700 flex items-center gap-1 border border-slate-300">
                  <Store className="w-2.5 h-2.5 text-blue-600" />
                  <span>Market Road</span>
                </div>

                {/* Floating GPS Target */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 animate-ping" />
                  <div className="w-5 h-5 rounded-full bg-[#1A73E8] border-2 border-white shadow-lg absolute" />
                </div>

                {/* Floating Map Action: + Add a place */}
                <button
                  data-demo-id="btn-add-place-pill"
                  onClick={() => navigateTo('CHOICE_MODAL')}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white hover:bg-blue-50 text-[#1A73E8] font-extrabold text-xs px-4 py-2 rounded-full shadow-xl border-2 border-[#1A73E8] flex items-center gap-1.5 cursor-pointer z-30 transition hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4 text-[#1A73E8]" />
                  <span>+ Add a place (இடத்தைச் சேர்)</span>
                </button>
              </div>

              {/* Bottom Instructions Card */}
              <div className="px-3 pb-2 z-20">
                <div className="bg-white rounded-2xl p-3 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A73E8] mb-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>STEP 2: TAP "+ CONTRIBUTE"</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {currentStep.instruction[language]}
                  </p>
                </div>
              </div>

              {/* Bottom Google Maps Tab Bar */}
              <div className="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around z-20 shrink-0">
                <div className="flex flex-col items-center text-slate-400 text-[10px] gap-0.5">
                  <Compass className="w-5 h-5" />
                  <span>Explore</span>
                </div>
                <div className="flex flex-col items-center text-slate-400 text-[10px] gap-0.5">
                  <Navigation className="w-5 h-5" />
                  <span>Go</span>
                </div>
                <div className="flex flex-col items-center text-slate-400 text-[10px] gap-0.5">
                  <Bookmark className="w-5 h-5" />
                  <span>Saved</span>
                </div>

                {/* CONTRIBUTE TAB (TARGET FOR STEP 2) */}
                <button
                  data-demo-id="btn-contribute-tab"
                  onClick={() => navigateTo('CHOICE_MODAL')}
                  className="flex flex-col items-center text-[#1A73E8] font-bold text-[10px] gap-0.5 cursor-pointer relative group active:scale-95 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-50 border-2 border-[#1A73E8] flex items-center justify-center shadow-xs group-hover:scale-105 transition animate-pulse">
                    <Plus className="w-5 h-5 text-[#1A73E8]" />
                  </div>
                  <span>Contribute</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= SCREEN 3: CHOICE MODAL (SHOP vs HOME) ================= */}
          {screen === 'CHOICE_MODAL' && (
            <div className="flex-1 flex flex-col justify-between bg-black/60 p-4 text-slate-800">
              <div className="my-auto bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-[#1A73E8] uppercase tracking-wider block">
                    {currentStep.title[language]}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    {language === 'ta'
                      ? 'நீங்கள் எதை சேர்க்க விரும்புகிறீர்கள்?'
                      : language === 'hi'
                      ? 'आप क्या जोड़ना चाहते हैं?'
                      : 'What would you like to do?'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-snug">
                    {currentStep.instruction[language]}
                  </p>
                </div>

                {/* Option A: Add a Shop (Public) */}
                <button
                  onClick={() => navigateTo('SHOP_FORM_NAME', 'SHOP')}
                  className="w-full p-4 rounded-2xl bg-blue-50/80 hover:bg-blue-100/90 border-2 border-[#1A73E8] text-left transition flex items-start gap-3.5 cursor-pointer group active:scale-98 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#1A73E8] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition">
                    <Store className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-[#1A73E8]">
                        {language === 'ta' ? 'கடை / வணிகம் சேர்க்க (Shop)' : language === 'hi' ? 'दुकान या व्यापार जोड़ें' : 'Add Shop / Business'}
                      </h4>
                      <span className="text-[9px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                        Public
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      {language === 'ta'
                        ? 'பொது வாடிக்கையாளர்கள் உங்கள் கடையை மேப்பில் கண்டறிய சேர்க்கவும்.'
                        : language === 'hi'
                        ? 'ग्राहकों को अपनी दुकान गूगल सर्च व मैप्स पर दिखाने के लिए।'
                        : 'Listed publicly so customers can search, call, and visit your business.'}
                    </p>
                  </div>
                </button>

                {/* Option B: Save Home Address (Private) */}
                <button
                  onClick={() => navigateTo('HOME_PRIVACY_EXPLANATION', 'HOME')}
                  className="w-full p-4 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100/90 border-2 border-emerald-500 text-left transition flex items-start gap-3.5 cursor-pointer group active:scale-98 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition">
                    <Home className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-emerald-800">
                        {language === 'ta' ? 'சொந்த வீட்டை சேமிக்க (Private Home)' : language === 'hi' ? 'निजी घर का पता सहेजें' : 'Save Private Home Location'}
                      </h4>
                      <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                        100% Private
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      {language === 'ta'
                        ? 'உங்கள் குடும்ப முகவரி ரகசியமாக உங்களுக்காக மட்டுமே சேமிக்கப்படும்.'
                        : language === 'hi'
                        ? 'घर का पता सिर्फ आपके फ़ोन में सुरक्षित रहेगा, किसी को नहीं दिखेगा।'
                        : 'Private personal location visible ONLY to you for 1-tap navigation.'}
                    </p>
                  </div>
                </button>

                {/* Safety Rule Card */}
                <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 text-[11px] text-amber-900 leading-snug flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Golden Rule:</strong> Never list your personal house as a public place on Google Maps. Homes should always be saved privately!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= SHOP FLOW SCREEN 1: SHOP NAME ================= */}
          {screen === 'SHOP_FORM_NAME' && (
            <div className="flex-1 flex flex-col justify-between bg-white p-5 text-slate-800 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Store className="w-5 h-5 text-[#1A73E8]" />
                  <h3 className="font-extrabold text-base text-slate-900">
                    {currentStep.title[language]}
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'ta' ? 'கடையின் முழு பெயர் (Place Name)' : language === 'hi' ? 'दुकान का पूरा नाम' : 'Business / Place Name *'}
                  </label>
                  <input
                    data-demo-id="input-shop-name"
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-[#1A73E8] bg-blue-50/30 text-sm font-bold text-slate-900 focus:outline-none"
                    placeholder="Enter shop name"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    {currentStep.tip?.[language]}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'ta' ? 'தெரு முகவரி (Address)' : language === 'hi' ? 'दुकान का पता' : 'Street Address'}
                  </label>
                  <input
                    type="text"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>

                {/* Guide Prompt Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-xs text-blue-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-[#1A73E8]">
                    <Sparkles className="w-4 h-4" />
                    <span>Guide Tip</span>
                  </div>
                  <p className="leading-snug">{currentStep.instruction[language]}</p>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => navigateTo('SHOP_FORM_CATEGORY')}
                className="w-full py-3.5 rounded-2xl bg-[#1A73E8] hover:bg-blue-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition min-h-[50px] active:scale-98"
              >
                <span>{language === 'ta' ? 'அடுத்தது: வகை தேர்வு' : language === 'hi' ? 'अगला: श्रेणी चुनें' : 'Next: Choose Category'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= SHOP FLOW SCREEN 2: CATEGORY ================= */}
          {screen === 'SHOP_FORM_CATEGORY' && (
            <div className="flex-1 flex flex-col justify-between bg-white p-5 text-slate-800 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ShoppingBag className="w-5 h-5 text-[#1A73E8]" />
                  <h3 className="font-extrabold text-base text-slate-900">
                    {currentStep.title[language]}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-snug">
                  {currentStep.instruction[language]}
                </p>

                {/* Categories Grid */}
                <div data-demo-id="category-options-list" className="grid grid-cols-2 gap-2.5 pt-1">
                  {MAPS_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3 rounded-2xl text-left border-2 transition cursor-pointer flex flex-col justify-between min-h-[64px] ${
                          isSelected
                            ? 'bg-blue-50 border-[#1A73E8] text-[#1A73E8] shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-bold text-xs">
                          {language === 'ta' ? cat.nameTa : language === 'hi' ? cat.nameHi : cat.nameEn}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1A73E8] self-end mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Continue to Pin Selection */}
              <button
                onClick={() => navigateTo('SHOP_PIN_CONFIRM')}
                className="w-full py-3.5 rounded-2xl bg-[#1A73E8] hover:bg-blue-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition min-h-[50px] active:scale-98 mt-3"
              >
                <span>{language === 'ta' ? 'அடுத்தது: மேப்பில் முள் வை' : language === 'hi' ? 'अगला: मैप पर पिन लगाएं' : 'Next: Set Location Pin'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= SHOP FLOW SCREEN 3: MAP PIN CONFIRMATION ================= */}
          {screen === 'SHOP_PIN_CONFIRM' && (
            <div className="flex-1 flex flex-col justify-between bg-[#E5E3DF] relative overflow-hidden">
              {/* Top Prompt Banner */}
              <div className="p-3 z-20 shrink-0">
                <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-200 text-slate-800">
                  <span className="text-[10px] font-bold text-[#1A73E8] uppercase block">
                    {currentStep.title[language]}
                  </span>
                  <p className="text-xs font-semibold leading-snug mt-0.5">
                    {currentStep.instruction[language]}
                  </p>
                </div>
              </div>

              {/* Interactive Draggable/Clickable Map View */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setPinPosition({ x: Math.min(85, Math.max(15, x)), y: Math.min(80, Math.max(25, y)) });
                }}
                className="flex-1 relative cursor-crosshair overflow-hidden"
              >
                {/* SVG Map Layout */}
                <svg className="w-full h-full absolute inset-0 opacity-80 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="40" width="140" height="100" fill="#C5E8C5" rx="8" />
                  <rect x="230" y="180" width="140" height="120" fill="#E8D5B5" rx="8" />
                  <line x1="0" y1="170" x2="390" y2="170" stroke="#FFFFFF" strokeWidth="24" />
                  <line x1="0" y1="170" x2="390" y2="170" stroke="#FEEA8C" strokeWidth="12" />
                  <line x1="190" y1="0" x2="190" y2="600" stroke="#FFFFFF" strokeWidth="20" />
                  <line x1="190" y1="0" x2="190" y2="600" stroke="#FEEA8C" strokeWidth="10" />
                </svg>

                {/* Shop Name Label attached to Pin */}
                <div
                  style={{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-full transition-all duration-150 pointer-events-none flex flex-col items-center z-30"
                >
                  <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg whitespace-nowrap border border-white">
                    {shopName}
                  </div>
                  <MapPin className="w-10 h-10 text-[#EA4335] fill-[#EA4335] drop-shadow-md animate-bounce" />
                  <div className="w-2.5 h-1 bg-black/40 rounded-full blur-[1px]" />
                </div>

                <div className="absolute bottom-3 left-3 bg-white/90 text-slate-600 text-[10px] px-2.5 py-1 rounded-full font-semibold border border-slate-300">
                  Tap anywhere on the map to move the pin
                </div>
              </div>

              {/* Bottom Confirm Pin Button */}
              <div className="p-4 bg-white border-t border-slate-200 z-20 shrink-0">
                <button
                  data-demo-id="btn-confirm-pin"
                  onClick={() => navigateTo('SHOP_EXTRA_DETAILS')}
                  className="w-full py-3.5 rounded-2xl bg-[#1A73E8] hover:bg-blue-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition min-h-[50px] active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'ta' ? 'இடத்தை உறுதிசெய் (Confirm Pin)' : language === 'hi' ? 'स्थान निश्चित करें (Confirm Pin)' : 'Confirm Pin Location'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= SHOP FLOW SCREEN 4: EXTRA DETAILS ================= */}
          {screen === 'SHOP_EXTRA_DETAILS' && (
            <div className="flex-1 flex flex-col justify-between bg-white p-5 text-slate-800 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Phone className="w-5 h-5 text-[#1A73E8]" />
                  <h3 className="font-extrabold text-base text-slate-900">
                    {currentStep.title[language]}
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'ta' ? 'கடை தொலைபேசி எண்' : language === 'hi' ? 'दुकान का फ़ोन नंबर' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Customers call this number to check product availability.
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'ta' ? 'திறக்கும் நேரம் (Hours)' : language === 'hi' ? 'दुकान का समय' : 'Opening Hours'}
                  </label>
                  <input
                    type="text"
                    value={shopHours}
                    onChange={(e) => setShopHours(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                {/* Review Summary Card */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-xs space-y-1.5">
                  <span className="font-extrabold text-slate-800 text-[11px] block uppercase">
                    Ready to submit summary:
                  </span>
                  <div className="text-slate-600 space-y-0.5">
                    <p><strong>Shop:</strong> {shopName}</p>
                    <p><strong>Category:</strong> {selectedCategory}</p>
                    <p><strong>Address:</strong> {shopAddress}</p>
                    <p><strong>Pin:</strong> Confirmed on Market Road</p>
                  </div>
                </div>
              </div>

              {/* Submit to Google Button */}
              <button
                data-demo-id="btn-submit-shop"
                onClick={() => navigateTo('SHOP_SUCCESS')}
                className="w-full py-3.5 rounded-2xl bg-[#1A73E8] hover:bg-blue-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition min-h-[50px] active:scale-98 mt-4"
              >
                <span>{language === 'ta' ? 'கூகுளுக்கு சமர்ப்பிக்கவும் (Submit)' : language === 'hi' ? 'गूगल को सबमिट करें' : 'Submit Shop to Google Maps'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= SHOP FLOW SCREEN 5: SUCCESS & PENDING REVIEW ================= */}
          {screen === 'SHOP_SUCCESS' && (
            <div className="flex-1 flex flex-col justify-between bg-white p-6 text-slate-800 text-center">
              <div className="my-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1A73E8] border-2 border-blue-200 flex items-center justify-center mx-auto shadow-md">
                  <Clock className="w-8 h-8 text-[#1A73E8]" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#1A73E8] tracking-wider">
                    SUBMISSION RECEIVED
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {currentStep.title[language]}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {currentStep.instruction[language]}
                  </p>
                </div>

                {/* Google Review Explanation Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-left text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>How Google Verification Works:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li>Google verifies that the shop really exists to prevent false or spam listings.</li>
                    <li>Approval typically takes <strong>24 to 48 hours</strong>.</li>
                    <li>Once approved, anyone searching your shop name will see your pin and contact info!</li>
                  </ul>
                </div>
              </div>

              {/* Try Home Location Flow or Reset */}
              <div className="space-y-2 pt-2 shrink-0">
                <button
                  onClick={() => {
                    mapsVoiceManager.stop();
                    onComplete?.();
                    onBackToMainMenu?.();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 cursor-pointer transition min-h-[48px] active:scale-95 border border-blue-400/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-200" />
                  <span>
                    {language === 'ta'
                      ? 'பாடத்தை முடித்து பாதைக்கு திரும்பு'
                      : language === 'hi'
                      ? 'पाठ पूरा करें और पाथ पर वापस'
                      : 'Finish Lesson & Return to Path'}
                  </span>
                </button>

                <button
                  onClick={() => navigateTo('HOME_PRIVACY_EXPLANATION', 'HOME')}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition min-h-[48px]"
                >
                  <Home className="w-4 h-4" />
                  <span>Now learn: How to Save Private Home Location</span>
                </button>

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  Restart Simulation
                </button>
              </div>
            </div>
          )}

          {/* ================= HOME FLOW SCREEN 1: PRIVACY EXPLANATION ================= */}
          {screen === 'HOME_PRIVACY_EXPLANATION' && (
            <div className="flex-1 flex flex-col justify-between bg-white p-5 text-slate-800 overflow-y-auto">
              <div className="space-y-4 my-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    SAFETY & PRIVACY CONSTITUTION
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {currentStep.title[language]}
                  </h3>
                  <p className="text-xs text-slate-600 leading-snug">
                    {currentStep.instruction[language]}
                  </p>
                </div>

                {/* Comparison Card: Public Place vs Private Home */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-red-700">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span>WRONG: Adding Home as Public Business</span>
                    </div>
                    <p className="text-[11px] text-red-800 leading-relaxed">
                      If you add your home as a public place, your private house address and photos become visible to strangers on the internet!
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>CORRECT: Save as Private "Home"</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Google Maps has a dedicated <strong>"Saved Home"</strong> feature. It is 100% private and visible ONLY to you when logged in!
                    </p>
                  </div>
                </div>
              </div>

              {/* Proceed to Private Home Setup */}
              <button
                data-demo-id="btn-proceed-private-home"
                onClick={() => navigateTo('HOME_SAVED_MENU')}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition min-h-[50px] active:scale-98 shrink-0"
              >
                <span>Proceed: Set Private Home Address</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= HOME FLOW SCREEN 2: SAVED HOME MENU ================= */}
          {screen === 'HOME_SAVED_MENU' && (
            <div className="flex-1 flex flex-col justify-between bg-white p-5 text-slate-800">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Bookmark className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-base text-slate-900">
                    Google Maps "Saved" Tab
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-snug">
                  {currentStep.instruction[language]}
                </p>

                {/* Simulated Labeled Places List */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Your Labeled Places (Private)
                  </span>

                  {/* Set Home Option */}
                  <button
                    data-demo-id="btn-set-home-address"
                    onClick={() => navigateTo('HOME_SET_PIN')}
                    className="w-full p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-between text-left cursor-pointer group active:scale-98 transition shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-emerald-900">Home</h4>
                        <span className="text-[11px] text-emerald-700">Tap to set your private address</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                  </button>

                  {/* Work (Disabled preview) */}
                  <div className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 opacity-60">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-700">Work</h4>
                      <span className="text-[11px] text-slate-400">Set work address</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next step button */}
              <button
                onClick={() => navigateTo('HOME_SET_PIN')}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition min-h-[50px] active:scale-98 shrink-0"
              >
                <span>Continue to Set Home Pin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= HOME FLOW SCREEN 3: CONFIRM HOME PIN ================= */}
          {screen === 'HOME_SET_PIN' && (
            <div className="flex-1 flex flex-col justify-between bg-[#E5E3DF] relative overflow-hidden">
              {/* Top Prompt Banner */}
              <div className="p-3 z-20 shrink-0">
                <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-200 text-slate-800">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                    {currentStep.title[language]}
                  </span>
                  <p className="text-xs font-semibold leading-snug mt-0.5">
                    {currentStep.instruction[language]}
                  </p>
                </div>
              </div>

              {/* Simulated Map Canvas with Private House Pin */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setPinPosition({ x: Math.min(85, Math.max(15, x)), y: Math.min(80, Math.max(25, y)) });
                }}
                className="flex-1 relative cursor-crosshair overflow-hidden"
              >
                {/* SVG Map Layout */}
                <svg className="w-full h-full absolute inset-0 opacity-80 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="30" y="50" width="130" height="90" fill="#C5E8C5" rx="8" />
                  <rect x="220" y="200" width="130" height="110" fill="#C5E8C5" rx="8" />
                  <line x1="0" y1="180" x2="390" y2="180" stroke="#FFFFFF" strokeWidth="22" />
                  <line x1="0" y1="180" x2="390" y2="180" stroke="#FEEA8C" strokeWidth="10" />
                  <line x1="180" y1="0" x2="180" y2="600" stroke="#FFFFFF" strokeWidth="20" />
                </svg>

                {/* Private Home Pin (Green House Symbol) */}
                <div
                  style={{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-full transition-all duration-150 pointer-events-none flex flex-col items-center z-30"
                >
                  <div className="bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap border border-white flex items-center gap-1">
                    <Home className="w-3 h-3 text-emerald-200" />
                    <span>My Private Home</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce mt-0.5">
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="w-2.5 h-1 bg-black/40 rounded-full blur-[1px]" />
                </div>
              </div>

              {/* Bottom Confirm Private Home Button */}
              <div className="p-4 bg-white border-t border-slate-200 z-20 shrink-0">
                <button
                  data-demo-id="btn-save-private-home"
                  onClick={() => navigateTo('HOME_SUCCESS')}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition min-h-[50px] active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Private Home Address</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= HOME FLOW SCREEN 4: SUCCESS ================= */}
          {screen === 'HOME_SUCCESS' && (
            <div className="flex-1 flex flex-col justify-between bg-white p-6 text-slate-800 text-center">
              <div className="my-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">
                    HOME ADDRESS SECURE
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {currentStep.title[language]}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {currentStep.instruction[language]}
                  </p>
                </div>

                {/* Highlights Card */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 text-left text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Privacy Assured:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-emerald-900 text-[11px]">
                    <li>This location is strictly private to your Google account.</li>
                    <li>No public review or waiting period is needed.</li>
                    <li>You can now get directions home with a single tap in Google Maps.</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 shrink-0">
                <button
                  onClick={() => {
                    mapsVoiceManager.stop();
                    onComplete?.();
                    onBackToMainMenu?.();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer transition min-h-[48px] active:scale-95 border border-emerald-400/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>
                    {language === 'ta'
                      ? 'பாடத்தை முடித்து பாதைக்கு திரும்பு'
                      : language === 'hi'
                      ? 'पाठ पूरा करें और पाथ पर वापस'
                      : 'Finish Lesson & Return to Path'}
                  </span>
                </button>

                <button
                  onClick={() => navigateTo('SHOP_FORM_NAME', 'SHOP')}
                  className="w-full py-3.5 rounded-2xl bg-[#1A73E8] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition min-h-[48px]"
                >
                  <Store className="w-4 h-4" />
                  <span>Now learn: How to Add a Public Shop</span>
                </button>

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  Restart Simulation
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. BOTTOM CONTROL BAR: LARGE BUTTONS (START, NEXT, BACK, REPLAY, TRY AGAIN) */}
      <footer className="w-full max-w-4xl mx-auto mt-3 bg-slate-900/95 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-3">
        {/* Left cluster: Start, Back, Next */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Large START Button */}
          <button
            onClick={handleReset}
            className={`px-4 sm:px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer min-h-[48px] shadow-md border active:scale-95 ${
              screen === 'PHONE_HOME'
                ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/40'
                : 'bg-slate-800 hover:bg-slate-700 text-blue-300 border-slate-700'
            }`}
            title="Start from beginning"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Start</span>
          </button>

          {/* 2. Large BACK Button */}
          <button
            onClick={handleBack}
            disabled={screen === 'PHONE_HOME'}
            className={`px-4 sm:px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer min-h-[48px] border active:scale-95 ${
              screen === 'PHONE_HOME'
                ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500 border-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 shadow-md'
            }`}
            title="Go back to previous step"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* 3. Large NEXT Button */}
          <button
            onClick={handleNext}
            disabled={screen === 'SHOP_SUCCESS' || screen === 'HOME_SUCCESS'}
            className={`px-5 sm:px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer min-h-[48px] shadow-lg active:scale-95 ${
              screen === 'SHOP_SUCCESS' || screen === 'HOME_SUCCESS'
                ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500 border border-slate-700'
                : 'bg-[#1A73E8] hover:bg-blue-600 text-white border border-blue-400/50 ring-2 ring-blue-500/20'
            }`}
            title="Advance to next step"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right cluster: Replay & Try Again */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 4. Large REPLAY Button */}
          <button
            onClick={handleReplayVoice}
            className="px-4 sm:px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer min-h-[48px] bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 active:scale-95 shadow-md"
            title="Replay Voice Guidance & Instructions"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Replay</span>
          </button>

          {/* 5. Large TRY AGAIN Button */}
          <button
            onClick={handleReset}
            className="px-4 sm:px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer min-h-[48px] bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 active:scale-95 shadow-md"
            title="Reset simulation to beginning"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Try Again</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

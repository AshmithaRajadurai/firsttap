import React, { useState } from 'react';
import { FirstTapWhatsApp } from './FirstTapWhatsApp';
import { WhatsAppTutorialScreen } from './WhatsAppTutorialScreen';
import { LanguageCode } from './types';
import { Globe, Smartphone, Volume2, Sparkles, MessageSquare } from 'lucide-react';

/**
 * Ready-to-run wrapper showcasing both the FirstTap Message interactive module
 * (with DemoRunner, Practice spotlight test, Simulated Keyboard & Celebration card)
 * and the alternative 5-lesson WhatsApp tutorial screen.
 */
export const StandaloneWhatsAppApp: React.FC = () => {
  const [language, setLanguage] = useState<LanguageCode>('ta');
  const [viewMode, setViewMode] = useState<'firsttap_message' | 'whatsapp_tutorial'>('firsttap_message');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-2 sm:p-4 font-sans">
      {/* Outer Header & Controls */}
      <header className="w-full max-w-md mb-2 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">WhatsApp Learning Module</h1>
            <p className="text-[11px] text-emerald-400">Standalone Interactive Simulator</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 p-1 rounded-xl">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1" />
          {(['en', 'ta', 'hi'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === lang
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'en' ? 'EN' : lang === 'ta' ? 'தமிழ்' : 'हिंदी'}
            </button>
          ))}
        </div>
      </header>

      {/* Mode Switcher Tabs */}
      <div className="w-full max-w-md mb-2 flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs">
        <button
          onClick={() => setViewMode('firsttap_message')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            viewMode === 'firsttap_message'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>FirstTap Message (W0–W7)</span>
        </button>

        <button
          onClick={() => setViewMode('whatsapp_tutorial')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            viewMode === 'whatsapp_tutorial'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Interactive Tutorial</span>
        </button>
      </div>

      {/* Mobile Device Mockup Frame */}
      <main className="w-full max-w-md h-[88vh] max-h-[860px] bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 flex flex-col relative">
        {viewMode === 'firsttap_message' ? (
          <FirstTapWhatsApp
            language={language}
            onLogAttempt={(attempt) => {
              console.log('[FirstTapWhatsApp Attempt]', attempt);
            }}
            onFinishModule={() => {
              alert('Module finished! Great job!');
            }}
            onExit={() => {
              console.log('[FirstTapWhatsApp] Exit requested');
            }}
          />
        ) : (
          <WhatsAppTutorialScreen
            onBackToMainMenu={() => {
              console.log('[WhatsAppTutorialScreen] Back to main menu');
            }}
          />
        )}
      </main>
    </div>
  );
};

export default StandaloneWhatsAppApp;

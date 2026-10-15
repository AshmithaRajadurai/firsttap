'use client';

import React from 'react';
import { SupportedLanguage } from '@/types';
import { Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/lib/lessons/catalog';
import { UI_TRANSLATIONS } from '@/lib/i18n/translations';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isApiMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  isApiMode,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];

  return (
    <header className="w-full max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-2">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
          <Sparkles className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
            {t.appTitle}
          </h1>
          <span className="text-[10px] text-slate-500 font-medium block -mt-1">
            {t.appSubtitle}
          </span>
        </div>
      </div>

      {/* Language Switcher & Mode Badge */}
      <div className="flex items-center space-x-2">
        {/* Language Pills (accessible fallback) */}
        <div className="flex items-center bg-white/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <Globe className="w-3.5 h-3.5 text-slate-400 mx-1.5 shrink-0" />
          {(Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]).map((langKey) => (
            <button
              key={langKey}
              onClick={() => onLanguageChange(langKey)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentLanguage === langKey
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {SUPPORTED_LANGUAGES[langKey].nativeName}
            </button>
          ))}
        </div>

        {/* Live / Demo indicator */}
        <div
          className={`hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold border ${
            isApiMode
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300'
          }`}
          title={
            isApiMode
              ? 'Active: Sarvam AI Indian-language speech synthesis'
              : 'Demo Mode: Browser Web Speech API fallback active'
          }
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isApiMode ? t.liveModeBadge : t.demoModeBadge}</span>
        </div>
      </div>
    </header>
  );
};

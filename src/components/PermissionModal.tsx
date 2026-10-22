'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, ShieldCheck, Sparkles } from 'lucide-react';

interface PermissionModalProps {
  onStart: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-amber-200 text-center space-y-5"
      >
        {/* Animated Icon Avatar */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Sparkles className="w-10 h-10 text-white fill-current animate-pulse" />
        </div>

        {/* Multilingual Welcome Heading */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">
            FirstTap-க்கு நல்வரவு!
          </h2>
          <p className="text-sm font-semibold text-amber-600">
            Welcome to FirstTap • आपका स्वागत है
          </p>
        </div>

        {/* Clear Accessible Permission Explanation */}
        <div className="bg-amber-50 rounded-2xl p-4 text-left space-y-3 border border-amber-200/80">
          <div className="flex items-start space-x-3">
            <Mic className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              <strong>குரல் வழி பயன்பாடு:</strong> நீங்கள் எதையும் தட்டாமல் பேசிக் கற்க மைக்ரோஃபோன் அனுமதி தேவைப்படுகிறது.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <Volume2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              <strong>Voice-First Learning:</strong> FirstTap will speak and listen to guide you naturally.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500">
              உங்கள் குரல் பாதுகாப்பானது. அனுமதியின்றி எந்த பதிவும் எடுக்கப்படாது.
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-lg shadow-xl shadow-orange-500/30 flex items-center justify-center space-x-3 transition-all cursor-pointer"
        >
          <Mic className="w-6 h-6" />
          <span>தொடங்குங்கள் (Start FirstTap)</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

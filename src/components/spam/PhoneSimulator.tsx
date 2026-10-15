import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Phone as PhoneIcon, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  Wifi,
  Battery,
  Signal,
  AlertTriangle,
  MessageSquare,
  Camera,
  Users,
  Info
} from 'lucide-react';

interface PhoneSimulatorProps {
  mode: 'home' | 'messages';
  sender: string;
  smsBody: string;
  smsLink?: string;
  timestamp?: string;
  isPracticeMode?: boolean;
  onOpenMessages?: () => void;
  onTapLinkAttempt?: () => void;
  onBlockCompleted?: () => void;
  pointerTarget?: 'notification' | 'messages_icon' | 'link' | 'menu' | null;
  isBlocked?: boolean;
  onUnblock?: () => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  mode,
  sender,
  smsBody,
  smsLink,
  timestamp = '10:45 AM · via Jio 4G',
  isPracticeMode = false,
  onOpenMessages,
  onTapLinkAttempt,
  onBlockCompleted,
  pointerTarget = null,
  isBlocked = false,
  onUnblock,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [reportCheckbox, setReportCheckbox] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmBlock = () => {
    setShowBlockDialog(false);
    triggerToast('Sender blocked and reported');
    if (onBlockCompleted) onBlockCompleted();
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[360px] lg:max-w-[380px] select-none font-sans">
      {/* Smartphone Chassis Exterior */}
      <div className="relative bg-slate-900 p-3 sm:p-3.5 lg:p-4 rounded-[42px] lg:rounded-[46px] shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-900/50">
        
        {/* Smartphone Screen Canvas */}
        <div className="relative bg-slate-100 rounded-[32px] lg:rounded-[34px] overflow-hidden flex flex-col h-[520px] sm:h-[560px] lg:h-[600px] shadow-inner text-slate-800">
          
          {/* Android Status Bar */}
          <div className="bg-slate-900 text-white px-5 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-medium tracking-tight z-20">
            <span>10:45 AM</span>
            
            {/* Center Front Camera Hole */}
            <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-slate-800 flex items-center justify-center">
              <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-300">Jio 4G</span>
              <Signal className="w-3 h-3 text-slate-200" />
              <Wifi className="w-3 h-3 text-slate-200" />
              <Battery className="w-3.5 h-3.5 text-slate-200" />
            </div>
          </div>

          {/* VIEW 1: SIMULATED ANDROID HOME SCREEN */}
          {mode === 'home' && (
            <div className="relative flex-1 bg-gradient-to-b from-teal-900 via-slate-800 to-slate-950 p-4 flex flex-col justify-between text-white overflow-hidden">
              
              {/* Background ambient decorative shapes */}
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>

              {/* Notification Banner Dropdown at Top */}
              <div 
                onClick={onOpenMessages}
                className="relative z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-2xl cursor-pointer hover:bg-slate-800 transition-all animate-bounce"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">Messages · VM-WINBIG</span>
                      <span className="text-[10px] text-slate-400">now</span>
                    </div>
                    <p className="text-[11px] text-slate-200 line-clamp-1 leading-tight mt-0.5">
                      Congratulations! You have won ₹1 crore. Click this link...
                    </p>
                  </div>
                </div>

                <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-teal-400 font-medium">
                  <span>Tap notification to view SMS</span>
                  <span>👆</span>
                </div>

                {pointerTarget === 'notification' && (
                  <div className="absolute -bottom-4 right-6 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                    Tap here 👆
                  </div>
                )}
              </div>

              {/* Home Screen Clock & Date Widget */}
              <div className="my-auto text-center py-6">
                <div className="text-4xl sm:text-5xl font-extralight tracking-tight font-sans text-white/95">
                  10:45
                </div>
                <div className="text-xs font-medium text-slate-300 mt-1">
                  Wednesday, 14 October
                </div>
                <div className="inline-block mt-3 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[11px] text-teal-200 border border-white/10">
                  Tap Messages icon below to open
                </div>
              </div>

              {/* App Dock at Bottom */}
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-3 border border-white/10">
                <div className="grid grid-cols-4 gap-2 text-center">
                  
                  {/* Phone Dialer */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                      <PhoneIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-slate-300">Phone</span>
                  </div>

                  {/* Messages App Icon with Unread Badge */}
                  <div 
                    onClick={onOpenMessages}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="relative w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform ring-2 ring-white">
                      <MessageSquare className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                        1
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-white group-hover:text-teal-300">
                      Messages
                    </span>

                    {pointerTarget === 'messages_icon' && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-bounce whitespace-nowrap">
                        Tap Messages 👆
                      </div>
                    )}
                  </div>

                  {/* Contacts */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-slate-300">Contacts</span>
                  </div>

                  {/* Camera */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center text-white shadow-md">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-slate-300">Camera</span>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: SIMULATED ANDROID NORMAL MESSAGES APP */}
          {mode === 'messages' && (
            <div className="relative flex-1 flex flex-col bg-[#EEF2F6]">
              
              {/* App Top Header */}
              <div className="bg-white border-b border-slate-200 px-3 py-2.5 flex items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={onOpenMessages}
                    className="p-1 rounded-full text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="Back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs">
                    {sender.substring(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[130px]">
                        {sender}
                      </span>
                      {isBlocked && (
                        <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-semibold">
                          Blocked
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">Normal SMS · Not in contacts</p>
                  </div>
                </div>

                {/* 3-Dot Options Menu */}
                <div className="relative flex items-center">
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={`p-1.5 rounded-full text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ${
                      pointerTarget === 'menu' ? 'ring-4 ring-amber-400 bg-amber-50 animate-pulse' : ''
                    }`}
                    title="Options menu"
                    aria-label="Options menu"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {menuOpen && (
                    <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-40 text-xs">
                      <button 
                        onClick={() => { setMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Details
                      </button>
                      <button 
                        onClick={() => { setMenuOpen(false); setShowBlockDialog(true); }}
                        className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        <span>Block & report spam</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                
                {/* Standard SMS carrier indicator */}
                <div className="text-center my-1">
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200">
                    <Lock className="w-2.5 h-2.5 text-slate-400" />
                    <span>Standard carrier SMS text</span>
                  </span>
                </div>

                {/* Timestamp */}
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {timestamp}
                  </span>
                </div>

                {/* SMS Bubble */}
                <div className="flex flex-col items-start max-w-[94%]">
                  <div className={`relative bg-white rounded-2xl rounded-tl-sm p-3.5 shadow-sm border leading-relaxed text-xs sm:text-sm ${
                    isBlocked ? 'opacity-60 grayscale border-slate-300' : 'border-slate-200 text-slate-800'
                  }`}>
                    
                    {/* Header inside SMS */}
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>From: {sender}</span>
                      <span className="text-slate-400">Normal SMS</span>
                    </div>

                    {/* Message Body */}
                    <p className="text-slate-900 font-normal whitespace-pre-line">
                      {smsBody}
                    </p>

                    {/* Suspicious Link Container */}
                    {smsLink && (
                      <div 
                        onClick={() => {
                          if (isPracticeMode && onTapLinkAttempt) {
                            onTapLinkAttempt();
                          }
                        }}
                        className={`mt-2.5 p-2 rounded-xl transition-all ${
                          isPracticeMode 
                            ? 'cursor-pointer hover:bg-rose-50 bg-slate-50 border border-slate-300 text-blue-600'
                            : 'bg-rose-50 border-2 border-rose-300 text-rose-950'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-mono text-[11px] break-all underline">
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span>{smsLink}</span>
                        </div>
                        <div className="mt-1 text-[9px] text-rose-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{isPracticeMode ? '⚠️ Tap to test danger' : 'Do not touch or click this link'}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-2 text-[9px] text-slate-400 text-right">
                      10:45 AM · Delivered
                    </div>
                  </div>

                  {/* Toast inside Phone */}
                  {toastMessage && (
                    <div className="mt-2 w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg flex items-center justify-center gap-1.5 animate-fadeIn">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{toastMessage}</span>
                    </div>
                  )}

                  {/* Blocked Status Banner */}
                  {isBlocked && (
                    <div className="mt-2.5 w-full bg-rose-50 border border-rose-200 rounded-xl p-3 text-center text-xs text-rose-800">
                      <ShieldAlert className="w-4 h-4 text-rose-600 mx-auto mb-1" />
                      <p className="font-bold">Sender is Blocked</p>
                      <p className="text-[11px] text-rose-600 mb-1">Calls and messages from this number are blocked.</p>
                      {onUnblock && (
                        <button 
                          onClick={onUnblock}
                          className="text-[10px] bg-white border border-rose-300 px-2.5 py-0.5 rounded text-rose-700 font-medium cursor-pointer"
                        >
                          Unblock
                        </button>
                      )}
                    </div>
                  )}

                </div>

              </div>

              {/* SMS Composer Bottom Bar */}
              <div className="bg-white border-t border-slate-200 p-2.5 flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded-full px-3 py-2 text-xs text-slate-400 flex items-center justify-between">
                  <span>Text message (SMS)</span>
                  <span className="text-[10px] text-slate-400 font-mono">SIM 1</span>
                </div>
                <button 
                  disabled 
                  className="w-8 h-8 rounded-full bg-slate-300 text-white flex items-center justify-center cursor-not-allowed"
                  title="Do not reply to spam messages"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Simulated Block Dialog */}
              {showBlockDialog && (
                <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-[280px] w-full text-left">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      Block "{sender}"?
                    </h4>
                    <p className="text-xs text-slate-600 mb-3">
                      You will no longer receive calls or messages from this sender.
                    </p>

                    <label className="flex items-center gap-2 text-xs text-slate-700 mb-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reportCheckbox}
                        onChange={(e) => setReportCheckbox(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span>Report message as spam</span>
                    </label>

                    <div className="flex items-center justify-end gap-2 text-xs font-semibold">
                      <button
                        onClick={() => setShowBlockDialog(false)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmBlock}
                        className="px-3.5 py-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer"
                      >
                        Block
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Android Home Navigation Indicator Bar */}
          <div className="bg-white py-1 flex justify-center items-center z-10 border-t border-slate-100">
            <div className="w-24 h-1 bg-slate-400 rounded-full"></div>
          </div>

        </div>
      </div>

      {/* Simulated Device Caption */}
      <div className="text-center mt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1">
        <Info className="w-3 h-3 text-slate-400" />
        <span>Simulated Android Phone (Normal SMS Messages app)</span>
      </div>
    </div>
  );
};

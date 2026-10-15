import React from 'react';
import { Delete, CornerDownLeft, Space } from 'lucide-react';

interface SimulatedKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onEnter?: () => void;
  mode?: 'alpha' | 'numeric';
  spotlightKey?: string; // e.g. 'key-a', 'key-space', 'key-comma', 'key-question'
}

export const SimulatedKeyboard: React.FC<SimulatedKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onEnter,
  mode = 'alpha',
  spotlightKey,
}) => {
  const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
  const numRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  const isHighlighted = (id: string) => spotlightKey === id;

  return (
    <div className="bg-slate-200/95 border-t border-slate-300 p-1.5 select-none animate-in slide-in-from-bottom-2 duration-200">
      {/* Numbers row (key-0..key-9) */}
      <div className="flex justify-center gap-1 mb-1">
        {numRow.map((num) => {
          const keyId = `key-${num}`;
          return (
            <button
              key={num}
              data-demo-id={keyId}
              onClick={() => onKeyPress(num)}
              className={`flex-1 min-h-[48px] max-w-[42px] rounded-lg shadow-xs text-sm font-bold transition cursor-pointer flex items-center justify-center border border-slate-300/80 active:scale-95 ${
                isHighlighted(keyId)
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-500 animate-pulse font-extrabold scale-105 z-10'
                  : 'bg-white text-slate-800 hover:bg-slate-100 active:bg-teal-100'
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      {mode === 'alpha' && (
        <>
          {/* Letters Row 1 (key-q..key-p) */}
          <div className="flex justify-center gap-1 mb-1">
            {row1.map((char) => {
              const keyId = `key-${char}`;
              return (
                <button
                  key={char}
                  data-demo-id={keyId}
                  onClick={() => onKeyPress(char)}
                  className={`flex-1 min-h-[48px] max-w-[42px] rounded-lg shadow-xs text-sm font-bold uppercase transition cursor-pointer flex items-center justify-center border border-slate-300/80 active:scale-95 ${
                    isHighlighted(keyId)
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-500 animate-pulse font-extrabold scale-105 z-10'
                      : 'bg-white text-slate-800 hover:bg-slate-100 active:bg-teal-100'
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>

          {/* Letters Row 2 (key-a..key-l) */}
          <div className="flex justify-center gap-1 mb-1 px-3">
            {row2.map((char) => {
              const keyId = `key-${char}`;
              return (
                <button
                  key={char}
                  data-demo-id={keyId}
                  onClick={() => onKeyPress(char)}
                  className={`flex-1 min-h-[48px] max-w-[42px] rounded-lg shadow-xs text-sm font-bold uppercase transition cursor-pointer flex items-center justify-center border border-slate-300/80 active:scale-95 ${
                    isHighlighted(keyId)
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-500 animate-pulse font-extrabold scale-105 z-10'
                      : 'bg-white text-slate-800 hover:bg-slate-100 active:bg-teal-100'
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>

          {/* Letters Row 3 with Comma, Question & Backspace (key-z..key-m, key-comma, key-question, key-back) */}
          <div className="flex justify-center gap-1 mb-1">
            {row3.map((char) => {
              const keyId = `key-${char}`;
              return (
                <button
                  key={char}
                  data-demo-id={keyId}
                  onClick={() => onKeyPress(char)}
                  className={`flex-1 min-h-[48px] max-w-[42px] rounded-lg shadow-xs text-sm font-bold uppercase transition cursor-pointer flex items-center justify-center border border-slate-300/80 active:scale-95 ${
                    isHighlighted(keyId)
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-500 animate-pulse font-extrabold scale-105 z-10'
                      : 'bg-white text-slate-800 hover:bg-slate-100 active:bg-teal-100'
                  }`}
                >
                  {char}
                </button>
              );
            })}

            {/* Comma: data-demo-id="key-comma" */}
            <button
              data-demo-id="key-comma"
              onClick={() => onKeyPress(',')}
              className={`w-9 min-h-[48px] rounded-lg shadow-xs text-sm font-bold transition cursor-pointer flex items-center justify-center border border-slate-300/80 active:scale-95 ${
                isHighlighted('key-comma')
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-500 animate-pulse font-extrabold scale-105 z-10'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              ,
            </button>

            {/* Question Mark: data-demo-id="key-question" */}
            <button
              data-demo-id="key-question"
              onClick={() => onKeyPress('?')}
              className={`w-9 min-h-[48px] rounded-lg shadow-xs text-sm font-bold transition cursor-pointer flex items-center justify-center border border-slate-300/80 active:scale-95 ${
                isHighlighted('key-question')
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-500 animate-pulse font-extrabold scale-105 z-10'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              ?
            </button>

            {/* Backspace: data-demo-id="key-back" */}
            <button
              data-demo-id="key-back"
              onClick={onBackspace}
              className={`w-12 min-h-[48px] rounded-lg shadow-xs transition cursor-pointer flex items-center justify-center border border-slate-400/80 active:scale-95 ${
                isHighlighted('key-back')
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-500 animate-pulse font-extrabold scale-105 z-10'
                  : 'bg-slate-300/90 text-slate-800 hover:bg-slate-400'
              }`}
              title="Backspace"
            >
              <Delete className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </>
      )}

      {/* Space & Action Row with 56px accessible height */}
      <div className="flex justify-center gap-1.5 mt-1">
        {/* Space: data-demo-id="key-space" */}
        <button
          data-demo-id="key-space"
          onClick={() => onKeyPress(' ')}
          className={`flex-1 min-h-[54px] rounded-xl shadow-xs text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-300/80 active:scale-98 ${
            isHighlighted('key-space')
              ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-500 animate-pulse font-extrabold scale-102 z-10'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Space className="w-4 h-4 text-slate-400" />
          <span>Space (இடைவெளி)</span>
        </button>

        {onEnter && (
          <button
            onClick={onEnter}
            className="w-20 min-h-[54px] bg-[#0D5C63] text-white rounded-xl shadow-xs text-xs font-bold hover:bg-[#09454A] active:scale-95 transition cursor-pointer flex items-center justify-center gap-1 border border-teal-600"
          >
            <span>Done</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

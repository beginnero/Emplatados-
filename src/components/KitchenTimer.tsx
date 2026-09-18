import { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Bell } from 'lucide-react';

export default function KitchenTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timerName, setTimerName] = useState('Pase');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      // Play web audio chime if supported
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880;
        osc.start();
        setTimeout(() => {
          osc.stop();
          audioCtx.close();
        }, 1000);
      } catch {
        // audio context not allowed without interaction
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const startPreset = (minutes: number, label: string) => {
    setSecondsLeft(minutes * 60);
    setTimerName(label);
    setIsActive(true);
    setIsOpen(true);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border border-stone-700 w-72 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Timer className="w-4 h-4" />
              <span>Cronómetro de Cocina</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 text-center">
            <div className="text-xs text-stone-400 mb-1">{timerName}</div>
            <div className={`text-4xl font-black font-mono tracking-wider ${secondsLeft === 0 && isActive === false ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
              {formatTime(secondsLeft)}
            </div>
            {secondsLeft === 0 && (
              <div className="text-xs font-bold text-red-400 flex items-center justify-center gap-1 mt-1">
                <Bell className="w-3.5 h-3.5" /> ¡Tiempo cumplido!
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <button
              onClick={() => setIsActive(!isActive)}
              disabled={secondsLeft === 0}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isActive
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40'
              }`}
            >
              {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isActive ? 'Pausar' : 'Iniciar'}</span>
            </button>
            <button
              onClick={() => {
                setIsActive(false);
                setSecondsLeft(0);
              }}
              className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-4 gap-1 text-[11px] font-bold">
            <button
              onClick={() => startPreset(3, 'Sellar / 3 min')}
              className="py-1 bg-stone-800 hover:bg-stone-700 rounded text-stone-200"
            >
              3 min
            </button>
            <button
              onClick={() => startPreset(6, 'Pase rápido / 6 min')}
              className="py-1 bg-stone-800 hover:bg-stone-700 rounded text-stone-200"
            >
              6 min
            </button>
            <button
              onClick={() => startPreset(8, 'Horno / 8 min')}
              className="py-1 bg-stone-800 hover:bg-stone-700 rounded text-stone-200"
            >
              8 min
            </button>
            <button
              onClick={() => startPreset(12, 'Risotto / 12 min')}
              className="py-1 bg-stone-800 hover:bg-stone-700 rounded text-stone-200"
            >
              12 min
            </button>
          </div>
        </div>
      ) : (
        <button
          id="btn-open-kitchen-timer"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-lg border text-xs font-bold transition-transform hover:scale-105 ${
            isActive && secondsLeft > 0
              ? 'bg-amber-500 text-stone-950 border-amber-400 font-mono animate-pulse'
              : 'bg-stone-900 text-white border-stone-700 hover:bg-stone-800'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>{isActive && secondsLeft > 0 ? formatTime(secondsLeft) : 'Cronómetro'}</span>
        </button>
      )}
    </div>
  );
}

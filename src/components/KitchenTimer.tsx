import { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Bell } from 'lucide-react';

export default function KitchenTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timerName, setTimerName] = useState('Pase');
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setHasFinished(true);
      try {
        const audioCtx = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880;
        osc.start();
        setTimeout(() => {
          osc.stop();
          audioCtx.close();
        }, 900);
      } catch {
        // Ignore if audio context is blocked
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const startPreset = (minutes: number, label: string) => {
    setSecondsLeft(minutes * 60);
    setTimerName(label);
    setHasFinished(false);
    setIsActive(true);
    setIsOpen(true);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-30 pb-safe">
      {isOpen ? (
        <div className="w-72 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#242422] p-4 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-2.5 border-b border-black/8 dark:border-white/8">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1a1a18] dark:text-[#f0efe8]">
              <Timer className="w-4 h-4 text-[#2a8549] dark:text-[#4cc376]" />
              <span>Cronómetro</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar cronómetro"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7a7a74] dark:text-[#8a8a82] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 text-center">
            <div className="text-xs text-[#6c6c66] dark:text-[#9a9991] mb-1">{timerName}</div>
            <div
              className={`text-4xl font-semibold font-mono-code tabular-nums tracking-tight ${
                hasFinished
                  ? 'text-[#b91c1c] dark:text-red-400'
                  : isActive
                  ? 'text-[#2a8549] dark:text-[#4cc376]'
                  : 'text-[#1a1a18] dark:text-[#f0efe8]'
              }`}
            >
              {formatTime(secondsLeft)}
            </div>
            {hasFinished && (
              <div className="text-xs font-medium text-[#b91c1c] dark:text-red-400 flex items-center justify-center gap-1 mt-1.5">
                <Bell className="w-3.5 h-3.5" /> Tiempo cumplido
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => {
                setHasFinished(false);
                setIsActive(!isActive);
              }}
              disabled={secondsLeft === 0}
              className={`min-h-[40px] flex-1 rounded-xl px-3 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${
                isActive
                  ? 'border border-black/12 dark:border-white/12 bg-[#f5f4f0] dark:bg-[#2a2a27] text-[#1a1a18] dark:text-[#f0efe8]'
                  : 'bg-[#1a1a18] dark:bg-[#f0efe8] text-white dark:text-[#1a1a18]'
              }`}
            >
              {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isActive ? 'Pausar' : 'Iniciar'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsActive(false);
                setHasFinished(false);
                setSecondsLeft(0);
              }}
              className="min-h-[40px] px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 text-[#6c6c66] dark:text-[#9a9991] hover:bg-black/5 dark:hover:bg-white/5 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cero</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-xs font-medium tabular-nums">
            {[
              { mins: 3, label: '3 min' },
              { mins: 6, label: '6 min' },
              { mins: 8, label: '8 min' },
              { mins: 12, label: '12 min' },
            ].map((preset) => (
              <button
                key={preset.mins}
                type="button"
                onClick={() => startPreset(preset.mins, preset.label)}
                className="min-h-[36px] rounded-lg border border-black/8 dark:border-white/8 bg-[#f5f4f0] dark:bg-[#1e1e1c] text-[#1a1a18] dark:text-[#f0efe8] hover:border-black/20 dark:hover:border-white/20 transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          id="btn-open-kitchen-timer"
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir cronómetro"
          className={`flex min-h-[44px] items-center gap-2 px-3.5 py-2 rounded-full border shadow-sm text-xs font-medium transition-colors cursor-pointer ${
            isActive && secondsLeft > 0
              ? 'bg-[#2a8549] dark:bg-[#4cc376] text-white dark:text-[#141413] border-transparent font-mono-code tabular-nums'
              : hasFinished
              ? 'bg-[#b91c1c] text-white border-transparent'
              : 'bg-white/95 dark:bg-[#1e1e1c]/95 text-[#1a1a18] dark:text-[#f0efe8] border-black/12 dark:border-white/12 hover:border-black/25 dark:hover:border-white/25 backdrop-blur-md'
          }`}
        >
          <Timer className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">
            {isActive && secondsLeft > 0
              ? formatTime(secondsLeft)
              : hasFinished
              ? '00:00'
              : 'Timer'}
          </span>
        </button>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';

export type TimerMode = 'countdown' | 'stopwatch';

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>('countdown');
  const [time, setTime] = useState(3600); // Current time in seconds, default 1 hour
  const [initialTime, setInitialTime] = useState(3600); // For resetting
  const [isActive, setIsActive] = useState(false);

  const setTimer = useCallback((seconds: number) => {
    setTime(seconds);
    setInitialTime(seconds);
    setIsActive(false);
  }, []);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTime(newMode === 'countdown' ? 3600 : 0);
    setInitialTime(newMode === 'countdown' ? 3600 : 0);
    setIsActive(false);
  }, []);

  const toggleTimer = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setTime(initialTime);
    setIsActive(false);
  }, [initialTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (mode === 'countdown') {
            if (prev <= 1) {
              setIsActive(false);
              playBeep();
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, mode]);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 1.0);
    } catch (e) {
      console.log('Audio synthesize failed:', e);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return {
    mode,
    time,
    isActive,
    formatTime,
    setTimer,
    switchMode,
    toggleTimer,
    resetTimer,
  };
}

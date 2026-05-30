import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerMode = 'countdown' | 'stopwatch';

export type TimerHistory = {
  id: string;
  title: string;
  note: string;
  mode: TimerMode;
  duration: number; // in seconds
  date: string;
};

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>('countdown');
  const [time, setTime] = useState(0); // Current time in seconds, default 0
  const [initialTime, setInitialTime] = useState(0); // For resetting
  const [isActive, setIsActive] = useState(false);

  // Task details
  const [taskTitle, setTaskTitle] = useState('');
  const [taskNote, setTaskNote] = useState('');
  
  // History
  const [history, setHistory] = useState<TimerHistory[]>([]);

  // Refs for interval closures
  const titleRef = useRef(taskTitle);
  const noteRef = useRef(taskNote);
  const initialTimeRef = useRef(initialTime);

  useEffect(() => { titleRef.current = taskTitle; }, [taskTitle]);
  useEffect(() => { noteRef.current = taskNote; }, [taskNote]);
  useEffect(() => { initialTimeRef.current = initialTime; }, [initialTime]);

  useEffect(() => {
    const saved = localStorage.getItem('timer_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveToHistory = useCallback((durationOverride?: number) => {
    const dur = durationOverride ?? (mode === 'countdown' ? initialTimeRef.current : time);
    if (dur === 0) return; // Don't save 0 duration timers

    const newEntry: TimerHistory = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: titleRef.current || 'Untitled Task',
      note: noteRef.current || '',
      mode,
      duration: dur,
      date: new Date().toISOString(),
    };
    
    setHistory(prev => {
      const updated = [newEntry, ...prev];
      localStorage.setItem('timer_history', JSON.stringify(updated));
      return updated;
    });
  }, [mode, time]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('timer_history');
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('timer_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setTimer = useCallback((seconds: number) => {
    setTime(seconds);
    setInitialTime(seconds);
    setIsActive(false);
  }, []);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTime(0);
    setInitialTime(0);
    setIsActive(false);
  }, []);

  const toggleTimer = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    if (mode === 'stopwatch' && time > 0) {
      saveToHistory();
    }
    setTime(initialTime);
    setIsActive(false);
  }, [initialTime, mode, time, saveToHistory]);

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

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (mode === 'countdown') {
            if (prev <= 1) {
              setIsActive(false);
              playBeep();
              // Save to history when finished
              saveToHistory(initialTimeRef.current);
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
  }, [isActive, mode, saveToHistory]);

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
    taskTitle,
    setTaskTitle,
    taskNote,
    setTaskNote,
    history,
    clearHistory,
    deleteHistoryItem
  };
}

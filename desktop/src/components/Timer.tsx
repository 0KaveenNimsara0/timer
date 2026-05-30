'use client';

import { useState, useEffect } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useTheme } from '@/hooks/useTheme';
import { useTasks, SavedTask } from '@/hooks/useTasks';
import Sidebar from '@/components/Sidebar';
import { Play, Pause, RotateCcw, Settings, X } from 'lucide-react';

export default function Timer() {
  const {
    mode, time, isActive, formatTime, setTimer, switchMode,
    toggleTimer, resetTimer, taskTitle, setTaskTitle, taskNote,
    setTaskNote, history, clearHistory, deleteHistoryItem
  } = useTimer();

  const { colors, updateColors } = useTheme();
  const { tasks, saveTask, editTask, deleteTask } = useTasks();

  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Open by default
  
  const [inputValue, setInputValue] = useState('0');
  const [inputUnit, setInputUnit] = useState<'hours' | 'minutes' | 'seconds'>('minutes');

  // Auto close sidebar when timer starts
  useEffect(() => {
    if (isActive) {
      setIsSidebarOpen(false);
    }
  }, [isActive]);

  const handleSetTime = () => {
    const val = parseInt(inputValue) || 0;
    let totalSeconds = 0;
    if (inputUnit === 'hours') totalSeconds = val * 3600;
    else if (inputUnit === 'minutes') totalSeconds = val * 60;
    else totalSeconds = val;
    
    setTimer(totalSeconds);
    setShowSettings(false);
  };

  const handleSelectTask = (t: SavedTask) => {
    setTaskTitle(t.title);
    setTaskNote(t.note);
    switchMode('countdown');
    setTimer(t.duration);
    
    let val = t.duration;
    let unit: 'hours'|'minutes'|'seconds' = 'seconds';
    if (val >= 3600 && val % 3600 === 0) {
      val = val / 3600;
      unit = 'hours';
    } else if (val >= 60 && val % 60 === 0) {
      val = val / 60;
      unit = 'minutes';
    }
    setInputValue(val.toString());
    setInputUnit(unit);
    
    setShowSettings(true);
  };

  const modalOverlayStyle = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 };
  const modalContainerStyle = { display: 'flex', flexDirection: 'column' as const, gap: '20px', background: 'var(--bg-color, #222)', padding: '32px', borderRadius: '16px', border: '1px solid var(--btn-color, #333)', width: '90%', maxWidth: '400px', maxHeight: '85vh', overflowY: 'auto' as const };
  const inputStyle = { padding: '10px', fontSize: '1rem', width: '100%', background: 'transparent', color: 'var(--text-color, #fff)', border: '1px solid var(--btn-color, #444)', borderRadius: '8px', outline: 'none' };
  const labelStyle = { color: 'var(--text-color, #fff)', opacity: 0.8, fontSize: '0.9rem', marginBottom: '4px', display: 'block' };

  return (
    <div className="timer-container" style={{ display: 'flex', height: '100%', width: '100%', background: 'var(--bg-color, #111)', color: 'var(--text-color, #fff)', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        history={history} 
        clearHistory={clearHistory}
        deleteHistoryItem={deleteHistoryItem}
        tasks={tasks}
        saveTask={saveTask}
        editTask={editTask}
        deleteTask={deleteTask}
        onSelectTask={handleSelectTask}
        formatTime={formatTime}
        colors={colors}
        updateColors={updateColors}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        
        {/* Settings Modal */}
        {showSettings && (
          <div style={modalOverlayStyle}>
            <div style={modalContainerStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontWeight: 500 }}>{mode === 'countdown' ? 'Timer Setup' : 'Stopwatch Setup'}</h2>
                <button onClick={() => setShowSettings(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-color, #fff)', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              
              <div>
                <label style={labelStyle}>Current Task Title</label>
                <input type="text" placeholder="e.g., Maths Question 1" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Current Task Note</label>
                <textarea placeholder="e.g., Solve before 4 mins..." value={taskNote} onChange={(e) => setTaskNote(e.target.value)} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} />
              </div>

              {mode === 'countdown' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Time Amount</label>
                    <input type="number" min="0" value={inputValue} onChange={(e) => setInputValue(e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Unit</label>
                    <select value={inputUnit} onChange={(e) => setInputUnit(e.target.value as any)} style={inputStyle}>
                      <option value="hours">Hours</option>
                      <option value="minutes">Minutes</option>
                      <option value="seconds">Seconds</option>
                    </select>
                  </div>
                </div>
              )}

              <button className="btn" style={{ background: 'var(--text-color, #fff)', color: 'var(--bg-color, #000)', marginTop: '8px' }} onClick={handleSetTime}>Confirm & Load</button>
            </div>
          </div>
        )}

        {/* Main Timer Display */}
        {!showSettings && (
          <>
            <div style={{ fontSize: '20vw', fontWeight: 700, color: 'var(--text-color, #fff)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
              {formatTime(time)}
            </div>
            
            <div style={{ fontSize: '1.2rem', opacity: 0.8, marginTop: '16px', minHeight: '28px' }}>
               {taskTitle || (mode === 'countdown' ? 'Countdown Mode' : 'Stopwatch Mode')}
            </div>
            
            <div className="controls" style={{ display: 'flex', gap: '24px', marginTop: '60px', alignItems: 'center' }}>
              
              {/* Segmented Mode Switcher */}
              <div style={{ display: 'flex', background: 'var(--btn-color, #222)', borderRadius: '24px', padding: '4px' }}>
                <button onClick={() => switchMode('countdown')} style={{ padding: '8px 20px', borderRadius: '20px', background: mode === 'countdown' ? 'var(--text-color, #fff)' : 'transparent', color: mode === 'countdown' ? 'var(--bg-color, #000)' : 'var(--text-color, #fff)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }}>Timer</button>
                <button onClick={() => switchMode('stopwatch')} style={{ padding: '8px 20px', borderRadius: '20px', background: mode === 'stopwatch' ? 'var(--text-color, #fff)' : 'transparent', color: mode === 'stopwatch' ? 'var(--bg-color, #000)' : 'var(--text-color, #fff)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }}>Stopwatch</button>
              </div>

              {/* Settings Button (Always Visible) */}
              <button className="btn btn-icon" style={{ background: 'var(--btn-color, #222)', color: 'var(--text-color, #fff)' }} onClick={() => setShowSettings(true)} title="Task Settings">
                <Settings size={24} />
              </button>

              <button className="btn btn-icon" onClick={toggleTimer} style={{ width: '80px', height: '80px', background: 'var(--text-color, #fff)', color: 'var(--bg-color, #000)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isActive ? <Pause size={36} /> : <Play size={36} style={{ marginLeft: '4px' }} />}
              </button>
              
              <button className="btn btn-icon" onClick={resetTimer} style={{ width: '64px', height: '64px', background: 'var(--btn-color, #222)', color: 'var(--text-color, #fff)' }} title="Reset / Save">
                <RotateCcw size={28} />
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

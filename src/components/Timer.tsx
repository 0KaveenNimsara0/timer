'use client';

import { useState } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

export default function Timer() {
  const {
    mode,
    time,
    isActive,
    formatTime,
    setTimer,
    switchMode,
    toggleTimer,
    resetTimer,
  } = useTimer();

  const [showSettings, setShowSettings] = useState(false);
  const [inputValue, setInputValue] = useState('60');
  const [inputUnit, setInputUnit] = useState<'hours' | 'minutes' | 'seconds'>('minutes');

  const handleSetTime = () => {
    const val = parseInt(inputValue) || 0;
    let totalSeconds = 0;
    if (inputUnit === 'hours') totalSeconds = val * 3600;
    else if (inputUnit === 'minutes') totalSeconds = val * 60;
    else totalSeconds = val;
    
    setTimer(totalSeconds);
    setShowSettings(false);
  };

  const inputStyle = { padding: '12px', fontSize: '2rem', width: '120px', background: '#111', color: '#fff', border: '1px solid #444', borderRadius: '8px', outline: 'none', textAlign: 'center' as const };
  const selectStyle = { padding: '12px', fontSize: '1.2rem', background: '#111', color: '#fff', border: '1px solid #444', borderRadius: '8px', outline: 'none', cursor: 'pointer' };

  return (
    <div className="timer-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', background: '#111' }}>
      
      {showSettings ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#222', padding: '40px', borderRadius: '16px', border: '1px solid #333' }}>
          <h2 style={{ color: '#fff', margin: 0, fontWeight: 500, textAlign: 'center' }}>Set Time</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <input 
              type="number" 
              min="0" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              style={inputStyle} 
            />
            <select
              value={inputUnit}
              onChange={(e) => setInputUnit(e.target.value as any)}
              style={selectStyle}
            >
              <option value="hours">Hours</option>
              <option value="minutes">Minutes</option>
              <option value="seconds">Seconds</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button className="btn" style={{ background: '#fff', color: '#000', flex: 1 }} onClick={handleSetTime}>Save</button>
            <button className="btn" style={{ background: 'transparent', color: '#fff', border: '1px solid #444', flex: 1 }} onClick={() => setShowSettings(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '20vw', fontWeight: 700, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
            {formatTime(time)}
          </div>

          <div className="controls" style={{ display: 'flex', gap: '24px', marginTop: '100px', alignItems: 'center' }}>
            
            <button className="btn" style={{ background: 'transparent', color: '#888', border: '1px solid #333' }} onClick={() => switchMode(mode === 'countdown' ? 'stopwatch' : 'countdown')}>
              {mode === 'countdown' ? 'Countdown' : 'Stopwatch'}
            </button>

            {mode === 'countdown' && (
              <button className="btn btn-icon" style={{ background: '#222', color: '#fff' }} onClick={() => setShowSettings(true)}>
                <Settings size={24} />
              </button>
            )}

            <button className="btn btn-icon" onClick={toggleTimer} style={{ width: '80px', height: '80px', background: '#fff', color: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {isActive ? <Pause size={36} /> : <Play size={36} style={{ marginLeft: '4px' }} />}
            </button>
            
            <button className="btn btn-icon" onClick={resetTimer} style={{ width: '64px', height: '64px', background: '#222', color: '#fff' }}>
              <RotateCcw size={28} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

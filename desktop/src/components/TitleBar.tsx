'use client';

import { useState, useEffect } from 'react';
import { Maximize, Pin, Square, Copy } from 'lucide-react';

export default function TitleBar() {
  const [isPinned, setIsPinned] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        if (typeof window !== 'undefined' && (window as any).require) {
          const { ipcRenderer } = (window as any).require('electron');
          ipcRenderer.send('exit-fullscreen');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFullscreen = () => {
    setIsFullscreen(true);
    if (typeof window !== 'undefined' && (window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('toggle-fullscreen');
    }
  };

  if (isFullscreen) return <div style={{ display: 'none' }} />;

  return (
    <div className="titlebar">
      <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '12px', gap: '8px' }}>
        <img src="/timer_logo.png" alt="App Logo" style={{ width: '16px', height: '16px', opacity: 0.8 }} />
        <span style={{ fontWeight: 600 }}>Celiox Timer App</span>
      </div>
      <div style={{ display: 'flex', height: '100%', WebkitAppRegion: 'no-drag', paddingRight: '12px' } as any}>
        <button 
          title="Fullscreen"
          onClick={handleFullscreen}
          style={{ height: '100%', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Maximize size={14} />
        </button>
        <button 
          title="Always on Top"
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).require) {
              const { ipcRenderer } = (window as any).require('electron');
              ipcRenderer.send('toggle-always-on-top');
              setIsPinned(!isPinned);
            }
          }}
          style={{ height: '100%', background: isPinned ? 'rgba(255,255,255,0.2)' : 'transparent', border: 'none', color: isPinned ? '#fff' : '#94a3b8', cursor: 'pointer', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={(e) => e.currentTarget.style.background = isPinned ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = isPinned ? 'rgba(255,255,255,0.2)' : 'transparent'}
        >
          <Pin size={14} fill={isPinned ? 'currentColor' : 'none'} style={{ transition: 'transform 0.3s ease', transform: isPinned ? 'rotate(45deg)' : 'rotate(90deg)' }} />
        </button>
        <button 
          title="Minimize"
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).require) {
              const { ipcRenderer } = (window as any).require('electron');
              ipcRenderer.send('minimize-window');
            }
          }}
          style={{ height: '100%', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          —
        </button>
        <button 
          title="Maximize"
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).require) {
              const { ipcRenderer } = (window as any).require('electron');
              ipcRenderer.send('maximize-window');
              setIsMaximized(!isMaximized);
            }
          }}
          style={{ height: '100%', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {isMaximized ? <Copy size={12} style={{ transform: 'scaleX(-1)' }} /> : <Square size={12} />}
        </button>
        <button 
          title="Close"
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).require) {
              const { ipcRenderer } = (window as any).require('electron');
              ipcRenderer.send('close-window');
            }
          }}
          style={{ height: '100%', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

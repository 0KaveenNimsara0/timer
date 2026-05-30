'use client';

export default function TitleBar() {
  return (
    <div className="titlebar">
      <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '12px', gap: '8px' }}>
        <img src="/timer_logo.png" alt="App Logo" style={{ width: '16px', height: '16px', opacity: 0.8 }} />
        <span style={{ fontWeight: 600 }}>Celiox Timer App</span>
      </div>
      <div style={{ display: 'flex', height: '100%', WebkitAppRegion: 'no-drag', paddingRight: '12px' } as any}>
        <button 
          title="Always on Top"
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).require) {
              const { ipcRenderer } = (window as any).require('electron');
              ipcRenderer.send('toggle-always-on-top');
            }
          }}
          style={{ height: '100%', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          📌
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
            }
          }}
          style={{ height: '100%', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          □
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

import { useState } from 'react';
import { TimerHistory } from '@/hooks/useTimer';
import { SavedTask } from '@/hooks/useTasks';
import { ThemeColors } from '@/hooks/useTheme';
import { Trash2, Play, Plus, List, Clock, X, Edit2, Settings as SettingsIcon } from 'lucide-react';

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  history: TimerHistory[];
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  tasks: SavedTask[];
  saveTask: (t: Omit<SavedTask, 'id'>) => void;
  editTask: (id: string, t: Omit<SavedTask, 'id'>) => void;
  deleteTask: (id: string) => void;
  onSelectTask: (t: SavedTask) => void;
  formatTime: (s: number) => string;
  colors: ThemeColors;
  updateColors: (c: ThemeColors) => void;
};

export default function Sidebar({
  isOpen, setIsOpen, history, clearHistory, deleteHistoryItem, tasks, saveTask, editTask, deleteTask, onSelectTask, formatTime, colors, updateColors
}: SidebarProps) {
  const [tab, setTab] = useState<'tasks' | 'history' | 'settings'>('tasks');
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNote, setNewTaskNote] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('5');
  const [newTaskUnit, setNewTaskUnit] = useState<'hours'|'minutes'|'seconds'>('minutes');

  const openAddModal = () => {
    setEditingTaskId(null);
    setNewTaskTitle('');
    setNewTaskNote('');
    setNewTaskTime('5');
    setNewTaskUnit('minutes');
    setShowAddTask(true);
  };

  const openEditModal = (task: SavedTask) => {
    setEditingTaskId(task.id);
    setNewTaskTitle(task.title);
    setNewTaskNote(task.note || '');
    
    // Convert duration back to best unit
    let val = task.duration;
    let unit: 'hours'|'minutes'|'seconds' = 'seconds';
    if (val >= 3600 && val % 3600 === 0) {
      val = val / 3600;
      unit = 'hours';
    } else if (val >= 60 && val % 60 === 0) {
      val = val / 60;
      unit = 'minutes';
    }
    setNewTaskTime(val.toString());
    setNewTaskUnit(unit);
    
    setShowAddTask(true);
  };

  const handleSaveTask = () => {
    const val = parseInt(newTaskTime) || 0;
    let duration = 0;
    if (newTaskUnit === 'hours') duration = val * 3600;
    else if (newTaskUnit === 'minutes') duration = val * 60;
    else duration = val;

    const taskData = { title: newTaskTitle || 'Untitled Task', note: newTaskNote, duration };
    if (editingTaskId) {
      editTask(editingTaskId, taskData);
    } else {
      saveTask(taskData);
    }
    
    setShowAddTask(false);
  };

  const inputStyle = { padding: '8px', fontSize: '0.9rem', width: '100%', background: 'rgba(0,0,0,0.2)', color: 'var(--text-color, #fff)', border: '1px solid var(--btn-color, #444)', borderRadius: '6px', outline: 'none', marginBottom: '8px' };

  const modalOverlayStyle = { position: 'fixed' as const, top: '32px', left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 };
  const modalContainerStyle = { display: 'flex', flexDirection: 'column' as const, gap: '20px', background: 'var(--bg-color, #222)', padding: '32px', borderRadius: '16px', border: '1px solid var(--btn-color, #333)', width: '90%', maxWidth: '400px', maxHeight: '85vh', overflowY: 'auto' as const };

  return (
    <>
      {/* Toggle Button when closed */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ position: 'absolute', left: '16px', top: '48px', zIndex: 10, background: 'var(--btn-color, #222)', border: 'none', color: 'var(--text-color, #fff)', padding: '12px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
        >
          <List size={24} />
        </button>
      )}

      {/* Add/Edit Task Modal */}
      {showAddTask && (
        <div style={modalOverlayStyle} onClick={() => setShowAddTask(false)}>
          <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontWeight: 500 }}>{editingTaskId ? 'Edit Task' : 'Create New Task'}</h2>
              <button onClick={() => setShowAddTask(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-color, #fff)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div>
              <input type="text" placeholder="Task Title" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} style={{ ...inputStyle, padding: '12px', fontSize: '1rem' }} />
              <textarea placeholder="Note / Description (Optional)" value={newTaskNote} onChange={e => setNewTaskNote(e.target.value)} style={{ ...inputStyle, padding: '12px', fontSize: '1rem', minHeight: '80px', resize: 'vertical' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <input type="number" min="0" value={newTaskTime} onChange={e => setNewTaskTime(e.target.value)} style={{ ...inputStyle, padding: '12px', fontSize: '1rem', marginBottom: 0 }} />
              </div>
              <div style={{ flex: 1 }}>
                <select value={newTaskUnit} onChange={e => setNewTaskUnit(e.target.value as any)} style={{ ...inputStyle, padding: '12px', fontSize: '1rem', marginBottom: 0 }}>
                  <option value="hours">Hours</option>
                  <option value="minutes">Minutes</option>
                  <option value="seconds">Seconds</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button style={{ flex: 1, padding: '12px', background: 'var(--text-color, #fff)', color: 'var(--bg-color, #000)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }} onClick={handleSaveTask}>Save Task</button>
              <button style={{ flex: 1, padding: '12px', background: 'transparent', color: 'var(--text-color, #fff)', border: '1px solid var(--btn-color, #444)', borderRadius: '8px', cursor: 'pointer' }} onClick={() => setShowAddTask(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Panel */}
      <div style={{
        position: 'absolute', top: '32px', left: 0, bottom: 0, width: '320px',
        background: 'var(--bg-color, #1a1a1a)', borderRight: '1px solid var(--btn-color, #333)',
        display: 'flex', flexDirection: 'row', zIndex: 100, transition: 'transform 0.3s ease',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,0.5)' : 'none'
      }}>
        {/* Vertical Left Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '60px', borderRight: '1px solid var(--btn-color, #333)', alignItems: 'center', paddingTop: '16px', gap: '16px' }}>
          
          <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-color, #fff)', cursor: 'pointer', padding: '12px' }} title="Close Sidebar">
            <X size={20} />
          </button>
          
          <div style={{ width: '40px', height: '1px', background: 'var(--btn-color, #333)' }} />
          
          <button onClick={() => setTab('tasks')} style={{ background: tab === 'tasks' ? 'var(--btn-color, #333)' : 'transparent', border: 'none', color: 'var(--text-color, #fff)', cursor: 'pointer', padding: '12px', borderRadius: '8px' }} title="Tasks">
            <List size={20} />
          </button>
          <button onClick={() => setTab('history')} style={{ background: tab === 'history' ? 'var(--btn-color, #333)' : 'transparent', border: 'none', color: 'var(--text-color, #fff)', cursor: 'pointer', padding: '12px', borderRadius: '8px' }} title="History">
            <Clock size={20} />
          </button>
          <button onClick={() => setTab('settings')} style={{ background: tab === 'settings' ? 'var(--btn-color, #333)' : 'transparent', border: 'none', color: 'var(--text-color, #fff)', cursor: 'pointer', padding: '12px', borderRadius: '8px' }} title="Settings">
            <SettingsIcon size={20} />
          </button>
          
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {tab === 'tasks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <button 
                onClick={openAddModal}
                style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px dashed var(--text-color, #fff)', color: 'var(--text-color, #fff)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.8 }}
              >
                <Plus size={18} /> Add New Task
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tasks.map(task => (
                  <div key={task.id} style={{ background: 'var(--btn-color, #222)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onSelectTask(task)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '1rem' }}>{task.title}</strong>
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{formatTime(task.duration)}</span>
                      </div>
                      {task.note && <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '4px' }}>{task.note}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => openEditModal(task)} style={{ background: 'transparent', border: 'none', color: 'var(--text-color, #fff)', cursor: 'pointer', padding: '8px', opacity: 0.8 }} title="Edit Task">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', opacity: 0.8 }} title="Delete Task">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.length === 0 ? (
                <p style={{ textAlign: 'center', opacity: 0.5, margin: '40px 0' }}>No history yet.</p>
              ) : (
                history.map(item => (
                  <div key={item.id} style={{ background: 'var(--btn-color, #222)', padding: '12px', borderRadius: '8px', position: 'relative' }}>
                    <button 
                      onClick={() => deleteHistoryItem(item.id)}
                      style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.8 }}
                      title="Remove from history"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', paddingRight: '24px' }}>
                      <strong style={{ fontSize: '1rem' }}>{item.title}</strong>
                      <span style={{ opacity: 0.7 }}>{formatTime(item.duration)}</span>
                    </div>
                    {item.note && <p style={{ margin: '4px 0', fontSize: '0.85rem', opacity: 0.8, paddingRight: '24px' }}>{item.note}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.5, marginTop: '8px' }}>
                      <span>{item.mode}</span>
                      <span>{new Date(item.date).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
              {history.length > 0 && (
                <button style={{ width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }} onClick={clearHistory}>
                  <Trash2 size={16} /> Clear All History
                </button>
              )}
            </div>
          )}
          {tab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'var(--btn-color, #222)', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 500 }}>Theme Colors</h3>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '8px' }}>Background</label>
                    <input type="color" value={colors?.background} onChange={(e) => updateColors({ ...colors, background: e.target.value })} style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '8px' }}>Text</label>
                    <input type="color" value={colors?.text} onChange={(e) => updateColors({ ...colors, text: e.target.value })} style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '8px' }}>Buttons</label>
                    <input type="color" value={colors?.button} onChange={(e) => updateColors({ ...colors, button: e.target.value })} style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent' }} />
                  </div>
                </div>
                
                <button 
                  style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--text-color, #fff)', color: 'var(--text-color, #fff)', borderRadius: '6px', cursor: 'pointer', opacity: 0.8 }} 
                  onClick={() => updateColors({ background: '#111111', text: '#ffffff', button: '#222222' })}
                >
                  Reset Default Colors
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Branding Footer inside Sidebar */}
        <div style={{ position: 'absolute', bottom: '16px', left: '76px', right: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', opacity: 0.3, pointerEvents: 'none' }}>
          <span style={{ color: 'var(--text-color, #aaa)', fontSize: '11px' }}>Developed by</span>
          <img src="/main_logo.svg" alt="Celiox Logo" style={{ width: '12px', height: '12px' }} />
          <span style={{ color: 'var(--text-color, #fff)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>CELIOX</span>
        </div>
      </div>
    </>
  );
}

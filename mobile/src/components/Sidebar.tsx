import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Animated, Dimensions, StyleSheet, Modal } from 'react-native';
import { TimerHistory } from '../hooks/useTimer';
import { SavedTask } from '../hooks/useTasks';
import { ThemeColors } from '../theme/ThemeContext';
import { Trash2, Play, Plus, List, Clock, X, Edit2, Settings as SettingsIcon } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

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
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNote, setNewTaskNote] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('5');
  const [newTaskUnit, setNewTaskUnit] = useState<'hours'|'minutes'|'seconds'>('minutes');

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

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

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={() => setIsOpen(false)}>
      <View style={styles.overlay}>
      {/* Background touch target to close sidebar */}
      <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={() => setIsOpen(false)} />
      
      <Animated.View style={[styles.container, { backgroundColor: colors.background, transform: [{ translateX: slideAnim }] }]}>
        
        {/* Left Nav Rail */}
        <View style={[styles.navRail, { borderRightColor: colors.button }]}>
          <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.navBtn}>
            <X color={colors.text} size={24} />
          </TouchableOpacity>
          <View style={[styles.separator, { backgroundColor: colors.button }]} />
          
          <TouchableOpacity onPress={() => setTab('tasks')} style={[styles.navBtn, tab === 'tasks' && { backgroundColor: colors.button }]}>
            <List color={colors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('history')} style={[styles.navBtn, tab === 'history' && { backgroundColor: colors.button }]}>
            <Clock color={colors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('settings')} style={[styles.navBtn, tab === 'settings' && { backgroundColor: colors.button }]}>
            <SettingsIcon color={colors.text} size={24} />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <ScrollView style={styles.content} contentContainerStyle={{ padding: 16 }}>
          {tab === 'tasks' && (
            <View>
              <TouchableOpacity style={[styles.addBtn, { borderColor: colors.text }]} onPress={openAddModal}>
                <Plus color={colors.text} size={20} />
                <Text style={{ color: colors.text, marginLeft: 8 }}>Add New Task</Text>
              </TouchableOpacity>

              {tasks.map(task => (
                <View key={task.id} style={[styles.card, { backgroundColor: colors.button }]}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => onSelectTask(task)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}>{task.title}</Text>
                      <Text style={{ color: colors.text, opacity: 0.7 }}>{formatTime(task.duration)}</Text>
                    </View>
                    {task.note ? <Text style={{ color: colors.text, opacity: 0.6, marginTop: 4 }}>{task.note}</Text> : null}
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'flex-end', gap: 12 }}>
                    <TouchableOpacity onPress={() => openEditModal(task)}><Edit2 color={colors.text} size={18} opacity={0.8} /></TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTask(task.id)}><Trash2 color="#ef4444" size={18} /></TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {tab === 'history' && (
            <View>
              {history.length === 0 ? (
                <Text style={{ color: colors.text, opacity: 0.5, textAlign: 'center', marginTop: 40 }}>No history yet.</Text>
              ) : (
                history.map(item => (
                  <View key={item.id} style={[styles.card, { backgroundColor: colors.button }]}>
                    <TouchableOpacity style={{ position: 'absolute', right: 12, top: 12, zIndex: 10 }} onPress={() => deleteHistoryItem(item.id)}>
                      <Trash2 color="#ef4444" size={18} opacity={0.8} />
                    </TouchableOpacity>
                    <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
                    <Text style={{ color: colors.text, opacity: 0.7 }}>{formatTime(item.duration)}</Text>
                    {item.note ? <Text style={{ color: colors.text, opacity: 0.6, marginTop: 4 }}>{item.note}</Text> : null}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                      <Text style={{ color: colors.text, opacity: 0.5, fontSize: 12 }}>{item.mode}</Text>
                      <Text style={{ color: colors.text, opacity: 0.5, fontSize: 12 }}>{new Date(item.date).toLocaleDateString()}</Text>
                    </View>
                  </View>
                ))
              )}
              {history.length > 0 && (
                <TouchableOpacity style={styles.clearBtn} onPress={clearHistory}>
                  <Trash2 color="#ef4444" size={16} />
                  <Text style={{ color: '#ef4444', marginLeft: 8 }}>Clear All History</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {tab === 'settings' && (
            <View>
              <View style={[styles.card, { backgroundColor: colors.button }]}>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>Theme Settings</Text>
                
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                  {[
                    { name: 'Dark', colors: { background: '#111111', text: '#ffffff', button: '#222222' } },
                    { name: 'Light', colors: { background: '#f8f9fa', text: '#111827', button: '#e5e7eb' } },
                    { name: 'Ocean', colors: { background: '#0f172a', text: '#38bdf8', button: '#1e293b' } },
                    { name: 'Forest', colors: { background: '#064e3b', text: '#34d399', button: '#065f46' } },
                    { name: 'Sunset', colors: { background: '#431407', text: '#fdba74', button: '#7c2d12' } },
                  ].map(theme => (
                    <TouchableOpacity 
                      key={theme.name}
                      onPress={() => updateColors(theme.colors)}
                      style={{ 
                        width: '46%', 
                        padding: 12, 
                        borderRadius: 8, 
                        backgroundColor: theme.colors.background,
                        borderWidth: 2,
                        borderColor: colors.background === theme.colors.background ? theme.colors.text : theme.colors.button,
                        alignItems: 'center'
                      }}
                    >
                      <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>{theme.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity 
                  style={[styles.resetBtn, { borderColor: colors.text }]}
                  onPress={() => updateColors({ background: '#111111', text: '#ffffff', button: '#222222' })}
                >
                  <Text style={{ color: colors.text }}>Reset Default Colors</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </ScrollView>
      </Animated.View>

      {/* Add Task Modal */}
      <Modal visible={showAddTask} transparent animationType="fade" onRequestClose={() => setShowAddTask(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.background, borderColor: colors.button }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{editingTaskId ? 'Edit Task' : 'Create New Task'}</Text>
            
            <TextInput 
              placeholder="Task Title" 
              placeholderTextColor="#888"
              value={newTaskTitle} 
              onChangeText={setNewTaskTitle} 
              style={[styles.input, { color: colors.text, borderColor: colors.button }]} 
            />
            <TextInput 
              placeholder="Note (Optional)" 
              placeholderTextColor="#888"
              value={newTaskNote} 
              onChangeText={setNewTaskNote} 
              multiline
              style={[styles.input, { color: colors.text, borderColor: colors.button, height: 80, textAlignVertical: 'top' }]} 
            />
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <TextInput 
                placeholder="Time"
                keyboardType="numeric"
                value={newTaskTime} 
                onChangeText={setNewTaskTime} 
                style={[styles.input, { flex: 1, marginBottom: 0, color: colors.text, borderColor: colors.button }]} 
              />
              <View style={{ flexDirection: 'row', flex: 1.5, borderRadius: 8, borderWidth: 1, borderColor: colors.button, overflow: 'hidden' }}>
                <TouchableOpacity onPress={() => setNewTaskUnit('hours')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: newTaskUnit === 'hours' ? colors.text : 'transparent' }}>
                  <Text style={{ color: newTaskUnit === 'hours' ? colors.background : colors.text, fontSize: 12, fontWeight: newTaskUnit === 'hours' ? 'bold' : 'normal' }}>Hr</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setNewTaskUnit('minutes')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: newTaskUnit === 'minutes' ? colors.text : 'transparent', borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.button }}>
                  <Text style={{ color: newTaskUnit === 'minutes' ? colors.background : colors.text, fontSize: 12, fontWeight: newTaskUnit === 'minutes' ? 'bold' : 'normal' }}>Min</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setNewTaskUnit('seconds')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: newTaskUnit === 'seconds' ? colors.text : 'transparent' }}>
                  <Text style={{ color: newTaskUnit === 'seconds' ? colors.background : colors.text, fontSize: 12, fontWeight: newTaskUnit === 'seconds' ? 'bold' : 'normal' }}>Sec</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.text }]} onPress={handleSaveTask}>
                <Text style={{ color: colors.background, fontWeight: 'bold' }}>Save Task</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.button }]} onPress={() => setShowAddTask(false)}>
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    flexDirection: 'row',
    width: '85%',
    maxWidth: 360,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  navRail: {
    width: 70,
    borderRightWidth: 1,
    alignItems: 'center',
    paddingTop: 16,
    gap: 16,
  },
  navBtn: {
    padding: 12,
    borderRadius: 12,
  },
  separator: {
    width: 40,
    height: 1,
    marginVertical: 4,
  },
  content: {
    flex: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    marginTop: 12,
  },
  resetBtn: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  saveBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  }
});

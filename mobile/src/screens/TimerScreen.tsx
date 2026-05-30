import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useTimer } from '../hooks/useTimer';
import { useTheme } from '../theme/ThemeContext';
import { useTasks, SavedTask } from '../hooks/useTasks';
import { Play, Pause, RotateCcw, Settings, X, Menu } from 'lucide-react-native';
import Sidebar from '../components/Sidebar';

const { width } = Dimensions.get('window');

export default function TimerScreen() {
  const {
    mode, time, isActive, formatTime, setTimer, switchMode,
    toggleTimer, resetTimer, taskTitle, setTaskTitle, taskNote,
    setTaskNote, history, clearHistory, deleteHistoryItem
  } = useTimer();

  const { colors, updateColors } = useTheme();
  const { tasks, saveTask, editTask, deleteTask } = useTasks();

  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [inputValue, setInputValue] = useState('0');
  const [inputUnit, setInputUnit] = useState<'hours'|'minutes'|'seconds'>('minutes');

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
    setIsSidebarOpen(false); // Close sidebar on select
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Toggle Sidebar Button */}
      {!isSidebarOpen && (
        <TouchableOpacity 
          onPress={() => setIsSidebarOpen(true)}
          style={[styles.menuBtn, { backgroundColor: colors.button, elevation: 10, zIndex: 10 }]}
        >
          <Menu color={colors.text} size={24} />
        </TouchableOpacity>
      )}

      {/* Main Content Area */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        {/* Settings Modal */}
        <Modal visible={showSettings} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: colors.button, borderColor: colors.button }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{mode === 'countdown' ? 'Timer Setup' : 'Stopwatch Setup'}</Text>
                <TouchableOpacity onPress={() => setShowSettings(false)}>
                  <X color={colors.text} size={24} />
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.label, { color: colors.text }]}>Current Task Title</Text>
              <TextInput 
                placeholder="e.g., Maths Question 1" 
                placeholderTextColor="#888"
                value={taskTitle} 
                onChangeText={setTaskTitle} 
                style={[styles.input, { color: colors.text, borderColor: '#444' }]} 
              />

              <Text style={[styles.label, { color: colors.text }]}>Current Task Note</Text>
              <TextInput 
                placeholder="e.g., Solve before 4 mins..." 
                placeholderTextColor="#888"
                value={taskNote} 
                onChangeText={setTaskNote} 
                multiline
                style={[styles.input, { color: colors.text, borderColor: '#444', height: 80, textAlignVertical: 'top' }]} 
              />

              {mode === 'countdown' && (
                <>
                  <Text style={[styles.label, { color: colors.text }]}>Time Amount</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                    <TextInput 
                      placeholder="Time"
                      keyboardType="numeric"
                      value={inputValue} 
                      onChangeText={setInputValue} 
                      style={[styles.input, { flex: 1, marginBottom: 0, color: colors.text, borderColor: '#444' }]} 
                    />
                    <View style={{ flexDirection: 'row', flex: 1.5, borderRadius: 8, borderWidth: 1, borderColor: '#444', overflow: 'hidden' }}>
                      <TouchableOpacity onPress={() => setInputUnit('hours')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: inputUnit === 'hours' ? colors.text : 'transparent' }}>
                        <Text style={{ color: inputUnit === 'hours' ? colors.background : colors.text, fontSize: 12, fontWeight: inputUnit === 'hours' ? 'bold' : 'normal' }}>Hr</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setInputUnit('minutes')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: inputUnit === 'minutes' ? colors.text : 'transparent', borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#444' }}>
                        <Text style={{ color: inputUnit === 'minutes' ? colors.background : colors.text, fontSize: 12, fontWeight: inputUnit === 'minutes' ? 'bold' : 'normal' }}>Min</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setInputUnit('seconds')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: inputUnit === 'seconds' ? colors.text : 'transparent' }}>
                        <Text style={{ color: inputUnit === 'seconds' ? colors.background : colors.text, fontSize: 12, fontWeight: inputUnit === 'seconds' ? 'bold' : 'normal' }}>Sec</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}

              <TouchableOpacity 
                style={[styles.confirmBtn, { backgroundColor: colors.text }]} 
                onPress={handleSetTime}
              >
                <Text style={{ color: colors.background, fontWeight: 'bold', fontSize: 16 }}>Confirm & Load</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Main Timer Display */}
        {!showSettings && (
          <View style={styles.timerDisplay}>
            <Text style={[styles.timeText, { color: colors.text }]}>
              {formatTime(time)}
            </Text>
            
            <Text style={[styles.taskTitle, { color: colors.text }]}>
               {taskTitle || (mode === 'countdown' ? 'Countdown Mode' : 'Stopwatch Mode')}
            </Text>
            
            <View style={styles.controls}>
              <View style={[styles.segmentedControl, { backgroundColor: colors.button }]}>
                <TouchableOpacity 
                  style={[styles.segmentBtn, mode === 'countdown' && { backgroundColor: colors.text }]}
                  onPress={() => switchMode('countdown')}
                >
                  <Text style={{ color: mode === 'countdown' ? colors.background : colors.text, fontWeight: '600' }}>Timer</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.segmentBtn, mode === 'stopwatch' && { backgroundColor: colors.text }]}
                  onPress={() => switchMode('stopwatch')}
                >
                  <Text style={{ color: mode === 'stopwatch' ? colors.background : colors.text, fontWeight: '600' }}>Stopwatch</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.button }]} onPress={() => setShowSettings(true)}>
                  <Settings color={colors.text} size={24} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.playBtn, { backgroundColor: colors.text }]} onPress={toggleTimer}>
                  {isActive ? <Pause color={colors.background} size={36} /> : <Play color={colors.background} size={36} style={{ marginLeft: 4 }} />}
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.button }]} onPress={resetTimer}>
                  <RotateCcw color={colors.text} size={28} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

      </View>

      {/* Sidebar Overlay (Uses Native Modal) */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  menuBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  label: {
    opacity: 0.8,
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  confirmBtn: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  timerDisplay: {
    alignItems: 'center',
    width: '100%',
  },
  timeText: {
    fontSize: width * 0.22,
    fontWeight: 'bold',
    letterSpacing: -2,
  },
  taskTitle: {
    fontSize: 18,
    opacity: 0.8,
    marginTop: 16,
  },
  controls: {
    marginTop: 60,
    alignItems: 'center',
    gap: 24,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    marginBottom: 8,
  },
  segmentBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
  },
  iconBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

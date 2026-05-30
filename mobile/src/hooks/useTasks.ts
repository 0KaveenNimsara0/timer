import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavedTask = {
  id: string;
  title: string;
  note: string;
  duration: number; // in seconds
};

export function useTasks() {
  const [tasks, setTasks] = useState<SavedTask[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const saved = await AsyncStorage.getItem('timer_tasks');
        if (saved) {
          setTasks(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    };
    loadTasks();
  }, []);

  const saveTask = useCallback(async (task: Omit<SavedTask, 'id'>) => {
    const newTask: SavedTask = { ...task, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
    setTasks(prev => {
      const updated = [...prev, newTask];
      AsyncStorage.setItem('timer_tasks', JSON.stringify(updated)).catch(e => console.error(e));
      return updated;
    });
  }, []);

  const editTask = useCallback(async (id: string, updatedTask: Omit<SavedTask, 'id'>) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...updatedTask, id } : t);
      AsyncStorage.setItem('timer_tasks', JSON.stringify(updated)).catch(e => console.error(e));
      return updated;
    });
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id);
      AsyncStorage.setItem('timer_tasks', JSON.stringify(updated)).catch(e => console.error(e));
      return updated;
    });
  }, []);

  return { tasks, saveTask, editTask, deleteTask };
}

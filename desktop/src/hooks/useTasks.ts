import { useState, useEffect, useCallback } from 'react';

export type SavedTask = {
  id: string;
  title: string;
  note: string;
  duration: number; // in seconds
};

export function useTasks() {
  const [tasks, setTasks] = useState<SavedTask[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('timer_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveTask = useCallback((task: Omit<SavedTask, 'id'>) => {
    const newTask: SavedTask = { ...task, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
    setTasks(prev => {
      const updated = [...prev, newTask];
      localStorage.setItem('timer_tasks', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const editTask = useCallback((id: string, updatedTask: Omit<SavedTask, 'id'>) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...updatedTask, id } : t);
      localStorage.setItem('timer_tasks', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem('timer_tasks', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { tasks, saveTask, editTask, deleteTask };
}

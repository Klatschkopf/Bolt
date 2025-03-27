import { create } from 'zustand';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  getTasksForDate: (date: Date) => Task[];
  getTasksByCategory: (category: string | null) => Task[];
  exportTasks: () => Promise<string>;
  importTasks: (jsonData: string) => Promise<void>;
  clearAllTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (task) => {
        const newTask = {
          ...task,
          id: Math.random().toString(36).substring(7),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
      },
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      updateTask: (id, updatedTask) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        }));
      },
      getTasksForDate: (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        return get().tasks.filter((task) => task.date === formattedDate);
      },
      getTasksByCategory: (category) => {
        // If category is null, return all tasks
        if (category === null) {
          return get().tasks;
        }
        // Otherwise filter by category
        return get().tasks.filter((task) => task.category === category);
      },
      exportTasks: async () => {
        const tasks = get().tasks;
        return JSON.stringify(tasks);
      },
      importTasks: async (jsonData) => {
        try {
          const tasks = JSON.parse(jsonData);
          if (!Array.isArray(tasks)) {
            throw new Error('Invalid data format');
          }
          set({ tasks });
        } catch (error) {
          throw new Error('Failed to import tasks');
        }
      },
      clearAllTasks: () => {
        set({ tasks: [] });
      },
    }),
    {
      name: 'task-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

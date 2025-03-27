export interface Task {
  id: string;
  description: string;
  startTime: string;
  duration: number; // in minutes
  color: string;
  emoji: string;
  completed: boolean;
  date: string;
  category?: string; // New field for task category
}

export interface TimeSlot {
  hour: number;
  minute: number;
  tasks: Task[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

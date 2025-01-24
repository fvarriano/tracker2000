export interface Habit {
  id: string;
  name: string;
  createdAt: Date;
  completedDates: string[]; // Array of ISO date strings
  userId: string;
}

export interface HabitLog {
  date: string; // ISO date string
  completed: boolean;
} 
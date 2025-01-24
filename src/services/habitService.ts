import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Habit } from '../types';

const HABITS_COLLECTION = 'habits';

export const habitService = {
  // Subscribe to habits (real-time updates)
  subscribeToHabits: (onUpdate: (habits: Habit[]) => void) => {
    const habitsQuery = query(
      collection(db, HABITS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(habitsQuery, (snapshot) => {
      const habits = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Habit[];
      onUpdate(habits);
    });
  },

  // Add a new habit
  addHabit: async (habit: Omit<Habit, 'id'>) => {
    try {
      await addDoc(collection(db, HABITS_COLLECTION), {
        ...habit,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  },

  // Toggle habit completion for a date
  toggleHabitCompletion: async (habitId: string, completedDates: string[]) => {
    try {
      const habitRef = doc(db, HABITS_COLLECTION, habitId);
      await updateDoc(habitRef, { completedDates });
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  },

  // Delete a habit
  deleteHabit: async (habitId: string) => {
    try {
      const habitRef = doc(db, HABITS_COLLECTION, habitId);
      await deleteDoc(habitRef);
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  },
}; 
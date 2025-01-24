import { GoogleGenerativeAI } from '@google/generative-ai';
import { Habit } from '../types';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

export const geminiService = {
  // Format habits data into a readable context string
  formatHabitsContext: (habits: Habit[]): string => {
    const today = new Date().toISOString().split('T')[0];
    
    const habitsContext = habits.map(habit => {
      const isCompletedToday = habit.completedDates.includes(today);
      const streak = calculateStreak(habit.completedDates);
      
      return `Habit: ${habit.name}
Current streak: ${streak} days
Completed today: ${isCompletedToday ? 'Yes' : 'No'}`;
    }).join('\n\n');

    return `Here's my current habits status:\n\n${habitsContext}`;
  },

  // Chat with Gemini
  chat: async (message: string, habits: Habit[]) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const context = geminiService.formatHabitsContext(habits);
      const prompt = `${context}\n\nUser message: ${message}\n\nYou are a helpful coach focused on helping me achieve my goals and personal development. Here is the current status of my habits. Please format your response using markdown for better readability. Use ** for bold text, * for italics, and proper markdown headings (##) for sections. Use bullet points (-) for lists where appropriate.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error chatting with Gemini:', error);
      throw error;
    }
  }
};

// Helper function to calculate streak (copied from HabitItem component)
const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort();
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateString = currentDate.toISOString().split('T')[0];
    if (!completedDates.includes(dateString)) {
      break;
    }
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}; 
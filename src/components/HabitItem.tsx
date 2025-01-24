import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '../types';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle, onDelete }) => {
  const isCompletedToday = habit.completedDates.includes(new Date().toISOString().split('T')[0]);
  const streak = calculateStreak(habit.completedDates);

  return (
    <View style={styles.container}>
      <View style={styles.habitInfo}>
        <Text style={styles.habitName}>{habit.name}</Text>
        <Text style={styles.streak}>Streak: {streak} days</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.toggleButton, isCompletedToday && styles.completed]}
          onPress={() => onToggle(habit.id)}
        >
          <Text style={styles.buttonText}>
            {isCompletedToday ? '✓' : '○'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(habit.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '500',
  },
  streak: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  completed: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 20,
    color: '#007AFF',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
}); 
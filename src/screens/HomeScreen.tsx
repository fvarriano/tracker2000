import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Habit } from '../types';
import { HabitItem } from '../components/HabitItem';
import { habitService } from '../services/habitService';

export const HomeScreen: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to habits
    const unsubscribe = habitService.subscribeToHabits((updatedHabits) => {
      setHabits(updatedHabits);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const addHabit = async () => {
    if (newHabitName.trim() === '') {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    try {
      await habitService.addHabit({
        name: newHabitName.trim(),
        createdAt: new Date(),
        completedDates: [],
      });
      setNewHabitName('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add habit');
    }
  };

  const toggleHabit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    const completedDates = habit.completedDates.includes(today)
      ? habit.completedDates.filter(date => date !== today)
      : [...habit.completedDates, today];

    try {
      await habitService.toggleHabitCompletion(habitId, completedDates);
    } catch (error) {
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  const deleteHabit = (habitId: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await habitService.deleteHabit(habitId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete habit');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Tracker</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newHabitName}
          onChangeText={setNewHabitName}
          placeholder="Enter new habit..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.addButton} onPress={addHabit}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            onToggle={toggleHabit}
            onDelete={deleteHabit}
          />
        )}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
}); 
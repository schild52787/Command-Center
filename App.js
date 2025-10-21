import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimerScreen from './src/screens/TimerScreen';
import RewardScreen from './src/screens/RewardScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const DEFAULT_SEGMENTS = [
  { id: 1, name: 'Wake up → Bathroom', emoji: '🚿', duration: 5 },
  { id: 2, name: 'Get dressed', emoji: '👗', duration: 7 },
  { id: 3, name: 'Breakfast', emoji: '🥞', duration: 15 },
  { id: 4, name: 'Brush teeth', emoji: '🪥', duration: 3 },
  { id: 5, name: 'Pack backpack', emoji: '🎒', duration: 5 },
  { id: 6, name: 'Shoes & coat', emoji: '👟', duration: 3 },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('timer');
  const [segments, setSegments] = useState(DEFAULT_SEGMENTS);
  const [streakData, setStreakData] = useState({ count: 0, lastDate: null });
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    loadSettings();
    loadStreakData();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSegments = await AsyncStorage.getItem('segments');
      if (savedSegments) {
        setSegments(JSON.parse(savedSegments));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const loadStreakData = async () => {
    try {
      const savedStreak = await AsyncStorage.getItem('streakData');
      if (savedStreak) {
        setStreakData(JSON.parse(savedStreak));
      }
    } catch (error) {
      console.log('Error loading streak:', error);
    }
  };

  const saveSettings = async (newSegments) => {
    try {
      await AsyncStorage.setItem('segments', JSON.stringify(newSegments));
      setSegments(newSegments);
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const updateStreak = async () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = { ...streakData };

    if (streakData.lastDate === today) {
      // Already completed today
      return;
    } else if (streakData.lastDate === yesterday) {
      // Consecutive day
      newStreak.count += 1;
      newStreak.lastDate = today;
    } else {
      // New streak
      newStreak.count = 1;
      newStreak.lastDate = today;
    }

    setStreakData(newStreak);
    await AsyncStorage.setItem('streakData', JSON.stringify(newStreak));
  };

  const handleComplete = () => {
    updateStreak();
    setShowReward(true);
  };

  const handleRewardClose = () => {
    setShowReward(false);
  };

  if (showReward) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <RewardScreen onClose={handleRewardClose} streak={streakData.count} />
      </View>
    );
  }

  if (currentScreen === 'settings') {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <SettingsScreen
          segments={segments}
          onSave={saveSettings}
          onBack={() => setCurrentScreen('timer')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <TimerScreen
        segments={segments}
        onComplete={handleComplete}
        onSettings={() => setCurrentScreen('settings')}
        streak={streakData.count}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5F4',
  },
});

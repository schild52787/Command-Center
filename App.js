import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimerScreen from './src/screens/TimerScreen';
import RewardScreen from './src/screens/RewardScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const DEFAULT_SEGMENTS = [
  { id: 1, name: 'Wake up → Bathroom', emoji: '\uD83D\uDEBF', duration: 5 },
  { id: 2, name: 'Get dressed', emoji: '\uD83D\uDC57', duration: 7 },
  { id: 3, name: 'Breakfast', emoji: '\uD83C\uDF5E', duration: 15 },
  { id: 4, name: 'Brush teeth', emoji: '\uD83E\uDEA5', duration: 3 },
  { id: 5, name: 'Pack backpack', emoji: '\uD83C\uDF92', duration: 5 },
  { id: 6, name: 'Shoes & coat', emoji: '\uD83E\uDD7F', duration: 3 },
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
      const storedSegments = await AsyncStorage.getItem('segments');
      if (storedSegments !== null) {
        setSegments(JSON.parse(storedSegments));
      }
    } catch (error) {
      Alert.alert('Error loading settings', error.message || 'Unable to load settings.');
    }
  };

  const loadStreakData = async () => {
    try {
      const storedStreakData = await AsyncStorage.getItem('streakData');
      if (storedStreakData !== null) {
        setStreakData(JSON.parse(storedStreakData));
      }
    } catch (error) {
      Alert.alert('Error loading streak data', error.message || 'Unable to load streak data.');
    }
  };

  const saveSettings = async (updatedSegments) => {
    try {
      await AsyncStorage.setItem('segments', JSON.stringify(updatedSegments));
      setSegments(updatedSegments);
    } catch (error) {
      Alert.alert('Error saving settings', error.message || 'Unable to save settings.');
    }
  };

  const saveStreakData = async (updatedStreakData) => {
    try {
      await AsyncStorage.setItem('streakData', JSON.stringify(updatedStreakData));
      setStreakData(updatedStreakData);
    } catch (error) {
      Alert.alert('Error saving streak data', error.message || 'Unable to save streak data.');
    }
  };

  const handleCompleteRoutine = () => {
    const today = new Date().toDateString();
    let newCount = streakData.count;
    if (streakData.lastDate) {
      const lastDate = new Date(streakData.lastDate).toDateString();
      if (lastDate === today) {
        // Already completed today; do nothing
        return;
      }
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDate === yesterday.toDateString()) {
        newCount += 1;
      } else {
        newCount = 1;
      }
    } else {
      newCount = 1;
    }
    const updatedStreakData = { count: newCount, lastDate: today };
    saveStreakData(updatedStreakData);
    setShowReward(true);
  };

  const handleTimerComplete = () => {
    handleCompleteRoutine();
  };

  const handleSettingsSave = (updatedSegments) => {
    saveSettings(updatedSegments);
    setCurrentScreen('timer');
  };

  const handleDismissReward = () => {
    setShowReward(false);
    setCurrentScreen('timer');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {currentScreen === 'timer' && !showReward && (
        <TimerScreen
          segments={segments}
          onComplete={handleTimerComplete}
          onSettingsPress={() => setCurrentScreen('settings')}
        />
      )}
      {currentScreen === 'settings' && (
        <SettingsScreen
          segments={segments}
          onSave={handleSettingsSave}
          onCancel={() => setCurrentScreen('timer')}
        />
      )}
      {showReward && (
        <RewardScreen
          streakCount={streakData.count}
          onClose={handleDismissReward}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

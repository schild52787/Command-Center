import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function TimerScreen({ segments, onComplete, onSettings, streak }) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(segments[0].duration * 60);
  const [completedSegments, setCompletedSegments] = useState([]);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // New effect: update timeLeft when segments or currentSegmentIndex changes
  useEffect(() => {
    setTimeLeft(segments[currentSegmentIndex].duration * 60);
  }, [segments, currentSegmentIndex]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSegmentComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    // Pulse animation for current segment
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const playGentleSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
        { shouldPlay: true }
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Sound error:', error);
    }
  };

  const handleSegmentComplete = async () => {
    await playGentleSound();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newCompleted = [...completedSegments, currentSegmentIndex];
    setCompletedSegments(newCompleted);

    if (currentSegmentIndex < segments.length - 1) {
      const nextIndex = currentSegmentIndex + 1;
      setCurrentSegmentIndex(nextIndex);
      setTimeLeft(segments[nextIndex].duration * 60);
    } else {
      setIsRunning(false);
      onComplete();
    }
  };

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning(true);
  };

  const handlePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRunning(false);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning(false);
    setCurrentSegmentIndex(0);
    setTimeLeft(segments[0].duration * 60);
    setCompletedSegments([]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSegment = segments[currentSegmentIndex];
  const totalDuration = segments[currentSegmentIndex].duration * 60;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <View style={styles.container}>
      {/* Header with Streak */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onSettings} style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {streak} days!</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Current Segment Display */}
        <Animated.View
          style={[styles.currentSegmentCard, { transform: [{ scale: pulseAnim }] }]}
        >
          <Text style={styles.currentLabel}>RIGHT NOW:</Text>
          <Text style={styles.emojiLarge}>{currentSegment.emoji}</Text>
          <Text style={styles.segmentName}>{currentSegment.name}</Text>
          <Text style={styles.timerDisplay}>{formatTime(timeLeft)}</Text>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </Animated.View>

        {/* Start/Pause Button */}
        {!isRunning ? (
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>
              {completedSegments.length === 0 ? '🌟 START! 🌟' : '▶️ CONTINUE'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
            <Text style={styles.pauseButtonText}>⏸️ PAUSE</Text>
          </TouchableOpacity>
        )}

        {/* Reset Button */}
        {(completedSegments.length > 0 || timeLeft < totalDuration) && (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>🔄 Start Over</Text>
          </TouchableOpacity>
        )}

        {/* Segment Progress List */}
        <View style={styles.segmentList}>
          <Text style={styles.segmentListTitle}>Morning Routine:</Text>
          {segments.map((segment, index) => {
            const isCompleted = completedSegments.includes(index);
            const isCurrent = index === currentSegmentIndex;
            const isUpcoming = index > currentSegmentIndex;

            return (
              <View
                key={segment.id}
                style={[
                  styles.segmentItem,
                  isCompleted && styles.segmentCompleted,
                  isCurrent && styles.segmentCurrent,
                  isUpcoming && styles.segmentUpcoming,
                ]}
              >
                <Text style={styles.segmentEmoji}>{segment.emoji}</Text>
                <Text
                  style={[
                    styles.segmentItemText,
                    isCompleted && styles.segmentCompletedText,
                    isUpcoming && styles.segmentUpcomingText,
                  ]}
                >
                  {segment.name}
                </Text>
                {isCompleted && <Text style={styles.checkmark}>✅</Text>}
                {isCurrent && <Text style={styles.arrow}>👉</Text>}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5F4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  settingsButton: {
    padding: 10,
  },
  settingsIcon: {
    fontSize: 30,
  },
  streakBadge: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  currentSegmentCard: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  currentLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 10,
  },
  emojiLarge: {
    fontSize: 100,
    marginVertical: 20,
  },
  segmentName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FF1493',
    fontVariant: ['tabular-nums'],
  },
  progressBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#FFB6D9',
    borderRadius: 10,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#32CD32',
    borderRadius: 10,
  },
  startButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 25,
    paddingHorizontal: 60,
    borderRadius: 50,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  pauseButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 25,
    paddingHorizontal: 60,
    borderRadius: 50,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pauseButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  resetButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 10,
  },
  resetButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  segmentList: {
    width: '100%',
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  segmentListTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 15,
    textAlign: 'center',
  },
  segmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  segmentCurrent: {
    backgroundColor: '#FFF9C4',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  segmentCompleted: {
    backgroundColor: '#E8F5E9',
  },
  segmentUpcoming: {
    opacity: 0.5,
  },
  segmentEmoji: {
    fontSize: 36,
    marginRight: 15,
  },
  segmentItemText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  segmentCompletedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  segmentUpcomingText: {
    color: '#999',
  },
  checkmark: {
    fontSize: 32,
  },
  arrow: {
    fontSize: 32,
  },
});

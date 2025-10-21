import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const STICKERS = ['⭐', '🌟', '✨', '🎉', '🎊', '🏆', '👑', '💖', '🦄', '🌈'];

export default function RewardScreen({ onClose, streak }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnims = useRef(
    Array.from({ length: 20 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Celebration haptics
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Main trophy animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 10,
      friction: 3,
      useNativeDriver: true,
    }).start();

    // Sparkle animations
    sparkleAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const getRandomSticker = (index) => {
    return STICKERS[index % STICKERS.length];
  };

  return (
    <View style={styles.container}>
      {/* Floating Sparkles */}
      {sparkleAnims.map((anim, index) => {
        const angle = (index * 360) / sparkleAnims.length;
        const radius = 150;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <Animated.View
            key={index}
            style={[
              styles.sparkle,
              {
                left: width / 2 + x - 20,
                top: 300 + y - 20,
                opacity: anim,
                transform: [
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.5],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.sparkleText}>{getRandomSticker(index)}</Text>
          </Animated.View>
        );
      })}

      {/* Main Content */}
      <Animated.View
        style={[styles.content, { transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.title}>AWESOME JOB, ELLE!</Text>
        <Text style={styles.subtitle}>You finished your morning routine!</Text>

        <View style={styles.stickerGrid}>
          <Text style={styles.stickerEmoji}>⭐</Text>
          <Text style={styles.stickerEmoji}>🌟</Text>
          <Text style={styles.stickerEmoji}>✨</Text>
        </View>

        {streak > 1 && (
          <View style={styles.streakCard}>
            <Text style={styles.streakTitle}>🔥 STREAK! 🔥</Text>
            <Text style={styles.streakNumber}>{streak} DAYS</Text>
            <Text style={styles.streakMessage}>
              {streak >= 5 && "You're a superstar!"}
              {streak >= 10 && "\nIncredible! Keep going!"}
              {streak >= 21 && "\nAmazing! You're unstoppable!"}
              {streak < 5 && "Keep it up!"}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.doneButton} onPress={onClose}>
          <Text style={styles.doneButtonText}>🎉 YAY! 🎉</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleText: {
    fontSize: 40,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  trophy: {
    fontSize: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FF1493',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 28,
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 30,
  },
  stickerGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  stickerEmoji: {
    fontSize: 60,
  },
  streakCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  streakTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF1493',
    marginBottom: 10,
  },
  streakMessage: {
    fontSize: 24,
    color: '#666',
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 25,
    paddingHorizontal: 60,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  doneButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
});

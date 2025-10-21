import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen({ segments, onSave, onBack }) {
  const [editedSegments, setEditedSegments] = useState(
    segments.map((seg) => ({ ...seg }))
  );

  const handleDurationChange = (index, value) => {
    const newSegments = [...editedSegments];
    const numValue = parseInt(value) || 0;
    newSegments[index] = { ...newSegments[index], duration: numValue };
    setEditedSegments(newSegments);
  };

  const incrementDuration = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSegments = [...editedSegments];
    newSegments[index] = {
      ...newSegments[index],
      duration: newSegments[index].duration + 1,
    };
    setEditedSegments(newSegments);
  };

  const decrementDuration = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSegments = [...editedSegments];
    if (newSegments[index].duration > 1) {
      newSegments[index] = {
        ...newSegments[index],
        duration: newSegments[index].duration - 1,
      };
      setEditedSegments(newSegments);
    }
  };

  const handleSave = () => {
    // Validate
    const hasInvalidDurations = editedSegments.some(
      (seg) => seg.duration < 1 || seg.duration > 60
    );

    if (hasInvalidDurations) {
      Alert.alert(
        'Invalid Duration',
        'Please enter durations between 1 and 60 minutes.'
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave(editedSegments);
    onBack();
  };

  const handleReset = () => {
    Alert.alert(
      'Reset to Defaults?',
      'This will reset all timings to the original values.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaults = [
              { id: 1, name: 'Wake up → Bathroom', emoji: '🚿', duration: 5 },
              { id: 2, name: 'Get dressed', emoji: '👗', duration: 7 },
              { id: 3, name: 'Breakfast', emoji: '🥞', duration: 15 },
              { id: 4, name: 'Brush teeth', emoji: '🪥', duration: 3 },
              { id: 5, name: 'Pack backpack', emoji: '🎒', duration: 5 },
              { id: 6, name: 'Shoes & coat', emoji: '👟', duration: 3 },
            ];
            setEditedSegments(defaults);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  const totalMinutes = editedSegments.reduce(
    (sum, seg) => sum + seg.duration,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚙️ Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Parent Settings</Text>
        <Text style={styles.description}>
          Adjust the time for each morning routine segment:
        </Text>

        {editedSegments.map((segment, index) => (
          <View key={segment.id} style={styles.segmentCard}>
            <View style={styles.segmentHeader}>
              <Text style={styles.segmentEmoji}>{segment.emoji}</Text>
              <Text style={styles.segmentName}>{segment.name}</Text>
            </View>

            <View style={styles.durationControl}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => decrementDuration(index)}
              >
                <Text style={styles.controlButtonText}>−</Text>
              </TouchableOpacity>

              <View style={styles.durationDisplay}>
                <TextInput
                  style={styles.durationInput}
                  value={String(segment.duration)}
                  onChangeText={(value) => handleDurationChange(index, value)}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.durationLabel}>min</Text>
              </View>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => incrementDuration(index)}
              >
                <Text style={styles.controlButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Routine Time:</Text>
          <Text style={styles.totalValue}>{totalMinutes} minutes</Text>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>🔄 Reset to Defaults</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>💾 Save Changes</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FF69B4',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF1493',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  segmentCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  segmentEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  segmentName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  durationControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    backgroundColor: '#FF69B4',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  durationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: '#FFF0F8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  durationInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF1493',
    width: 50,
    textAlign: 'center',
  },
  durationLabel: {
    fontSize: 18,
    color: '#666',
    marginLeft: 5,
  },
  totalCard: {
    backgroundColor: '#32CD32',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  resetButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButton: {
    backgroundColor: '#FF1493',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface TimerBarProps {
  timeRemaining: number;
  totalTime: number;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  timeRemaining,
  totalTime,
}) => (
  <View style={styles.timerContainer}>
    <View
      style={[
        styles.timerBar,
        { width: `${(timeRemaining / totalTime) * 100}%` },
        timeRemaining < totalTime * 0.3
          ? styles.timerCritical
          : timeRemaining < totalTime * 0.6
            ? styles.timerWarning
            : null,
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  timerContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 15,
    width: '100%',
    overflow: 'hidden',
  },
  timerBar: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },
  timerWarning: {
    backgroundColor: '#ff9800',
  },
  timerCritical: {
    backgroundColor: '#f44336',
  },
});

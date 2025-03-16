import React from 'react';
import { View } from 'react-native';
import styles from './styles';

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

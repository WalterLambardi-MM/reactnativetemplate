import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

interface GameHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  score: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentIndex,
  totalQuestions,
  score,
}) => (
  <View style={styles.header}>
    <Text style={styles.questionText}>
      Pregunta {currentIndex + 1} de {totalQuestions}
    </Text>
    <Text style={styles.scoreText}>Puntuación: {score}</Text>
  </View>
);

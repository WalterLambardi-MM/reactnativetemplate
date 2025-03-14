import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c62828',
  },
});

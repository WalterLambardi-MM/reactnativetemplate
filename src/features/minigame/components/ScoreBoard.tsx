import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { GameScore, GameType } from '../types/minigame.types';

interface ScoreBoardProps {
  scores: GameScore[];
  gameType?: GameType;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores, gameType }) => {
  // Filtrar puntuaciones por tipo de juego si se especifica
  const filteredScores = gameType
    ? scores.filter((score) => score.gameType === gameType)
    : scores;

  // Ordenar por puntuación (de mayor a menor)
  const sortedScores = [...filteredScores].sort((a, b) => b.score - a.score);

  // Limitar a los 10 mejores
  const topScores = sortedScores.slice(0, 10);

  // Formatear fecha
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const calculateAccuracy = (score: GameScore) => {
    // Si el score tiene correctAnswers, usarlo directamente
    if (score.correctAnswers !== undefined) {
      return Math.round((score.correctAnswers / score.totalQuestions) * 100);
    }

    // Si no, estimamos la precisión basada en la puntuación
    // Asumiendo que cada respuesta correcta da un mínimo de puntos (puntuación base)
    // Esta es una estimación y puede necesitar ajustes
    const estimatedBaseScore = 50; // Puntuación mínima por pregunta correcta
    const estimatedCorrectAnswers = Math.min(
      score.totalQuestions,
      Math.ceil(score.score / estimatedBaseScore),
    );

    return Math.min(
      100,
      Math.round((estimatedCorrectAnswers / score.totalQuestions) * 100),
    );
  };

  // Renderizar un elemento de puntuación
  const renderScoreItem = ({
    item,
    index,
  }: {
    item: GameScore;
    index: number;
  }) => (
    <View style={styles.scoreItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.score}>{item.score}</Text>
      <Text style={styles.accuracy}>{calculateAccuracy(item)}%</Text>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
    </View>
  );

  // Renderizar el encabezado de la tabla
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerText}>#</Text>
      <Text style={styles.headerText}>Puntos</Text>
      <Text style={styles.headerText}>Precisión</Text>
      <Text style={styles.headerText}>Fecha</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mejores Puntuaciones</Text>

      {topScores.length > 0 ? (
        <FlatList
          data={topScores}
          renderItem={renderScoreItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.emptyText}>
          Aún no hay puntuaciones registradas. ¡Juega para ser el primero!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    marginBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  scoreItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rank: {
    flex: 0.5,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  score: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#c62828',
    fontWeight: 'bold',
  },
  accuracy: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  date: {
    flex: 1.5,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

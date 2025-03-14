import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { CurrentGame } from '../types/minigame.types';
import { formatTime } from '../../../shared/utils/formatUtils';

interface GameResultProps {
  game: CurrentGame;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const GameResult: React.FC<GameResultProps> = ({
  game,
  onPlayAgain,
  onGoHome,
}) => {
  // Calcular estadísticas
  const totalQuestions = game.questions.length;
  const correctAnswers = game.questions.filter((q) => {
    if (q.selectedOption === undefined || q.selectedOption === -1) return false;
    try {
      return q.options[q.selectedOption].id === q.correctPokemon.id;
    } catch (error) {
      console.error('Error checking correct answer:', error);
      return false;
    }
  }).length;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  // Calcular tiempo total
  const totalTimeMs =
    game.endTime && game.startTime ? game.endTime - game.startTime : 0;

  const formattedTime = formatTime(totalTimeMs);

  // Determinar mensaje según el rendimiento
  let message = '';
  if (accuracy >= 90) {
    message = '¡Increíble! ¡Eres un Maestro Pokémon!';
  } else if (accuracy >= 70) {
    message = '¡Muy bien! Estás en camino a ser un gran entrenador.';
  } else if (accuracy >= 50) {
    message = 'Buen intento. Sigue practicando para mejorar.';
  } else {
    message = 'Necesitas estudiar más sobre Pokémon. ¡No te rindas!';
  }

  if (!game || !game.questions || game.questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No hay datos de juego disponibles.</Text>
        <TouchableOpacity style={styles.button} onPress={onGoHome}>
          <Text style={styles.buttonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resultado Final</Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{game.score}</Text>
        <Text style={styles.scoreLabel}>Puntos</Text>
      </View>

      <Text style={styles.message}>{message}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {correctAnswers}/{totalQuestions}
          </Text>
          <Text style={styles.statLabel}>Correctas</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Precisión</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formattedTime}</Text>
          <Text style={styles.statLabel}>Tiempo</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
          <Text style={styles.buttonText}>Jugar de Nuevo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.homeButton]}
          onPress={onGoHome}
        >
          <Text style={styles.buttonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#c62828',
  },
  scoreLabel: {
    fontSize: 18,
    color: '#666',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#c62828',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  homeButton: {
    backgroundColor: '#333',
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

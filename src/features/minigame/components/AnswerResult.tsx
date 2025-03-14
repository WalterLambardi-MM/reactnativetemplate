import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GameQuestion } from '../types/minigame.types';

interface AnswerResultProps {
  currentQuestion: GameQuestion;
  timeoutOccurred: boolean;
  isLastQuestion: boolean;
  onNextQuestion: () => void;
}

export const AnswerResult: React.FC<AnswerResultProps> = ({
  currentQuestion,
  timeoutOccurred,
  isLastQuestion,
  onNextQuestion,
}) => {
  // Verificar que selectedOption existe y está definido
  const selectedOption = currentQuestion.selectedOption;
  const isTimeout = timeoutOccurred || selectedOption === -1;

  // Verificar si la respuesta es correcta
  const isCorrect =
    !isTimeout &&
    selectedOption !== undefined &&
    currentQuestion.options[selectedOption].id ===
      currentQuestion.correctPokemon.id;

  return (
    <View style={styles.resultContainer}>
      {isTimeout ? (
        <>
          <Text style={styles.timeoutText}>¡Tiempo agotado!</Text>
          <Text style={styles.pokemonName}>
            Es {currentQuestion.correctPokemon.name}
          </Text>
        </>
      ) : (
        <>
          <Text style={isCorrect ? styles.correctText : styles.incorrectText}>
            {isCorrect ? '¡Correcto!' : '¡Incorrecto!'}
          </Text>
          <Text style={styles.pokemonName}>
            Es {currentQuestion.correctPokemon.name}
          </Text>
        </>
      )}

      <TouchableOpacity style={styles.nextButton} onPress={onNextQuestion}>
        <Text style={styles.nextButtonText}>
          {isLastQuestion ? 'Ver Resultados' : 'Siguiente'}
        </Text>
        <MaterialIcons
          name={isLastQuestion ? 'score' : 'arrow-forward'}
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  correctText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4caf50',
  },
  incorrectText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#f44336',
  },
  timeoutText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff9800',
  },
  pokemonName: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#c62828',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

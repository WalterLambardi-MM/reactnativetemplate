import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GameQuestion } from '../../types/minigame.types';
import styles from './styles';

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
